"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Save, RefreshCw, Zap, Brain, Database, Key } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface SettingsPanelProps {
  onSave?: (settings: any) => Promise<void>
  initialSettings?: any
}

export function SettingsPanel({ onSave, initialSettings = {} }: SettingsPanelProps) {
  const [settings, setSettings] = useState({
    // API Settings
    pplxApiKey: initialSettings.pplxApiKey || "",
    pplxModel: initialSettings.pplxModel || "sonar-medium-online",
    openaiApiKey: initialSettings.openaiApiKey || "",
    openaiModel: initialSettings.openaiModel || "gpt-4o",
    huggingfaceApiToken: initialSettings.huggingfaceApiToken || "",

    // Generation Settings
    temperature: initialSettings.temperature || 0.7,
    maxTokens: initialSettings.maxTokens || 4096,
    topP: initialSettings.topP || 0.9,
    frequencyPenalty: initialSettings.frequencyPenalty || 0.5,
    presencePenalty: initialSettings.presencePenalty || 0.5,

    // Feature Flags
    enableLogging: initialSettings.enableLogging !== false,
    enableContinuousLearning: initialSettings.enableContinuousLearning || false,
    enableAutonomousDebugging: initialSettings.enableAutonomousDebugging || false,
    enableClientML: initialSettings.enableClientML || false,

    // Advanced Settings
    logLevel: initialSettings.logLevel || "info",
    contextMemorySize: initialSettings.contextMemorySize || 10,
  })

  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleSave = async () => {
    if (!onSave) return

    setIsSaving(true)
    setSaveError(null)
    setSaveSuccess(false)

    try {
      await onSave(settings)
      setSaveSuccess(true)

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Failed to save settings")
    } finally {
      setIsSaving(false)
    }
  }

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="text-2xl">Settings</CardTitle>
        <CardDescription>Configure your AI assistant's behavior and capabilities</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="api" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              <span>API</span>
            </TabsTrigger>
            <TabsTrigger value="generation" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span>Generation</span>
            </TabsTrigger>
            <TabsTrigger value="features" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span>Features</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span>Advanced</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="api" className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Perplexity API</h3>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="pplxApiKey">API Key</Label>
                    <Input
                      id="pplxApiKey"
                      type="password"
                      value={settings.pplxApiKey}
                      onChange={(e) => updateSetting("pplxApiKey", e.target.value)}
                      placeholder="Enter your Perplexity API key"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="pplxModel">Model</Label>
                    <Select value={settings.pplxModel} onValueChange={(value) => updateSetting("pplxModel", value)}>
                      <SelectTrigger id="pplxModel">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sonar-small-online">sonar-small-online</SelectItem>
                        <SelectItem value="sonar-medium-online">sonar-medium-online</SelectItem>
                        <SelectItem value="sonar-large-online">sonar-large-online</SelectItem>
                        <SelectItem value="mixtral-8x7b-instruct">mixtral-8x7b-instruct</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-2">OpenAI (Fallback)</h3>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="openaiApiKey">API Key</Label>
                    <Input
                      id="openaiApiKey"
                      type="password"
                      value={settings.openaiApiKey}
                      onChange={(e) => updateSetting("openaiApiKey", e.target.value)}
                      placeholder="Enter your OpenAI API key (optional)"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="openaiModel">Model</Label>
                    <Select value={settings.openaiModel} onValueChange={(value) => updateSetting("openaiModel", value)}>
                      <SelectTrigger id="openaiModel">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4o">gpt-4o</SelectItem>
                        <SelectItem value="gpt-4-turbo">gpt-4-turbo</SelectItem>
                        <SelectItem value="gpt-3.5-turbo">gpt-3.5-turbo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-2">Hugging Face</h3>
                <div className="grid gap-2">
                  <Label htmlFor="huggingfaceApiToken">API Token</Label>
                  <Input
                    id="huggingfaceApiToken"
                    type="password"
                    value={settings.huggingfaceApiToken}
                    onChange={(e) => updateSetting("huggingfaceApiToken", e.target.value)}
                    placeholder="Enter your Hugging Face API token (optional)"
                  />
                  <p className="text-sm text-gray-500 mt-1">Used for enhanced reasoning and contextual understanding</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="generation" className="space-y-6">
            <div className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <Label htmlFor="temperature">Temperature: {settings.temperature}</Label>
                    <span className="text-sm text-gray-500">
                      {settings.temperature < 0.3
                        ? "More focused"
                        : settings.temperature > 0.7
                          ? "More creative"
                          : "Balanced"}
                    </span>
                  </div>
                  <Slider
                    id="temperature"
                    min={0}
                    max={1}
                    step={0.1}
                    value={[settings.temperature]}
                    onValueChange={(value) => updateSetting("temperature", value[0])}
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Label htmlFor="maxTokens">Max Tokens: {settings.maxTokens}</Label>
                    <span className="text-sm text-gray-500">
                      {settings.maxTokens < 2000 ? "Concise" : settings.maxTokens > 6000 ? "Comprehensive" : "Standard"}
                    </span>
                  </div>
                  <Slider
                    id="maxTokens"
                    min={1000}
                    max={8192}
                    step={1000}
                    value={[settings.maxTokens]}
                    onValueChange={(value) => updateSetting("maxTokens", value[0])}
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Label htmlFor="topP">Top P: {settings.topP}</Label>
                  </div>
                  <Slider
                    id="topP"
                    min={0.1}
                    max={1}
                    step={0.1}
                    value={[settings.topP]}
                    onValueChange={(value) => updateSetting("topP", value[0])}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label htmlFor="frequencyPenalty">Frequency Penalty: {settings.frequencyPenalty}</Label>
                    </div>
                    <Slider
                      id="frequencyPenalty"
                      min={0}
                      max={2}
                      step={0.1}
                      value={[settings.frequencyPenalty]}
                      onValueChange={(value) => updateSetting("frequencyPenalty", value[0])}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <Label htmlFor="presencePenalty">Presence Penalty: {settings.presencePenalty}</Label>
                    </div>
                    <Slider
                      id="presencePenalty"
                      min={0}
                      max={2}
                      step={0.1}
                      value={[settings.presencePenalty]}
                      onValueChange={(value) => updateSetting("presencePenalty", value[0])}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableLogging">Enable Logging</Label>
                  <p className="text-sm text-gray-500">Log system operations for debugging and monitoring</p>
                </div>
                <Switch
                  id="enableLogging"
                  checked={settings.enableLogging}
                  onCheckedChange={(checked) => updateSetting("enableLogging", checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableContinuousLearning">Continuous Learning</Label>
                  <p className="text-sm text-gray-500">Improve responses based on conversation history</p>
                </div>
                <Switch
                  id="enableContinuousLearning"
                  checked={settings.enableContinuousLearning}
                  onCheckedChange={(checked) => updateSetting("enableContinuousLearning", checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableAutonomousDebugging">Autonomous Debugging</Label>
                  <p className="text-sm text-gray-500">Automatically detect and recover from errors</p>
                </div>
                <Switch
                  id="enableAutonomousDebugging"
                  checked={settings.enableAutonomousDebugging}
                  onCheckedChange={(checked) => updateSetting("enableAutonomousDebugging", checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableClientML">Client-side ML</Label>
                  <p className="text-sm text-gray-500">Enable machine learning features in the browser</p>
                </div>
                <Switch
                  id="enableClientML"
                  checked={settings.enableClientML}
                  onCheckedChange={(checked) => updateSetting("enableClientML", checked)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="logLevel">Log Level</Label>
                <Select value={settings.logLevel} onValueChange={(value) => updateSetting("logLevel", value)}>
                  <SelectTrigger id="logLevel">
                    <SelectValue placeholder="Select log level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="debug">Debug</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warn">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="contextMemorySize">Context Memory Size</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    id="contextMemorySize"
                    min={1}
                    max={20}
                    step={1}
                    value={[settings.contextMemorySize]}
                    onValueChange={(value) => updateSetting("contextMemorySize", value[0])}
                    className="flex-1"
                  />
                  <span className="w-12 text-center">{settings.contextMemorySize}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Number of previous messages to include in context</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {saveError && (
          <Alert variant="destructive" className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{saveError}</AlertDescription>
          </Alert>
        )}

        {saveSuccess && (
          <Alert className="mt-6 bg-green-50 border-green-200 text-green-800">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Settings saved successfully</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

