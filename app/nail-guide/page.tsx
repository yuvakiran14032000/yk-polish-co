import Link from "next/link";
import {
  Flower2,
  Droplets,
  Hand,
  Heart,
  ShieldCheck,
  Sparkles,
  RotateCcw,
  ArrowUpRight,
} from "lucide-react";
export const metadata = {
  title: "Application & nail care guide",
  description:
    "Apply, care for, gently remove and reuse your YK Polish Co. press-ons. Instructions from our official application and care brochure.",
  alternates: { canonical: "/nail-guide" },
};
const application = [
  ["Clean", "Clean your natural nails with the Alcohol / Prep Wipe."],
  ["Prep", "Gently push back your cuticles using the Cuticle Stick."],
  ["Size", "Choose the right press-on size for each natural nail."],
  ["Apply", "Apply using Adhesive Tabs or Nail Glue."],
  ["Press", "Place the nail firmly and hold for 10–15 seconds."],
  [
    "Set",
    "Let the nails set fully. Avoid water for at least 1–2 hours after application.",
  ],
  ["Shape", "Gently shape or refine the edges with the Mini Nail File."],
];
export default function Guide() {
  return (
    <div className="container">
      <section className="guide-intro">
        <div>
          <p className="eyebrow">YOUR SET HAS ARRIVED</p>
          <h1>
            A little care.
            <br />
            <em>A little longer.</em>
          </h1>
          <p>
            Apply with patience. Wear with confidence. Your guide to a lovely
            fit, gentle removal, and loving your press-ons again.
          </p>
          <a
            href="/references/nail-guide.pdf"
            className="text-link"
            target="_blank"
            rel="noreferrer"
          >
            Open your original care brochure <ArrowUpRight size={15} />
          </a>
        </div>
        <div className="guide-stamp">
          <Flower2 size={85} strokeWidth={0.7} />
          <span>
            Keep.
            <br />
            Reuse.
            <br />
            <em>Relove.</em>
          </span>
        </div>
      </section>
      <nav className="guide-tabs" aria-label="Nail guide sections">
        {[
          ["sizing", "Find your fit"],
          ["apply", "Apply"],
          ["care", "Care"],
          ["remove", "Remove"],
          ["reuse", "Reuse"],
        ].map(([id, label]) => (
          <a key={id} href={`#${id}`}>
            {label}
          </a>
        ))}
      </nav>
      <section className="guide-block" id="sizing">
        <p className="eyebrow">01 / FIND YOUR FIT</p>
        <h2>
          A comfortable <em>beginning.</em>
        </h2>
        <p>
          Choose the right press-on size for each natural nail before you apply.
          If you’re unsure, choose “Need sizing assistance” in your design
          preferences or ask us before ordering. We’ll help confirm your fit and
          any measurements needed.
        </p>
        <Link className="text-link" href="/customise">
          Ask us about sizing <ArrowUpRight size={15} />
        </Link>
      </section>
      <section className="guide-block" id="apply">
        <p className="eyebrow">02 / APPLY YOUR NAILS</p>
        <h2>
          Your perfect set <em>starts here.</em>
        </h2>
        <div className="guide-steps">
          {application.map(([title, body], i) => (
            <div key={title} className="guide-step">
              <span className="step-number">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="guide-block" id="care">
        <p className="eyebrow">03 / LOVE YOUR NAILS</p>
        <h2>
          A little care goes <em>a long way.</em>
        </h2>
        <div className="guide-steps">
          {[
            {
              Icon: Sparkles,
              title: "Clean & dry",
              text: "Apply only on clean, dry natural nails.",
            },
            {
              Icon: Droplets,
              title: "Give them time",
              text: "Avoid water for at least 1–2 hours after application.",
            },
            {
              Icon: Hand,
              title: "Treat them gently",
              text: "Avoid using your nails as tools.",
            },
            {
              Icon: ShieldCheck,
              title: "A little protection",
              text: "Wear gloves during prolonged cleaning or washing.",
            },
            {
              Icon: Heart,
              title: "Choose your wear",
              text: "Choose nail glue for longer-lasting wear.",
            },
            {
              Icon: RotateCcw,
              title: "Keep it temporary",
              text: "Use adhesive tabs for temporary wear and easy removal.",
            },
          ].map(({ Icon, title, text }) => (
            <div className="guide-step" key={title}>
              <Icon size={30} strokeWidth={1} />
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="guide-block" id="remove">
        <p className="eyebrow">04 / A GENTLE GOODBYE</p>
        <h2>
          Soak. Loosen. <em>Remove.</em>
        </h2>
        <p>Never pull or force the nails off.</p>
        <div className="guide-steps">
          {[
            [
              "Soak",
              "Soak your fingertips in warm, soapy water for 10–15 minutes.",
            ],
            [
              "Loosen",
              "Gently loosen the press-on from the sides using the Cuticle Stick. If it doesn’t release easily, soak for a little longer.",
            ],
            [
              "Remove gently",
              "Gently remove to protect your natural nails. Do not force or peel.",
            ],
          ].map(([title, text], i) => (
            <div className="guide-step" key={title}>
              <span className="step-number">0{i + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="guide-block" id="reuse" style={{ marginBottom: 65 }}>
        <p className="eyebrow">05 / KEEP. REUSE. RELOVE.</p>
        <h2>
          A little love, <em>again.</em>
        </h2>
        <p>
          Remove any leftover adhesive from the inside of the press-on. Gently
          wipe with a damp, lint-free tissue and dry. Store your press-ons
          safely in their original box.
        </p>
        <p>
          Adhesive tabs are best for easy temporary wear and reuse. Glue-applied
          nails may be reusable if removed gently.
        </p>
        <Link href="/collections" className="text-link">
          Find your next moment <ArrowUpRight size={15} />
        </Link>
      </section>
    </div>
  );
}
