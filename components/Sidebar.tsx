// components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { HomeIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/20/solid";

export default function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user) return null; // Visa inte sidebar om ej inloggad

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Mina pass", href: "/dashboard/historik", icon: CalendarDaysIcon },
    { name: "Logga pass", href: "/dashboard/logga-pass", icon: PlusIcon },
  ];

  return (
    <aside className="hidden lg:block lg:w-64 bg-white shadow h-screen sticky top-0">
      <div className="p-6">
      </div>
      <nav className="px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
