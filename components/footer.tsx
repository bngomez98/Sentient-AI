import Link from "next/link"
import Image from "next/image"
import { Button } from "./ui/button"

export function Footer() {
  const footerLinks = [
    {
      title: "The Movement",
      links: [
        { href: "/problem", label: "The Problem" },
        { href: "/solution", label: "The Solution" },
        { href: "/my-district", label: "My District" },
      ],
    },
    {
      title: "Get Involved",
      links: [
        { href: "/pledge", label: "Take the Pledge" },
        { href: "/donate", label: "Donate" },
        { href: "/resources", label: "Resources" },
      ],
    },
    {
      title: "About",
      links: [
        { href: "/faq", label: "FAQ" },
        { href: "/contact", label: "Contact Us" },
        { href: "/methodology", label: "Methodology" },
      ],
    },
  ]

  return (
    <footer className="bg-brand-navy text-brand-cream">
      <div className="container mx-auto container-padding py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Image src="/brand-logo.png" alt="Fresh 535 Logo" width={32} height={32} />
              <span className="text-xl font-semibold">FRESH 535</span>
            </Link>
            <p className="text-slate-400 max-w-sm mb-6">
              A non-partisan civic movement to restore functional governance by replacing all 535 members of Congress.
            </p>
            <Button asChild variant="secondary">
              <Link href="/pledge">Join the Movement</Link>
            </Button>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-white mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-slate-400 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-700 mt-12 pt-8 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Fresh 535. All Rights Reserved.</p>
          <p className="mt-1">A non-partisan civic movement for congressional accountability.</p>
        </div>
      </div>
    </footer>
  )
}
