"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomForm from "../../../../../../components/form/CustomForm";
import CustomInput from "../../../../../../components/form/CustomInput";
import CustomSelect from "../../../../../../components/form/CustomSelect";
import CustomTextarea from "../../../../../../components/form/CustomTextarea";
import EmployeeAssignment from "./EmployeeAssignment";

const taskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  priority: z.string().min(1, "Priority is required"),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  assignments: z
    .array(
      z.object({
        employeeId: z.number().min(1, "Employee is required"),
        responsibility: z.string().min(1, "Responsibility is required"),
      })
    )
    .optional(),
});

const priorityOptions = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const AddTaskModal = ({ isOpen, onClose, onSubmit }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  const handleSubmit = (data) => {
    onSubmit(data);
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity overflow-y-auto">
      <div className="min-h-screen w-full flex items-center justify-center p-4">
        <div
          ref={modalRef}
          className="relative w-full max-w-lg bg-white rounded-xl shadow-lg my-8"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute top-3 right-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              <span className="sr-only">Close</span>
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 rounded-t-xl">
            <h3 className="text-xl font-semibold text-gray-800">
              Add New Task
            </h3>
          </div>

          <div className="px-6 py-4 max-h-[calc(100vh-16rem)] overflow-y-auto">
            <CustomForm
              id="taskForm"
              onSubmit={handleSubmit}
              resolver={zodResolver(taskSchema)}
              defaultValues={{
                title: "",
                priority: "",
                description: "",
                dueDate: "",
                assignments: [{ employeeId: "", responsibility: "" }],
              }}
            >
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium mb-2 text-gray-700"
                >
                  Task Title <span className="text-red-500">*</span>
                </label>
                <CustomInput
                  name="title"
                  placeholder="Enter task title"
                  required
                  autoFocus
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="priority"
                  className="block text-sm font-medium mb-2 text-gray-700"
                >
                  Priority <span className="text-red-500">*</span>
                </label>
                <CustomSelect
                  name="priority"
                  options={priorityOptions}
                  placeholder="Select priority"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium mb-2 text-gray-700"
                >
                  Description
                </label>
                <CustomTextarea
                  name="description"
                  rows={4}
                  placeholder="Enter task description"
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="dueDate"
                  className="block text-sm font-medium mb-2 text-gray-700"
                >
                  Due Date
                </label>
                <CustomInput name="dueDate" type="date" />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Members & Responsibilities{" "}
                  <span className="text-red-500">*</span>
                </label>
                <EmployeeAssignment />
              </div>
            </CustomForm>
          </div>

          <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-200 rounded-b-xl">
            <div className="flex justify-end gap-x-2">
              <button
                type="button"
                onClick={onClose}
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="taskForm"
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-purple-600 text-white hover:bg-purple-700"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AddTaskModal;
