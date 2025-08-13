import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Download, Printer } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export type Resource = {
  title: string
  description: string
  previewUrl: string
  link: string
  type: "Printable" | "Digital Asset" | "Social Media"
}

export function ResourceCard({ resource }: { resource: Resource }) {
  const isPrintable = resource.type === "Printable"
  return (
    <div className="border bg-white rounded-lg overflow-hidden transition-shadow hover:shadow-xl flex flex-col">
      <div className="bg-slate-100 p-4 flex justify-center items-center aspect-video">
        <Image
          src={resource.previewUrl || "/placeholder.svg"}
          alt={`Preview of ${resource.title}`}
          width={400}
          height={300}
          className="object-contain max-h-full w-auto"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <Badge variant={isPrintable ? "destructive" : "secondary"} className="w-fit mb-2">
          {resource.type}
        </Badge>
        <h3 className="text-xl font-semibold mb-2">{resource.title}</h3>
        <p className="text-slate-600 mb-4 text-sm flex-grow">{resource.description}</p>
        <Button asChild className="w-full mt-auto">
          <Link href={resource.link} target={isPrintable ? "_blank" : "_self"}>
            {isPrintable ? (
              <>
                <Printer className="h-4 w-4 mr-2" /> View & Print
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" /> Download
              </>
            )}
          </Link>
        </Button>
      </div>
    </div>
  )
}
