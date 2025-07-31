import {
  Mail,
  MapPin,
  Building,
  Calendar,
  Briefcase,
  Star,
  ExternalLink,
  Clock,
} from "lucide-react";
import Link from "next/link";

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

interface AlumniCardProps {
  alumni: {
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
    relevance_score?: number;
    match_reason?: string;
    experiences?: Experience[];
  };
}

const regions: Record<string, string> = {
  NA: "North America",
  SA: "South America",
  EU: "Europe",
  AS: "Asia",
  AF: "Africa",
  OC: "Oceania",
  AN: "Antarctica"
};

const AlumniCard = ({ alumni }: AlumniCardProps) => {
  const memberSlug = `${alumni.first_name.toLowerCase()}-${alumni.last_name.toLowerCase()}`;

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {alumni.first_name} {alumni.last_name}
            </h3>
            {alumni.relevance_score && (
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full flex items-center">
                <Star className="h-3 w-3 mr-1" />
                {Math.round(alumni.relevance_score * 100)}% match
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span>{alumni.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>{alumni.location || "Location not specified"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Building className="h-4 w-4 text-gray-400" />
                <span>{alumni.pod}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>Session {alumni.session}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Briefcase className="h-4 w-4 text-gray-400" />
                <span>{alumni.internship}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="capitalize">{regions[alumni.region] || alumni.region}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Experience */}
      {alumni.experiences && alumni.experiences.length > 0 && (
        <div className="mb-3">
          <p className="text-sm font-medium text-gray-700 mb-2">Current Experience:</p>
          {alumni.experiences
            .filter(exp => exp.is_current)
            .slice(0, 2)
            .map((experience) => (
              <div key={experience.id} className="text-sm text-gray-600 mb-1">
                <span className="font-medium">{experience.title}</span>
                <span className="text-gray-500"> at </span>
                <span className="font-medium">{experience.organization_name}</span>
                <span className="text-xs text-gray-400 ml-1">
                  ({getExperienceTypeDisplay(experience.experience_type)})
                </span>
              </div>
            ))}
          {alumni.experiences.filter(exp => exp.is_current).length === 0 && 
           alumni.experiences.length > 0 && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">{alumni.experiences[0].title}</span>
              <span className="text-gray-500"> at </span>
              <span className="font-medium">{alumni.experiences[0].organization_name}</span>
              <span className="text-xs text-gray-400 ml-1">
                ({getExperienceTypeDisplay(alumni.experiences[0].experience_type)})
              </span>
            </div>
          )}
        </div>
      )}

      {alumni.skills && (
        <div className="mb-3">
          <p className="text-sm font-medium text-gray-700 mb-1">Skills:</p>
          <p className="text-sm text-gray-600 line-clamp-2">{alumni.skills}</p>
        </div>
      )}

      {alumni.additional_info && (
        <div className="mb-3">
          <p className="text-sm font-medium text-gray-700 mb-1">
            Additional Info:
          </p>
          <p className="text-sm text-gray-600 line-clamp-3">
            {alumni.additional_info}
          </p>
        </div>
      )}

      {alumni.match_reason && (
        <div className="mt-3">
          <p className="text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
            {alumni.match_reason}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <Link
          href={`/member/${alumni.id}`}
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          View Full Profile
          <ExternalLink className="h-3 w-3 ml-1" />
        </Link>
        <a
          href={`mailto:${alumni.email}`}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-700 transition-colors"
        >
          <Mail className="h-3 w-3 mr-1" />
          Contact
        </a>
      </div>
    </div>
  );
};

export default AlumniCard;
