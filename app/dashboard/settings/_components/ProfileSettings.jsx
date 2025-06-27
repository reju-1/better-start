"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomInput from "../../../../components/form/CustomInput";
import CustomRadioGroup from "../../../../components/form/CustomRadioGroup";
import CustomTextarea from "../../../../components/form/CustomTextarea";
import CustomFileInput from "../../../../components/form/CustomFileInput";
import CustomForm from "../../../../components/form/CustomForm";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { useUpdateProfileMutation } from "../../../../redux/api/profileApi";

const profileSchema = z.object({
  profile_photo: z.any(),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  current_password: z.string().optional(),
  new_password: z.string().optional(),
  phone: z.string().min(1, "Phone number is required"),
  gender: z.string(),
  bio: z.string().optional(),
});

const ProfileSettings = () => {
  const [imagePreview, setImagePreview] = useState(
    "https://preline.co/assets/img/160x160/img1.jpg"
  );

  const [updateProfile] = useUpdateProfileMutation();

  const handleImageChange = (file) => {
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleSubmit = async (data) => {
    const toastId = toast.loading("Updating profile...");

    try {
      const formData = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        current_password: data.current_password || "",
        new_password: data.new_password || "",
        phone: data.phone,
        gender: data.gender,
        bio: data.bio || "",
        profile_photo: "https://i.ibb.co/zW6RJFbs/Frame-63.png",
      };

      const response = await updateProfile(formData).unwrap();
      console.log("Profile updated:", response);

      toast.success("Profile updated successfully!", { id: toastId });
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile. Please try again.", {
        id: toastId,
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xs p-4 sm:p-7">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800">Profile</h2>
        <p className="text-sm text-gray-600">
          Manage your name, password and account settings.
        </p>
      </div>

      <CustomForm
        onSubmit={handleSubmit}
        onError={(errors) => {
          console.error("Form validation errors:", errors);
        }}
        resolver={zodResolver(profileSchema)}
        defaultValues={{
          profile_photo: null,
          first_name: "",
          last_name: "",
          email: "",
          current_password: "",
          new_password: "",
          phone: "",
          gender: "male",
          bio: "",
        }}
      >
        <div className="grid sm:grid-cols-12 gap-2 sm:gap-6">
          {/* Profile Photo */}
          <div className="sm:col-span-3">
            <label className="inline-block text-sm text-gray-800 mt-2.5">
              Profile photo
              <span className="font-bold text-red-600">*</span>
            </label>
          </div>
          <div className="sm:col-span-9">
            <div className="flex items-center gap-5">
              <div className="relative h-16 w-16">
                <Image
                  className="rounded-full ring-2 ring-white object-cover"
                  src={imagePreview}
                  alt="Avatar"
                  fill
                  sizes="64px"
                  priority
                />
              </div>
              <CustomFileInput
                name="profile_photo"
                accept="image/*"
                maxSize={5 * 1024 * 1024}
                onChange={handleImageChange}
              />
            </div>
          </div>

          {/* Full Name */}
          <div className="sm:col-span-3">
            <label className="inline-block text-sm text-gray-800 mt-2.5">
              Full name
              <span className="font-bold text-red-600">*</span>
            </label>
          </div>
          <div className="sm:col-span-9">
            <div className="grid grid-cols-2 gap-4 w-full">
              <CustomInput
                name="first_name"
                placeholder="First name"
                required
              />
              <CustomInput name="last_name" placeholder="Last name" required />
            </div>
          </div>

          {/* Email */}
          <div className="sm:col-span-3">
            <label className="inline-block text-sm text-gray-800 mt-2.5">
              Email
            </label>
          </div>
          <div className="sm:col-span-9">
            <CustomInput
              name="email"
              type="email"
              placeholder="you@example.com"
              className="w-full"
            />
          </div>

          {/* Password */}
          <div className="sm:col-span-3">
            <label className="inline-block text-sm text-gray-800 mt-2.5">
              Password
            </label>
          </div>
          <div className="sm:col-span-9">
            <div className="grid grid-cols-2 gap-4 w-full">
              <CustomInput
                name="current_password"
                type="password"
                placeholder="Current password"
              />
              <CustomInput
                name="new_password"
                type="password"
                placeholder="New password"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="sm:col-span-3">
            <div className="inline-block">
              <label className="inline-block text-sm text-gray-800 mt-2.5">
                Phone
                <span className="font-bold text-red-600">*</span>
              </label>
            </div>
          </div>
          <div className="sm:col-span-9">
            <CustomInput
              name="phone"
              placeholder="+x(xxx)xxx-xx-xx"
              required
              className="w-full"
            />
          </div>

          {/* Gender */}
          <div className="sm:col-span-3">
            <label className="inline-block text-sm text-gray-800 mt-2.5">
              Gender
            </label>
          </div>
          <div className="sm:col-span-9">
            <CustomRadioGroup
              name="gender"
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
              ]}
            />
          </div>

          {/* Bio */}
          <div className="sm:col-span-3">
            <label className="inline-block text-sm text-gray-800 mt-2.5">
              BIO
            </label>
          </div>
          <div className="sm:col-span-9">
            <CustomTextarea
              name="bio"
              placeholder="Type your bio"
              rows={5}
              maxLength={500}
              className="w-full"
            />
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-x-2">
          <button
            type="button"
            className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-purple-700 text-white hover:bg-purple-800"
          >
            Save changes
          </button>
        </div>
      </CustomForm>
    </div>
  );
};

export default ProfileSettings;
