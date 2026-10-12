
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex  items-center justify-center bg-background px-2 py-2 text-foreground sm:px-6 sm:py-12">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-8 sm:gap-10 md:grid-cols-2 md:gap-12 lg:gap-16">

        {/* Illustration */}
        <div className="order-1 flex min-w-0 justify-center md:order-2">
          <div className="w-full max-w-[280px] overflow-hidden rounded-2xl border border-border bg-background-card p-2 sm:max-w-sm sm:p-3 lg:max-w-md">
            <img
              src="https://cdn.dribbble.com/userupload/34115149/file/original-45f4efdd5a06bc743a173731761648f6.jpg?resize=420x&vertical=center"
              alt="Page not found illustration"
              className="block h-auto max-h-[35dvh] w-full rounded-xl object-contain sm:max-h-[45dvh] md:max-h-[60dvh]"
            />
          </div>
        </div>

        {/* Content */}
        <div className="order-2 min-w-0 text-center md:order-1 md:text-left">
          <span className="inline-flex rounded-full border border-border bg-background-card px-3 py-1.5 text-xs font-semibold text-primary sm:px-4 sm:text-sm">
            ERROR 404
          </span>

          <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:mt-5 sm:text-4xl lg:text-5xl xl:text-6xl">
            Oops! Page not found
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted-foreground sm:mt-5 sm:text-base sm:leading-7 md:mx-0">
            The page you're looking for doesn't exist or may have been moved.
            Let's get you back on track.
          </p>

          <div className="mt-6 flex justify-center md:mt-8 md:justify-start">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-secondary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:px-6 sm:text-base"
            >
              <span aria-hidden="true">←</span>
              Return Home
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
