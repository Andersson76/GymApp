"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b shadow-sm px-4 py-3 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-screen-xl 2xl:max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Vänster: Logo + Hamburger */}
          <div className="flex items-center">
            {/* Hamburger for mobile */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 focus:outline-none"
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>

            {/* Logo – always visible */}
            <div className="ml-4">
              <Image
                src="/gymappTransparent.png"
                alt="GymApp logotyp"
                className="w-28 h-auto sm:w-36"
                width={144}
                height={40}
                priority
              />
            </div>
          </div>

          {/* Right: Auth Buttons */}
          <div className="flex items-center space-x-4 text-sm">
            {!user ? (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Logga in
                </Link>
                <Link
                  href="/register"
                  className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
                >
                  Registrera
                </Link>
              </>
            ) : (
              <Menu as="div" className="relative inline-block text-left">
                <Menu.Button className="text-gray-700 hover:text-blue-600">
                  Inloggad som:{" "}
                  <span className="font-medium">{user.email}</span>
                </Menu.Button>
                <Transition
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={logout}
                          className={`${
                            active ? "bg-gray-100" : ""
                          } w-full text-left px-4 py-2 text-gray-700`}
                        >
                          Logga ut
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            )}
          </div>
        </div>

        {/* Mobil dropdown meny */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 space-y-1 text-sm">
            <Link
              href="/dashboard"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/historik"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Mina pass
            </Link>
            <Link
              href="/dashboard/logga-pass"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Logga pass
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
