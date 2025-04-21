"use client";

import { UserProfile } from "@clerk/nextjs";
import ProfileForm from "./ProfileForm";

export default function UserProfileModal() {
  return (
    <div className="flex flex-col gap-4">
      <ProfileForm />
      <div className="border-t pt-4">
        <UserProfile
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-none",
            },
          }}
          path="/user-profile"
          routing="path"
        />
      </div>
    </div>
  );
} 