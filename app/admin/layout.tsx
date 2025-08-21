// app/admin/layout.tsx
"use client";

import { signOut, useSession } from "next-auth/react";
import { LogOut, LayoutDashboard } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <LayoutDashboard className="w-6 h-6 text-gray-700" />
            <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Welcome, {session?.user?.name || "Admin"}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-red-500 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
