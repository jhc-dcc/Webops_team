"use client";

import { AdminLogin } from "@/components/admin-login";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import {
  CheckCircle,
  Download,
  Eye,
  Loader2,
  LogOut,
  PlusCircle,
  Recycle,
  Shield,
  TrendingUp,
  XCircle
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface EwasteSubmission {
  _id: string;
  _creationTime: number;
  name: string;
  email: string;
  phone: string;
  participantType: "individual" | "organization";
  organizationName?: string;
  organizationAddress?: string;
  representativeName?: string;
  wasteWeight: number;
  wasteTypes: string[];
  additionalNotes?: string;
  submittedAt: number;
  verificationStatus: "pending" | "verified" | "rejected";
  verifiedBy?: string;
  verifiedAt?: number;
}

type DonorFormState = {
  name: string;
  email: string;
  phone: string;
  participantType: "individual" | "organization";
  organizationName: string;
  wasteWeight: string;
  wasteTypes: string[];
  submittedAt: string;
  verificationStatus: "pending" | "verified" | "rejected";
};

const toDateTimeLocalValue = (date = new Date()) => {
  const timezoneOffset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - timezoneOffset)
      .toISOString()
      .slice(0, 16);
};

const createInitialDonorForm = (): DonorFormState => ({
  name: "",
  email: "",
  phone: "",
  participantType: "individual",
  organizationName: "",
  wasteWeight: "",
  wasteTypes: [],
  submittedAt: toDateTimeLocalValue(),
  verificationStatus: "verified",
});

const wasteTypeLabels: Record<string, string> = {
  laptops: "Laptops & Computers",
  phones: "Mobile Phones & Tablets",
  cables: "Cables & Chargers",
  batteries: "Batteries",
  appliances: "Small Appliances",
  monitors: "Monitors & TVs",
  printers: "Printers & Scanners",
  audio: "Audio Equipment",
  gaming: "Gaming Consoles",
  other: "Other Electronic Items",
};

