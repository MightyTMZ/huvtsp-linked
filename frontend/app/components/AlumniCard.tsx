import {
  Mail,
  MapPin,
  Building,
  Calendar,
  Briefcase,
  Star,
} from "lucide-react";

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
  };
}

const regions: Record<string, string> = {
  NA: "North America",
  SA: "South America",
  EU: "Europe",
  AS: "Asia",
  AF: "Africa",
  OC: "Oceania",
};

const AlumniCard = ({ alumni }: AlumniCardProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
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
                <span className="capitalize">{regions[alumni.region]}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

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
    </div>
  );
};

export default AlumniCard;
