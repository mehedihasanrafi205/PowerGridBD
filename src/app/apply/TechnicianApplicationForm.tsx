"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateApplication } from "@/hooks";
import { cn } from "@/lib/utils";

const applicationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(6, "Phone number looks too short"),
  experience: z
    .number({ error: "Enter years of experience" })
    .min(0, "Experience cannot be negative"),
  skills: z.string().optional(),
  motivation: z.string().optional(),
});

type ApplicationForm = z.infer<typeof applicationSchema>;

/**
 * Public technician application form. Submits to the real
 * onboarding endpoint; on success routes to email OTP
 * verification with the address prefilled for resends.
 */
export default function TechnicianApplicationForm() {
  const router = useRouter();
  const createMutation = useCreateApplication();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationForm>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      experience: 0,
      skills: "",
      motivation: "",
    },
  });

  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const onSubmit = (data: ApplicationForm) => {
    createMutation.mutate(
      {
        name: data.name,
        email: data.email,
        phone: data.phone,
        experience: data.experience,
        skills: data.skills || undefined,
        motivation: data.motivation || undefined,
      },
      {
        onSuccess: () => {
          setSubmittedEmail(data.email);
          router.push(`/apply/verify?email=${encodeURIComponent(data.email)}`);
        },
      },
    );
  };

  const errorClass = (invalid: boolean) => cn(invalid && "border-destructive");

  return (
    <div className="mx-auto w-full max-w-2xl">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 md:p-8"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="apply-name">Full Name *</Label>
            <Input
              id="apply-name"
              placeholder="Your name"
              autoComplete="name"
              {...register("name")}
              disabled={createMutation.isPending}
              className={cn(
                "bg-zinc-900 border-zinc-700 text-white",
                errorClass(!!errors.name),
              )}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="apply-email">Email *</Label>
            <Input
              id="apply-email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              {...register("email")}
              disabled={createMutation.isPending}
              className={cn(
                "bg-zinc-900 border-zinc-700 text-white",
                errorClass(!!errors.email),
              )}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="apply-phone">Phone *</Label>
            <Input
              id="apply-phone"
              type="tel"
              placeholder="+8801XXXXXXXXX"
              autoComplete="tel"
              {...register("phone")}
              disabled={createMutation.isPending}
              className={cn(
                "bg-zinc-900 border-zinc-700 text-white",
                errorClass(!!errors.phone),
              )}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="apply-experience">Experience (years) *</Label>
            <Input
              id="apply-experience"
              type="number"
              min={0}
              placeholder="3"
              {...register("experience", { valueAsNumber: true })}
              disabled={createMutation.isPending}
              className={cn(
                "bg-zinc-900 border-zinc-700 text-white font-mono",
                errorClass(!!errors.experience),
              )}
            />
            {errors.experience && (
              <p className="text-sm text-destructive">
                {errors.experience.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="apply-skills">Skills</Label>
          <Input
            id="apply-skills"
            placeholder="Transformer maintenance, cable fault location…"
            {...register("skills")}
            disabled={createMutation.isPending}
            className="bg-zinc-900 border-zinc-700 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="apply-motivation">Motivation</Label>
          <Textarea
            id="apply-motivation"
            placeholder="Why do you want to join the field force?"
            rows={4}
            {...register("motivation")}
            disabled={createMutation.isPending}
            className="bg-zinc-900 border-zinc-700 text-white"
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={createMutation.isPending}
        >
          {createMutation.isPending
            ? "Submitting…"
            : submittedEmail
              ? "Submitted — check your email"
              : "Submit Application"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already applied?{" "}
          <Link
            href={`/apply/verify${submittedEmail ? `?email=${encodeURIComponent(submittedEmail)}` : ""}`}
            className="font-medium text-primary hover:underline"
          >
            Verify your email
          </Link>
        </p>
      </form>
    </div>
  );
}
