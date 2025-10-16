import Link from "next/link";

export default function HomePage() {
  return (
    <main className="container py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          Panel Frontend
        </h1>
        <div className="space-x-2">
          <Link
            className="inline-flex items-center rounded-md bg-black px-3 py-2 text-white"
            href="/login"
          >
            Login
          </Link>
          <Link
            className="inline-flex items-center rounded-md bg-gray-900/5 px-3 py-2"
            href="/playground/dnd"
          >
            D&D Playground
          </Link>
        </div>
      </div>
      <p className="mt-6 text-gray-600 max-w-2xl">
        Next 15 + React 19 + Tailwind 4 kuruldu. Zustand, TanStack Query, RHF +
        Zod ve dnd-kit hazır.
      </p>
    </main>
  );
}
