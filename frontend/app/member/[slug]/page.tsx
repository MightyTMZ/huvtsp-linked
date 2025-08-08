"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { 
  MapPin, 
  Building, 
  Briefcase, 
  Calendar, 
  Mail, 
  Globe, 
  Users,
  ArrowLeft,
  ExternalLink,
  Clock,
  Award
} from "lucide-react";
import Link from "next/link";
import LoadingSpinner from "../../components/LoadingSpinner";
import Feedback from "../../components/Feedback";

interface Experience {
  id: number;
  organization: number;
  organization_name: string;
  organization_type: string;
  title: string;
  experience_type: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string;
}

interface SocialLink {
  id: number;
  title: string;
  link: string;
  description: string;
  platform: string;
}

interface MemberProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  region: string;
  location: string;
  session: string;
  pod: string;
  internship: string;
  skills: string;
  additional_info: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  experiences: Experience[];
  social_links: SocialLink[];
}

const MemberProfile = () => {
  const params = useParams();
  const slug = params.slug as string;
  const [member, setMember] = useState<MemberProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMemberProfile = async () => {
      if (!slug) return;

      setLoading(true);
      setError("");

      try {
        // First, try to get the member by slug (which could be ID or name)
        const response = await fetch(`/api/member/${slug}`);
        
        if (response.ok) {
          const data = await response.json();
          setMember(data);
        } else if (response.status === 404) {
          setError("Member not found");
        } else {
          setError("Failed to load member profile");
        }
      } catch (error) {
        console.error("Error fetching member profile:", error);
        setError("Failed to load member profile");
      } finally {
        setLoading(false);
      }
    };

    fetchMemberProfile();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading member profile..." />
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {error || "Member not found"}
          </h1>
          <p className="text-gray-600 mb-6">
            The member you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/filter-search"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </Link>
        </div>
      </div>
    );
  }

  const skillsList = member.skills ? member.skills.split(",").map(skill => skill.trim()) : [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  const getExperienceTypeDisplay = (type: string) => {
    const typeMap: Record<string, string> = {
      'EM': 'Employment',
      'IN': 'Internship',
      'VO': 'Volunteer',
      'AC': 'Academic',
      'FR': 'Freelance',
      'BM': 'Board Member',
      'ME': 'Mentor',
      'AD': 'Advisor',
      'AT': 'Event Attendee',
      'CM': 'Cohort Member',
      'FO': 'Founder',
      'CP': 'Competition',
      'OT': 'Other'
    };
    return typeMap[type] || type;
  };

  const getRegionDisplay = (regionCode: string) => {
    const regionMap: Record<string, string> = {
      'NA': 'North America',
      'SA': 'South America',
      'EU': 'Europe',
      'AS': 'Asia',
      'AF': 'Africa',
      'OC': 'Oceania',
      'AN': 'Antarctica'
    };
    return regionMap[regionCode] || regionCode;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/filter-search"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </Link>
        </div>

        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {member.first_name} {member.last_name}
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                {member.internship} • {member.pod}
              </p>
              
              {/* Contact Info */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  <a 
                    href={`mailto:${member.email}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {member.email}
                  </a>
                </div>
                {member.location && (
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{member.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Social Links */}
            {member.social_links && member.social_links.length > 0 && (
              <div className="flex gap-3 mt-4 md:mt-0">
                {member.social_links.map((link) => (
                  <a
                    key={link.id}
                    href={link.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                    title={link.title || link.platform}
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* HUVTSP Experience */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                HUVTSP Experience
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Session</p>
                    <p className="font-medium">{member.session}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Building className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Pod</p>
                    <p className="font-medium">{member.pod}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Briefcase className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Internship</p>
                    <p className="font-medium">{member.internship}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Region</p>
                    <p className="font-medium">{getRegionDisplay(member.region)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Experience */}
            {member.experiences && member.experiences.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Professional Experience
                </h2>
                <div className="space-y-4">
                  {member.experiences.map((experience) => (
                    <div key={experience.id} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {experience.title || 'No title specified'}
                          </h3>
                          <p className="text-blue-600 font-medium">
                            {experience.organization_name}
                          </p>
                        </div>
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                          {getExperienceTypeDisplay(experience.experience_type)}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>
                          {formatDate(experience.start_date)} - 
                          {experience.is_current ? ' Present' : 
                           experience.end_date ? ` ${formatDate(experience.end_date)}` : ' N/A'}
                        </span>
                      </div>
                      {experience.description && (
                        <p className="text-sm text-gray-600">
                          {experience.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {skillsList.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Skills & Expertise
                </h2>
                <div className="flex flex-wrap gap-2">
                  {skillsList.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social Links */}
            {member.social_links && member.social_links.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Social Links & Profiles
                </h2>
                <div className="space-y-3">
                  {member.social_links.map((link) => (
                    <div key={link.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {link.title || link.platform || 'Profile Link'}
                        </p>
                        {link.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {link.description}
                          </p>
                        )}
                      </div>
                      <a
                        href={link.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Visit
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Info */}
            {member.additional_info && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  About
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {member.additional_info}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Connect
              </h3>
              <div className="space-y-3">
                <a
                  href={`mailto:${member.email}`}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </a>
                {member.social_links && member.social_links.length > 0 && (
                  <>
                    {member.social_links.map((link, index) => (
                      <a
                        key={link.id}
                        href={link.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {link.title || link.platform || `View Profile ${index + 1}`}
                      </a>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* Experience Summary */}
            {member.experiences && member.experiences.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Experience Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Experience</span>
                    <span className="text-sm font-medium">{member.experiences.length} positions</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Current Roles</span>
                    <span className="text-sm font-medium">
                      {member.experiences.filter(exp => exp.is_current).length}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Similar Alumni */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Similar Alumni
              </h3>
              <p className="text-sm text-gray-600">
                Find other alumni from the same pod, session, or with similar skills.
              </p>
              <Link
                href={`/filter-search?pod=${member.pod}&session=${member.session}`}
                className="inline-flex items-center mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View Similar Alumni
                <ArrowLeft className="h-3 w-3 ml-1 rotate-180" />
              </Link>
            </div>
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

export default MemberProfile; 