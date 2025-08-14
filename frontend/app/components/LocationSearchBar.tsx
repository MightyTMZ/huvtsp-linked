"use client";

import { Search, Filter, LocationEdit } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: () => void;
  loading: boolean;
}

export default function LocationSearchBar({
  query,
  onQueryChange,
  onSearch,
}: SearchBarProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [query]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSearch();
    }
  };

  return (
    <div className="max-w-4xl mx-auto mb-8">
      {/* Search Input */}
      <div className="relative mb-4">
        <LocationEdit className="absolute left-4 top-4 text-muted-foreground w-5 h-5" />
        <textarea
          ref={textareaRef}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask anything..."
          className="w-full pl-12 pr-4 py-4 text-lg border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 resize-none min-h-[60px] max-h-[200px] overflow-y-auto"
          rows={1}
        />
      </div>      
    </div>
  );
}
