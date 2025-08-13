"use client"

import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Linkedin, Mail, MessageCircle, Link2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ShareButtons() {
  const { toast } = useToast()
  const shareUrl = "https://fresh535.org"
  const shareText =
    "Join the Fresh 535 movement to restore congressional accountability. If they're in, they're out! 🇺🇸 #Fresh535"

  const handleShare = (platform: string) => {
    let url = ""

    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}&hashtags=Fresh535,CongressionalAccountability`
        break
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`
        break
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(shareText)}`
        break
      case "email":
        url = `mailto:?subject=${encodeURIComponent("Join the Fresh 535 Movement")}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`
        break
      case "whatsapp":
        url = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`
        break
      case "copy":
        navigator.clipboard.writeText(shareUrl)
        toast({
          title: "Link copied!",
          description: "The Fresh 535 website link has been copied to your clipboard.",
        })
        return
    }

    if (url) {
      window.open(url, "_blank", "width=600,height=400,noopener,noreferrer")
    }
  }

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("twitter")}
        className="bg-primary/10 border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground backdrop-blur-sm"
      >
        <Twitter className="h-4 w-4 mr-2" />
        Twitter
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("facebook")}
        className="bg-primary/10 border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground backdrop-blur-sm"
      >
        <Facebook className="h-4 w-4 mr-2" />
        Facebook
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("linkedin")}
        className="bg-primary/10 border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground backdrop-blur-sm"
      >
        <Linkedin className="h-4 w-4 mr-2" />
        LinkedIn
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("email")}
        className="bg-primary/10 border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground backdrop-blur-sm"
      >
        <Mail className="h-4 w-4 mr-2" />
        Email
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("whatsapp")}
        className="bg-primary/10 border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground backdrop-blur-sm"
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        WhatsApp
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("copy")}
        className="bg-primary/10 border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground backdrop-blur-sm"
      >
        <Link2 className="h-4 w-4 mr-2" />
        Copy Link
      </Button>
    </div>
  )
}
