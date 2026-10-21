import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Heart,
  RotateCcw,
  Gift,
  Flower2,
  Check,
} from "lucide-react";
import { getCatalogue } from "@/lib/catalogue";
import { faqs } from "@/lib/brand";
import { ProductCard } from "@/components/product-card";
import { CollectionCard } from "@/components/collection-card";
import { Reveal } from "@/components/reveal";
export const metadata = { alternates: { canonical: "/" } };
export default async function Home() {
  const { products, collections, settings, error } = await getCatalogue();
  const featured = products.filter((p) => p.featured);
  const concept = settings.hero_image === "/images/editorial-concept.webp";
  const latest = [...products].sort(
    (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at),
  );
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <Reveal>
            <div className="hero-eyebrow">
              <span /> A LITTLE ART. ENTIRELY YOU.
            </div>
            <h1>
              {settings.hero_title === "Your Nails. Your Mood. Your Moment." ? (
                <>
                  Your Nails.
                  <br />
                  Your Mood.
                  <br />
                  <em>Your Moment.</em>
                </>
              ) : (
                settings.hero_title
              )}
            </h1>
            <p>{settings.hero_description}</p>
            <div className="hero-buttons">
              <Link className="button" href="/collections">
                Shop collections <ArrowUpRight size={17} />
              </Link>
              <Link className="text-link" href="/customise">
                Customise your set <ArrowRight size={16} />
              </Link>
            </div>
            <div className="hero-footnote">
              <span className="fine-line" />
              HANDMADE. PERSONAL. REUSABLE.
            </div>
          </Reveal>
        </div>
        <div className="hero-visual">
          <Image
            src={settings.hero_image}
            alt={
              concept
                ? "AI editorial concept of blush press-on nail art on silk; not actual product photography."
                : "YK Polish Co. handmade press-on nail artwork"
            }
            fill
            priority
            sizes="(max-width: 760px) 100vw, 55vw"
          />
          <div className="hero-image-label">
            THE ART OF A LITTLE SELF-EXPRESSION
          </div>
          <div className="hero-note">
            <Flower2 size={22} strokeWidth={1} />
            <span>
              Made to match
              <br />
              <em>every moment.</em>
            </span>
          </div>
          {concept && (
            <span className="image-disclosure">
              AI concept artwork · not product photography
            </span>
          )}
        </div>
        <div className="hero-side-note">PRESS-ON NAILS & CUSTOM NAIL ART</div>
      </section>
      <div className="benefits container">
        {[
          { Icon: Heart, label: "Handmade with love" },
          { Icon: Sparkles, label: "Designed for your moments" },
          { Icon: RotateCcw, label: "Reuse with proper care" },
          { Icon: Gift, label: "Application kit included" },
        ].map(({ Icon, label }) => (
          <div key={label}>
            <Icon size={21} strokeWidth={1.3} />
            <span>{label}</span>
          </div>
        ))}
      </div>
      <section className="section container">
        <Reveal>
          <div className="section-heading">
            <div>
              <p className="eyebrow">A FRESH LITTLE OBSESSION</p>
              <h2>
                Meet your next <em>mood.</em>
              </h2>
            </div>
            <Link href="/shop?sort=newest" className="text-link">
              View new arrivals <ArrowUpRight size={17} />
            </Link>
          </div>
          {products.length ? (
            <div className="product-grid home-products">
              {latest.slice(0, 4).map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          ) : (
            <div className="catalogue-coming">
              <Flower2 size={36} strokeWidth={1} />
              <div>
                <h3>
                  {error
                    ? "Our design gallery is taking a moment."
                    : "A new chapter of nail art is coming."}
                </h3>
                <p>
                  {error
                    ? "Please try again shortly, or explore the collections and enquire personally."
                    : "Individual designs will appear here as they’re published. Explore the collections and let’s find your next set together."}
                </p>
              </div>
              <Link href="/collections" className="text-link">
                Find your collection <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </Reveal>
      </section>
      <section className="section collection-section">
        <div className="container">
          <Reveal>
            <div className="section-heading">
              <div>
                <p className="eyebrow">A SET FOR EVERY SIDE OF YOU</p>
                <h2>
                  Find your <em>collection.</em>
                </h2>
              </div>
              <Link href="/collections" className="text-link">
                Explore all collections <ArrowUpRight size={17} />
              </Link>
            </div>
            <div className="collection-grid">
              {collections
                .filter((c) => c.featured)
                .slice(0, 6)
                .map((c, i) => (
                  <CollectionCard key={c.id} collection={c} index={i} />
                ))}
            </div>
            <p className="fine-print collection-disclosure">
              Illustrative collection artwork. Starting prices from our official
              catalogue; designs and final pricing confirmed with you.
            </p>
          </Reveal>
        </div>
      </section>
      <section className="section container">
        <div className="occasion-layout">
          <div>
            <p className="eyebrow">WHAT’S ON YOUR CALENDAR?</p>
            <h2>
              Dress for
              <br />
              <em>the moment.</em>
            </h2>
            <p className="muted">
              For the everyday plans.
              <br />
              And the unforgettable ones.
            </p>
          </div>
          <div className="occasion-links">
            {[
              ["01", "Office", "corporate-girlies"],
              ["02", "College & Events", "college-events"],
              ["03", "Vacation", "vacation"],
              ["04", "Party", "party-ready"],
              ["05", "Festive", "festive-vibes"],
              ["06", "Bridal", "bridal"],
            ].map(([num, label, slug]) => (
              <Link key={slug} href={`/collections/${slug}`}>
                <span>{num}</span>
                <h3>{label}</h3>
                <ArrowUpRight size={20} />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="custom-banner">
        <div className="custom-art" aria-hidden="true">
          <div className="studio-orbit" />
          <div className="studio-nail n1" />
          <div className="studio-nail n2" />
          <div className="studio-nail n3" />
          <span className="script">
            uniquely
            <br />
            yours.
          </span>
          <span className="eyebrow">THE CUSTOM NAIL STUDIO</span>
        </div>
        <div className="custom-copy">
          <Reveal>
            <p className="eyebrow">YOUR IMAGINATION, OUR LITTLE CANVAS</p>
            <h2>
              Dream it.
              <br />
              <em>We’ll design it.</em>
            </h2>
            <p>
              A colour you can’t stop thinking about. A special outfit. A moment
              that deserves something personal. Let’s turn your inspiration into
              nail art.
            </p>
            <Link href="/customise" className="button button-light">
              Create your custom set <ArrowUpRight size={17} />
            </Link>
            <span className="custom-price">PERSONALISED SETS FROM ₹699+</span>
          </Reveal>
        </div>
      </section>
      {featured.length > 0 && (
        <section className="section container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">A FEW WE’RE LOVING</p>
              <h2>
                The <em>YK Edit.</em>
              </h2>
            </div>
            <Link href="/shop?sort=featured" className="text-link">
              Discover the edit <ArrowUpRight size={17} />
            </Link>
          </div>
          <div className="product-grid home-products">
            {featured.slice(0, 4).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
      <section className="section container how-section">
        <div className="section-heading centered">
          <p className="eyebrow">FROM A LITTLE CRUSH TO YOUR NEXT SET</p>
          <h2>
            Made personal. <em>Kept simple.</em>
          </h2>
        </div>
        <div className="steps-grid">
          {[
            [
              "01",
              "Find your feeling.",
              "Explore our designs and collections. Find the set that feels like your kind of beautiful.",
            ],
            [
              "02",
              "Make it yours.",
              "Choose your preferences and add your favourites to your enquiry bag. Need sizing help? Just ask.",
            ],
            [
              "03",
              "Let’s talk nails.",
              "Send your bag through WhatsApp. We’ll confirm every little detail with you personally.",
            ],
          ].map(([num, title, text]) => (
            <div key={num}>
              <span className="step-number">{num}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
        <p className="fine-print centered">
          An enquiry begins a conversation. Your order is confirmed personally.
        </p>
      </section>
      <section className="care-preview container">
        <div className="care-illustration">
          <Flower2 size={76} strokeWidth={0.7} />
          <span>
            Keep.
            <br />
            Reuse.
            <br />
            <em>Relove.</em>
          </span>
        </div>
        <div>
          <p className="eyebrow">A LITTLE CARE GOES A LONG WAY</p>
          <h2>
            Your set has arrived.
            <br />
            <em>Let’s make it last.</em>
          </h2>
          <p>
            Apply with patience. Wear with confidence. From finding your fit to
            a gentle goodbye, we’ve got you.
          </p>
          <Link className="text-link" href="/nail-guide">
            The application & care guide <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
      <section className="section instagram-section container">
        <Sparkles size={28} strokeWidth={1} />
        <p className="eyebrow">THE LITTLE DETAILS, UP CLOSE</p>
        <h2>
          A little more <em>YK.</em>
        </h2>
        <p>Follow the art, the inspiration, and the moments in between.</p>
        <a
          className="text-link"
          href={settings.instagram}
          target="_blank"
          rel="noreferrer"
        >
          Find us @ykpolishco <ArrowUpRight size={17} />
        </a>
      </section>
      <section className="section faq-section container" id="faq">
        <div>
          <p className="eyebrow">BEFORE YOU FALL IN LOVE</p>
          <h2>
            A few things
            <br />
            <em>you might wonder.</em>
          </h2>
          <p className="muted">Still curious? We’re a message away.</p>
          <Link href="/customise" className="text-link">
            Let’s create something <ArrowRight size={16} />
          </Link>
        </div>
        <div className="faq-list">
          {faqs.map(([q, a]) => (
            <details key={q}>
              <summary>
                {q}
                <span className="faq-plus">+</span>
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>
      <div className="last-note">
        <Check size={18} />
        <span>
          A little art. A little confidence. <em>A whole lot of you.</em>
        </span>
      </div>
    </>
  );
}
