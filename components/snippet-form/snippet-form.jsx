"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { SnippetFormSkeleton } from "./snippet-form-skeleton";
import { SnippetFormAuth } from "./snippet-form-auth";
import { SnippetFormContent } from "./snippet-form-content";

const initialState = {
  title: "",
  language: "",
  framework: "",
  code: "",
  description: "",
  tags: "",
  authorId: "",
};

export function SnippetForm() {
  const { data: session, status } = useSession();
  const [form, setForm] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [customLanguage, setCustomLanguage] = useState("");
  const [customFramework, setCustomFramework] = useState("");

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (session?.user?.id) {
      setForm((prev) => ({
        ...prev,
        authorId: session.user.id,
      }));
    }
  }, [session]);


  if (!mounted) return null;

  if (status === "loading") {
    return (
      <SnippetFormSkeleton />
      // <div>page is loading</div>
    )
  }

  if (!session) {
    return <SnippetFormAuth />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Use custom value if "Other" is selected
    const languageToSend = form.language === "Other" ? customLanguage : form.language;
    const frameworkToSend = form.framework === "Other" ? customFramework : form.framework;

    const payload = {
      ...form,
      language: languageToSend.toLowerCase().trim(),
      framework: frameworkToSend.toLowerCase().trim(),
      
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    try {
      console.log('content : ', payload)
      const res = await axios.post("/api/db/snippets", payload, {
        headers: {
          "Content-Type": "application/json",
        }, 
      });

      if (res.data.status === 201) {
        toast({
          title: "Success!",
          description: "Your code snippet has been saved.",
          variant: "default",
        });
        setForm(initialState);
      } else {
        toast({
          title: "Something went wrong",
          description: "Your code snippet couldn't be saved.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Network error",
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SnippetFormContent
      form={form}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      setForm={setForm}
      initialState={initialState}
      customLanguage={customLanguage}
      setCustomLanguage={setCustomLanguage}
      customFramework={customFramework}
      setCustomFramework={setCustomFramework}
    />
  );
}