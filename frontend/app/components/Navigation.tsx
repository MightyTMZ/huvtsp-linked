"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Filter, TrendingUp, BarChart3, Home, Menu, X, Lightbulb, LocationEdit } from "lucide-react";
import { useState } from "react";
// import Feedback from "./Feedback";

export default function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      name: "Location Search",
      href: "/location-based-searching",
      icon: LocationEdit,
      description: "Find alumni based on their location",
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
      name: "Startup Resources",
      href: "/startup-resources",
      icon: Lightbulb,
      description: "Startup tools & resources (Public)",
    },
    // {
    //   name: "Analytics",
    //   href: "/analytics",
    //   icon: BarChart3,
    //   description: "Search statistics",
    // },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                HUVTSP Alumni &nbsp;<span style={{ fontSize: "10px" }}>(Beta)</span>
              </Link>
            </div>
            {/* Desktop Navigation - Hidden on mobile */}
            <div className="hidden md:ml-6 md:flex md:space-x-8">
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
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
          
          {/* Feedback Link - Hidden on mobile for now */}
          {/* <div className="hidden md:flex items-center">
            <Feedback variant="compact" />
          </div> */}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200 shadow-lg">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? "bg-blue-50 border-l-4 border-blue-500 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center">
                    <Icon className="h-5 w-5 mr-3" />
                    <span>{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
