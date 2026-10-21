import Link from "next/link";
export const metadata = {
  title: "Privacy",
  alternates: { canonical: "/privacy" },
};
export default function Privacy() {
  return (
    <article className="container legal">
      <div className="page-heading">
        <p className="eyebrow">THE DETAILS MATTER</p>
        <h1>
          Your <em>privacy.</em>
        </h1>
        <p>How this catalogue handles your enquiry information.</p>
      </div>
      <h2>Your enquiry bag</h2>
      <p>
        Your bag is stored in your browser’s local storage so it remains
        available when you return. Use “Clear bag” to remove it from this
        browser. We do not take online payments on this website.
      </p>
      <h2>Information you choose to share</h2>
      <p>
        When enquiry storage is configured, preparing an enquiry saves the
        designs, preferences, quantities, notes and a reference in our protected
        database for the brand to manage your request. A custom enquiry includes
        the brief you provide. The interface tells you if an enquiry has not
        been saved. Please leave sensitive personal information out of design
        notes.
      </p>
      <h2>WhatsApp and Instagram</h2>
      <p>
        Opening a WhatsApp link places your enquiry text in WhatsApp for you to
        send. The site cannot verify delivery. WhatsApp and Instagram handle
        your information under their own privacy policies. Reference images can
        be shared directly with the brand through those services.
      </p>
      <h2>Services used by this website</h2>
      <p>
        The website host processes technical request information to serve and
        protect the site. When configured, Supabase provides the database,
        product image storage and admin authentication. Google Fonts supplies
        the website’s typefaces and receives the technical information needed to
        deliver font files. Admin sessions use authentication cookies. The
        storefront does not require a customer account.
      </p>
      <h2>Your choices</h2>
      <p>
        Contact YK Polish Co. through{" "}
        <a
          className="underlined"
          href="https://www.instagram.com/ykpolishco/"
          target="_blank"
          rel="noreferrer"
        >
          Instagram
        </a>{" "}
        or{" "}
        <a
          className="underlined"
          href="https://wa.me/919611435929"
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp
        </a>{" "}
        to ask about enquiry information or request its correction or deletion.
        You can browse without submitting an enquiry.
      </p>
      <Link href="/" className="text-link">
        Return to YK
      </Link>
    </article>
  );
}
