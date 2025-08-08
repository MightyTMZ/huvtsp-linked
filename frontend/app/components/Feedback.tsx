"use client";

import { MessageSquare } from "lucide-react";

interface FeedbackProps {
  className?: string;
  variant?: "default" | "compact" | "floating";
}

export default function Feedback({ className = "", variant = "default" }: FeedbackProps) {
  const feedbackUrl = "https://forms.gle/K5BNvXpuqn6QDgq26";
  
  if (variant === "floating") {
    return (
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        <a
          href={feedbackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <MessageSquare className="h-4 w-4" />
          <span className="text-sm font-medium">Feedback</span>
        </a>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`text-center ${className}`}>
        <a
          href={feedbackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
        >
          <MessageSquare className="h-4 w-4" />
          Not satisfied? Have suggestions? Let us know
        </a>
      </div>
    );
  }

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <MessageSquare className="h-5 w-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-700">
            Not satisfied with your experience? Have suggestions for improvement?
          </p>
          <a
            href={feedbackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors mt-1"
          >
            Let us know
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
