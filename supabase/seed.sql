-- Confirmed collection data only. No fabricated product inventory.
insert into public.collections(id,name,slug,starting_price,description,featured,display_order) values
('00000000-0000-4000-8000-000000000001','Everyday','everyday',399,'Simple, clean, everyday designs.',true,0),
('00000000-0000-4000-8000-000000000002','Minimalist','minimalist',399,'Clean designs and considered details.',true,1),
('00000000-0000-4000-8000-000000000003','Corporate Girlies','corporate-girlies',499,'Easy-to-wear designs for your workday moments.',true,2),
('00000000-0000-4000-8000-000000000004','Moms-to-Be','moms-to-be',499,'A personal detail for a special chapter.',false,3),
('00000000-0000-4000-8000-000000000005','College & Events','college-events',499,'For campus days and celebrations.',false,4),
('00000000-0000-4000-8000-000000000006','Vacation','vacation',499,'Nail art for your next escape.',false,5),
('00000000-0000-4000-8000-000000000007','Party Ready','party-ready',599,'Trendy, detailed and occasion-ready designs.',true,6),
('00000000-0000-4000-8000-000000000008','Festive Vibes','festive-vibes',599,'Nail art for your celebratory mood.',false,7),
('00000000-0000-4000-8000-000000000009','Occasion Ready','occasion-ready',599,'Details for the moments you dress up for.',false,8),
('00000000-0000-4000-8000-000000000010','Gifting','gifting',599,'A thoughtful expression of personal style.',false,9),
('00000000-0000-4000-8000-000000000011','Statement','statement',699,'Bold designs with elevated detailing.',true,10),
('00000000-0000-4000-8000-000000000012','Bridal','bridal',799,'Intricate, elegant and bridal-focused.',true,11),
('00000000-0000-4000-8000-000000000013','Customised','customised',699,'Tailored to your design preferences.',false,12)
on conflict(id) do nothing;
insert into public.site_settings(id,value) values('main','{"whatsapp":"919611435929","instagram":"https://www.instagram.com/ykpolishco/","announcement":"Handmade for your moments. An application kit with every set.","hero_title":"Your Nails. Your Mood. Your Moment.","hero_description":"Handcrafted press-on nails for every version of you. A little art. A little self-expression. Entirely yours.","hero_image":"/images/editorial-concept.webp"}') on conflict(id) do nothing;
