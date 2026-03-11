"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users } from "lucide-react";
import { useState, Fragment } from "react";
import { signOut } from "next-auth/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Patients", href: "/patients", icon: Users },
];

export default function Navbar() {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">
          Samantha.ai
        </h1>

        {/* Nav Links */}
        <nav className="flex items-center gap-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300
                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-cyan-400 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
              >
                <Icon
                  size={18}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Profile Avatar + Dropdown */}
        <div className="relative">
          <div
            className="h-9 w-9 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 text-white flex items-center justify-center font-semibold shadow cursor-pointer"
            onClick={toggleDropdown}
          >
            <FontAwesomeIcon icon={faUser} />
          </div>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <button
                onClick={() => signOut({ callbackUrl: "/auth/login" })}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
