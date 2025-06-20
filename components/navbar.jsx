"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Search, Menu, X, Code, ChevronDown } from "lucide-react";
import { ModeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";

const NavLinks = [
  { href: "/", label: "Home" },
  { href: "/pages/snippets", label: "Snippets" },
  { href: "/pages/submit", label: "Submit Snippet" },
  { href: "/pages/favorites", label: "Favorites" },

];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        isScrolled
          ? "bg-background/95 backdrop-blur-sm border-b shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Code className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">CodeVault</span>
            </Link>
            <nav className="hidden md:flex ml-10 space-x-6">
              {NavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === link.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>

            <ModeToggle />

            {/* implement here if user exist then show a dropdown to go dashboard or use logout there..*/}

              {session?.user?(
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="hidden md:flex">
                      {session.user.name || "Profile"}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <button className="w-full">
                        <Link href="/pages/dashboard">Dashboard</Link>
                      </button>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <button variant="outline" className="hidden md:flex w-full" onClick={() => signOut()}>
                        Logout  
                      </button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                // If user is not logged in, show sign in options
 
              
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="hidden md:flex">
                  Sign In
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/pages/auth">Login</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/pages/auth">Sign Up</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
)}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 py-2 pb-4 border-t bg-background">
          <nav className="flex flex-col space-y-3">
            {NavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "py-2 px-3 rounded-md text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t">
              <Link
                href="/auth/login"
                className="block py-2 px-3 rounded-md text-sm font-medium hover:bg-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="block py-2 px-3 rounded-md text-sm font-medium hover:bg-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}