const EwasteAdmin = () => {
  const { isAuthenticated, login, logout } = useAdminAuth();
  const submissions = useQuery(api.ewaste.getAllSubmissions, {});
  const updateVerificationStatus = useMutation(api.ewaste.updateVerificationStatus);
  const addAdminDonor = useMutation(api.ewaste.addAdminDonor);

  const [selectedSubmission, setSelectedSubmission] = useState<EwasteSubmission | null>(null);
  const [isAddDonorOpen, setIsAddDonorOpen] = useState(false);
  const [isAddingDonor, setIsAddingDonor] = useState(false);
  const [donorForm, setDonorForm] = useState<DonorFormState>(
      createInitialDonorForm
  );

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onLogin={login} />;
  }

  if (submissions === undefined) {
    return (
        <div className="min-h-screen py-8 px-4 pt-32 bg-black">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              <span className="ml-3 text-white">Loading e-waste submissions...</span>
            </div>
          </div>
        </div>
    );
  }

  const handleViewDetails = (submission: EwasteSubmission) => {
    setSelectedSubmission(submission);
  };

  const handleCloseModal = () => {
    setSelectedSubmission(null);
  };

  const handleStatusUpdate = async (submissionId: string, status: "verified" | "rejected") => {
    try {
      await updateVerificationStatus({
        submissionId: submissionId as Id<"ewasteSubmissions">,
        status,
        verifiedBy: "Admin", // You can replace with actual admin name
      });
      toast.success(`Submission ${status} successfully!`);
    } catch (err) {
      console.error("Error updating submission status:", err);
      toast.error(`Failed to ${status} submission`);
    }
  };

  const toggleWasteType = (wasteType: string) => {
    setDonorForm((current) => ({
      ...current,
      wasteTypes: current.wasteTypes.includes(wasteType)
          ? current.wasteTypes.filter((type) => type !== wasteType)
          : [...current.wasteTypes, wasteType],
    }));
  };

  const closeAddDonorModal = () => {
    if (isAddingDonor) return;
    setIsAddDonorOpen(false);
    setDonorForm(createInitialDonorForm());
  };

  const handleAddDonor = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = donorForm.name.trim();
    const email = donorForm.email.trim().toLowerCase();
    const phone = donorForm.phone.trim();
    const organizationName = donorForm.organizationName.trim();
    const wasteWeight = Number(donorForm.wasteWeight);
    const submittedAt = new Date(donorForm.submittedAt).getTime();

    if (!name || !email || !phone) {
      toast.error("Name, email and phone are required.");
      return;
    }

    if (
        donorForm.participantType === "organization" &&
        !organizationName
    ) {
      toast.error("Organization name is required.");
      return;
    }

    if (!Number.isFinite(wasteWeight) || wasteWeight <= 0) {
      toast.error("Waste weight must be greater than 0 kg.");
      return;
    }

    if (donorForm.wasteTypes.length === 0) {
      toast.error("Select at least one waste type.");
      return;
    }

    if (!Number.isFinite(submittedAt)) {
      toast.error("Please enter a valid submission date and time.");
      return;
    }

    try {
      setIsAddingDonor(true);

      const result = await addAdminDonor({
        name,
        email,
        phone,
        participantType: donorForm.participantType,
        organizationName:
            donorForm.participantType === "organization"
                ? organizationName
                : undefined,
        representativeName:
            donorForm.participantType === "organization" ? name : undefined,
        wasteWeight,
        wasteTypes: donorForm.wasteTypes,
        submittedAt,
        verificationStatus: donorForm.verificationStatus,
        verifiedBy:
            donorForm.verificationStatus === "verified"
                ? "Admin"
                : undefined,
      });

      toast.success(
          result.action === "updated"
              ? `Existing donor updated. ${wasteWeight} kg was added.`
              : "Donor added successfully."
      );

      setIsAddDonorOpen(false);
      setDonorForm(createInitialDonorForm());
    } catch (error) {
      console.error("Failed to add donor:", error);
      toast.error(
          error instanceof Error
              ? error.message
              : "Failed to add donor."
      );
    } finally {
      setIsAddingDonor(false);
    }
  };

  const exportToCSV = () => {
    if (!submissions || submissions.length === 0) return;

    const headers = [
      "S.No",
      "Name",
      "Email",
      "Phone",
      "Participant Type",
      "Organization Name",
      "Organization Address",
      "Representative Name",
      "Waste Weight (kg)",
      "Waste Types",
      "Additional Notes",
      "Verification Status",
      "Verified By",
      "Submission Date",
      "Submission Time",
    ];

    const csvData = submissions.map((submission, index) => [
      index + 1,
      submission.name || "",
      submission.email || "",
      submission.phone || "",
      submission.participantType || "",
      submission.organizationName || "",
      submission.organizationAddress || "",
      submission.representativeName || "",
      submission.wasteWeight || "",
      submission.wasteTypes.map(type => wasteTypeLabels[type] || type).join("; ") || "",
      submission.additionalNotes || "",
      submission.verificationStatus || "",
      submission.verifiedBy || "",
      new Date(submission.submittedAt).toLocaleDateString(),
      new Date(submission.submittedAt).toLocaleTimeString(),
    ]);

    const csvContent = [headers, ...csvData]
        .map(row => row.map(field => `"${field}"`).join(","))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ewaste-submissions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const verifiedCount = submissions?.filter(s => s.verificationStatus === "verified").length || 0;
  const pendingCount = submissions?.filter(s => s.verificationStatus === "pending").length || 0;
  const rejectedCount = submissions?.filter(s => s.verificationStatus === "rejected").length || 0;
  const totalWeight = submissions?.filter(s => s.verificationStatus === "verified").reduce((sum, s) => sum + s.wasteWeight, 0) || 0;

  return (
      <div className="min-h-screen py-8 px-4 pt-32 bg-black">
        <div className="max-w-full mx-auto">
          {/* Header */}
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                E-waste Submissions
              </h1>
              <p className="text-gray-400">
                Total Submissions:{" "}
                <span className="text-green-400 font-semibold">
                {submissions?.length || 0}
              </span>
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                  onClick={() => setIsAddDonorOpen(true)}
                  className="bg-green-600 hover:bg-green-700 text-white"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Donor
              </Button>

              <Button
                  onClick={exportToCSV}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={!submissions || submissions.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>

              <Button
                  onClick={logout}
                  variant="outline"
                  className="border-green-500/30 text-green-400 hover:bg-green-900/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <Card className="bg-black border-green-500/30">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Recycle className="w-8 h-8 text-green-400" />
                  <div className="ml-4">
                    <p className="text-sm text-gray-400">Total Submissions</p>
                    <p className="text-2xl font-bold text-white">{submissions?.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black border-blue-500/30">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <CheckCircle className="w-8 h-8 text-blue-400" />
                  <div className="ml-4">
                    <p className="text-sm text-gray-400">Verified</p>
                    <p className="text-2xl font-bold text-white">{verifiedCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black border-yellow-500/30">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Shield className="w-8 h-8 text-yellow-400" />
                  <div className="ml-4">
                    <p className="text-sm text-gray-400">Pending</p>
                    <p className="text-2xl font-bold text-white">{pendingCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black border-red-500/30">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <XCircle className="w-8 h-8 text-red-400" />
                  <div className="ml-4">
                    <p className="text-sm text-gray-400">Rejected</p>
                    <p className="text-2xl font-bold text-white">{rejectedCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black border-purple-500/30">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8 text-purple-400" />
                  <div className="ml-4">
                    <p className="text-sm text-gray-400">Total Weight</p>
                    <p className="text-2xl font-bold text-white">{totalWeight.toFixed(1)}kg</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Submissions Table */}
          <Card className="bg-black border-green-500/30">
            <CardHeader>
              <CardTitle className="text-white">All E-waste Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">#</TableHead>
                      <TableHead className="text-gray-300">Name</TableHead>
                      <TableHead className="text-gray-300">Email</TableHead>
                      <TableHead className="text-gray-300">Phone</TableHead>
                      <TableHead className="text-gray-300">Type</TableHead>
                      <TableHead className="text-gray-300">Weight (kg)</TableHead>
                      <TableHead className="text-gray-300">Waste Types</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Date</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions?.map((submission, index) => (
                        <TableRow key={submission._id} className="border-gray-700 hover:bg-gray-900/50">
                          <TableCell className="text-gray-300">{index + 1}</TableCell>
                          <TableCell className="text-white font-medium">
                            {submission.name}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            <div className="max-w-[200px] truncate">
                              {submission.email}
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-300">{submission.phone}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-green-400 border-green-400">
                              {submission.participantType}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-white font-medium">
                            {submission.wasteWeight} kg
                          </TableCell>
                          <TableCell className="text-gray-300">
                            <div className="max-w-[150px] truncate">
                              {submission.wasteTypes.length} type(s)
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                                variant={
                                  submission.verificationStatus === "verified" ? "default" :
                                      submission.verificationStatus === "pending" ? "secondary" : "destructive"
                                }
                                className={
                                  submission.verificationStatus === "verified" ? "bg-green-600" :
                                      submission.verificationStatus === "pending" ? "bg-yellow-600" : "bg-red-600"
                                }
                            >
                              {submission.verificationStatus}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-300 text-sm">
                            {new Date(submission.submittedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                  onClick={() => handleViewDetails(submission)}
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              {submission.verificationStatus === "pending" && (
                                  <>
                                    <Button
                                        onClick={() => handleStatusUpdate(submission._id, "verified")}
                                        size="sm"
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        onClick={() => handleStatusUpdate(submission._id, "rejected")}
                                        size="sm"
                                        className="bg-red-600 hover:bg-red-700 text-white"
                                    >
                                      <XCircle className="w-4 h-4" />
                                    </Button>
                                  </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Empty State */}
          {submissions && submissions.length === 0 && (
              <div className="text-center py-12">
                <Recycle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No E-waste Submissions Yet</h3>
                <p className="text-gray-500">Submissions will appear here once users start submitting e-waste entries.</p>
              </div>
          )}

          {/* Add Donor Modal */}
          {isAddDonorOpen && (
              <div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                  onMouseDown={(event) => {
                    if (event.target === event.currentTarget) {
                      closeAddDonorModal();
                    }
                  }}
              >
                <Card className="w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-black border-green-500/40">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-2xl text-white">
                          Add Donor
                        </CardTitle>
                        <p className="mt-1 text-sm text-gray-400">
                          Add an individual or organization directly to Convex.
                        </p>
                      </div>

                      <Button
                          type="button"
                          variant="ghost"
                          onClick={closeAddDonorModal}
                          disabled={isAddingDonor}
                          className="text-gray-400 hover:text-white"
                      >
                        ✕
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <form onSubmit={handleAddDonor} className="space-y-6">
                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div>
                          <label
                              htmlFor="donor-name"
                              className="mb-2 block text-sm font-medium text-gray-300"
                          >
                            Name
                          </label>
                          <input
                              id="donor-name"
                              type="text"
                              value={donorForm.name}
                              onChange={(event) =>
                                  setDonorForm((current) => ({
                                    ...current,
                                    name: event.target.value,
                                  }))
                              }
                              placeholder="Donor or representative name"
                              className="w-full rounded-md border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none transition focus:border-green-500"
                              required
                          />
                        </div>

                        <div>
                          <label
                              htmlFor="donor-email"
                              className="mb-2 block text-sm font-medium text-gray-300"
                          >
                            Email
                          </label>
                          <input
                              id="donor-email"
                              type="email"
                              value={donorForm.email}
                              onChange={(event) =>
                                  setDonorForm((current) => ({
                                    ...current,
                                    email: event.target.value,
                                  }))
                              }
                              placeholder="donor@example.com"
                              className="w-full rounded-md border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none transition focus:border-green-500"
                              required
                          />
                        </div>

                        <div>
                          <label
                              htmlFor="donor-phone"
                              className="mb-2 block text-sm font-medium text-gray-300"
                          >
                            Phone
                          </label>
                          <input
                              id="donor-phone"
                              type="tel"
                              value={donorForm.phone}
                              onChange={(event) =>
                                  setDonorForm((current) => ({
                                    ...current,
                                    phone: event.target.value,
                                  }))
                              }
                              placeholder="Phone number"
                              className="w-full rounded-md border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none transition focus:border-green-500"
                              required
                          />
                        </div>

                        <div>
                          <label
                              htmlFor="participant-type"
                              className="mb-2 block text-sm font-medium text-gray-300"
                          >
                            Participant Type
                          </label>
                          <select
                              id="participant-type"
                              value={donorForm.participantType}
                              onChange={(event) =>
                                  setDonorForm((current) => ({
                                    ...current,
                                    participantType: event.target.value as
                                        | "individual"
                                        | "organization",
                                    organizationName:
                                        event.target.value === "organization"
                                            ? current.organizationName
                                            : "",
                                  }))
                              }
                              className="w-full rounded-md border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none transition focus:border-green-500"
                          >
                            <option value="individual">Individual</option>
                            <option value="organization">Organization</option>
                          </select>
                        </div>

                        {donorForm.participantType === "organization" && (
                            <div className="md:col-span-2">
                              <label
                                  htmlFor="organization-name"
                                  className="mb-2 block text-sm font-medium text-gray-300"
                              >
                                Organization Name
                              </label>
                              <input
                                  id="organization-name"
                                  type="text"
                                  value={donorForm.organizationName}
                                  onChange={(event) =>
                                      setDonorForm((current) => ({
                                        ...current,
                                        organizationName: event.target.value,
                                      }))
                                  }
                                  placeholder="College, school, office or organization"
                                  className="w-full rounded-md border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none transition focus:border-green-500"
                                  required
                              />
                            </div>
                        )}

                        <div>
                          <label
                              htmlFor="waste-weight"
                              className="mb-2 block text-sm font-medium text-gray-300"
                          >
                            Waste Weight (kg)
                          </label>
                          <input
                              id="waste-weight"
                              type="number"
                              min="0.01"
                              step="0.01"
                              value={donorForm.wasteWeight}
                              onChange={(event) =>
                                  setDonorForm((current) => ({
                                    ...current,
                                    wasteWeight: event.target.value,
                                  }))
                              }
                              placeholder="Example: 12.5"
                              className="w-full rounded-md border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none transition focus:border-green-500"
                              required
                          />
                        </div>

                        <div>
                          <label
                              htmlFor="submitted-at"
                              className="mb-2 block text-sm font-medium text-gray-300"
                          >
                            Submitted At
                          </label>
                          <input
                              id="submitted-at"
                              type="datetime-local"
                              value={donorForm.submittedAt}
                              onChange={(event) =>
                                  setDonorForm((current) => ({
                                    ...current,
                                    submittedAt: event.target.value,
                                  }))
                              }
                              className="w-full rounded-md border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none transition focus:border-green-500"
                              required
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label
                              htmlFor="verification-status"
                              className="mb-2 block text-sm font-medium text-gray-300"
                          >
                            Verification Status
                          </label>
                          <select
                              id="verification-status"
                              value={donorForm.verificationStatus}
                              onChange={(event) =>
                                  setDonorForm((current) => ({
                                    ...current,
                                    verificationStatus: event.target.value as
                                        | "pending"
                                        | "verified"
                                        | "rejected",
                                  }))
                              }
                              className="w-full rounded-md border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none transition focus:border-green-500"
                          >
                            <option value="verified">
                              Verified — appears on leaderboard
                            </option>
                            <option value="pending">
                              Pending — hidden until verified
                            </option>
                            <option value="rejected">
                              Rejected — hidden from leaderboard
                            </option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <p className="mb-3 text-sm font-medium text-gray-300">
                          Waste Types
                        </p>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {Object.entries(wasteTypeLabels).map(
                              ([type, label]) => {
                                const checked =
                                    donorForm.wasteTypes.includes(type);

                                return (
                                    <label
                                        key={type}
                                        className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
                                            checked
                                                ? "border-green-500 bg-green-500/10"
                                                : "border-gray-800 bg-gray-950 hover:border-gray-700"
                                        }`}
                                    >
                                      <input
                                          type="checkbox"
                                          checked={checked}
                                          onChange={() => toggleWasteType(type)}
                                          className="h-4 w-4 accent-green-600"
                                      />
                                      <span className="text-sm text-gray-200">
                                {label}
                              </span>
                                    </label>
                                );
                              }
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col-reverse gap-3 border-t border-gray-800 pt-5 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={closeAddDonorModal}
                            disabled={isAddingDonor}
                            className="border-gray-700 text-gray-300 hover:bg-gray-900"
                        >
                          Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={isAddingDonor}
                            className="bg-green-600 text-white hover:bg-green-700"
                        >
                          {isAddingDonor ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                              </>
                          ) : (
                              <>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Donor
                              </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
          )}

          {/* Detail Modal */}
          {selectedSubmission && (
              <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                <Card className="bg-black border-green-500/30 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl text-white">
                        E-waste Submission Details - {selectedSubmission.name}
                      </CardTitle>
                      <Button variant="ghost" onClick={handleCloseModal} className="text-gray-400">
                        ✕
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Personal Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-green-400 mb-3">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-400">Name</label>
                          <p className="text-white">{selectedSubmission.name}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">Email</label>
                          <p className="text-white break-all">{selectedSubmission.email}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">Phone</label>
                          <p className="text-white">{selectedSubmission.phone}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">Participant Type</label>
                          <p className="text-white capitalize">{selectedSubmission.participantType}</p>
                        </div>
                      </div>
                    </div>

                    {/* Organization Information */}
                    {selectedSubmission.participantType === "organization" && (
                        <div>
                          <h3 className="text-lg font-semibold text-green-400 mb-3">Organization Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm text-gray-400">Organization Name</label>
                              <p className="text-white">{selectedSubmission.organizationName}</p>
                            </div>
                            <div>
                              <label className="text-sm text-gray-400">Representative Name</label>
                              <p className="text-white">{selectedSubmission.representativeName}</p>
                            </div>
                            <div className="md:col-span-2">
                              <label className="text-sm text-gray-400">Organization Address</label>
                              <p className="text-white">{selectedSubmission.organizationAddress}</p>
                            </div>
                          </div>
                        </div>
                    )}

                    {/* E-waste Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-green-400 mb-3">E-waste Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-400">Total Weight</label>
                          <p className="text-white text-2xl font-bold">{selectedSubmission.wasteWeight} kg</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">Waste Types</label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {selectedSubmission.wasteTypes.map(type => (
                                <Badge key={type} variant="outline" className="text-green-400 border-green-400">
                                  {wasteTypeLabels[type] || type}
                                </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {selectedSubmission.additionalNotes && (
                          <div className="mt-4">
                            <label className="text-sm text-gray-400">Additional Notes</label>
                            <p className="text-white bg-gray-900 p-3 rounded">{selectedSubmission.additionalNotes}</p>
                          </div>
                      )}
                    </div>

                    {/* Verification Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-green-400 mb-3">Verification Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm text-gray-400">Status</label>
                          <Badge
                              variant={
                                selectedSubmission.verificationStatus === "verified" ? "default" :
                                    selectedSubmission.verificationStatus === "pending" ? "secondary" : "destructive"
                              }
                              className={
                                selectedSubmission.verificationStatus === "verified" ? "bg-green-600" :
                                    selectedSubmission.verificationStatus === "pending" ? "bg-yellow-600" : "bg-red-600"
                              }
                          >
                            {selectedSubmission.verificationStatus}
                          </Badge>
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">Verified By</label>
                          <p className="text-white">{selectedSubmission.verifiedBy || "Not yet verified"}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">Verified At</label>
                          <p className="text-white">
                            {selectedSubmission.verifiedAt
                                ? new Date(selectedSubmission.verifiedAt).toLocaleString()
                                : "Not yet verified"
                            }
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Submission Details */}
                    <div>
                      <h3 className="text-lg font-semibold text-green-400 mb-3">Submission Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-400">Submission Date</label>
                          <p className="text-white">{new Date(selectedSubmission.submittedAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">Submission Time</label>
                          <p className="text-white">{new Date(selectedSubmission.submittedAt).toLocaleTimeString()}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {selectedSubmission.verificationStatus === "pending" && (
                        <div className="flex gap-4 pt-4 border-t border-gray-700">
                          <Button
                              onClick={() => {
                                handleStatusUpdate(selectedSubmission._id, "verified");
                                handleCloseModal();
                              }}
                              className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Verify Submission
                          </Button>
                          <Button
                              onClick={() => {
                                handleStatusUpdate(selectedSubmission._id, "rejected");
                                handleCloseModal();
                              }}
                              className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject Submission
                          </Button>
                        </div>
                    )}
                  </CardContent>
                </Card>
              </div>
          )}
        </div>
      </div>
  );
};

export default EwasteAdmin;