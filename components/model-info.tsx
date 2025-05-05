import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ModelInfo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="inline-flex items-center justify-center text-sm font-medium text-muted-foreground hover:text-foreground">
            <Info className="h-4 w-4" />
            <span className="sr-only">Model Information</span>
          </button>
        </TooltipTrigger>
        <TooltipContent className="w-80">
          <div className="space-y-2">
            <h4 className="font-semibold">Multi-Task AI Model</h4>
            <p className="text-sm text-muted-foreground">
              This AI assistant uses a multi-task learning approach to handle various NLP tasks:
            </p>
            <ul className="text-xs space-y-1 list-disc pl-4">
              <li>Text classification</li>
              <li>Sentiment analysis</li>
              <li>Text summarization</li>
              <li>Entity extraction</li>
              <li>Question answering</li>
            </ul>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

