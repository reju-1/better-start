"use client";

// Update imports
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomForm from "../../../../../../components/form/CustomForm";
import CustomInput from "../../../../../../components/form/CustomInput";
import CustomSelect from "../../../../../../components/form/CustomSelect";
import CustomTextarea from "../../../../../../components/form/CustomTextarea";
import EmployeeAssignment from "./EmployeeAssignment";

// Update schema to match AddTaskModal
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

const EditTaskModal = ({ isOpen, onClose, task, onSubmit }) => {
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

  const handleSubmit = (data) => {
    onSubmit(data);
    onClose();
  };

  if (!isOpen || !task) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        <div
          ref={modalRef}
          className="relative w-full max-w-lg bg-white rounded-xl shadow-xl"
        >
          {/* Close button */}
          <div className="absolute top-3 right-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              <span className="sr-only">Close</span>
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Header */}
          <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 rounded-t-xl">
            <h3 className="text-xl font-semibold text-gray-800">Edit Task</h3>
          </div>

          {/* Content */}
          <div className="px-6 py-4 max-h-[calc(100vh-16rem)] overflow-y-auto">
            <CustomForm
              id="editTaskForm"
              onSubmit={handleSubmit}
              resolver={zodResolver(taskSchema)}
              defaultValues={{
                title: task.title,
                description: task.description || "",
                priority: task.priority,
                dueDate: task.dueDate,
                assignments: task.assignments || [
                  { employeeId: "", responsibility: "" },
                ],
              }}
            >
              {/* Title */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Title <span className="text-red-500">*</span>
                </label>
                <CustomInput
                  name="title"
                  placeholder="Enter task title"
                  required
                />
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <CustomTextarea
                  name="description"
                  rows={4}
                  placeholder="Enter task description"
                />
              </div>

              {/* Priority */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority <span className="text-red-500">*</span>
                </label>
                <CustomSelect
                  name="priority"
                  options={priorityOptions}
                  placeholder="Select priority"
                  required
                />
              </div>

              {/* Due Date */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <CustomInput name="dueDate" type="date" />
              </div>

              {/* Employee Assignment Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Members & Responsibilities{" "}
                  <span className="text-red-500">*</span>
                </label>
                <EmployeeAssignment />
              </div>
            </CustomForm>
          </div>

          {/* Footer */}
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
                form="editTaskForm"
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-purple-600 text-white hover:bg-purple-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default EditTaskModal;
