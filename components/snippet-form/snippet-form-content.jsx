'use client'
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "./code-editor";
import { TagInput } from "./taginput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CopyCheck, Code as CodeIcon, Loader2 } from "lucide-react";

const languages = [
  "JavaScript", "TypeScript", "Python", "Java", "C#", "PHP", "Ruby",
  "Go", "Swift", "Kotlin", "Rust", "C++", "C", "HTML", "CSS", "SQL", "Other"
];

const frameworks = [
  "React", "Vue", "Angular", "Next.js", "Svelte", "Express",
  "Django", "Flask", "Spring", "Laravel", "Ruby on Rails", ".NET", "Other", "None"
];

export function SnippetFormContent({
  form,
  handleChange,
  handleSubmit,
  isSubmitting,
  setForm,
  initialState,
  customLanguage,
  setCustomLanguage,
  customFramework,
  setCustomFramework,
}) {
  const [activeTab, setActiveTab] = useState("info");


  // Handle select changes (for language and framework)
  const handleSelectChange = (name, value) => {
    if (name === "language") {
      if (value === "Other") {
        setForm(prev => ({ ...prev, language: "Other" }));
        setCustomLanguage("");
      } else {
        setForm(prev => ({ ...prev, language: value }));
        setCustomLanguage("");
      }
    } else if (name === "framework") {
      if (value === "Other") {
        setForm(prev => ({ ...prev, framework: "Other" }));
        setCustomFramework("");
      } else if (value === "None") {
        setForm(prev => ({ ...prev, framework: "" }));
        setCustomFramework("");
      } else {
        setForm(prev => ({ ...prev, framework: value }));
        setCustomFramework("");
      }
    }
  };

  // Handle custom language/framework input
  const showCustomLanguage = form.language === "Other";
  const showCustomFramework = form.framework === "Other";

  const handleCustomInput = (name, value) => {
    if (name === "language") setCustomLanguage(value);
    if (name === "framework") setCustomFramework(value);
  };

  // In your form submission, use:
  const finalLanguage = form.language === "Other" ? customLanguage : form.language;
  const finalFramework = form.framework === "Other" ? customFramework : form.framework;


  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      <form onSubmit={handleSubmit}>
        <Card className="border shadow-md transition-all duration-300 hover:shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex items-center space-x-2">
              <CodeIcon className="h-5 w-5 text-primary" />
              <CardTitle className="text-2xl font-bold">Save New Snippet</CardTitle>
            </div>
            <CardDescription>
              Share your code with the community. Add details to make it easy to find and use.
            </CardDescription>
          </CardHeader>

          <div className="px-6 pb-2 flex space-x-2 border-b">
            <Button
              type="button"
              variant={activeTab === "info" ? "default" : "ghost"}
              className={cn(
                "rounded-none border-b-2 border-transparent pb-2.5 pt-1 px-4",
                activeTab === "info" && "border-primary"
              )}
              onClick={() => setActiveTab("info")}
            >
              Snippet Info
            </Button>
            <Button
              type="button"
              variant={activeTab === "code" ? "default" : "ghost"}
              className={cn(
                "rounded-none border-b-2 border-transparent pb-2.5 pt-1 px-4",
                activeTab === "code" && "border-primary"
              )}
              onClick={() => setActiveTab("code")}
            >
              Code
            </Button>
          </div>

          <CardContent className="pt-6 pb-2">
            {activeTab === "info" && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="E.g., React User Authentication Hook"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Language */}
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    {showCustomLanguage ? (
                      <>
                        <Input
                          id="custom-language"
                          name="language"
                          placeholder="Enter language"
                          value={customLanguage}
                          onChange={e => handleCustomInput("language", e.target.value)}
                          className="mt-2"
                          required
                          autoFocus
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          className="mt-1 text-xs"
                          onClick={() => {
                            setCustomLanguage("");
                            setForm(prev => ({ ...prev, language: "" }));
                          }}
                        >
                          Back to select
                        </Button>
                      </>
                    ) : (
                      <Select
                        value={form.language}
                        onValueChange={value => handleSelectChange("language", value)}
                      >
                        <SelectTrigger id="language" className="w-full">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map(lang => (
                            <SelectItem key={lang} value={lang}>
                              {lang}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  {/* Framework */}
                  <div className="space-y-2">
                    <Label htmlFor="framework">Framework (optional)</Label>
                    {showCustomFramework ? (
                      <>
                        <Input
                          id="custom-framework"
                          name="framework"
                          placeholder="Enter framework"
                          value={customFramework}
                          onChange={e => handleCustomInput("framework", e.target.value)}
                          className="mt-2"
                          autoFocus
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          className="mt-1 text-xs"
                          onClick={() => {
                            setCustomFramework("");
                            setForm(prev => ({ ...prev, framework: "" }));
                          }}
                        >
                          Back to select
                        </Button>
                      </>
                    ) : (
                      <Select
                        value={form.framework}
                        onValueChange={value => handleSelectChange("framework", value)}
                      >
                        <SelectTrigger id="framework" className="w-full">
                          <SelectValue placeholder="Select framework" />
                        </SelectTrigger>
                        <SelectContent>
                          {frameworks.map(fw => (
                            <SelectItem key={fw} value={fw}>
                              {fw}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Explain what this code does and how to use it..."
                    value={form.description}
                    onChange={handleChange}
                    required
                    className="min-h-[120px] resize-y transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <TagInput
                    id="tags"
                    name="tags"
                    placeholder="Add tags separated by commas (e.g., React, Hooks, Authentication)"
                    value={form.tags}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            {activeTab === "code" && (
              <div className="space-y-2">
                <Label htmlFor="code">Code Snippet</Label>
                <CodeEditor
                  id="code"
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                  language={form.language ? form.language.toLowerCase() : "javascript"}
                />
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between pt-6">
            <Button variant="outline" type="button" onClick={() => setForm(initialState)}>
              Reset
            </Button>
            <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CopyCheck className="mr-2 h-4 w-4" />
                  Save Snippet
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}