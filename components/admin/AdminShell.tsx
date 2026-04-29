import { AdminSidebar } from "./shell/AdminSidebar";
import { AdminTopbar } from "./shell/AdminTopbar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen w-full min-w-245 max-w-420 gap-5 px-6 py-4">
        <aside className="panel sticky top-4 flex h-[calc(100vh-2rem)] w-72 shrink-0 flex-col">
          <AdminSidebar />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <AdminTopbar />
          <main className="pb-4">{children}</main>
        </div>
      </div>
    </div>
  );
}
