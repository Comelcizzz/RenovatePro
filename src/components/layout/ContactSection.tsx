"use client";

import { contactInfo } from "@/lib/dummy-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, MapPin, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function ContactSection() {
  return (
    <div className="bg-gray-900/50 py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white">Get in Touch</h2>
          <p className="text-lg text-gray-300 mt-4 max-w-2xl mx-auto">
            Have a project in mind? We&apos;d love to hear from you. Contact us today
            to get started.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white">Contact Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300">
                <div className="flex items-center gap-4">
                  <Phone className="h-5 w-5 text-primary" />
                  <a
                    href={`tel:${contactInfo.phone}`}
                    className="hover:text-white"
                  >
                    {contactInfo.phone}
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="h-5 w-5 text-primary" />
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="hover:text-white"
                  >
                    {contactInfo.email}
                  </a>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <span>{contactInfo.address}</span>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white">Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 btn-outline"
                >
                  <ExternalLink className="h-4 w-4" /> View Photo References
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 btn-outline"
                >
                  <ExternalLink className="h-4 w-4" /> View Floorplans
                </Button>
              </CardContent>
            </Card>
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
              <iframe
                src={contactInfo.mapsUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          <div className="lg:col-span-2">
            <Card className="glass-card h-full">
              <CardHeader>
                <CardTitle className="text-white">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      type="text"
                      placeholder="Your Name"
                      className="glass"
                    />
                    <Input
                      type="tel"
                      placeholder="Your Phone"
                      className="glass"
                    />
                  </div>
                  <Input
                    type="text"
                    placeholder="Address (Optional)"
                    className="glass"
                  />
                  <Textarea
                    placeholder="Your Message"
                    rows={6}
                    className="glass"
                  />
                  <Button type="submit" className="w-full btn-primary">
                    Submit Inquiry
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
