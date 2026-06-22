import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          DevPulse
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          A Knowledge Management System for developers. Write daily logs,
          document what you learn, and build your engineering portfolio.
        </p>
        <div className="mt-10">
          <Link
            href="/logs"
            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Write a Daily Log →
          </Link>
        </div>
      </div>
    </div>
  );
}
