"use client";

import { useState } from "react";
import PostsTable from "./PostsTable";
import { Plus } from "lucide-react";
import Link from "next/link";
import Breadcrumb from "../../common/Breadcrumb";

const dummyPosts = [
  {
    id: 1,
    title: "Software Engineer",
    employmentType: "Full Time",
    description:
      "Responsible for developing scalable web applications and collaborating with cross-functional teams.",
    createdAt: "May 01, 2025",
    endDate: "Jun 15, 2025",
  },
  {
    id: 2,
    title: "HR Manager",
    employmentType: "Part Time",
    description:
      "Oversee recruitment processes and employee relations for the organization.",
    createdAt: "Apr 20, 2025",
    endDate: "May 30, 2025",
  },
  {
    id: 3,
    title: "Data Analyst",
    employmentType: "Contract",
    description:
      "Analyze business data and generate actionable insights for management.",
    createdAt: "Mar 10, 2025",
    endDate: "Apr 10, 2025",
  },
  {
    id: 4,
    title: "Frontend Developer",
    employmentType: "Full Time",
    description:
      "Build and maintain responsive web interfaces using modern frameworks and libraries.",
    createdAt: "May 05, 2025",
    endDate: "Jun 20, 2025",
  },
  {
    id: 5,
    title: "UX Designer",
    employmentType: "Full Time",
    description:
      "Create user-centered designs and improve user experiences for our products.",
    createdAt: "May 10, 2025",
    endDate: "Jun 25, 2025",
  },
];

const RecruitementPosts = () => {
  const [posts, setPosts] = useState(dummyPosts);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination values
  const totalItems = posts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = posts.slice(startIndex, endIndex);

  // Handle page navigation
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return (
    <div className="bg-bg-color min-h-screen pb-12">
      <Breadcrumb
        items={[{ label: "Employee", href: "/dashboard/employee" }]}
        currentPage="Recruitment Posts"
      />

      {/* Table Section */}
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        {/* Card */}
        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="bg-white border border-gray-200 rounded-xl shadow-2xs overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      Recruitment Posts
                    </h2>
                    <p className="text-sm text-gray-600">
                      Create recruitment form, edit, publish and more.
                    </p>
                  </div>

                  <div>
                    <div className="inline-flex gap-x-2">
                      <Link
                        className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-primary text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all"
                        href="/dashboard/employee/create_job_post"
                      >
                        <Plus className="size-4" />
                        Create
                      </Link>
                    </div>
                  </div>
                </div>
                {/* End Header */}

                {/* Table */}
                <PostsTable posts={currentItems} />
                {/* End Table */}

                {/* Footer */}
                <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200">
                  <div className="inline-flex items-center gap-x-2">
                    <p className="text-sm text-gray-600">Showing:</p>
                    <div className="max-w-sm space-y-3">
                      <select
                        className="py-2 px-3 pe-9 block w-full border-gray-500 rounded-lg text-sm focus:border-primary focus:ring-primary"
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                      >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={9}>9</option>
                        <option value={20}>20</option>
                      </select>
                    </div>
                    <p className="text-sm text-gray-600">of {totalItems}</p>
                  </div>

                  <div>
                    <div className="inline-flex gap-x-2">
                      <button
                        type="button"
                        onClick={goToPrevPage}
                        disabled={currentPage === 1}
                        className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:pointer-events-none"
                      >
                        <svg
                          className="shrink-0 size-4"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m15 18-6-6 6-6" />
                        </svg>
                        Prev
                      </button>

                      <button
                        type="button"
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:pointer-events-none"
                      >
                        Next
                        <svg
                          className="shrink-0 size-4"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                {/* End Footer */}
              </div>
            </div>
          </div>
        </div>
        {/* End Card */}
      </div>
      {/* End Table Section */}
    </div>
  );
};

export default RecruitementPosts;
