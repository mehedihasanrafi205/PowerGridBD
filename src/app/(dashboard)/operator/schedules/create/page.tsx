"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { PageHeader } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAreas, useAuth, useCreateSchedule } from "@/hooks";
import { cn } from "@/lib/utils";

const scheduleSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  type: z.enum(["FEEDER", "AREA"]),
  areaId: z.string().min(1, "Area is required"),
  feederId: z.string().optional(),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  recurrence: z.enum(["NONE", "DAILY", "WEEKLY", "MONTHLY"]),
  recurrenceDays: z.array(z.string()).optional(),
});

type ScheduleForm = z.infer<typeof scheduleSchema>;

export default function CreateSchedulePage() {
  const { isLoading: authLoading } = useAuth();
  const router = useRouter();
  const createMutation = useCreateSchedule();
  const { data: areas, isLoading: areasLoading } = useAreas({ limit: 100 });

  const isLoading = authLoading || createMutation.isPending || areasLoading;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<ScheduleForm>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "FEEDER",
      areaId: "",
      feederId: "",
      startTime: "",
      endTime: "",
      recurrence: "NONE",
      recurrenceDays: [],
    },
  });

  const recurrence = watch("recurrence");
  const showRecurrenceDays = recurrence !== "NONE";

  const handleSubmitForm = async (data: ScheduleForm) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success("Schedule created successfully!");
      // NOTE: no router.refresh() here — it aborts the pending
      // client navigation. The list refetches via query
      // invalidation in the mutation itself.
      router.push("/operator/schedules");
    } catch {
      toast.error("Failed to create schedule");
    }
  };

  const daysOfWeek = [
    { value: "MONDAY", label: "Monday" },
    { value: "TUESDAY", label: "Tuesday" },
    { value: "WEDNESDAY", label: "Wednesday" },
    { value: "THURSDAY", label: "Thursday" },
    { value: "FRIDAY", label: "Friday" },
    { value: "SATURDAY", label: "Saturday" },
    { value: "SUNDAY", label: "Sunday" },
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 max-w-3xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/4 bg-muted rounded" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <PageHeader
        title="Create Schedule"
        description="Create a new load-shedding schedule."
        actions={
          <Link href="/operator/schedules">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
        }
      />

      <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Weekly Maintenance - Gulshan Area"
                {...register("title")}
                disabled={isLoading}
                className={cn(
                  errors.title && "border-destructive focus:border-destructive",
                )}
              />
              {errors.title && (
                <p className="text-sm text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Schedule Type *</Label>
              <Select {...register("type")} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FEEDER">Feeder-based</SelectItem>
                  <SelectItem value="AREA">Area-based</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-destructive">
                  {errors.type.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Optional description of the schedule"
                {...register("description")}
                disabled={isLoading}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="areaId">Area *</Label>
              <Select
                {...register("areaId")}
                onValueChange={(value) => {
                  setValue("areaId", value);
                  setValue("feederId", "");
                }}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an area" />
                </SelectTrigger>
                <SelectContent>
                  {areas?.data?.map((area) => (
                    <SelectItem key={area.id} value={area.id}>
                      {area.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.areaId && (
                <p className="text-sm text-destructive">
                  {errors.areaId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="feederId">Feeder (Optional)</Label>
              <Select {...register("feederId")} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a feeder" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Feeders</SelectItem>
                  {/* Would filter by area in real implementation */}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Schedule Timing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time *</Label>
                <Input
                  id="startTime"
                  type="datetime-local"
                  {...register("startTime")}
                  disabled={isLoading}
                  className={cn(
                    errors.startTime &&
                      "border-destructive focus:border-destructive",
                  )}
                />
                {errors.startTime && (
                  <p className="text-sm text-destructive">
                    {errors.startTime.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">End Time *</Label>
                <Input
                  id="endTime"
                  type="datetime-local"
                  {...register("endTime")}
                  disabled={isLoading}
                  className={cn(
                    errors.endTime &&
                      "border-destructive focus:border-destructive",
                  )}
                />
                {errors.endTime && (
                  <p className="text-sm text-destructive">
                    {errors.endTime.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recurrence">Recurrence</Label>
              <Select
                {...register("recurrence")}
                onValueChange={(value) => {
                  setValue(
                    "recurrence",
                    value as "NONE" | "DAILY" | "WEEKLY" | "MONTHLY",
                  );
                  if (value === "NONE") setValue("recurrenceDays", []);
                }}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select recurrence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">One-time only</SelectItem>
                  <SelectItem value="DAILY">Daily</SelectItem>
                  <SelectItem value="WEEKLY">Weekly</SelectItem>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {showRecurrenceDays && (
              <div className="space-y-2">
                <Label>Recurrence Days</Label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map((day) => (
                    <label
                      key={day.value}
                      className="inline-flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer hover:bg-accent"
                    >
                      <input
                        type="checkbox"
                        value={day.value}
                        {...register("recurrenceDays")}
                      />
                      <span className="text-sm">{day.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <Link href="/operator/schedules">
                <Button type="button" variant="outline" disabled={isLoading}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </Link>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Schedule
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
