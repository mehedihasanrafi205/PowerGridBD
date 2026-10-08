"use client";

import { Camera, Loader2, Save, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth, useUpdateProfile, useUpdateProfileImage } from "@/hooks";

export default function TechnicianProfilePage() {
  const { user, isLoading: authLoading, refresh } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Seed the form from the loaded profile. Functional updates only
  // fill untouched fields, so in-progress typing is never clobbered.
  // Without this the submit sends empty strings for every field the
  // user didn't retype, and the backend rejects the update.
  useEffect(() => {
    if (!user) return;
    setName((v) => v || user.name || "");
    setPhone((v) => v || user.phone || "");
    setAddress((v) => v || user.address || "");
  }, [user]);

  const updateProfileMutation = useUpdateProfile();
  const updateImageMutation = useUpdateProfileImage();

  const isLoading =
    updateProfileMutation.isPending || updateImageMutation.isPending;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    const input = document.getElementById(
      "profile-image-upload",
    ) as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;

    try {
      await updateImageMutation.mutateAsync(file);
      toast.success("Profile image updated!");
      refresh();
    } catch {
      toast.error("Failed to update profile image");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfileMutation.mutateAsync({ name, phone, address });
      toast.success("Profile updated successfully!");
      refresh();
    } catch {
      toast.error("Failed to update profile");
    }
  };

  if (authLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4 max-w-2xl mx-auto">
          <div className="bg-card border rounded-xl p-6">
            <div className="h-8 w-1/4 bg-muted rounded mb-4" />
            <div className="grid md:grid-cols-2 gap-4">
              <div className="h-10 bg-muted rounded" />
              <div className="h-10 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <PageHeader
        title="Technician Profile"
        description="Manage your account information."
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Profile Photo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={previewImage || user?.profileImage || ""}
                alt={user?.name || ""}
              />
              <AvatarFallback className="text-2xl font-medium">
                {user?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user?.name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <div className="mt-4 flex items-center gap-4">
                <label
                  htmlFor="profile-image-upload"
                  className="cursor-pointer"
                >
                  <Button
                    variant="outline"
                    disabled={updateImageMutation.isPending}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    {updateImageMutation.isPending
                      ? "Uploading..."
                      : "Change Photo"}
                  </Button>
                  <input
                    id="profile-image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
                {previewImage && (
                  <Button
                    variant="default"
                    onClick={handleImageUpload}
                    disabled={updateImageMutation.isPending}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Max 5MB • JPG, PNG
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-6" />

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name || user?.name || ""}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user?.email || ""}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={phone || user?.phone || ""}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+880 1XXX XXX XXX"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={address || user?.address || ""}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House 123, Road 45, Gulshan, Dhaka"
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardContent className="pt-0">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
