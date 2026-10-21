"use client";
import Link from "next/link";
export default function ErrorPage({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="container empty-state">
      <p className="eyebrow">A LITTLE PAUSE</p>
      <h1>
        Let’s try <em>again.</em>
      </h1>
      <p>
        We couldn’t load this page. Please try once more, or contact us through
        Instagram.
      </p>
      <button className="button" onClick={reset}>
        Try again
      </button>
      <Link className="text-link" href="/">
        Back to YK
      </Link>
    </div>
  );
}
