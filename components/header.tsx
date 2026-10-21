"use client";
import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, Menu, ArrowUpRight } from "lucide-react";
import { Instagram } from "./icons";
import { Input } from "./ui/input";
import { Modal } from "./modal";
import { useCart } from "@/lib/cart";
import type { Settings } from "@/lib/types";
const nav = [
  ["Home", "/"],
  ["Shop", "/shop"],
  ["Collections", "/collections"],
  ["Customise", "/customise"],
  ["Nail Guide", "/nail-guide"],
  ["Our Story", "/about"],
];
const subscribe = () => () => {};
export function Header({
  settings,
  demo,
}: {
  settings: Settings;
  demo: boolean;
}) {
  const [menu, setMenu] = useState(false),
    [search, setSearch] = useState(false);
  const pathname = usePathname(),
    items = useCart((s) => s.items),
    setOpen = useCart((s) => s.setOpen),
    mounted = useSyncExternalStore(
      subscribe,
      () => true,
      () => false,
    ),
    count = mounted ? items.reduce((n, i) => n + i.quantity, 0) : 0;
  return (
    <>
      <div className="announcement">
        {demo
          ? "DEVELOPMENT PREVIEW · Sample designs, not actual inventory"
          : settings.announcement}
        <span>KEEP. REUSE. RELOVE.</span>
      </div>
      <header className="site-header">
        <Link href="/" aria-label="YK Polish Co. home" className="logo-link">
          <Image
            src="/logo.png"
            alt="YK Polish Co. official logo"
            width={108}
            height={90}
            priority
          />
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {nav.map(([name, path]) => (
            <Link
              key={path}
              href={path}
              className={pathname === path ? "active" : ""}
            >
              {name}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="icon-button"
            aria-label="Search designs"
            onClick={() => setSearch(true)}
          >
            <Search size={20} />
          </button>
          <a
            className="icon-button instagram-header"
            href={settings.instagram}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
          >
            <Instagram size={19} />
          </a>
          <button
            className="bag-trigger"
            aria-label={`Open enquiry bag, ${count} items`}
            onClick={() => setOpen(true)}
          >
            <ShoppingBag size={20} />
            <span className="bag-word">Bag</span>
            <span className="bag-count" aria-live="polite">
              {count}
            </span>
          </button>
          <button
            className="icon-button mobile-menu"
            aria-label="Open navigation"
            onClick={() => setMenu(true)}
          >
            <Menu />
          </button>
        </div>
      </header>
      <Modal open={menu} onOpenChange={setMenu} title="Explore YK" drawer>
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {nav.map(([name, path]) => (
            <Link key={path} href={path} onClick={() => setMenu(false)}>
              {name}
              <ArrowUpRight size={20} />
            </Link>
          ))}
        </nav>
      </Modal>
      <Modal open={search} onOpenChange={setSearch} title="Find your next mood">
        <form
          action="/shop"
          className="search-form"
          onSubmit={() => setSearch(false)}
        >
          <label htmlFor="global-search">Design, colour or collection</label>
          <div className="input-action">
            <Input
              id="global-search"
              name="q"
              placeholder="What are you in the mood for?"
              required
              autoFocus
            />
            <button className="button" type="submit" aria-label="Search">
              <Search size={20} />
            </button>
          </div>
        </form>
        <Link
          href="/collections"
          onClick={() => setSearch(false)}
          className="text-link"
        >
          Explore all collections <ArrowUpRight size={16} />
        </Link>
      </Modal>
    </>
  );
}
