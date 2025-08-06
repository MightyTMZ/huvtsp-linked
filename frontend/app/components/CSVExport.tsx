"use client";

import { Download } from "lucide-react";

interface CSVExportProps {
  data: any[];
  filename?: string;
  disabled?: boolean;
  className?: string;
}

const CSVExport = ({ data, filename = "alumni-search-results", disabled = false, className = "" }: CSVExportProps) => {
  const escapeCSVField = (field: string) => {
    if (!field) return "";
    // Escape quotes and wrap in quotes if contains comma, quote, or newline
    const escaped = field.replace(/"/g, '""');
    if (escaped.includes(',') || escaped.includes('"') || escaped.includes('\n') || escaped.includes('\r')) {
      return `"${escaped}"`;
    }
    return escaped;
  };

  const convertToCSV = (data: any[]) => {
    if (data.length === 0) return "";

    // Define the headers based on the data structure
    const headers = [
      "First Name",
      "Last Name", 
      "Email",
      "Location",
      "Region",
      "Session",
      "Pod",
      "Internship",
      "Skills",
      "Additional Info",
      "Current Experience",
      "Match Score",
      "Match Reason"
    ];

    // Convert data to CSV rows
    const csvRows = data.map(item => {
      // Handle both direct data structure (filter search) and nested data structure (smart search)
      const first_name = item.first_name || item.data?.first_name || "";
      const last_name = item.last_name || item.data?.last_name || "";
      const email = item.email || item.data?.email || "";
      const location = item.location || item.data?.location || "";
      const region = item.region || item.data?.region || "";
      const session = item.session || item.data?.session || "";
      const pod = item.pod || item.data?.pod || "";
      const internship = item.internship || item.data?.internship || "";
      const skills = item.skills || item.data?.skills || "";
      const additional_info = item.additional_info || item.data?.additional_info || "";
      
      // Handle current experience
      let currentExperience = "";
      if (item.experiences) {
        const currentExps = item.experiences.filter((exp: any) => exp.is_current);
        if (currentExps.length > 0) {
          currentExperience = currentExps.map((exp: any) => `${exp.title} at ${exp.organization_name}`).join("; ");
        } else if (item.experiences.length > 0) {
          currentExperience = `${item.experiences[0].title} at ${item.experiences[0].organization_name}`;
        }
      }
      
      const relevance_score = item.relevance_score ? Math.round(item.relevance_score * 100) + "%" : "";
      const match_reason = item.match_reason || "";

      const row = [
        first_name,
        last_name,
        email,
        location,
        region,
        session,
        pod,
        internship,
        skills,
        additional_info,
        currentExperience,
        relevance_score,
        match_reason
      ];
      
      return row.map(field => escapeCSVField(field)).join(",");
    });

    return [headers.join(","), ...csvRows].join("\n");
  };

  const handleExport = () => {
    if (data.length === 0 || disabled) return;

    const csvContent = convertToCSV(data);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={disabled || data.length === 0}
      className={`inline-flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed ${className}`}
    >
      <Download className="h-4 w-4" />
      <span>Export to CSV ({data.length} results)</span>
    </button>
  );
};

export default CSVExport; 