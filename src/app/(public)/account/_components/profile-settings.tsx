"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Separator } from "~/components/ui/separator";
import { AlertCircle, CheckCircle2, Loader2, Upload } from "lucide-react";

export function ProfileSettings() {
  const { data: user, isLoading } = api.user.me.useQuery();
  const updateProfile = api.user.updateProfile.useMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize form when data loads
  if (user && !hasChanges && !name && !email) {
    setName(user.name ?? "");
    setEmail(user.email ?? "");
    setImage(user.image ?? "");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updates: { name?: string; email?: string; image?: string | null } = {};

    if (name !== user?.name) updates.name = name;
    if (email !== user?.email) updates.email = email;
    if (image !== user?.image) updates.image = image || null;

    if (Object.keys(updates).length === 0) return;

    updateProfile.mutate(updates, {
      onSuccess: () => {
        setHasChanges(false);
      },
    });
  };

  const handleChange = () => {
    setHasChanges(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load user data</AlertDescription>
      </Alert>
    );
  }

  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() ?? user.email?.[0]?.toUpperCase() ?? "U";

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile Information</h3>
        <p className="text-sm text-muted-foreground">
          Update your account profile information
        </p>
      </div>

      <Separator />

      {updateProfile.isSuccess && (
        <Alert variant="success">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>Profile updated successfully</AlertDescription>
        </Alert>
      )}

      {updateProfile.isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{updateProfile.error.message}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={image ?? user.image} alt={user.name ?? ""} />
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Label htmlFor="image">Profile Picture URL</Label>
            <div className="flex gap-2">
              <Input
                id="image"
                type="url"
                placeholder="https://example.com/avatar.jpg"
                value={image}
                onChange={(e) => {
                  setImage(e.target.value);
                  handleChange();
                }}
                disabled={updateProfile.isPending}
              />
              <Button type="button" variant="outline" disabled>
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Enter an image URL or upload a photo (upload coming soon)
            </p>
          </div>
        </div>

        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              handleChange();
            }}
            disabled={updateProfile.isPending}
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              handleChange();
            }}
            disabled={updateProfile.isPending}
          />
          {user.emailVerified && (
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-green-600">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Verified
              </Badge>
              <span className="text-xs text-muted-foreground">
                {new Date(user.emailVerified).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {/* Account Info */}
        <div className="rounded-lg border border-border bg-muted/50 p-4 space-y-2">
          <h4 className="text-sm font-medium">Account Information</h4>
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Account Created</span>
              <span>{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Roles</span>
              <div className="flex gap-1">
                {user.roles.map((role) => (
                  <Badge key={role.id} variant="outline">
                    {role.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setName(user.name ?? "");
              setEmail(user.email ?? "");
              setImage(user.image ?? "");
              setHasChanges(false);
              updateProfile.reset();
            }}
            disabled={!hasChanges || updateProfile.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!hasChanges || updateProfile.isPending}
          >
            {updateProfile.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

