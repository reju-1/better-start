"use client";

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomForm from "@/components/form/CustomForm";
import CustomInput from "@/components/form/CustomInput";
import CustomTextarea from "@/components/form/CustomTextarea";
import CustomSelect from "@/components/form/CustomSelect";
import Breadcrumb from "@/components/common/Breadcrumb";

// Define the validation schema using Zod
const jobPostSchema = z.object({
  job_title: z.string().min(1, "Job title is required"),
  job_description: z
    .string()
    .min(50, "Please provide a detailed job description (min 50 characters)"),
  required_skills: z.string().min(1, "Required skills are needed"),
  preferred_skills: z.string().optional(),
  experience_level: z.string().min(1, "Experience level is required"),
  location: z.string().min(1, "Location is required"),
  employment_type: z.string().min(1, "Please select an employment type"),
  salary_range: z.string().optional(),
  posted_date: z.string().min(1, "Posted date is required"),
});

const CreateJobPost = ({ onSubmit }) => {
  const handleSubmit = (data) => {
    console.log("Form submitted:", data);
    if (onSubmit) {
      onSubmit(data);
    }
  };

  const handleCancel = () => {
    // Handle cancellation logic here
    console.log("Form cancelled");
  };

  const employmentTypes = [
    { value: "", label: "Select type" },
    "Full-time",
    "Part-time",
    "Contract",
    "Internship",
    "Temporary",
  ];

  return (
    <>
      <Breadcrumb
        items={[{ label: "Employee", href: "/dashboard/employee" }]}
        currentPage="Create Job Requirement"
      />

      <div className="max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:pt-2 lg:pb-0 mx-auto">
        <div className="bg-white rounded-xl shadow-xs p-4 sm:p-7">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            New Job Requirement
          </h1>

          <CustomForm
            onSubmit={handleSubmit}
            resolver={zodResolver(jobPostSchema)}
            defaultValues={{
              job_title: "",
              job_description: "",
              required_skills: "",
              preferred_skills: "",
              experience_level: "",
              location: "",
              employment_type: "",
              salary_range: "",
              posted_date: "",
            }}
          >
            {/* Job Title */}
            <div className="mb-5">
              <label
                htmlFor="job-title"
                className="block text-sm font-medium text-gray-500 mb-1"
              >
                Job Title
              </label>
              <CustomInput
                name="job_title"
                id="job-title"
                placeholder="e.g., Frontend Developer"
                className="py-2 px-3 block w-full border-gray-200 rounded-lg shadow-2xs sm:text-sm focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>

            {/* Job Description */}
            <div className="mb-5">
              <label
                htmlFor="job-description"
                className="block text-sm font-medium text-gray-500 mb-1"
              >
                Job Description
              </label>
              <CustomTextarea
                name="job_description"
                id="job-description"
                rows={4}
                placeholder="Summary of duties, expectations, and context"
                className="py-2 px-3 block w-full border-gray-200 rounded-lg shadow-2xs sm:text-sm focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>

            {/* Required Skills */}
            <div className="mb-5">
              <label
                htmlFor="required-skills"
                className="block text-sm font-medium text-gray-500 mb-1"
              >
                Required Skills
              </label>
              <CustomTextarea
                name="required_skills"
                id="required-skills"
                rows={2}
                placeholder="List must-have skills, separated by commas"
                className="py-2 px-3 block w-full border-gray-200 rounded-lg shadow-2xs sm:text-sm focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>

            {/* Preferred Skills */}
            <div className="mb-5">
              <label
                htmlFor="preferred-skills"
                className="block text-sm font-medium text-gray-500 mb-1"
              >
                Preferred Skills
              </label>
              <CustomTextarea
                name="preferred_skills"
                id="preferred-skills"
                rows={2}
                placeholder="List nice-to-have skills, separated by commas"
                className="py-2 px-3 block w-full border-gray-200 rounded-lg shadow-2xs sm:text-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            {/* Experience Level */}
            <div className="mb-5">
              <label
                htmlFor="experience-level"
                className="block text-sm font-medium text-gray-500 mb-1"
              >
                Experience Level
              </label>
              <CustomInput
                name="experience_level"
                id="experience-level"
                placeholder="e.g., Entry, Mid, Senior, 3+ years"
                className="py-2 px-3 block w-full border-gray-200 rounded-lg shadow-2xs sm:text-sm focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>

            {/* Location and Employment Type row */}
            <div className="flex flex-row gap-4 mb-5">
              {/* Location */}
              <div className="w-1/2">
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-500 mb-1"
                >
                  Location
                </label>
                <CustomInput
                  name="location"
                  id="location"
                  placeholder="e.g., Berlin, Germany or Remote"
                  className="py-2 px-3 block w-full border-gray-200 rounded-lg shadow-2xs sm:text-sm focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>

              {/* Employment Type */}
              <div className="w-1/2">
                <label
                  htmlFor="employment-type"
                  className="block text-sm font-medium text-gray-500 mb-1"
                >
                  Employment Type
                </label>
                <CustomSelect
                  name="employment_type"
                  id="employment-type"
                  options={employmentTypes}
                  className="py-2 px-3 block w-full border-gray-200 rounded-lg shadow-2xs sm:text-sm focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            {/* Salary Range and Posted Date row */}
            <div className="flex flex-row gap-4 mb-8">
              {/* Salary Range */}
              <div className="w-1/2">
                <label
                  htmlFor="salary-range"
                  className="block text-sm font-medium text-gray-500 mb-1"
                >
                  Salary Range (optional)
                </label>
                <CustomInput
                  name="salary_range"
                  id="salary-range"
                  placeholder="e.g., €70,000 - €90,000/year"
                  className="py-2 px-3 block w-full border-gray-200 rounded-lg shadow-2xs sm:text-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              {/* Posted Date */}
              <div className="w-1/2">
                <label
                  htmlFor="posted-date"
                  className="block text-sm font-medium text-gray-500 mb-1"
                >
                  Posted Date
                </label>
                <CustomInput
                  name="posted_date"
                  id="posted-date"
                  type="date"
                  className="py-2 px-3 block w-full border-gray-200 rounded-lg shadow-2xs sm:text-sm focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-purple-600 text-white hover:bg-purple-700 focus:outline-hidden focus:bg-purple-700 disabled:opacity-50 disabled:pointer-events-none"
              >
                Start and Publish
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-gray-400 text-white hover:bg-gray-500 focus:outline-hidden focus:bg-gray-500 disabled:opacity-50 disabled:pointer-events-none"
              >
                Stop
              </button>
            </div>
          </CustomForm>
        </div>
      </div>
    </>
  );
};

export default CreateJobPost;
