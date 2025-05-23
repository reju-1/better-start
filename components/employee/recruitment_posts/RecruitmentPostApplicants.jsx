"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Breadcrumb from "../../common/Breadcrumb";
import { ArrowRight } from "lucide-react";
import ApplicantTable from "./ApplicantTable";
import Image from "next/image";

// Dummy data for applicants
const dummyApplicants = [
  {
    id: 1,
    name: "Sarah Johnson",
    phone: "+1 555-123-4567",
    email: "sarah.johnson@email.com",
    rating: 5,
    feedback: "Excellent communication skills, highly suitable for the role.",
    status: "accepted",
  },
  {
    id: 2,
    name: "Michael Lee",
    phone: "+1 555-987-6543",
    email: "michael.lee@email.com",
    rating: 4,
    feedback: "Good technical skills, needs improvement in teamwork.",
    status: "pending",
  },
  {
    id: 3,
    name: "Jessica Chen",
    phone: "+1 555-678-9012",
    email: "jessica.chen@email.com",
    rating: 3,
    feedback:
      "Average performance in technical assessment. Decent communication.",
    status: "pending",
  },
  {
    id: 4,
    name: "David Wilson",
    phone: "+1 555-345-6789",
    email: "david.wilson@email.com",
    rating: 2,
    feedback: "Limited experience for the role. Consider for junior position.",
    status: "rejected",
  },
  {
    id: 5,
    name: "Emily Rodriguez",
    phone: "+1 555-890-1234",
    email: "emily.rodriguez@email.com",
    rating: 5,
    feedback: "Outstanding technical skills and great cultural fit.",
    status: "accepted",
  },
];

const RecruitmentPostApplicants = ({ postId = 1 }) => {
  const [applicants, setApplicants] = useState(dummyApplicants);
  const [filteredApplicants, setFilteredApplicants] = useState(dummyApplicants);
  const [search, setSearch] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [currentPage, setCurrentPage] = useState(1);
  const [recruitmentInfo, setRecruitmentInfo] = useState({
    title: "Software Engineer Recruitment",
    startDate: "2025-05-01",
    daysAgo: 22,
  });

  // Calculate how many days ago from the start date
  useEffect(() => {
    // In a real app, this would be calculated based on current date
    // For now, we're using the dummy value
  }, []);

  // Filter applicants based on search
  useEffect(() => {
    if (search.trim() === "") {
      setFilteredApplicants(applicants);
    } else {
      const filtered = applicants.filter(
        (applicant) =>
          applicant.name.toLowerCase().includes(search.toLowerCase()) ||
          applicant.email.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredApplicants(filtered);
    }
  }, [search, applicants]);

  // Pagination logic
  const totalItems = filteredApplicants.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = filteredApplicants.slice(startIndex, endIndex);

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

  // Handle applicant status change
  const handleStatusChange = (id, newStatus) => {
    const updatedApplicants = applicants.map((applicant) =>
      applicant.id === id ? { ...applicant, status: newStatus } : applicant
    );
    setApplicants(updatedApplicants);
  };

  // Render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`shrink-0 size-3 ${
            i <= rating ? "text-blue-600" : "text-gray-300"
          }`}
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
        </svg>
      );
    }
    return stars;
  };

  return (
    <div className="bg-bg-color min-h-screen pb-12">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Employee", href: "/dashboard/employee" },
          {
            label: "Recruitment Posts",
            href: "/dashboard/employee/recruitment_posts",
          },
        ]}
        currentPage="Applicants"
      />

      {/* Job Recruitment Title Section */}
      <div className="max-w-[85rem] px-4 mx-auto mt-6 mb-2">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {recruitmentInfo.title}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Started on:{" "}
              <span className="font-medium">{recruitmentInfo.startDate}</span>
              &middot;
              <span className="text-blue-600 font-semibold">
                {recruitmentInfo.daysAgo} days ago
              </span>
            </p>
          </div>
          <div>
            <Link
              href={`/employee_recruitment`}
              target="_blank"
              className="text-[1rem] font-medium text-black no-underline flex items-center gap-3"
            >
              Go to the form
              <Image
                src="https://i.ibb.co.com/gbNMx7dC/redirect.png"
                alt="Redirect"
                width={12}
                height={11.5}
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <ApplicantTable
        search={search}
        setSearch={setSearch}
        currentItems={currentItems}
        renderStars={renderStars}
        handleStatusChange={handleStatusChange}
        itemsPerPage={itemsPerPage}
        handleItemsPerPageChange={handleItemsPerPageChange}
        totalItems={totalItems}
        goToPrevPage={goToPrevPage}
        goToNextPage={goToNextPage}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  );
};

export default RecruitmentPostApplicants;
