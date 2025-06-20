import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Github, Twitter, Linkedin, Send } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-muted/40 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">CodeVault</h3>
            <p className="text-sm text-muted-foreground">
              Community-driven platform for sharing and discovering code snippets with AI assistance.
            </p>
            <div className="flex space-x-4">
              <Link href="https://github.com" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="https://twitter.com" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="https://linkedin.com" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/snippets" className="text-muted-foreground hover:text-primary transition-colors">Snippets</Link>
              </li>
              <li>
                <Link href="/submit" className="text-muted-foreground hover:text-primary transition-colors">Submit Snippet</Link>
              </li>
              <li>
                <Link href="/favorites" className="text-muted-foreground hover:text-primary transition-colors">Favorites</Link>
              </li>
              
            </ul>
          </div>

         

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Subscribe</h3>
            <p className="text-sm text-muted-foreground">
              Stay updated with the latest snippets and features.
            </p>
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="max-w-[220px]"
              />
              <Button size="sm" variant="outline">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} CodeVault. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}