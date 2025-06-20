"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function CodeEditor({
  id,
  name,
  value,
  onChange,
  language = "javascript",
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={cn(
        "relative rounded-md border border-input bg-card overflow-hidden transition-all duration-200",
        isFocused && "ring-2 ring-primary/20"
      )}
    >
      <div className="flex items-center justify-between p-2 bg-muted/50 border-b">
        <span className="text-xs font-medium">
          {language || "code"}
        </span>
        <span className="text-xs text-muted-foreground">
          {value.split("\n").length} lines
        </span>
      </div>
      <Textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="font-mono text-sm p-4 min-h-[300px] resize-y border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        placeholder={`Paste your ${language || "code"} snippet here...`}
        required
      />
    </div>
  );
}