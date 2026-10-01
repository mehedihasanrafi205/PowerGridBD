"use client";

import { useAuth } from "@/hooks";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateOutage } from "@/hooks";
import { useAreas } from "@/hooks";
import { cn } from "@/lib/utils";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const outageSchema = z.object({
  description: z.string().min(10, "Description must be at least 10 characters").max(500),
  areaId: z.string().min(1, "Please select an area"),
  isPriority: z.boolean().optional(),
});

type OutageForm = z.infer<typeof outageSchema>;

export default function ReportOutagePage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { data: areas, isLoading: areasLoading } = useAreas();
  const { mutate: createOutage, isPending } = useCreateOutage();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<OutageForm>({
    resolver: zodResolver(outageSchema),
    defaultValues: {
      description: "",
      areaId: "",
      isPriority: false,
    },
  });

  const isPriority = watch("isPriority");

  const onSubmit = async (data: OutageForm) => {
    try {
      await createOutage(data);
      toast.success("Outage reported successfully!");
      router.push("/customer/outages");
    } catch (error) {
      // Error handled by hook
    }
  };

  if (authLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4 max-w-2xl mx-auto">
          <div className="h-8 w-1/4 bg-muted rounded" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <div className="mb-8">
        <Link href="/customer/outages" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Outages
        </Link>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-100 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Report New Outage</h1>
            <p className="text-muted-foreground">Help us restore power faster by reporting outages in your area.</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Outage Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="areaId">Area *</Label>
              <Select
                {...register("areaId")}
                value={watch("areaId")}
                onValueChange={(v) => setValue("areaId", v)}
              >
                <SelectTrigger className={cn(errors.areaId && "border-destructive")}>
                  <SelectValue placeholder="Select your area" />
                </SelectTrigger>
                <SelectContent>
                  {areasLoading ? (
                    <SelectItem value="" disabled>Loading areas...</SelectItem>
                  ) : (
                    areas?.data?.map((area) => (
                      <SelectItem key={area.id} value={area.id}>
                        {area.name} {area.feeder && `(${area.feeder.name})`}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.areaId && (
                <p className="text-sm text-destructive mt-1">{errors.areaId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Describe the outage: what happened, when it started, any visible damage, etc."
                rows={5}
                className={cn(errors.description && "border-destructive")}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Minimum 10 characters. Be as specific as possible.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="isPriority"
                {...register("isPriority")}
                checked={isPriority}
              />
              <Label htmlFor="isPriority" className="cursor-pointer">
                <span className="font-medium">Mark as Priority Restoration</span>
                <p className="text-sm text-muted-foreground">
                  Pay for priority handling - your outage jumps to the top of the work queue
                </p>
              </Label>
            </div>

            {isPriority && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>Priority Restoration:</strong> This will initiate a payment of BDT 500.
                  You'll be redirected to SSLCommerz for payment. Once confirmed, your outage
                  will be prioritized in the work queue.
                </p>
              </div>
            )}

            <div className="flex gap-4 pt-4 border-t">
              <Link href="/customer/outages">
                <Button type="button" variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isPending} className="flex-1">
                {isPending ? "Submitting..." : "Submit Outage Report"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}