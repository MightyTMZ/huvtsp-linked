"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Building2, Target, Users, Link as LinkIcon, Mail, MapPin } from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import Feedback from "../../components/Feedback";

interface ProjectData {
  id: number;
  title: string;
  type: string;
  stage: string;
  what_are_they_looking_for: string;
  additional_info: string;
  founders: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    location?: string;
    skills?: string;
  }[];
  project_links?: {
    id: number;
    title: string;
    link: string;
    platform: string;
  }[];
  slug: string;
}

const ProjectDetail = () => {
  const params = useParams();
  const slug = params.slug as string;
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/project/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setProject(data);
        } else {
          setError("Project not found");
        }
      } catch (err) {
        setError("Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProject();
    }
  }, [slug]);

  const getTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      "ST": "Startup",
      "NP": "Non Profit",
    };
    return types[type] || type;
  };

  const getStageLabel = (stage: string) => {
    const stages: { [key: string]: string } = {
      "J": "Just an idea",
      "MVP": "Research/MVP/Early Development",
      "L": "Launched Venture",
    };
    return stages[stage] || stage;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading project details..." />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error || "Project not found"}
          </h2>
          <p className="text-gray-600">
            The project you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {project.title}
              </h1>
              <div className="flex items-center space-x-4 mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  <Building2 className="h-4 w-4 mr-1" />
                  {getTypeLabel(project.type)}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <Target className="h-4 w-4 mr-1" />
                  {getStageLabel(project.stage)}
                </span>
              </div>
            </div>
          </div>

          {project.what_are_they_looking_for && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Looking for:
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {project.what_are_they_looking_for}
              </p>
            </div>
          )}

          {project.additional_info && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                About this project:
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {project.additional_info}
              </p>
            </div>
          )}
        </div>

        {/* Founders Section */}
        {project.founders && project.founders.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Project Founders
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.founders.map((founder) => (
                <div
                  key={founder.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {founder.first_name} {founder.last_name}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    {founder.location && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {founder.location}
                      </div>
                    )}
                    {founder.skills && (
                      <div>
                        <span className="font-medium">Skills:</span> {founder.skills}
                      </div>
                    )}
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      <a
                        href={`mailto:${founder.email}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {founder.email}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Project Links */}
        {project.project_links && project.project_links.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <LinkIcon className="h-5 w-5 mr-2" />
              Project Links
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.project_links.map((link) => (
                <a
                  key={link.id}
                  href={link.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {link.title || link.platform}
                    </h3>
                    {link.platform && link.title && (
                      <p className="text-sm text-gray-600">{link.platform}</p>
                    )}
                  </div>
                  <LinkIcon className="h-4 w-4 text-gray-400" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Contact Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Interested in this project?
          </h2>
          <p className="text-gray-600 mb-6">
            Reach out to the founders to learn more about collaboration opportunities.
          </p>
          <div className="flex flex-wrap gap-4">
            {project.founders?.map((founder) => (
              <a
                key={founder.id}
                href={`mailto:${founder.email}?subject=Interest in ${project.title}`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Mail className="h-4 w-4 mr-2" />
                Contact {founder.first_name}
              </a>
            ))}
          </div>
        </div>
        
        {/* Feedback Section */}
        <div className="mt-8">
          <Feedback />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail; 