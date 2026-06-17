import DashboardSidebar from "@/components/Dashboard/DashboardSidebar";
import DashboardMobileMenu from "@/components/Dashboard/DashboardMobileMenu";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 via-white to-red-100 p-3 md:p-4">
      {/* Mobile Header */}
      <div className="md:hidden mb-4">
        <DashboardMobileMenu />
      </div>

      <div className="flex gap-5 h-[calc(100vh-1.5rem)] pt-16 md:pt-0">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block">
          <DashboardSidebar />
        </aside>

        {/* Content */}

        <main className="flex-1 overflow-hidden">
          <section className="h-full overflow-y-auto bg-white rounded-3xl shadow-xl border border-red-100 p-4 md:p-8">
            {children}
          </section>
        </main>
      </div>
    </div>
  );
}
