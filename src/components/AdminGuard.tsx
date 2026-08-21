"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAdminAuthenticated, logoutAdmin } from "@/lib/admin-auth";
import { LogOut } from "lucide-react";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.replace("/admin/login");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-stone-400">
        Checking access...
      </div>
    );
  }

  const handleLogout = () => {
    logoutAdmin();
    router.replace("/admin/login");
  };

  return (
    <div>
      <div className="bg-stone-900 text-white px-4 py-2 flex items-center justify-between text-sm">
        <span className="text-stone-300">Admin panel</span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg hover:bg-stone-700 transition"
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>
      {children}
    </div>
  );
}
