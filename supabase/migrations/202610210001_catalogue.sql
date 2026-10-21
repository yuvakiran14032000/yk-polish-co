-- Apply once using Supabase migrations or the SQL editor as postgres.
begin;
create extension if not exists pgcrypto;
create table public.admin_users(user_id uuid primary key references auth.users(id) on delete cascade,created_at timestamptz not null default now());
create function public.is_admin() returns boolean language sql stable security definer set search_path='' as $$ select exists(select 1 from public.admin_users where user_id=(select auth.uid())); $$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated,service_role;
create table public.collections(id uuid primary key default gen_random_uuid(),name text not null,slug text not null unique check(slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),starting_price integer not null check(starting_price>0),description text not null default '',image_url text,featured boolean not null default false,display_order integer not null default 0,created_at timestamptz not null default now(),updated_at timestamptz not null default now());
create table public.products(id uuid primary key default gen_random_uuid(),name text not null,slug text not null unique check(slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),description text not null,price integer not null check(price>0),starting_price boolean not null default false,status text not null default 'draft' check(status in('draft','published','archived')),availability text not null default 'made_to_order' check(availability in('made_to_order','available','unavailable')),featured boolean not null default false,display_order integer not null default 0,colors text[] not null default '{}',occasions text[] not null default '{}',created_at timestamptz not null default now(),updated_at timestamptz not null default now());
create index products_catalogue on public.products(status,display_order);
create index products_created on public.products(created_at desc);
create table public.product_collections(product_id uuid not null references public.products(id) on delete cascade,collection_id uuid not null references public.collections(id) on delete cascade,primary key(product_id,collection_id));
create index product_collections_collection on public.product_collections(collection_id);
create table public.product_images(id uuid primary key default gen_random_uuid(),product_id uuid not null references public.products(id) on delete cascade,url text not null,alt text not null,display_order integer not null default 0,created_at timestamptz not null default now());
create index product_images_product on public.product_images(product_id,display_order);
create table public.product_variants(id uuid primary key default gen_random_uuid(),product_id uuid not null references public.products(id) on delete cascade,shape text not null,length text not null,sizes text[] not null check(cardinality(sizes)>0),created_at timestamptz not null default now(),unique(product_id,shape,length));
create table public.product_addons(id uuid primary key default gen_random_uuid(),product_id uuid not null references public.products(id) on delete cascade,name text not null,price integer not null check(price>=0),created_at timestamptz not null default now());
create index product_addons_product on public.product_addons(product_id);
create table public.enquiries(id uuid primary key default gen_random_uuid(),reference text not null unique,status text not null default 'draft' check(status in('draft','whatsapp_opened','customer_confirmed_sent','manually_confirmed','cancelled')),estimated_subtotal integer not null check(estimated_subtotal>=0),notes text not null default '',brief jsonb,admin_notes text not null default '',token_hash text not null unique,token_expires_at timestamptz not null default(now()+interval '24 hours'),created_at timestamptz not null default now(),updated_at timestamptz not null default now());
create index enquiries_recent on public.enquiries(created_at desc);
create table public.enquiry_items(id uuid primary key default gen_random_uuid(),enquiry_id uuid not null references public.enquiries(id) on delete cascade,product_id uuid references public.products(id) on delete set null,name text not null,slug text not null,quantity integer not null check(quantity between 1 and 20),unit_price integer not null check(unit_price>0),starting_price boolean not null default false,shape text not null,length text not null,size text not null,notes text not null default '',addons jsonb not null default '[]',created_at timestamptz not null default now());
create index enquiry_items_enquiry on public.enquiry_items(enquiry_id);
create table public.site_settings(id text primary key check(id='main'),value jsonb not null default '{}',created_at timestamptz not null default now(),updated_at timestamptz not null default now());
create table public.rate_limit_windows(key text not null,window_start timestamptz not null,hits integer not null,primary key(key,window_start));
create function public.touch_updated_at() returns trigger language plpgsql set search_path='' as $$ begin new.updated_at=now();return new;end; $$;
do $$ declare t text;begin foreach t in array array['products','collections','enquiries','site_settings'] loop execute format('create trigger touch_updated before update on public.%I for each row execute function public.touch_updated_at()',t);end loop;end; $$;
do $$ declare t text;begin foreach t in array array['admin_users','collections','products','product_collections','product_images','product_variants','product_addons','enquiries','enquiry_items','site_settings','rate_limit_windows'] loop execute format('alter table public.%I enable row level security',t);execute format('revoke all on public.%I from anon, authenticated',t);execute format('grant all on public.%I to service_role',t);end loop;end; $$;
grant select on public.admin_users to authenticated;
create policy admin_self on public.admin_users for select to authenticated using(user_id=(select auth.uid()));
grant select on public.collections,public.products,public.product_collections,public.product_images,public.product_variants,public.product_addons,public.site_settings to anon,authenticated;
create policy collections_public on public.collections for select to anon,authenticated using(true);
create policy products_public on public.products for select to anon,authenticated using(status='published');
create policy settings_public on public.site_settings for select to anon,authenticated using(true);
do $$ declare t text;begin foreach t in array array['product_images','product_variants','product_addons','product_collections'] loop execute format('create policy published_product on public.%I for select to anon,authenticated using(exists(select 1 from public.products where id=product_id and status=''published''))',t);end loop;end; $$;
do $$ declare t text;begin foreach t in array array['products','collections','product_images','product_variants','product_addons','product_collections','site_settings'] loop execute format('grant insert,update,delete on public.%I to authenticated',t);execute format('create policy admin_manage on public.%I for all to authenticated using((select public.is_admin())) with check((select public.is_admin()))',t);end loop;end; $$;
grant select,update on public.enquiries to authenticated;
grant select on public.enquiry_items to authenticated;
create policy enquiries_admin_read on public.enquiries for select to authenticated using((select public.is_admin()));
create policy enquiries_admin_update on public.enquiries for update to authenticated using((select public.is_admin())) with check((select public.is_admin()));
create policy enquiry_items_admin on public.enquiry_items for select to authenticated using((select public.is_admin()));

