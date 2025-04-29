"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Save } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const { user, isAuthenticated, isLoading, updateSettings } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Settings state
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system")
  const [showReasoningProcess, setShowReasoningProcess] = useState(false)
  const [temperature, setTemperature] = useState(0.7)
  const [systemPrompt, setSystemPrompt] = useState("")
  const [contextMemorySize, setContextMemorySize] = useState(50)

  // Load user settings when user data is available
  useEffect(() => {
    if (user?.settings) {
      setTheme(user.settings.theme || "system")
      setShowReasoningProcess(user.settings.showReasoningProcess || false)
      setTemperature(user.settings.temperature || 0.7)
      setSystemPrompt(user.settings.systemPrompt || "")
      setContextMemorySize(user.settings.contextMemorySize || 50)
    }
  }, [user])

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isLoading, isAuthenticated, router])

  const handleSaveSettings = async () => {
    setIsSaving(true)
    try {
      const success = await updateSettings({
        theme,
        showReasoningProcess,
        temperature,
        systemPrompt,
        contextMemorySize,
      })

      if (success) {
        toast({
          title: "Settings saved",
          description: "Your preferences have been updated successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to save settings. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-10">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <Tabs defaultValue="general">
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="ai">AI Behavior</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure your general preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-reasoning">Show Reasoning Process</Label>
                  <p className="text-sm text-muted-foreground">Display the AI's chain of thought reasoning process</p>
                </div>
                <Switch id="show-reasoning" checked={showReasoningProcess} onCheckedChange={setShowReasoningProcess} />
              </div>

              <div>
                <Label htmlFor="theme">Theme</Label>
                <Select value={theme} onValueChange={(value: any) => setTheme(value)}>
                  <SelectTrigger id="theme" className="mt-1">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle>AI Behavior</CardTitle>
              <CardDescription>Customize how the AI responds to your queries</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between">
                  <Label htmlFor="temperature">Temperature: {temperature.toFixed(1)}</Label>
                  <span className="text-sm text-muted-foreground">
                    {temperature < 0.3 ? "More focused" : temperature > 0.7 ? "More creative" : "Balanced"}
                  </span>
                </div>
                <Slider
                  id="temperature"
                  min={0}
                  max={1}
                  step={0.1}
                  value={[temperature]}
                  onValueChange={(value) => setTemperature(value[0])}
                  className="mt-2"
                />
              </div>

              <div>
                <div className="flex justify-between">
                  <Label htmlFor="context-memory">Context Memory: {contextMemorySize}</Label>
                  <span className="text-sm text-muted-foreground">
                    {contextMemorySize < 20 ? "Short-term" : contextMemorySize > 50 ? "Long-term" : "Balanced"}
                  </span>
                </div>
                <Slider
                  id="context-memory"
                  min={10}
                  max={100}
                  step={10}
                  value={[contextMemorySize]}
                  onValueChange={(value) => setContextMemorySize(value[0])}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="system-prompt">System Prompt</Label>
                <Textarea
                  id="system-prompt"
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  placeholder="Enter custom system prompt..."
                  className="mt-1 h-32"
                />
                <p className="text-xs text-muted-foreground mt-1">Leave blank to use the default system prompt</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the visual appearance</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">More appearance settings coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSaveSettings} disabled={isSaving}>
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Settings
        </Button>
      </div>
    </div>
  )
}
