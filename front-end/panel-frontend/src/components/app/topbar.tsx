"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { Menu, User, LogOut } from "lucide-react";
import { useState } from "react";

export function Topbar({ userEmail }: { userEmail?: string }) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Mobile menu button + Title */}
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
          <div className="lg:hidden text-lg font-semibold text-gray-900">
            Panel
          </div>
        </div>

        {/* Right side - User info + Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span>{userEmail ? userEmail : "Kullanıcı"}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="hidden sm:inline-flex"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Çıkış Yap
          </Button>

          {/* Mobile logout button */}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="sm:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <LogOut className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {showMobileMenu && (
        <div className="lg:hidden mt-4 py-4 border-t border-gray-200">
          <nav className="space-y-2">
            <a
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
              href="/dashboard"
            >
              Dashboard
            </a>
            <a
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
              href="/sites"
            >
              Siteler
            </a>
            <a
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
              href="/pages"
            >
              Sayfalar
            </a>
          </nav>

          {/* User info in mobile menu */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="px-3 py-2 text-xs text-gray-500">
              Giriş: {userEmail || "Kullanıcı"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
