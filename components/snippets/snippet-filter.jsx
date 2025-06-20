"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search } from "lucide-react";
import axios from "axios";

export default function SnippetsFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Fetched from backend
  const [languages, setLanguages] = useState([]);
  const [frameworks, setFrameworks] = useState([]);
  const [tags, setTags] = useState([]);

  // Fetch tags from backend and split by type
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await axios.get("/api/db/tags");
        const allTags = res.data.tags || [];
        setLanguages(allTags.filter(t => t.type === "language"));
        setFrameworks(allTags.filter(t => t.type === "framework"));
        setTags(allTags.filter(t => t.type === "topic" || t.type === "tag"));
      } catch (err) {
        setLanguages([]);
        setFrameworks([]);
        setTags([]);
      }
    };
    fetchTags();
  }, []);

  // Initialize filters from URL params
  useEffect(() => {
    const tagsParam = searchParams.get("tags");
    if (tagsParam) {
      setSelectedTags(tagsParam.split(",").filter(Boolean));
    }
    const verified = searchParams.get("verified") === "true";
    if (verified) setVerifiedOnly(true);
    const searchQuery = searchParams.get("q");
    if (searchQuery) setQuery(searchQuery);
    // eslint-disable-next-line
  }, [searchParams]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (selectedTags.filter(Boolean).length > 0)
      params.set("tags", selectedTags.filter(Boolean).join(","));
    if (verifiedOnly) params.set("verified", "true");
    router.push(`?${params.toString()}`);
    // eslint-disable-next-line
  }, [query, selectedTags, verifiedOnly]);

  const handleSearch = (e) => {
    e.preventDefault();
    // URL updates automatically via useEffect
  };

  // Toggle any tag (language, framework, or topic/tag)
  const toggleTag = (id) => {
    setSelectedTags(prev =>
      prev.includes(id)
        ? prev.filter(tag => tag !== id)
        : [...prev, id]
    );
  };

  const clearFilters = () => {
    setQuery("");
    setSelectedTags([]);
    setVerifiedOnly(false);
    router.push("/pages/sample");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search snippets..."
              className="pl-8 pr-4"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full mt-2">
            Search
          </Button>
        </form>
      </div>

      <Accordion type="multiple" defaultValue={["languages", "frameworks", "tags", "options"]} className="space-y-4">
        <AccordionItem value="languages" className="border rounded-md px-4">
          <AccordionTrigger className="py-3">Languages</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-1 pb-3">
              {languages.map((language) => (
                <div key={language._id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`language-${language._id}`}
                    checked={selectedTags.includes(language._id)}
                    onCheckedChange={() => toggleTag(language._id)}
                  />
                  <Label
                    htmlFor={`language-${language._id}`}
                    className="flex items-center justify-between w-full text-sm cursor-pointer"
                  >
                    <span>{language.tag}</span>
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="frameworks" className="border rounded-md px-4">
          <AccordionTrigger className="py-3">Frameworks</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-1 pb-3">
              {frameworks.map((fw) => (
                <div key={fw._id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`framework-${fw._id}`}
                    checked={selectedTags.includes(fw._id)}
                    onCheckedChange={() => toggleTag(fw._id)}
                  />
                  <Label
                    htmlFor={`framework-${fw._id}`}
                    className="flex items-center justify-between w-full text-sm cursor-pointer"
                  >
                    <span>{fw.tag}</span>
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="tags" className="border rounded-md px-4">
          <AccordionTrigger className="py-3">Tags</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-1 pb-3">
              {tags.map((tag) => (
                <div key={tag._id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tag-${tag._id}`}
                    checked={selectedTags.includes(tag._id)}
                    onCheckedChange={() => toggleTag(tag._id)}
                  />
                  <Label
                    htmlFor={`tag-${tag._id}`}
                    className="flex items-center justify-between w-full text-sm cursor-pointer"
                  >
                    <span>{tag.tag}</span>
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="options" className="border rounded-md px-4">
          <AccordionTrigger className="py-3">Options</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-1 pb-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="verified"
                  checked={verifiedOnly}
                  onCheckedChange={(checked) => setVerifiedOnly(checked === true)}
                />
                <Label
                  htmlFor="verified"
                  className="text-sm cursor-pointer"
                >
                  Verified snippets only
                </Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {(selectedTags.length > 0 || verifiedOnly) && (
        <div className="pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="w-full text-muted-foreground hover:text-primary"
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}