"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X, Heart, Users } from "lucide-react"
import { Button } from "./ui/button"

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/my-district", label: "My District" },
    { href: "/analysis", label: "The Problem" },
    { href: "/solution", label: "The Solution" },
    { href: "/data", label: "Data & Evidence" },
    { href: "/resources", label: "Resources" },
    { href: "/faq", label: "FAQ" },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass-header shadow-md border-b" : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto container-padding">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-2 group">
            <Image
              src="/brand-logo.png"
              alt="Fresh 535 Logo"
              width={40}
              height={40}
              className="transition-transform duration-300 group-hover:scale-110"
              priority
            />
            <span className="text-xl font-semibold tracking-tight text-primary font-inter">FRESH 535</span>
          </Link>

          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors duration-200 relative ${
                  pathname === item.href ? "text-primary" : "text-slate-600 hover:text-primary"
                }`}
              >
                {item.label}
                {pathname === item.href && (
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-accent rounded-full" />
                )}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center space-x-2">
            <Button variant="outline" size="sm" asChild className="bg-transparent">
              <Link href="/donate">
                <Heart className="h-4 w-4 mr-2" />
                Donate
              </Link>
            </Button>
            <Button asChild size="sm" variant="destructive">
              <Link href="/pledge">
                <Users className="h-4 w-4 mr-2" />
                Take the Pledge
              </Link>
            </Button>
          </div>

          <button
            className="lg:hidden text-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-background shadow-xl border-t">
          <div className="container mx-auto container-padding py-6 flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block py-2 text-center font-medium rounded-md ${
                  pathname === item.href ? "text-accent bg-accent/10" : "text-slate-700 hover:text-accent"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col space-y-3 pt-4 border-t">
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/donate">
                  <Heart className="h-4 w-4 mr-2" />
                  Donate
                </Link>
              </Button>
              <Button variant="destructive" className="w-full" asChild>
                <Link href="/pledge">
                  <Users className="h-4 w-4 mr-2" />
                  Take the Pledge
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
