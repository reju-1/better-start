"use client";

import { useState } from "react";
import ProfileSettings from "./_components/ProfileSettings";
import CompanySettings from "./_components/CompanySettings";
import Navbar from "../../../components/common/Navbar";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<"profile" | "company">("profile");

  return (
    <div className="min-h-screen bg-[#f6f9ff]">
      {/* Navbar */}
      <Navbar />

      <div className="pt-36 pb-6">
        {/* Content Container */}
        <div className="max-w-4xl px-4 sm:px-6 lg:px-8 mx-auto">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8" aria-label="Tabs">
              <button
                className={`py-4 px-1 inline-flex items-center gap-x-2 border-b-2 text-sm font-medium whitespace-nowrap ${
                  activeTab === "profile"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-blue-600 hover:border-blue-600"
                }`}
                onClick={() => setActiveTab("profile")}
                aria-current={activeTab === "profile" ? "page" : undefined}
              >
                Profile Settings
              </button>
              <button
                className={`py-4 px-1 inline-flex items-center gap-x-2 border-b-2 text-sm font-medium whitespace-nowrap ${
                  activeTab === "company"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-blue-600 hover:border-blue-600"
                }`}
                onClick={() => setActiveTab("company")}
              >
                Company Settings
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="py-10">
            {activeTab === "profile" ? (
              <ProfileSettings />
            ) : (
              <CompanySettings />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
