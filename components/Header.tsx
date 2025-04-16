"use client";

import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarImage } from "./ui/avatar";

export default function Header() {
  const { isSignedIn } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <header className="border-b">
    <div className="mx-auto px-16 max-w-7xl"> {/* ← Container with padding + max-width */}
      <nav className="mx-auto px-16 max-w-7xl flex justify-between items-center h-16">


        {/* Left-aligned navigation (desktop) */}
        <div className="hidden md:flex space-x-6">
          <NavLinks />
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Right-aligned auth section */}
        <div className="flex items-center gap-4 ml-auto">
          {isSignedIn && (
            <Link href="/create" className="hidden md:block">
              <Button variant="outline">Create Post</Button>
            </Link>
          )}
          <AuthSection />
        </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container px-4 py-2 space-y-2">
            <NavLinks vertical />
            {isSignedIn && (
              <Link href="/create">
                <Button variant="outline" className="w-full">
                  Create Post
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
    </div>
    </header>
  );
}

function NavLinks({ vertical = false }) {
  return (
    <div className={`flex ${vertical ? "flex-col" : "flex-row"} gap-4`}>
      <Link href="/" className="hover:text-primary">
        Home
      </Link>
      <Link href="/category/technology" className="hover:text-primary">
        Technology
      </Link>
      <Link href="/category/finance" className="hover:text-primary">
        Finance
      </Link>
      <Link href="/category/politics" className="hover:text-primary">
        Politics
      </Link>
    </div>
  );
}

function AuthSection() {
  const { isSignedIn } = useUser();

  return (
    <>
      {isSignedIn ? (
        <div className="flex items-center gap-2">
          <UserButton afterSignOutUrl="/" />
        </div>
      ) : (
        <Link href="/sign-in">
          <Button variant="ghost">Sign In</Button>
        </Link>
      )}
    </>
  );
}
