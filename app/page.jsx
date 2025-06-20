'use client';

import React from "react";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";



export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Find, Share & Collaborate on Code Snippets
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                A community-driven platform with AI-assisted code snippets, explanations, and versioning.
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2">
              <div className="relative">
              </div>
             
            </div>
          </div>
        </div>
      </section>
{/* 
      {/* Featured Snippets */}
      <section className="w-full py-12 md:py-16 lg:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col gap-2 mb-8">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Featured Snippets</h2>
            <p className="text-muted-foreground">
              Discover the most popular and useful code snippets
            </p>
          </div>
     
          <div className="flex justify-center mt-8">
            <Button variant="outline" asChild>
              <Link href="/pages/snippets" className="flex items-center">
                View all snippets
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="w-full py-12 md:py-16 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col gap-2 mb-8">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Browse by Category</h2>
            <p className="text-muted-foreground">
              Find snippets organized by programming language and category
            </p>
          </div>
      
        </div>
      </section> 

      {/* Call to Action */}
      <section className="w-full py-12 md:py-16 lg:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Have a useful snippet to share?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground">
                Join our community and contribute your knowledge to help others solve their coding challenges.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild>
                <Link href="/pages/submit">Submit a Snippet</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/pages/auth">Create an Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
