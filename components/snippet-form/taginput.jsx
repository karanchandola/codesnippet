"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export function TagInput({
  id,
  name,
  placeholder,
  value,
  onChange,
}) {
  const [tags, setTags] = useState([]);

  // Update tags when value changes
  useEffect(() => {
    if (value) {
      setTags(value.split(",").map(tag => tag.trim()).filter(Boolean));
    } else {
      setTags([]);
    }
  }, [value]);

  const removeTag = (tagToRemove) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    const newValue = updatedTags.join(", ");
    // Create a synthetic event to pass to onChange
    const event = {
      target: {
        name,
        value: newValue
      }
    };
    onChange(event);
  };

  return (
    <div className="space-y-2">
      <Input
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
      />
      
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {tags.map((tag, index) => (
            <Badge 
              key={`${tag}-${index}`}
              variant="secondary"
              className="px-2 py-1 text-xs font-medium animate-in fade-in-50 duration-300"
            >
              {tag}
              <button 
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 rounded-full hover:bg-background/20 p-0.5"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {tag}</span>
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}