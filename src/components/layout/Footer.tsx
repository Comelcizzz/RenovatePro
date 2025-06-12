"use client";

import Link from "next/link";
import { useState } from "react";
import { ContactSection } from "./ContactSection";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <>
      <ContactSection />
      <footer className="relative mt-20">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-indigo-900/20 to-transparent" />

        <div className="relative z-10">
          {/* Main footer content */}
          <div className="glass-dark border-t border-border">
            <div className="container mx-auto px-4 py-16">
              <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12">
                {/* Brand section */}
                <div className="lg:col-span-1">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur-lg opacity-60" />
                      <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 text-primary-foreground p-3 rounded-2xl font-bold text-xl">
                        R
                      </div>
                    </div>
                    <span className="text-2xl font-black gradient-text-accent">
                      RenovatePro
                    </span>
                  </div>

                  <p className="text-foreground/70 mb-8 leading-relaxed">
                    Transforming spaces with revolutionary design and
                    cutting-edge technology. Where dreams meet reality.
                  </p>

                  {/* Social media */}
                  <div className="flex space-x-4">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        className="w-12 h-12 glass rounded-xl flex items-center justify-center text-foreground/60 hover:text-foreground transition-all duration-300 hover:scale-110 group"
                      >
                        <div className="text-xl">{social.icon}</div>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Quick Links */}
                <div>
                  <h4 className="text-xl font-bold text-foreground mb-6 gradient-text-accent">
                    Quick Links
                  </h4>
                  <ul className="space-y-4">
                    {quickLinks.map((link, index) => (
                      <li key={index}>
                        <Link
                          href={link.href}
                          className="text-foreground/70 hover:text-foreground transition-all duration-300 group flex items-center"
                        >
                          <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Services */}
                <div>
                  <h4 className="text-xl font-bold text-foreground mb-6 gradient-text-accent">
                    Our Services
                  </h4>
                  <ul className="space-y-4">
                    {services.map((service, index) => (
                      <li key={index}>
                        <Link
                          href={service.href}
                          className="text-foreground/70 hover:text-foreground transition-all duration-300 group flex items-center"
                        >
                          <span className="text-lg mr-3">{service.icon}</span>
                          {service.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Newsletter */}
                <div>
                  <h4 className="text-xl font-bold text-foreground mb-6 gradient-text-accent">
                    Stay Updated
                  </h4>

                  <p className="text-foreground/70 mb-6">
                    Get the latest updates on our amazing projects and exclusive
                    offers.
                  </p>

                  <form onSubmit={handleSubscribe} className="space-y-4">
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full glass text-foreground placeholder-foreground/50 px-4 py-3 rounded-xl border border-border focus:border-blue-500/50 focus:outline-none transition-all duration-300"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubscribed}
                      className="w-full btn-primary"
                    >
                      {isSubscribed ? (
                        <span className="flex items-center justify-center">
                          <span className="mr-2">✓</span>
                          Subscribed!
                        </span>
                      ) : (
                        "Subscribe"
                      )}
                    </button>
                  </form>

                  {/* Contact info */}
                  <div className="mt-8 space-y-3">
                    <div className="flex items-center text-foreground/70">
                      <span className="mr-3">📍</span>
                      123 Innovation Street, Design City
                    </div>
                    <div className="flex items-center text-foreground/70">
                      <span className="mr-3">📞</span>
                      +1 (555) 123-4567
                    </div>
                    <div className="flex items-center text-foreground/70">
                      <span className="mr-3">✉️</span>
                      hello@renovatepro.com
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="glass-dark border-t border-border">
            <div className="container mx-auto px-4 py-8">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="text-foreground/60 text-center md:text-left">
                  © {new Date().getFullYear()} RenovatePro. Crafted with ❤️ and
                  cutting-edge technology.
                </div>

                <div className="flex space-x-6">
                  <Link
                    href="/"
                    className="text-foreground/60 hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/"
                    className="text-foreground/60 hover:text-foreground transition-colors"
                  >
                    Terms of Service
                  </Link>
                  <Link
                    href="/"
                    className="text-foreground/60 hover:text-foreground transition-colors"
                  >
                    Cookie Policy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

const socialLinks = [
  { href: "https://facebook.com", icon: "📘" }, // Facebook
  { href: "https://twitter.com", icon: "🐦" }, // Twitter
  { href: "https://instagram.com", icon: "📷" }, // Instagram
  { href: "https://www.linkedin.com/in/ivan-bidlovskyi", icon: "💼" }, // LinkedIn
];

const quickLinks = [
  { name: "About Us", href: "/about" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Testimonials", href: "/" },
  { name: "Blog", href: "/" },
  { name: "Careers", href: "/" },
  { name: "Contact", href: "/" },
];

const services = [
  { name: "Kitchen Renovation", href: "/services", icon: "🍳" },
  { name: "Bathroom Design", href: "/services", icon: "🛁" },
  { name: "Living Spaces", href: "/services", icon: "🛋️" },
  { name: "Commercial Projects", href: "/services", icon: "🏢" },
];
