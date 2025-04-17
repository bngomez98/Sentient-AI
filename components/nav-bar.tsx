import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NavBar() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              Sentient-1
            </Link>
          </div>

          <nav className="flex items-center space-x-4">
            <Link href="/" passHref>
              <Button variant="ghost">Chat</Button>
            </Link>
            <Link href="/status" passHref>
              <Button variant="ghost">Status</Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

