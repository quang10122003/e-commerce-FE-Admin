import { Suspense } from "react";
import { LoginPageClient } from "./LoginPageClient";

function LoginPageFallback() {
  return (
    <main className="mx-auto flex min-h-screen w-full min-w-245 max-w-6xl items-center justify-center px-6 py-8">
      <div className="panel w-full max-w-md text-center text-sm text-slate-500">
        Dang tai trang dang nhap...
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginPageClient />
    </Suspense>
  );
}
