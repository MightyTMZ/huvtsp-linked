"use client";

import { Users, Briefcase } from "lucide-react";

export default function FormLinks() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Join the Network
        </h3>
        <p className="text-gray-600">
          Don't see yourself or your project? Add your profile or venture to the network.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Alumni Profile</h4>
          <p className="text-sm text-gray-600 mb-3">
            Add your personal profile to connect with fellow alumni
          </p>
          <a
            href="https://forms.gle/a2rnNLBkHfhieBT46"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Fill Alumni Form
          </a>
        </div>

        <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
            <Briefcase className="h-6 w-6 text-green-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Venture/Project</h4>
          <p className="text-sm text-gray-600 mb-3">
            Add your venture or project to showcase it to the network
          </p>
          <a
            href="https://forms.gle/rivGC6r8qwndHVWP9"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            Fill Venture Form
          </a>
        </div>
      </div>
    </div>
  );
}
