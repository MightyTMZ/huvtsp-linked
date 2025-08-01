"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Filter, TrendingUp, BarChart3, Home } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
      description: "Welcome page",
    },
    {
      name: "Alumni Search",
      href: "/smart-search",
      icon: Search,
      description: "Natural language search",
    },
    {
      name: "Alumni Filter",
      href: "/filter-search",
      icon: Filter,
      description: "Advanced filtering",
    },
    {
      name: "Ventures Search",
      href: "/project-smart-search",
      icon: Search,
      description: "Natural language search",
    },
    {
      name: "Ventures Filter",
      href: "/project-filter-search",
      icon: Filter,
      description: "Advanced filtering",
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: BarChart3,
      description: "Search statistics",
    },
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                HUVTSP Alumni &nbsp;<span style={{ fontSize: "10px" }}>(Beta)</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive
                        ? "border-blue-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-1" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
