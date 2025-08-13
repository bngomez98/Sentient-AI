"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Loader2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

export function PledgeForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    zipCode: "",
    comments: "",
    isAnonymous: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/pledge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsSubmitted(true)
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          zipCode: "",
          comments: "",
          isAnonymous: false,
        })
      }
    } catch (error) {
      console.error("Error submitting pledge:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleAnonymousChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isAnonymous: checked,
      email: checked ? "" : prev.email,
    }))
  }

  if (isSubmitted) {
    return (
      <Card className="border-2 border-green-200 bg-green-50">
        <CardHeader className="text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <CardTitle className="text-2xl text-green-900">Thank You for Taking the Pledge!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-lg text-green-800 mb-4">
            You've joined thousands of Americans committed to restoring congressional accountability.
          </p>
          <p className="text-green-700">
            {formData.isAnonymous
              ? "Your anonymous pledge has been recorded."
              : "We'll keep you informed about elections in your area and provide resources to help you make informed decisions."}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Checkbox id="anonymous" checked={formData.isAnonymous} onCheckedChange={handleAnonymousChange} />
        <Label htmlFor="anonymous" className="text-sm font-medium text-slate-700">
          Pledge anonymously (no email required)
        </Label>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="firstName" className="text-sm font-medium text-slate-700">
            First Name *
          </Label>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            required
            value={formData.firstName}
            onChange={handleChange}
            className="mt-1"
            placeholder="Enter your first name"
          />
        </div>

        <div>
          <Label htmlFor="lastName" className="text-sm font-medium text-slate-700">
            Last Name (Optional)
          </Label>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            className="mt-1"
            placeholder="Enter your last name"
          />
        </div>
      </div>

      {!formData.isAnonymous && (
        <div>
          <Label htmlFor="email" className="text-sm font-medium text-slate-700">
            Email Address *
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required={!formData.isAnonymous}
            value={formData.email}
            onChange={handleChange}
            className="mt-1"
            placeholder="Enter your email address"
          />
          <p className="text-xs text-slate-500 mt-1">
            Your email stays private and is never visible to the public. We'll use this to send you election reminders
            and voter resources.
          </p>
        </div>
      )}

      <div>
        <Label htmlFor="zipCode" className="text-sm font-medium text-slate-700">
          ZIP Code *
        </Label>
        <Input
          id="zipCode"
          name="zipCode"
          type="text"
          required
          value={formData.zipCode}
          onChange={handleChange}
          className="mt-1"
          placeholder="Enter your ZIP code"
          pattern="[0-9]{5}(-[0-9]{4})?"
        />
        <p className="text-xs text-slate-500 mt-1">Required to track movement momentum by district.</p>
      </div>

      <div>
        <Label htmlFor="comments" className="text-sm font-medium text-slate-700">
          Comments (Optional)
        </Label>
        <Textarea
          id="comments"
          name="comments"
          value={formData.comments}
          onChange={handleChange}
          className="mt-1"
          placeholder="Tell us why you're taking the pledge..."
          rows={4}
        />
      </div>

      <div className="bg-brand-navy text-brand-cream p-4 rounded-lg border">
        <h3 className="font-semibold mb-2">Your Pledge:</h3>
        <p className="text-sm italic opacity-90">
          "I pledge to vote against every incumbent member of Congress in every election until we achieve complete
          congressional turnover. I will vote for any qualified challenger over any incumbent, regardless of party
          affiliation, because accountability matters more than ideology."
        </p>
      </div>

      <Button type="submit" className="w-full text-lg py-3" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Submitting Pledge...
          </>
        ) : (
          "Take the Fresh 535 Pledge"
        )}
      </Button>

      <div className="bg-slate-50 p-4 rounded-lg border">
        <h4 className="font-semibold text-slate-900 mb-2">Privacy Notice</h4>
        <p className="text-xs text-slate-600">
          Your information is used solely for movement coordination and voter education. We never sell or share your
          data with third parties. Email addresses remain private and are not visible to the public. You can unsubscribe
          from communications at any time. Anonymous pledges are recorded without any personal information beyond zip
          code for district tracking.
        </p>
      </div>
    </form>
  )
}
