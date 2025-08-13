import type React from "react"
import { ContactForm } from "@/components/contact-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, MessageSquare, Users, FileText } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">Contact Fresh 535</h1>
            <p className="text-xl text-slate-600">
              Get in touch with questions, feedback, media inquiries, or volunteer opportunities.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
              <ContactForm />
            </div>

            <div className="space-y-8">
              <ContactCard
                icon={<MessageSquare className="h-6 w-6 text-blue-700" />}
                title="General Inquiries"
                description="Questions about the movement, methodology, or how to get involved."
                contact="Use the contact form and select 'General' as your subject."
              />

              <ContactCard
                icon={<Mail className="h-6 w-6 text-blue-700" />}
                title="Media & Press"
                description="Interview requests, press inquiries, and media resources."
                contact="Use the contact form and select 'Media' as your subject. Include your outlet and deadline."
              />

              <ContactCard
                icon={<Users className="h-6 w-6 text-blue-700" />}
                title="Volunteer Opportunities"
                description="Help spread the message through social media, campus organizing, or content creation."
                contact="Use the contact form and select 'Volunteer' as your subject."
              />

              <ContactCard
                icon={<FileText className="h-6 w-6 text-blue-700" />}
                title="Data & Research"
                description="Questions about our methodology, data sources, or research findings."
                contact="Use the contact form and select 'Research' as your subject."
              />
            </div>
          </div>

          <div className="mt-16 bg-gray-50 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-blue-700 mb-2">Response Time</h4>
                <p className="text-slate-600 text-sm">
                  We aim to respond to all inquiries within 48 hours. Media requests receive priority during business
                  hours.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-blue-700 mb-2">Privacy Policy</h4>
                <p className="text-slate-600 text-sm">
                  We never sell or share personal information. Contact form data is used solely for responding to your
                  inquiry.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-blue-700 mb-2">Volunteer Background</h4>
                <p className="text-slate-600 text-sm">
                  No special skills required. We need help with social media, writing, research, and community outreach.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-blue-700 mb-2">Speaking Requests</h4>
                <p className="text-slate-600 text-sm">
                  We're available for campus talks, civic group presentations, and podcast interviews. Contact us with
                  details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const ContactCard = ({
  icon,
  title,
  description,
  contact,
}: {
  icon: React.ReactNode
  title: string
  description: string
  contact: string
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-3">
        {icon}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-slate-600 mb-3">{description}</p>
      <p className="text-sm font-medium">{contact}</p>
    </CardContent>
  </Card>
)