-- Distributed, atomic rate limiting. Public database roles cannot call this.
create function public.consume_rate_limit(p_key text,p_limit integer) returns boolean language plpgsql security invoker set search_path='' as $$
declare bucket timestamptz:=to_timestamp(floor(extract(epoch from now())/600)*600);counted integer;
begin
 delete from public.rate_limit_windows where window_start<now()-interval '20 minutes';
 insert into public.rate_limit_windows(key,window_start,hits) values(p_key,bucket,1) on conflict(key,window_start) do update set hits=public.rate_limit_windows.hits+1 returning hits into counted;
 return counted<=p_limit;
end; $$;
revoke all on function public.consume_rate_limit(text,integer) from public,anon,authenticated;
grant execute on function public.consume_rate_limit(text,integer) to service_role;

-- Validate the snapshots again inside the transaction, then atomically save.
create function public.create_enquiry(p_payload jsonb) returns uuid language plpgsql security invoker set search_path='' as $$
declare eid uuid;item jsonb;addon jsonb;p public.products%rowtype;a public.product_addons%rowtype;total integer:=0;line_total integer;
begin
 if jsonb_array_length(p_payload->'items')>30 then raise exception 'Too many items';end if;
 for item in select value from jsonb_array_elements(p_payload->'items') loop
  select * into p from public.products where id=(item->>'product_id')::uuid and status='published' and availability<>'unavailable' for share;
  if not found or p.price<>(item->>'unit_price')::integer or p.starting_price<>(item->>'starting_price')::boolean or p.name<>item->>'name' then raise exception 'Product changed';end if;
  if not exists(select 1 from public.product_variants where product_id=p.id and shape=item->>'shape' and length=item->>'length' and item->>'size'=any(sizes)) then raise exception 'Invalid variant';end if;
  line_total:=p.price;
  for addon in select value from jsonb_array_elements(item->'addons') loop
   select * into a from public.product_addons where id=(addon->>'id')::uuid and product_id=p.id;
   if not found or a.price<>(addon->>'price')::integer then raise exception 'Addon changed';end if;
   line_total:=line_total+a.price;
  end loop;
  total:=total+line_total*(item->>'quantity')::integer;
 end loop;
 if total<>(p_payload->>'estimated_subtotal')::integer then raise exception 'Total changed';end if;
 insert into public.enquiries(reference,token_hash,estimated_subtotal,notes,brief) values(p_payload->>'reference',p_payload->>'token_hash',total,p_payload->>'notes',nullif(p_payload->'brief','null'::jsonb)) returning id into eid;
 insert into public.enquiry_items(enquiry_id,product_id,name,slug,quantity,unit_price,starting_price,shape,length,size,notes,addons)
 select eid,(x->>'product_id')::uuid,x->>'name',x->>'slug',(x->>'quantity')::integer,(x->>'unit_price')::integer,(x->>'starting_price')::boolean,x->>'shape',x->>'length',x->>'size',x->>'notes',x->'addons' from jsonb_array_elements(p_payload->'items') x;
 return eid;
