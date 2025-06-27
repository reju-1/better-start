"use client";

import Image from "next/image";
import { useFieldArray, useFormContext } from "react-hook-form";
import CustomSelect from "../../../../../../components/form/CustomSelect";
import CustomInput from "../../../../../../components/form/CustomInput";

// Dummy employee data - replace with API data later
const employeeOptions = [
  { value: 1, label: "John Doe", image: "https://i.pravatar.cc/32?img=1" },
  { value: 2, label: "Jane Smith", image: "https://i.pravatar.cc/32?img=2" },
  { value: 3, label: "Mike Johnson", image: "https://i.pravatar.cc/32?img=3" },
];

const EmployeeAssignment = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "assignments",
  });

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg"
        >
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Team Member {index + 1}
            </label>
            <CustomSelect
              name={`assignments.${index}.employeeId`}
              options={employeeOptions}
              placeholder="Select employee"
              formatOptionLabel={({ label, image }) => (
                <div className="flex items-center gap-2">
                  <div className="relative w-6 h-6 rounded-full overflow-hidden">
                    <Image
                      src={image}
                      alt={label}
                      className="rounded-full"
                      fill
                      sizes="24px"
                    />
                  </div>
                  <span>{label}</span>
                </div>
              )}
            />
            {errors?.assignments?.[index]?.employeeId && (
              <p className="mt-1 text-sm text-red-600">
                {errors.assignments[index].employeeId.message}
              </p>
            )}
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Responsibility
            </label>
            <CustomInput
              name={`assignments.${index}.responsibility`}
              placeholder="Enter responsibility"
            />
            {errors?.assignments?.[index]?.responsibility && (
              <p className="mt-1 text-sm text-red-600">
                {errors.assignments[index].responsibility.message}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => remove(index)}
            className="mt-8 text-red-600 hover:text-red-700"
          >
            <svg
              className="w-5 h-5"
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
      ))}

      <button
        type="button"
        onClick={() => append({ employeeId: "", responsibility: "" })}
        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        Add Team Member
      </button>

      {errors?.assignments && (
        <p className="text-sm text-red-600">{errors.assignments.message}</p>
      )}
    </div>
  );
};

export default EmployeeAssignment;
