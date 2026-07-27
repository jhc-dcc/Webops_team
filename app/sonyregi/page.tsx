"use client";

import { useState } from "react";

export default function Page() {
  const [showButtons, setShowButtons] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    departmentOther: "",
    year: "",
  });

  const departments = [
    "BSC IT",
    "BVOC SD",
    "BVOC TT",
    "BCOM",
    "BBA",
    "BSC",
    "BIOTECH",
    "BMS",
    "BMM",
    "BFM",
    "BAF",
    "BBI",
    "BA",
    "BDS",
    "Other",
  ];

  const years = ["FY", "SY", "TY"];

  // Phone validation function for Indian numbers
  const validatePhoneNumber = (phone: string): boolean => {
    // Remove all spaces, hyphens, and parentheses
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");

    // Check for Indian number patterns:
    // 1. 10 digits starting with 6-9: 9876543210
    // 2. +91 followed by 10 digits: +919876543210
    // 3. 0091 followed by 10 digits: 00919876543210
    // 4. 91 followed by 10 digits: 919876543210

    const patterns = [
      /^[6-9]\d{9}$/, // 10 digits starting with 6-9
      /^\+91[6-9]\d{9}$/, // +91 followed by 10 digits starting with 6-9
      /^0091[6-9]\d{9}$/, // 0091 followed by 10 digits starting with 6-9
      /^91[6-9]\d{9}$/, // 91 followed by 10 digits starting with 6-9
    ];

    return patterns.some((pattern) => pattern.test(cleanPhone));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Reset departmentOther if department is not "Other"
    if (name === "department" && value !== "Other") {
      setFormData((prev) => ({ ...prev, departmentOther: "" }));
      // Clear departmentOther error as well
      if (errors.departmentOther) {
        setErrors((prev) => ({ ...prev, departmentOther: "" }));
      }
    }

    // Real-time phone validation
    if (name === "phone" && value && !validatePhoneNumber(value)) {
      setErrors((prev) => ({
        ...prev,
        phone: "Please enter a valid phone number",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Clear previous errors
    setErrors({});
    const newErrors: { [key: string]: string } = {};

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        newErrors.name = "Full name is required";
      }
      if (!formData.email.trim()) {
        newErrors.email = "Email address is required";
      }
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
      }
      if (!formData.department) {
        newErrors.department = "Please select a department";
      }
      if (!formData.year) {
        newErrors.year = "Please select your year of study";
      }

      // Validate departmentOther if department is "Other"
      if (formData.department === "Other" && !formData.departmentOther.trim()) {
        newErrors.departmentOther = "Please specify your department";
      }

      // Validate phone number
      if (formData.phone.trim() && !validatePhoneNumber(formData.phone)) {
        newErrors.phone =
          "Please enter a valid Indian phone number (10 digits, with or without country code +91)";
      }

      // If there are validation errors, show them and stop
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const response = await fetch("/api/sony-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setShowButtons(true);
    } catch (error: unknown) {
      console.error("Error submitting registration:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.";

      // Show general error at the top of the form
      setErrors({
        general: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-red-900/20 py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-lg mx-auto bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-2xl p-8 mt-20 border border-gray-700/50">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-2">
            Event Registration
          </h2>
          <p className="text-gray-300">
            Join us for an extraordinary tech experience!
          </p>
          <div className="mt-4 w-24 h-1 bg-gray-600 rounded-full mx-auto"></div>
        </div>

        {!showButtons ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General error message */}
            {errors.general && (
              <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm">{errors.general}</p>
              </div>
            )}

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className={`mt-1 block w-full h-12 px-3 rounded-md bg-gray-700 border text-white placeholder-gray-400 shadow-sm focus:ring-1 transition-colors ${
                  errors.name
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-600 focus:border-red-500 focus:ring-red-500"
                }`}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className={`mt-1 block w-full h-12 px-3 rounded-md bg-gray-700 border text-white placeholder-gray-400 shadow-sm focus:ring-1 transition-colors ${
                  errors.email
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-600 focus:border-red-500 focus:ring-red-500"
                }`}
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className={`mt-1 block w-full h-12 px-3 rounded-md bg-gray-700 border text-white placeholder-gray-400 shadow-sm focus:ring-1 transition-colors ${
                  errors.phone
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-600 focus:border-red-500 focus:ring-red-500"
                }`}
                placeholder="Enter your phone number"
              />
              {errors.phone ? (
                <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
              ) : (
                <p className="mt-1 text-xs text-gray-400">
                  Enter a valid phone number
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="department"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Department *
              </label>
              <select
                id="department"
                name="department"
                required
                value={formData.department}
                onChange={handleInputChange}
                className={`mt-1 block w-full h-12 px-3 rounded-md bg-gray-700 border text-white shadow-sm focus:ring-1 transition-colors ${
                  errors.department
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-600 focus:border-red-500 focus:ring-red-500"
                }`}
              >
                <option value="" className="text-gray-400">
                  Select your department
                </option>
                {departments.map((dept) => (
                  <option key={dept} value={dept} className="bg-gray-700">
                    {dept}
                  </option>
                ))}
              </select>
              {errors.department && (
                <p className="mt-1 text-sm text-red-400">{errors.department}</p>
              )}
            </div>

            {/* Show input field if "Other" is selected for Department */}
            {formData.department === "Other" && (
              <div>
                <label
                  htmlFor="departmentOther"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Please specify your department *
                </label>
                <input
                  type="text"
                  id="departmentOther"
                  name="departmentOther"
                  required
                  value={formData.departmentOther}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full h-12 px-3 rounded-md bg-gray-700 border text-white placeholder-gray-400 shadow-sm focus:ring-1 transition-colors ${
                    errors.departmentOther
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-600 focus:border-red-500 focus:ring-red-500"
                  }`}
                  placeholder="Enter your department"
                />
                {errors.departmentOther && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.departmentOther}
                  </p>
                )}
              </div>
            )}

            <div>
              <label
                htmlFor="year"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Year of Study *
              </label>
              <select
                id="year"
                name="year"
                required
                value={formData.year}
                onChange={handleInputChange}
                className={`mt-1 block w-full h-12 px-3 rounded-md bg-gray-700 border text-white shadow-sm focus:ring-1 transition-colors ${
                  errors.year
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-600 focus:border-red-500 focus:ring-red-500"
                }`}
              >
                <option value="" className="text-gray-400">
                  Select your year
                </option>
                {years.map((year) => (
                  <option key={year} value={year} className="bg-gray-700">
                    {year === "FY"
                      ? "First Year (FY)"
                      : year === "SY"
                      ? "Second Year (SY)"
                      : "Third Year (TY)"}
                  </option>
                ))}
              </select>
              {errors.year && (
                <p className="mt-1 text-sm text-red-400">{errors.year}</p>
              )}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Registering...
                  </>
                ) : (
                  "Register for Event"
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="text-center py-8 px-4 bg-green-900/20 border border-green-500/30 rounded-lg">
              <div className="flex justify-center mb-6">
                <svg
                  className="w-16 h-16 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-green-400 mb-3">
                Registration Successful!
              </h3>
              <p className="text-green-200 mb-6 leading-relaxed">
                Thank you for registering for our event! You can now visit our
                partner websites:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href="https://www.sony.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col items-center justify-center py-6 px-6 border border-blue-500 rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-b from-blue-900/40 to-transparent hover:from-blue-800/50 hover:to-blue-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
              >
                <div className="absolute inset-0 rounded-lg bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                <div className="absolute -inset-1 bg-blue-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                <div className="flex flex-col items-center space-y-2 relative z-10">
                  <span className="text-blue-400">Visit Sony</span>
                  <svg
                    className="w-4 h-4 mt-2 opacity-70"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    ></path>
                  </svg>
                </div>
              </a>

              <a
                href="https://www.nestle.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col items-center justify-center py-6 px-6 border border-yellow-500 rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-b from-yellow-900/40 to-transparent hover:from-yellow-800/50 hover:to-yellow-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-200 transform hover:scale-105"
              >
                <div className="absolute inset-0 rounded-lg bg-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                <div className="absolute -inset-1 bg-yellow-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                <div className="flex flex-col items-center space-y-2 relative z-10">
                  <span className="text-yellow-400">Visit Nescafé</span>
                  <svg
                    className="w-4 h-4 mt-2 opacity-70"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    ></path>
                  </svg>
                </div>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced ambient effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-transparent to-yellow-900/10" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}