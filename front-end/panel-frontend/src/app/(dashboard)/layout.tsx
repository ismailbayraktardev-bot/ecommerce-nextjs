import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { Topbar } from "@/components/app/topbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (!session) redirect("/login");

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden lg:block min-h-dvh">
        <div className="grid grid-cols-[220px_1fr] h-screen">
          <aside className="border-r border-gray-200 bg-white p-4">
            <div className="text-sm font-semibold">Panel</div>
            <nav className="mt-4 space-y-2 text-sm">
              <a
                className="block rounded px-2 py-1 hover:bg-gray-100"
                href="/dashboard"
              >
                Dashboard
              </a>
              <a
                className="block rounded px-2 py-1 hover:bg-gray-100"
                href="/sites"
              >
                Siteler
              </a>
              <a
                className="block rounded px-2 py-1 hover:bg-gray-100"
                href="/pages"
              >
                Sayfalar
              </a>
            </nav>
          </aside>
          <section className="overflow-auto">
            <Topbar userEmail={session?.user?.email || undefined} />
            <div className="p-6">{children}</div>
          </section>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden min-h-dvh flex flex-col">
        <Topbar userEmail={session?.user?.email || undefined} />
        <main className="flex-1 overflow-auto">
          <div className="p-4">{children}</div>
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="bg-white border-t border-gray-200 px-4 py-2 safe-area-pb">
          <div className="flex justify-around items-center">
            <a
              href="/dashboard"
              className="flex flex-col items-center gap-1 p-2 text-xs"
            >
              <div className="w-6 h-6 bg-blue-500 rounded-md flex items-center justify-center">
                <span className="text-white text-xs">D</span>
              </div>
              <span className="text-gray-700">Dashboard</span>
            </a>
            <a
              href="/sites"
              className="flex flex-col items-center gap-1 p-2 text-xs"
            >
              <div className="w-6 h-6 bg-gray-400 rounded-md flex items-center justify-center">
                <span className="text-white text-xs">S</span>
              </div>
              <span className="text-gray-500">Siteler</span>
            </a>
            <a
              href="/pages"
              className="flex flex-col items-center gap-1 p-2 text-xs"
            >
              <div className="w-6 h-6 bg-gray-400 rounded-md flex items-center justify-center">
                <span className="text-white text-xs">P</span>
              </div>
              <span className="text-gray-500">Sayfalar</span>
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
