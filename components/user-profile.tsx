import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";

export function UserProfile() {
  const { user } = useUser();
  const profile = useQuery(api.userProfiles.getProfile, {
    userId: user?.id || "",
  });

  if (!profile) {
    return <div>No profile found</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Profile</h2>
      <p>Username: {profile.username}</p>
      <p>Created: {new Date(profile.createdAt).toLocaleDateString()}</p>
    </div>
  );
} 