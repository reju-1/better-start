"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CustomForm from "@/components/form/CustomForm";
import CustomInput from "@/components/form/CustomInput";
import Button from "@/components/ui/Button";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// Login validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(50, { message: "Password must be at most 50 characters" }),
});

const LoginForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data) => {
    const toastId = toast.loading("Logging in...");
    setIsLoading(true);

    try {
      console.log("Login data:", data);

      // Dummy API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Login successful!", {
        id: toastId,
      });

      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please try again.", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CustomForm
        className="w-full max-w-md px-6 space-y-5"
        onSubmit={handleSubmit}
        resolver={zodResolver(loginSchema)}
        defaultValues={{
          email: "",
          password: "",
        }}
      >
        <h2 className="text-3xl font-bold text-primary text-center mb-2">
          Let&apos;s Buzz In!
        </h2>

        <CustomInput
          name="email"
          placeholder="Email Address / Username"
          type="email"
          required
          disabled={isLoading}
        />

        <CustomInput
          name="password"
          type="password"
          placeholder="Password"
          required
          disabled={isLoading}
        />

        <Button
          type="submit"
          content="Login"
          isLoading={isLoading}
          disabled={isLoading}
        />

        <p className="text-center text-primary-text-color">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-primary hover:text-purple-700 font-semibold"
          >
            Register here
          </Link>
        </p>
      </CustomForm>
    </>
  );
};

export default LoginForm;
