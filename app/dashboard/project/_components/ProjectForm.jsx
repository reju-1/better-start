"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import CustomForm from "../../../../components/form/CustomForm";
import CustomInput from "../../../../components/form/CustomInput";
import CustomSelect from "../../../../components/form/CustomSelect";
import CustomTextarea from "../../../../components/form/CustomTextarea";

// Validation schema using Zod
const projectSchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  status: z.string().min(1, "Status is required"),
  priorityLevel: z.string().min(1, "Priority level is required"),
  dueDate: z.string().min(1, "Start date is required"),
  endDate: z
    .string()
    .min(1, "End date is required")
    .refine((date) => new Date(date), {
      message: "Please enter a valid date",
    }),
});

const ProjectForm = ({ isUpdateMode = false, projectData = null, on }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categoryOptions = [
    { value: "", label: "Select a category" },
    { value: "Web Development", label: "Web Development" },
    { value: "Mobile App", label: "Mobile App" },
    { value: "UI/UX Design", label: "UI/UX Design" },
    { value: "Branding", label: "Branding" },
    { value: "Marketing", label: "Marketing" },
    { value: "Content Creation", label: "Content Creation" },
    { value: "SEO", label: "SEO" },
    { value: "Other", label: "Other" },
  ];

  const statusOptions = [
    { value: "", label: "Select status" },
    { value: "Not Started", label: "Not Started" },
    { value: "In Progress", label: "In Progress" },
    { value: "Under Review", label: "Under Review" },
    { value: "Completed", label: "Completed" },
    { value: "On Hold", label: "On Hold" },
  ];

  const priorityOptions = [
    { value: "", label: "Select priority" },
    { value: "Low", label: "Low" },
    { value: "Medium", label: "Medium" },
    { value: "High", label: "High" },
    { value: "Urgent", label: "Urgent" },
  ];

  const defaultValues = {
    projectName: projectData?.projectName || "",
    description: projectData?.description || "",
    status: projectData?.status || "",
    priorityLevel: projectData?.priorityLevel || "",
    dueDate: projectData?.dueDate || "",
    endDate: projectData?.endDate || "",
    category: projectData?.category || "",
  };

  const handleFormSubmit = async (data) => {
    const toastId = toast.loading(
      isUpdateMode ? "Updating project..." : "Creating project..."
    );
    setIsSubmitting(true);

    try {
      // API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Project data:", data);

      toast.success(
        isUpdateMode
          ? "Project updated successfully!"
          : "Project created successfully!",
        {
          id: toastId,
        }
      );

      router.push("/dashboard/project");
    } catch (error) {
      console.error("Project submission failed:", error);
      toast.error("Something went wrong. Please try again.", {
        id: toastId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleError = (errors) => {
    console.error(errors);
  };

  return (
    <>
      <div className="mt-4">
        {/* Main Form Section */}
        <div className="max-w-4xl px-4 py-6 sm:px-6 lg:px-8 mx-auto">
          {/* Form Card */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-7">
            {/* Form Header */}
            <div className="mb-5 sm:mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                {isUpdateMode ? "Update Project" : "Create New Project"}
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                {isUpdateMode
                  ? "Update your project information below."
                  : "Fill in the details below to create a new project."}
              </p>
            </div>
            <CustomForm
              onSubmit={handleFormSubmit}
              onError={handleError}
              defaultValues={defaultValues}
              resolver={zodResolver(projectSchema)}
              className="w-full"
            >
              {/* Form body */}
              <div className="">
                <div className="space-y-5 sm:space-y-6">
                  {/* Project Details Section */}
                  <div>
                    {/* Project Name */}
                    <div className="mb-4">
                      <label
                        htmlFor="projectName"
                        className="block text-sm font-medium mb-2 text-gray-700"
                      >
                        Project Name <span className="text-red-500">*</span>
                      </label>
                      <CustomInput
                        name="projectName"
                        placeholder="Enter project name"
                        required
                        className="py-3 px-4"
                      />
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium mb-2 text-gray-700"
                      >
                        Description <span className="text-red-500">*</span>
                      </label>
                      <CustomTextarea
                        name="description"
                        placeholder="Describe the project in detail"
                        required
                        className="py-3 px-4"
                        rows={4}
                      />
                      <p className=" text-sm text-gray-400">
                        Provide a detailed description of the project goals,
                        scope, and requirements.
                      </p>
                    </div>

                    {/* Category */}
                    <div className="mb-4">
                      <label
                        htmlFor="category"
                        className="block text-sm font-medium mb-2 text-gray-700"
                      >
                        Category <span className="text-red-500">*</span>
                      </label>
                      <CustomSelect
                        name="category"
                        options={categoryOptions}
                        placeholder="Select a category"
                        required
                        className="py-3 px-4"
                      />
                    </div>
                  </div>

                  {/* Project Status Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Status & Priority
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      {/* Status */}
                      <div>
                        <label
                          htmlFor="status"
                          className="block text-sm font-medium mb-2 text-gray-700"
                        >
                          Project Status <span className="text-red-500">*</span>
                        </label>
                        <CustomSelect
                          name="status"
                          options={statusOptions}
                          placeholder="Select status"
                          required
                          className="py-3 px-4"
                        />
                      </div>

                      {/* Priority Level */}
                      <div>
                        <label
                          htmlFor="priorityLevel"
                          className="block text-sm font-medium mb-2 text-gray-700"
                        >
                          Priority Level <span className="text-red-500">*</span>
                        </label>
                        <CustomSelect
                          name="priorityLevel"
                          options={priorityOptions}
                          placeholder="Select priority"
                          required
                          className="py-3 px-4"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Timeline Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Project Timeline
                    </h3>

                    {/* Dates */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label
                          htmlFor="dueDate"
                          className="block text-sm font-medium mb-2 text-gray-700"
                        >
                          Start Date <span className="text-red-500">*</span>
                        </label>
                        <CustomInput
                          name="dueDate"
                          type="date"
                          required
                          className="py-3 px-4"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="endDate"
                          className="block text-sm font-medium mb-2 text-gray-700"
                        >
                          End Date <span className="text-red-500">*</span>
                        </label>
                        <CustomInput
                          name="endDate"
                          type="date"
                          required
                          className="py-3 px-4"
                        />
                      </div>

                      <p className="text-sm text-gray-400">
                        Ensure the end date is after the start date.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form footer */}
              <div className="p-4 sm:px-7">
                <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => router.push("/dashboard/project")}
                    className="py-2.5 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-gray-300 font-medium bg-white text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="py-2.5 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all text-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <span
                          className="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-white rounded-full"
                          role="status"
                          aria-label="loading"
                        ></span>
                        {isUpdateMode ? "Updating..." : "Creating..."}
                      </>
                    ) : isUpdateMode ? (
                      "Update Project"
                    ) : (
                      "Create Project"
                    )}
                  </button>
                </div>
              </div>
            </CustomForm>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectForm;
