"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, MessageSquare, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNav } from "@/components/landing/LandingNav";
import { LiveStatusStrip } from "@/components/landing/LiveStatusStrip";
import { SectionHeading } from "@/components/landing/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

const SUPPORT_EMAIL = "support@powergridbd.com";

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data: ContactForm) => {
    const subject = encodeURIComponent(`[PowerGridBD] ${data.subject}`);
    const body = encodeURIComponent(
      `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`,
    );
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
    toast.success("Opening your email client to send the message.");
    reset();
  };

  return (
    <div className="min-h-screen bg-deep-charcoal font-sans">
      <LandingNav />
      <div className="pt-16">
        <LiveStatusStrip />
      </div>

      <main>
        <section className="container mx-auto px-4 pt-20 pb-16 lg:pt-28">
          <SectionHeading
            align="center"
            eyebrow="Contact"
            title="Talk to the operations team."
            description="Questions about outages, schedules, SLA subscriptions, or technician applications — reach the team through your email client."
          />
        </section>

        <section className="bg-zinc-950 py-16 border-t border-zinc-900">
          <div className="container mx-auto px-4 grid lg:grid-cols-5 gap-10">
            {/* Channels */}
            <div className="lg:col-span-2 space-y-5">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-smart-teal">
                    <Mail className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-white">Email Support</h3>
                </div>
                <p className="text-sm text-zinc-400 mb-3">
                  For outage reports, billing questions, and account help.
                </p>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="font-mono text-sm text-electric-blue hover:underline break-all"
                >
                  {SUPPORT_EMAIL}
                </a>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-amber-400">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-white">In-Platform</h3>
                </div>
                <p className="text-sm text-zinc-400">
                  Signed-in users can report outages, manage schedules, and
                  track payments directly in their role dashboard.
                </p>
                <p className="mt-3">
                  <Button
                    asChild
                    variant="outline"
                    className="border-zinc-700 text-zinc-200 hover:bg-zinc-800/60"
                  >
                    <a href="/auth/login">Sign In</a>
                  </Button>
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 md:p-8 space-y-5"
                noValidate
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">Name</Label>
                    <Input
                      id="contact-name"
                      className="bg-zinc-900 border-zinc-700 text-white"
                      placeholder="Your name"
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="text-xs text-destructive">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Email</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      className="bg-zinc-900 border-zinc-700 text-white"
                      placeholder="you@example.com"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-subject">Subject</Label>
                  <Input
                    id="contact-subject"
                    className="bg-zinc-900 border-zinc-700 text-white"
                    placeholder="What is this about?"
                    {...register("subject")}
                  />
                  {errors.subject && (
                    <p className="text-xs text-destructive">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-message">Message</Label>
                  <Textarea
                    id="contact-message"
                    rows={6}
                    className="bg-zinc-900 border-zinc-700 text-white resize-none"
                    placeholder="Describe your issue or question…"
                    {...register("message")}
                  />
                  {errors.message && (
                    <p className="text-xs text-destructive">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-electric-blue hover:bg-electric-blue/90 text-white gap-2"
                >
                  <Send className="h-4 w-4" />
                  {isSubmitting ? "Preparing…" : "Send via Email Client"}
                </Button>

                <p className="text-xs text-zinc-500">
                  This form opens your email client with the details pre-filled
                  — nothing is stored or sent from this page.
                </p>
              </form>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
