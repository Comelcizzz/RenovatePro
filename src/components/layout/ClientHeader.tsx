"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface ClientHeaderProps {
  session: any;
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/services", label: "Services" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function ClientHeader({ session }: ClientHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "glass backdrop-blur-2xl border-b border-border"
          : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center space-x-3">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 rounded-2xl font-bold text-xl">
                R
              </div>
            </div>
            <span className="text-2xl font-black gradient-text-accent">
              RenovatePro
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="/services">Services</NavLink>
            <NavLink href="/portfolio">Portfolio</NavLink>
            <NavLink href="/about">About</NavLink>

            {session ? (
              <div className="flex items-center space-x-4">
                <NavLink href="/dashboard">Dashboard</NavLink>
                <form action="/api/auth/logout" method="POST">
                  <button
                    type="submit"
                    className="text-foreground/80 hover:text-foreground transition-colors font-medium"
                  >
                    Logout
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-foreground/80 hover:text-foreground transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="btn-primary text-sm px-6 py-2"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden relative w-10 h-10 glass rounded-xl flex items-center justify-center"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span
                className={`bg-foreground block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                  isMobileMenuOpen
                    ? "rotate-45 translate-y-1"
                    : "-translate-y-0.5"
                }`}
              ></span>
              <span
                className={`bg-foreground block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${
                  isMobileMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              ></span>
              <span
                className={`bg-foreground block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                  isMobileMenuOpen
                    ? "-rotate-45 -translate-y-1"
                    : "translate-y-0.5"
                }`}
              ></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden absolute top-full left-0 w-full transition-all duration-500 ease-out ${
            isMobileMenuOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
        >
          <div className="glass-dark mt-4 mx-4 rounded-3xl p-6 border border-border">
            <div className="flex flex-col space-y-4">
              <MobileNavLink
                href="/services"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Services
              </MobileNavLink>
              <MobileNavLink
                href="/portfolio"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Portfolio
              </MobileNavLink>
              <MobileNavLink
                href="/about"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </MobileNavLink>

              {session ? (
                <>
                  <MobileNavLink
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </MobileNavLink>
                  <form action="/api/auth/logout" method="POST">
                    <button
                      type="submit"
                      className="w-full text-left py-3 px-4 text-foreground/80 hover:text-foreground transition-colors rounded-xl hover:bg-foreground/5"
                    >
                      Logout
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <MobileNavLink
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </MobileNavLink>
                  <Link
                    href="/register"
                    className="btn-primary text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="relative text-foreground/80 hover:text-foreground transition-all duration-300 font-medium group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 group-hover:w-full transition-all duration-300"></span>
    </Link>
  );
}

function MobileNavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      className="block py-3 px-4 text-foreground/80 hover:text-foreground transition-colors rounded-xl hover:bg-foreground/5"
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
