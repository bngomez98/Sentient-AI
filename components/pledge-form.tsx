"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Loader2 } from "lucide-react"

const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
]

export function PledgeForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    state: "",
    zipCode: "",
    comments: "",
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
          state: "",
          zipCode: "",
          comments: "",
        })
      }
    } catch (error) {
      console.error("Error submitting pledge:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
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
            We'll keep you informed about elections in your area and provide resources to help you make informed
            decisions.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
            Last Name *
          </Label>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            required
            value={formData.lastName}
            onChange={handleChange}
            className="mt-1"
            placeholder="Enter your last name"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email" className="text-sm font-medium text-slate-700">
          Email Address *
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="mt-1"
          placeholder="Enter your email address"
        />
        <p className="text-xs text-slate-500 mt-1">
          We'll use this to send you election reminders and voter resources.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="state" className="text-sm font-medium text-slate-700">
            State *
          </Label>
          <select
            id="state"
            name="state"
            required
            value={formData.state}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select your state</option>
            {US_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

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
        </div>
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

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">Your Pledge:</h3>
        <p className="text-sm text-blue-800 italic">
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

      <p className="text-xs text-slate-500 text-center">
        By submitting this form, you agree to receive election reminders and movement updates. You can unsubscribe at
        any time. We will never sell or share your information.
      </p>
    </form>
  )
}
