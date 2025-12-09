"use client"

import React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Mail, MapPin, Send } from "lucide-react"
import MyMap from "@/components/ui/mapsData"

interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

interface ToastLike {
  success: (title: string, desc?: string) => void
  error: (title: string, desc?: string) => void
  warning: (title: string, desc?: string) => void
}

interface Props {
  contactForm: ContactForm
  setContactForm: (v: ContactForm) => void
  isSubmitting: boolean
  setIsSubmitting: (v: boolean) => void
  toast: ToastLike
}

export default function ContactSection({
  contactForm,
  setContactForm,
  isSubmitting,
  setIsSubmitting,
  toast
}: Props) {

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.warning("Form Incomplete", "Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      })

      const data = await response.json()
      if (data.success) {
        toast.success("Message Sent!", data.message || "We will get back to you soon")
        setContactForm({ name: "", email: "", subject: "", message: "" })
      } else {
        toast.error("Failed to Send", data.error || "Please try again later")
      }
    } catch (err) {
      toast.error("Network Error", "Failed to send message. Check your connection.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Get in Touch
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            We'd love to hear from you
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* FORM CARD */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="shadow-xl border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>

                <form onSubmit={onSubmit} className="space-y-5">
                  <Input
                    placeholder="Your Name *"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    required
                    disabled={isSubmitting}
                  />

                  <Input
                    type="email"
                    placeholder="Your Email *"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    required
                    disabled={isSubmitting}
                  />

                  <Input
                    placeholder="Subject (Optional)"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    disabled={isSubmitting}
                  />

                  <textarea
                    placeholder="Your Message *"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white disabled:opacity-50"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    required
                    disabled={isSubmitting}
                  />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full h-11 text-lg flex items-center justify-center gap-2 bg-primary text-primary-foreground"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin h-5 w-5 rounded-full border-b-2 border-white" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>

              </CardContent>
            </Card>
          </motion.div>

          {/* RIGHT SIDE INFO + MAP */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Contact Details Card */}
            <Card className="shadow-xl border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <span className="text-gray-800 dark:text-gray-300">+91 9876543210</span>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <span className="text-gray-800 dark:text-gray-300">support@grodelivery.com</span>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="text-gray-800 dark:text-gray-300">
                    123 Grocery Street, Delivery City, DC 12345
                  </span>
                </div>

              </CardContent>
            </Card>

            {/* MAP CARD */}
            <Card className="shadow-xl border-gray-200 dark:border-gray-700 overflow-hidden">
              <CardContent className="p-0 h-64">
                <MyMap />
              </CardContent>
            </Card>

          </motion.div>

        </div>
      </div>
    </section>
  )
}