end; $$;
revoke all on function public.create_enquiry(jsonb) from public,anon,authenticated;
grant execute on function public.create_enquiry(jsonb) to service_role;

-- Authenticated admin only. The child records and product save together.
create function public.save_product(p_payload jsonb) returns uuid language plpgsql security invoker set search_path='' as $$
declare pid uuid:=coalesce((p_payload->>'id')::uuid,gen_random_uuid());x jsonb;
begin
 if not public.is_admin() then raise exception 'Forbidden';end if;
 if p_payload->>'status'='published' and (jsonb_array_length(p_payload->'images')=0 or jsonb_array_length(p_payload->'variants')=0) then raise exception 'Images and variants required';end if;
 insert into public.products(id,name,slug,description,price,starting_price,status,availability,featured,display_order,colors,occasions)
 values(pid,p_payload->>'name',p_payload->>'slug',p_payload->>'description',(p_payload->>'price')::integer,(p_payload->>'starting_price')::boolean,p_payload->>'status',p_payload->>'availability',(p_payload->>'featured')::boolean,(p_payload->>'display_order')::integer,array(select jsonb_array_elements_text(p_payload->'colors')),array(select jsonb_array_elements_text(p_payload->'occasions')))
 on conflict(id) do update set name=excluded.name,slug=excluded.slug,description=excluded.description,price=excluded.price,starting_price=excluded.starting_price,status=excluded.status,availability=excluded.availability,featured=excluded.featured,display_order=excluded.display_order,colors=excluded.colors,occasions=excluded.occasions;
 delete from public.product_collections where product_id=pid;
 insert into public.product_collections(product_id,collection_id) select pid,value::uuid from jsonb_array_elements_text(p_payload->'collection_ids');
 delete from public.product_images where product_id=pid;
 insert into public.product_images(product_id,url,alt,display_order) select pid,v->>'url',v->>'alt',(v->>'display_order')::integer from jsonb_array_elements(p_payload->'images') v;
 delete from public.product_variants where product_id=pid;
 insert into public.product_variants(product_id,shape,length,sizes) select pid,v->>'shape',v->>'length',array(select jsonb_array_elements_text(v->'sizes')) from jsonb_array_elements(p_payload->'variants') v;
 delete from public.product_addons where product_id=pid;
 for x in select value from jsonb_array_elements(p_payload->'addons') loop insert into public.product_addons(id,product_id,name,price) values((x->>'id')::uuid,pid,x->>'name',(x->>'price')::integer);end loop;
 return pid;
end; $$;
revoke all on function public.save_product(jsonb) from public,anon;
grant execute on function public.save_product(jsonb) to authenticated;

-- Owner-uploaded product photography only. SVG uploads are deliberately excluded.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('product-images','product-images',true,5242880,array['image/jpeg','image/png','image/webp']);
create policy product_images_admin_insert on storage.objects for insert to authenticated with check(bucket_id='product-images' and (select public.is_admin()));
create policy product_images_admin_read on storage.objects for select to authenticated using(bucket_id='product-images' and (select public.is_admin()));
create policy product_images_admin_update on storage.objects for update to authenticated using(bucket_id='product-images' and (select public.is_admin())) with check(bucket_id='product-images' and (select public.is_admin()));
create policy product_images_admin_delete on storage.objects for delete to authenticated using(bucket_id='product-images' and (select public.is_admin()));
commit;
