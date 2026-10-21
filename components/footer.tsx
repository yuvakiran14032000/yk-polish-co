import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Instagram } from "./icons";
import { whatsappUrl } from "@/lib/enquiry";
import type { Settings } from "@/lib/types";
export function Footer({ settings }: { settings: Settings }) {
  return (
    <footer className="footer">
      <div className="container footer-main">
        <div className="footer-brand">
          <Image
            src="/logo.png"
            width={132}
            height={112}
            alt="YK Polish Co. official logo"
          />
          <p>
            Your Nails. Your Mood.
            <br />
            <em>Your Moment.</em>
          </p>
          <span>
            Made to be admired.
            <br />
            Passion in every detail.
          </span>
        </div>
        <div>
          <h3>Explore</h3>
          <Link href="/shop">Shop all designs</Link>
          <Link href="/collections">The collections</Link>
          <Link href="/customise">Custom Nail Studio</Link>
          <Link href="/about">Our story</Link>
        </div>
        <div>
          <h3>A little guidance</h3>
          <Link href="/nail-guide">Application & care</Link>
          <Link href="/nail-guide#sizing">Find your fit</Link>
          <Link href="/#faq">Your questions, answered</Link>
          <Link href="/cart">Your enquiry bag</Link>
        </div>
        <div>
          <h3>Let’s talk nails</h3>
          <a
            href={whatsappUrl(
              settings.whatsapp,
              "Hi YK Polish Co.! I would love to know more about your press-on nails.",
            )}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp us <ArrowUpRight size={14} />
          </a>
          <a href={settings.instagram} target="_blank" rel="noreferrer">
            <Instagram size={14} /> @ykpolishco <ArrowUpRight size={14} />
          </a>
          <p>
            Personalised nail art.
            <br />A conversation away.
          </p>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} YK Polish Co.</span>
        <span>Handmade with love. Worn with confidence.</span>
        <div>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
