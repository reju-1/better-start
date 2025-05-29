"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProjectForm from "../../_components/ProjectForm";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../../../components/common/LoadingSpinner";
import Breadcrumb from "../../../../../components/common/Breadcrumb";

const UpdateProjectPage = () => {
  const params = useParams();
  const projectId = params.id;
  const [projectData, setProjectData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!projectId) {
        setError("Project ID is missing");
        setIsLoading(false);
        return;
      }

      try {
        // Fake api call
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Mock data
        const mockProject = {
          projectName: "Website Redesign",
          description:
            "Redesign the company website with modern UI/UX principles focusing on conversion optimization and improved user experience.",
          category: "Web Development",
          status: "In Progress",
          priorityLevel: "High",
          dueDate: "2025-06-15",
          endDate: "2025-09-15",
        };

        setProjectData(mockProject);
      } catch (error) {
        console.error("Failed to fetch project data:", error);
        toast.error("Failed to load project data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId]);

  if (isLoading) {
    return <LoadingSpinner size="large" fullScreen />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8 mt-20">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <svg
            className="w-12 h-12 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-red-800 mb-2">
            Error Loading Project
          </h3>
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb
        items={[{ label: "Projects Overview", href: "/dashboard/project" }]}
        currentPage="Update Project"
      />
      <ProjectForm isUpdateMode={true} projectData={projectData} />
    </>
  );
};

export default UpdateProjectPage;
