import DashboardSidebar from "@/components/Dashboard/DashboardSidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 via-white to-red-100 p-4">
      <div className="flex gap-6 h-[calc(100vh-2rem)]">
        <DashboardSidebar />
        <main className="flex-1 overflow-hidden">
          <div className="bg-white rounded-3xl shadow-xl border border-red-100 h-full overflow-y-auto p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
