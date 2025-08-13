"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import {
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  MessageCircle,
  Link2,
  Copy,
  Download,
  QrCode,
  Users,
  Megaphone,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ShareModal({ isOpen, onClose }: ShareModalProps) {
  const [activeTab, setActiveTab] = useState("social")
  const [customMessage, setCustomMessage] = useState(
    "Join the Fresh 535 movement to restore congressional accountability. If they're in, they're out! 🇺🇸 #Fresh535",
  )
  const { toast } = useToast()

  const shareUrl = "https://fresh535.org"
  const defaultMessage =
    "Join the Fresh 535 movement to restore congressional accountability. If they're in, they're out!"

  const socialPlatforms = [
    {
      name: "Twitter",
      icon: Twitter,
      color: "bg-primary hover:bg-primary/90",
      action: () => {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(customMessage)}&url=${encodeURIComponent(shareUrl)}&hashtags=Fresh535,CongressionalAccountability`
        window.open(url, "_blank", "width=600,height=400")
      },
    },
    {
      name: "Facebook",
      icon: Facebook,
      color: "bg-primary hover:bg-primary/90",
      action: () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(customMessage)}`
        window.open(url, "_blank", "width=600,height=400")
      },
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      color: "bg-primary hover:bg-primary/90",
      action: () => {
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(customMessage)}`
        window.open(url, "_blank", "width=600,height=400")
      },
    },
    {
      name: "Email",
      icon: Mail,
      color: "bg-gray-600 hover:bg-gray-700",
      action: () => {
        const subject = "Join the Fresh 535 Movement"
        const body = `${customMessage}\n\nLearn more: ${shareUrl}`
        const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
        window.location.href = url
      },
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "bg-green-500 hover:bg-green-600",
      action: () => {
        const url = `https://wa.me/?text=${encodeURIComponent(`${customMessage} ${shareUrl}`)}`
        window.open(url, "_blank")
      },
    },
    {
      name: "Copy Link",
      icon: Link2,
      color: "bg-slate-600 hover:bg-slate-700",
      action: () => {
        navigator.clipboard.writeText(shareUrl)
        toast({
          title: "Link copied!",
          description: "The Fresh 535 website link has been copied to your clipboard.",
        })
      },
    },
  ]

  const shareAssets = [
    {
      name: "Logo Pack",
      description: "High-resolution logos in multiple formats",
      icon: Download,
      action: () => window.open("/resources", "_blank"),
    },
    {
      name: "Social Graphics",
      description: "Ready-to-share images for social media",
      icon: Download,
      action: () => window.open("/resources", "_blank"),
    },
    {
      name: "QR Code",
      description: "QR code linking to Fresh535.org",
      icon: QrCode,
      action: () => window.open("/resources", "_blank"),
    },
  ]

  const tabs = [
    { id: "social", label: "Social Media", icon: Megaphone },
    { id: "personal", label: "Personal Outreach", icon: Users },
    { id: "assets", label: "Download Assets", icon: Download },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Share the Fresh 535 Movement</DialogTitle>
          <p className="text-slate-600 text-center">
            Help us reach more Americans who want congressional accountability
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.id ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Social Media Tab */}
          {activeTab === "social" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Customize your message:</label>
                <Textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full"
                  rows={3}
                  placeholder="Share why Fresh 535 matters to you..."
                />
                <p className="text-xs text-slate-500 mt-1">{customMessage.length}/280 characters</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {socialPlatforms.map((platform) => (
                  <Button
                    key={platform.name}
                    onClick={platform.action}
                    className={`${platform.color} text-white flex flex-col items-center space-y-2 h-20`}
                  >
                    <platform.icon className="h-6 w-6" />
                    <span className="text-sm">{platform.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Personal Outreach Tab */}
          {activeTab === "personal" && (
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Email Template</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Subject:</label>
                      <Input value="Something important about our democracy" className="w-full" readOnly />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Message:</label>
                      <Textarea
                        value={`Hi [Name],

I wanted to share something with you that I think is really important for our democracy.

I recently learned about the Fresh 535 movement - it's a non-partisan effort to restore accountability to Congress by replacing all 535 members with new representatives who haven't been captured by special interests.

Here's why this matters: Congress has an 18% approval rating, yet 95% of incumbents get reelected. This disconnect shows our system is broken. The Fresh 535 approach is simple - vote out every incumbent, regardless of party, until we get representatives who actually represent us.

You can learn more at: ${shareUrl}

What do you think? I'd love to hear your thoughts.

Best,
[Your name]`}
                        className="w-full"
                        rows={12}
                        readOnly
                      />
                    </div>
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(`Subject: Something important about our democracy

Hi [Name],

I wanted to share something with you that I think is really important for our democracy.

I recently learned about the Fresh 535 movement - it's a non-partisan effort to restore accountability to Congress by replacing all 535 members with new representatives who haven't been captured by special interests.

Here's why this matters: Congress has an 18% approval rating, yet 95% of incumbents get reelected. This disconnect shows our system is broken. The Fresh 535 approach is simple - vote out every incumbent, regardless of party, until we get representatives who actually represent us.

You can learn more at: ${shareUrl}

What do you think? I'd love to hear your thoughts.

Best,
[Your name]`)
                        toast({
                          title: "Email template copied!",
                          description: "The email template has been copied to your clipboard.",
                        })
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Email Template
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Conversation Starters</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-sm">
                        "Did you know Congress has an 18% approval rating but 95% of incumbents get reelected? There's a
                        movement called Fresh 535 that's trying to fix this..."
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-sm">
                        "I found this interesting approach to fixing Congress - instead of trying to reform the system,
                        just replace everyone in it. What do you think about that?"
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-sm">
                        "Have you heard about Fresh 535? It's not about left vs right - it's about accountability vs
                        corruption. Pretty interesting approach..."
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Assets Tab */}
          {activeTab === "assets" && (
            <div className="space-y-6">
              <p className="text-slate-600 text-center">Download professional assets to share the Fresh 535 message</p>

              <div className="grid gap-4">
                {shareAssets.map((asset) => (
                  <Card key={asset.name} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <asset.icon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{asset.name}</h3>
                          <p className="text-sm text-slate-600">{asset.description}</p>
                        </div>
                        <Button onClick={asset.action} variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold text-blue-900 mb-2">Need Custom Assets?</h3>
                  <p className="text-blue-800 text-sm mb-4">
                  </p>
                  <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100 bg-transparent">
                    Contact Us
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
