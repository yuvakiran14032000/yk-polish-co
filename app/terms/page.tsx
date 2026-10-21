import Link from "next/link";
export const metadata = {
  title: "Enquiry terms",
  alternates: { canonical: "/terms" },
};
export default function Terms() {
  return (
    <article className="container legal">
      <div className="page-heading">
        <p className="eyebrow">A PERSONAL CONVERSATION</p>
        <h1>
          The little <em>details.</em>
        </h1>
        <p>How browsing and enquiring with YK Polish Co. works.</p>
      </div>
      <h2>Enquiries, prices and availability</h2>
      <p>
        This is a product catalogue with an enquiry bag. Preparing an enquiry,
        opening WhatsApp or marking a message as sent does not place or confirm
        an order. YK Polish Co. confirms your design, sizing, availability,
        final price and fulfilment details personally.
      </p>
      <p>
        Collection prices are starting prices. Customised sets start at ₹699+
        and bridal sets at ₹799+. Add-ons may change the final price. Bag totals
        are estimates. An application kit is included with every set. Shipping
        is charged separately and is confirmed during your enquiry.
      </p>
      <h2>Personalised designs</h2>
      <p>
        Shape, length, sizing and design choices depend on the selected product
        and design feasibility. Custom Studio selections are preferences for
        discussion. Clearly labelled concept imagery and collection
        illustrations are not photographs of confirmed brand inventory.
      </p>
      <h2>Before confirming a purchase</h2>
      <p>
        Ask the brand to confirm production timing, delivery, payment
        arrangements, and the cancellation, exchange or return terms that apply
        to your set before you agree to an order. This website does not collect
        online payment and does not promise delivery times.
      </p>
      <h2>Care</h2>
      <p>
        Follow the supplied{" "}
        <Link className="underlined" href="/nail-guide">
          application and care guide
        </Link>
        . Reuse depends on removal and care. Never pull, force or peel press-ons
        off.
      </p>
      <h2>Contact</h2>
      <p>
        For questions about your enquiry or a set, contact{" "}
        <a
          className="underlined"
          href="https://wa.me/919611435929"
          target="_blank"
          rel="noreferrer"
        >
          +91 9611435929
        </a>{" "}
        or{" "}
        <a
          className="underlined"
          href="https://www.instagram.com/ykpolishco/"
          target="_blank"
          rel="noreferrer"
        >
          @ykpolishco
        </a>
        .
      </p>
    </article>
  );
}
