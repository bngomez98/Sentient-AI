import { ResourceCard, type Resource } from "@/components/resource-card"

const resources: Resource[] = [
  {
    title: "Printable Flyer",
    description: "A detailed, one-page flyer explaining the movement. Perfect for community bulletin boards.",
    previewUrl: "/fresh-printable-flyer.png",
    link: "/resources/flyer",
    type: "Printable",
  },
  {
    title: "Data Packet Summary",
    description: "A comprehensive summary of the key data and charts from our analysis, ready for printing.",
    previewUrl: "/pledge-cards.png", // Placeholder
    link: "/resources/data-packet",
    type: "Printable",
  },
  {
    title: "Primary Logo Pack",
    description: "Official Fresh 535 logos (PNG, SVG) for use on light and dark backgrounds.",
    previewUrl: "/brand-logo.png",
    link: "#", // This would be a direct download link in a real app
    type: "Digital Asset",
  },
  {
    title: "'I Pledged' Profile Badge",
    description: "Add this badge to your social media profile picture to show your support.",
    previewUrl: "/fresh-535-pledged-badge.png",
    link: "#",
    type: "Social Media",
  },
  {
    title: "Accountability Deficit Graphic",
    description: "A shareable graphic for Instagram & Facebook detailing key statistics.",
    previewUrl: "/accountability-deficit-graphic.png",
    link: "#",
    type: "Social Media",
  },
  {
    title: "Twitter / X Header",
    description: "An optimized header image for your Twitter / X profile.",
    previewUrl: "/fresh-535-twitter-header.png",
    link: "#",
    type: "Social Media",
  },
]

export default function ResourcesPage() {
  return (
    <div className="section-padding">
      <div className="container mx-auto container-padding">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl mb-4">Movement Resources</h1>
          <p className="text-lg text-slate-600">
            Download and share official assets to promote the Fresh 535 message in your community and online.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((resource) => (
            <ResourceCard key={resource.title} resource={resource} />
          ))}
        </div>
      </div>
    </div>
  )
}
