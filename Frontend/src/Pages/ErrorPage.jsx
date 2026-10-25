import { Link, useRouteError } from "react-router";

export default function ErrorPage() {
  const error = useRouteError();
  const isNotFound = error?.status === 404;

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-345 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <span className="text-6xl font-black text-accent">🛒</span>
      <h1 className="text-3xl font-black text-ink">
        {isNotFound ? "404 — Page not found" : "Something went wrong"}
      </h1>
      <p className="max-w-md text-ink-faint">
        {isNotFound
          ? "The page you're looking for doesn't exist or may have moved."
          : error?.message || "An unexpected error occurred. Please try again."}
      </p>
      <div className="flex gap-3">
        <Link
          to="/"
          className="rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-white transition hover:bg-accent-strong"
        >
          Go to Home
        </Link>
        <button
          onClick={() => window.history.back()}
          className="rounded-full border-line-strong px-6 py-2.5 text-sm font-bold text-ink transition hover:bg-card-soft"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
