"use client";

import { AdminLogin } from "@/components/admin-login";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import {
  Building2,
  Calendar,
  CheckCircle,
  Download,
  Edit,
  Eye,
  FileText,
  LogOut,
  Save,
  Trash2,
  User,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";

interface CLRegistration {
  _id: string;
  _creationTime: number;
  collegeName: string;
  collegeAddress: string;
  clName: string;
  clYear: string;
  clContact: string;
  clEmail: string;
  clFeeReceiptUrl: string;
  clGovtIdUrl: string;
  aclContact: string;
  aclEmail: string;
  aclFeeReceiptUrl: string;
  aclGovtIdUrl: string;
  attendingClMeet: boolean;
  submittedAt: number;
  verificationStatus: "pending" | "verified" | "rejected";
  verifiedBy?: string;
  verifiedAt?: number;
}

interface EditFormData {
  collegeName: string;
  collegeAddress: string;
  clName: string;
  clYear: string;
  clContact: string;
  clEmail: string;
  clFeeReceiptUrl: string;
  clGovtIdUrl: string;
  aclContact: string;
  aclEmail: string;
  aclFeeReceiptUrl: string;
  aclGovtIdUrl: string;
  attendingClMeet: boolean;
  verificationStatus: "pending" | "verified" | "rejected";
}

const CLAdmin = () => {
  const { isAuthenticated, login, logout } = useAdminAuth();
  const registrations = useQuery(api.clRegistrations.listCLRegistrations);
  const formSettings = useQuery(api.clRegistrations.getFormSettings);
  const updateCLRegistration = useMutation(
    api.clRegistrations.updateCLRegistration
  );
  const deleteCLRegistration = useMutation(
    api.clRegistrations.deleteCLRegistration
  );
  const toggleFormStatus = useMutation(api.clRegistrations.toggleFormStatus);
  const updateVerificationStatus = useMutation(
    api.clRegistrations.updateVerificationStatus
  );

  const [selectedRegistration, setSelectedRegistration] =
    useState<CLRegistration | null>(null);
  const [editingRegistration, setEditingRegistration] =
    useState<CLRegistration | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onLogin={login} />;
  }

  if (registrations === undefined || formSettings === undefined) {
    return (
      <div className="min-h-screen py-4 sm:py-8 px-3 sm:px-4 pt-20 sm:pt-24 md:pt-32 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-red-500"></div>
              <span className="text-sm sm:text-base text-white">
                Loading CL registrations...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleViewDetails = (registration: CLRegistration) => {
    setSelectedRegistration(registration);
  };

  const handleEditRegistration = (registration: CLRegistration) => {
    setEditingRegistration(registration);
    setEditFormData({
      collegeName: registration.collegeName,
      collegeAddress: registration.collegeAddress,
      clName: registration.clName,
      clYear: registration.clYear,
      clContact: registration.clContact,
      clEmail: registration.clEmail,
      clFeeReceiptUrl: registration.clFeeReceiptUrl,
      clGovtIdUrl: registration.clGovtIdUrl,
      aclContact: registration.aclContact,
      aclEmail: registration.aclEmail,
      aclFeeReceiptUrl: registration.aclFeeReceiptUrl,
      aclGovtIdUrl: registration.aclGovtIdUrl,
      attendingClMeet: registration.attendingClMeet,
      verificationStatus: registration.verificationStatus,
    });
  };

  const handleSaveEdit = async () => {
    if (!editingRegistration || !editFormData) return;

    setIsSubmitting(true);
    try {
      await updateCLRegistration({
        id: editingRegistration._id as Id<"clRegistrations">,
        ...editFormData,
      });
      setEditingRegistration(null);
      setEditFormData(null);
    } catch (error) {
      console.error("Error updating registration:", error);
      alert("Failed to update registration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRegistration = async (id: string) => {
    try {
      await deleteCLRegistration({ id: id as Id<"clRegistrations"> });
      setDeleteConfirmId(null);
    } catch (error) {
      console.error("Error deleting registration:", error);
      alert("Failed to delete registration. Please try again.");
    }
  };

  const handleToggleForm = async () => {
    try {
      await toggleFormStatus({
        isOpen: !(formSettings?.isOpen ?? true),
        updatedBy: "admin",
      });
    } catch (error) {
      console.error("Error toggling form status:", error);
      alert("Failed to toggle form status. Please try again.");
    }
  };

  const handleUpdateStatus = async (
    id: string,
    status: "pending" | "verified" | "rejected"
  ) => {
    try {
      await updateVerificationStatus({
        id: id as Id<"clRegistrations">,
        status,
        verifiedBy: "admin",
      });
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setSelectedRegistration(null);
  };

  const handleCancelEdit = () => {
    setEditingRegistration(null);
    setEditFormData(null);
  };

  const exportToCSV = () => {
    if (!registrations || registrations.length === 0) return;

    const headers = [
      "S.No",
      "College Name",
      "College Address",
      "CL Name",
      "CL Year",
      "CL Contact",
      "CL Email",
      "CL Fee Receipt URL",
      "CL Govt ID URL",
      "ACL Contact",
      "ACL Email",
      "ACL Fee Receipt URL",
      "ACL Govt ID URL",
      "Attending CL Meet",
      "Verification Status",
      "Verified By",
      "Verified At",
      "Registration Date",
      "Registration Time",
    ];

    const csvData = registrations.map((reg, index) => [
      index + 1,
      reg.collegeName || "",
      reg.collegeAddress || "",
      reg.clName || "",
      reg.clYear || "",
      reg.clContact || "",
      reg.clEmail || "",
      reg.clFeeReceiptUrl || "",
      reg.clGovtIdUrl || "",
      reg.aclContact || "",
      reg.aclEmail || "",
      reg.aclFeeReceiptUrl || "",
      reg.aclGovtIdUrl || "",
      reg.attendingClMeet ? "Yes" : "No",
      reg.verificationStatus || "",
      reg.verifiedBy || "",
      reg.verifiedAt ? new Date(reg.verifiedAt).toLocaleString() : "",
      new Date(reg.submittedAt).toLocaleDateString(),
      new Date(reg.submittedAt).toLocaleTimeString(),
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cl-registrations-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const isFormOpen = formSettings?.isOpen ?? true;

  return (
    <div className="min-h-screen py-4 sm:py-8 px-3 sm:px-4 pt-20 sm:pt-24 md:pt-32 bg-black">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
              CL Registrations
            </h1>
            <p className="text-sm sm:text-base text-gray-400">
              Total Registrations:{" "}
              <span className="text-red-400 font-semibold">
                {registrations?.length || 0}
              </span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-4 w-full sm:w-auto">
            <Button
              onClick={exportToCSV}
              className="bg-green-600 hover:bg-green-700 text-white flex-1 sm:flex-initial text-sm"
              disabled={!registrations || registrations.length === 0}
            >
              <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Export CSV
            </Button>
            <Button
              onClick={logout}
              variant="outline"
              className="border-red-500/30 text-red-400 hover:bg-red-900/10 flex-1 sm:flex-initial text-sm"
            >
              <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Form Status Toggle */}
        <Card className="bg-black border-purple-500/30 mb-6 sm:mb-8">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-1">
                  Registration Form Status
                </h3>
                <p className="text-xs sm:text-sm text-gray-400">
                  {isFormOpen
                    ? "Form is currently accepting registrations"
                    : "Form is currently closed"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs sm:text-sm font-medium ${
                    isFormOpen ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {isFormOpen ? "Open" : "Closed"}
                </span>
                <Switch
                  checked={isFormOpen}
                  onCheckedChange={handleToggleForm}
                  className="data-[state=checked]:bg-green-600"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-black border-red-500/30">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" />
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm text-gray-400">Total CLs</p>
                  <p className="text-xl sm:text-2xl font-bold text-white">
                    {registrations?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black border-green-500/30">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm text-gray-400">Verified</p>
                  <p className="text-xl sm:text-2xl font-bold text-white">
                    {registrations?.filter(
                      (r) => r.verificationStatus === "verified"
                    ).length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black border-yellow-500/30">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm text-gray-400">Pending</p>
                  <p className="text-xl sm:text-2xl font-bold text-white">
                    {registrations?.filter(
                      (r) => r.verificationStatus === "pending"
                    ).length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black border-blue-500/30">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm text-gray-400">
                    Attending Meet
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-white">
                    {registrations?.filter((r) => r.attendingClMeet).length ||
                      0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Registrations Table */}
        <Card className="bg-black border-red-500/30">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg md:text-xl text-white">
              All CL Registrations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-4 md:p-6">
            <div className="overflow-x-auto -mx-2 sm:mx-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300 text-xs sm:text-sm">
                      #
                    </TableHead>
                    <TableHead className="text-gray-300 text-xs sm:text-sm min-w-[150px]">
                      College
                    </TableHead>
                    <TableHead className="text-gray-300 text-xs sm:text-sm min-w-[120px]">
                      CL Name
                    </TableHead>
                    <TableHead className="text-gray-300 text-xs sm:text-sm">
                      Year
                    </TableHead>
                    <TableHead className="text-gray-300 text-xs sm:text-sm min-w-[100px]">
                      Contact
                    </TableHead>
                    <TableHead className="text-gray-300 text-xs sm:text-sm min-w-[150px]">
                      Email
                    </TableHead>
                    <TableHead className="text-gray-300 text-xs sm:text-sm">
                      CL Meet
                    </TableHead>
                    <TableHead className="text-gray-300 text-xs sm:text-sm min-w-[120px]">
                      Status
                    </TableHead>
                    <TableHead className="text-gray-300 text-xs sm:text-sm">
                      Date
                    </TableHead>
                    <TableHead className="text-gray-300 text-xs sm:text-sm min-w-[140px]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrations?.map((reg, index) => (
                    <TableRow
                      key={reg._id}
                      className="border-gray-700 hover:bg-gray-900/50"
                    >
                      <TableCell className="text-gray-300 text-xs sm:text-sm">
                        {index + 1}
                      </TableCell>
                      <TableCell className="text-white font-medium text-xs sm:text-sm">
                        <div className="max-w-[150px] sm:max-w-[200px] truncate">
                          {reg.collegeName}
                        </div>
                      </TableCell>
                      <TableCell className="text-white text-xs sm:text-sm">
                        {reg.clName}
                      </TableCell>
                      <TableCell className="text-gray-300 text-xs sm:text-sm">
                        {reg.clYear}
                      </TableCell>
                      <TableCell className="text-gray-300 text-xs sm:text-sm">
                        {reg.clContact}
                      </TableCell>
                      <TableCell className="text-gray-300 text-xs sm:text-sm">
                        <div className="max-w-[150px] sm:max-w-[180px] truncate">
                          {reg.clEmail}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            reg.attendingClMeet ? "default" : "secondary"
                          }
                          className={`text-xs ${
                            reg.attendingClMeet ? "bg-green-600" : "bg-gray-600"
                          }`}
                        >
                          {reg.attendingClMeet ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={reg.verificationStatus}
                          onValueChange={(value) =>
                            handleUpdateStatus(
                              reg._id,
                              value as "pending" | "verified" | "rejected"
                            )
                          }
                        >
                          <SelectTrigger className="w-[100px] sm:w-[120px] bg-gray-800 border-gray-600 text-xs sm:text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">
                              <Badge
                                variant="secondary"
                                className="bg-yellow-600 text-xs"
                              >
                                Pending
                              </Badge>
                            </SelectItem>
                            <SelectItem value="verified">
                              <Badge
                                variant="default"
                                className="bg-green-600 text-xs"
                              >
                                Verified
                              </Badge>
                            </SelectItem>
                            <SelectItem value="rejected">
                              <Badge
                                variant="destructive"
                                className="bg-red-600 text-xs"
                              >
                                Rejected
                              </Badge>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-gray-300 text-xs sm:text-sm">
                        <div className="whitespace-nowrap">
                          {new Date(reg.submittedAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 sm:gap-2">
                          <Button
                            onClick={() => handleViewDetails(reg)}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white p-2"
                          >
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                          <Button
                            onClick={() => handleEditRegistration(reg)}
                            size="sm"
                            className="bg-yellow-600 hover:bg-yellow-700 text-white p-2"
                          >
                            <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                          <Button
                            onClick={() => setDeleteConfirmId(reg._id)}
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 text-white p-2"
                          >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
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
        {registrations && registrations.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <Users className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-400 mb-2">
              No CL Registrations Yet
            </h3>
            <p className="text-sm sm:text-base text-gray-500 px-4">
              CL registrations will appear here once users start signing up.
            </p>
          </div>
        )}

        {/* Detail Modal */}
        {selectedRegistration && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-start sm:items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto pt-20 sm:pt-4">
            <Card className="bg-black border-red-500/30 max-w-4xl w-full my-4 sm:my-8 max-h-[calc(100vh-5rem)] sm:max-h-[90vh] overflow-hidden flex flex-col">
              <CardHeader className="sticky top-0 bg-black/95 backdrop-blur-sm z-10 border-b border-red-500/30 p-3 sm:p-6 flex-shrink-0">
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-base sm:text-lg md:text-xl text-white pr-2">
                    CL Registration Details - {selectedRegistration.clName}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-white hover:bg-red-900/20 flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 p-0 rounded-full"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6 p-3 sm:p-6 overflow-y-auto flex-1">
                {/* College Information */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-red-400 mb-2 sm:mb-3 flex items-center gap-2">
                    <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    College Information
                  </h3>
                  <div className="grid grid-cols-1 gap-3 sm:gap-4 bg-gray-900/50 p-3 sm:p-4 rounded-lg">
                    <div>
                      <label className="text-xs sm:text-sm text-gray-400">
                        College Name
                      </label>
                      <p className="text-sm sm:text-base text-white break-words">
                        {selectedRegistration.collegeName}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm text-gray-400">
                        College Address
                      </label>
                      <p className="text-sm sm:text-base text-white break-words">
                        {selectedRegistration.collegeAddress}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contingent Leader Information */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-red-400 mb-2 sm:mb-3 flex items-center gap-2">
                    <User className="w-4 h-4 sm:w-5 sm:h-5" />
                    Contingent Leader
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 bg-gray-900/50 p-3 sm:p-4 rounded-lg">
                    <div>
                      <label className="text-xs sm:text-sm text-gray-400">
                        Name
                      </label>
                      <p className="text-sm sm:text-base text-white break-words">
                        {selectedRegistration.clName}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm text-gray-400">
                        Year
                      </label>
                      <p className="text-sm sm:text-base text-white">
                        {selectedRegistration.clYear}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm text-gray-400">
                        Contact
                      </label>
                      <p className="text-sm sm:text-base text-white">
                        {selectedRegistration.clContact}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm text-gray-400">
                        Email
                      </label>
                      <p className="text-sm sm:text-base text-white break-all">
                        {selectedRegistration.clEmail}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Assistant Contingent Leader Information */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-red-400 mb-2 sm:mb-3 flex items-center gap-2">
                    <User className="w-4 h-4 sm:w-5 sm:h-5" />
                    Assistant Contingent Leader
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 bg-gray-900/50 p-3 sm:p-4 rounded-lg">
                    <div>
                      <label className="text-xs sm:text-sm text-gray-400">
                        Contact
                      </label>
                      <p className="text-sm sm:text-base text-white">
                        {selectedRegistration.aclContact}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm text-gray-400">
                        Email
                      </label>
                      <p className="text-sm sm:text-base text-white break-all">
                        {selectedRegistration.aclEmail}
                      </p>
                    </div>
                  </div>
                </div>

                {/* CL Meet Attendance */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-red-400 mb-2 sm:mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                    CL Meet Attendance
                  </h3>
                  <div className="bg-gray-900/50 p-3 sm:p-4 rounded-lg">
                    <Badge
                      variant={
                        selectedRegistration.attendingClMeet
                          ? "default"
                          : "secondary"
                      }
                      className={
                        selectedRegistration.attendingClMeet
                          ? "bg-green-600"
                          : "bg-gray-600"
                      }
                    >
                      {selectedRegistration.attendingClMeet
                        ? "Attending"
                        : "Not Attending"}
                    </Badge>
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-red-400 mb-2 sm:mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                    Documents
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {/* CL Documents */}
                    <div className="space-y-3 sm:space-y-4">
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-300">
                        Contingent Leader
                      </h4>
                      <div>
                        <label className="text-xs sm:text-sm text-gray-400">
                          Fee Receipt / College ID
                        </label>
                        <div className="mt-2">
                          <Image
                            src={selectedRegistration.clFeeReceiptUrl}
                            alt="CL Fee Receipt"
                            width={300}
                            height={300}
                            className="w-full h-auto rounded border border-gray-600 max-h-48 sm:max-h-64 object-contain bg-gray-800"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm text-gray-400">
                          Government ID
                        </label>
                        <div className="mt-2">
                          <Image
                            src={selectedRegistration.clGovtIdUrl}
                            alt="CL Government ID"
                            width={300}
                            height={300}
                            className="w-full h-auto rounded border border-gray-600 max-h-48 sm:max-h-64 object-contain bg-gray-800"
                          />
                        </div>
                      </div>
                    </div>

                    {/* ACL Documents */}
                    <div className="space-y-3 sm:space-y-4">
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-300">
                        Assistant Contingent Leader
                      </h4>
                      <div>
                        <label className="text-xs sm:text-sm text-gray-400">
                          Fee Receipt / College ID
                        </label>
                        <div className="mt-2">
                          <Image
                            src={selectedRegistration.aclFeeReceiptUrl}
                            alt="ACL Fee Receipt"
                            width={300}
                            height={300}
                            className="w-full h-auto rounded border border-gray-600 max-h-48 sm:max-h-64 object-contain bg-gray-800"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm text-gray-400">
                          Government ID
                        </label>
                        <div className="mt-2">
                          <Image
                            src={selectedRegistration.aclGovtIdUrl}
                            alt="ACL Government ID"
                            width={300}
                            height={300}
                            className="w-full h-auto rounded border border-gray-600 max-h-48 sm:max-h-64 object-contain bg-gray-800"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Registration Details */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-red-400 mb-2 sm:mb-3">
                    Registration Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 bg-gray-900/50 p-3 sm:p-4 rounded-lg">
                    <div>
                      <label className="text-xs sm:text-sm text-gray-400">
                        Submitted On
                      </label>
                      <p className="text-sm sm:text-base text-white">
                        {new Date(
                          selectedRegistration.submittedAt
                        ).toLocaleDateString()}{" "}
                        at{" "}
                        {new Date(
                          selectedRegistration.submittedAt
                        ).toLocaleTimeString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm text-gray-400">
                        Verification Status
                      </label>
                      <div className="mt-1">
                        <Badge
                          variant={
                            selectedRegistration.verificationStatus ===
                            "verified"
                              ? "default"
                              : selectedRegistration.verificationStatus ===
                                "rejected"
                              ? "destructive"
                              : "secondary"
                          }
                          className={
                            selectedRegistration.verificationStatus ===
                            "verified"
                              ? "bg-green-600"
                              : selectedRegistration.verificationStatus ===
                                "rejected"
                              ? "bg-red-600"
                              : "bg-yellow-600"
                          }
                        >
                          {selectedRegistration.verificationStatus}
                        </Badge>
                      </div>
                    </div>
                    {selectedRegistration.verifiedBy && (
                      <>
                        <div>
                          <label className="text-xs sm:text-sm text-gray-400">
                            Verified By
                          </label>
                          <p className="text-sm sm:text-base text-white break-words">
                            {selectedRegistration.verifiedBy}
                          </p>
                        </div>
                        <div>
                          <label className="text-xs sm:text-sm text-gray-400">
                            Verified At
                          </label>
                          <p className="text-sm sm:text-base text-white">
                            {selectedRegistration.verifiedAt
                              ? new Date(
                                  selectedRegistration.verifiedAt
                                ).toLocaleString()
                              : "N/A"}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Edit Modal */}
        {editingRegistration && editFormData && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-start sm:items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto pt-20 sm:pt-4">
            <Card className="bg-black border-yellow-500/30 max-w-4xl w-full my-4 sm:my-8 max-h-[calc(100vh-5rem)] sm:max-h-[90vh] overflow-hidden flex flex-col">
              <CardHeader className="sticky top-0 bg-black/95 backdrop-blur-sm z-10 border-b border-yellow-500/30 p-3 sm:p-6 flex-shrink-0">
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-base sm:text-lg md:text-xl text-white pr-2">
                    Edit CL Registration - {editingRegistration.clName}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    onClick={handleCancelEdit}
                    className="text-gray-400 hover:text-white hover:bg-yellow-900/20 flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 p-0 rounded-full"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6 p-3 sm:p-6 overflow-y-auto flex-1">
                {/* College Information */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-yellow-400 mb-2 sm:mb-3">
                    College Information
                  </h3>
                  <div className="grid grid-cols-1 gap-3 sm:gap-4">
                    <div>
                      <Label className="text-xs sm:text-sm text-gray-300">
                        College Name
                      </Label>
                      <Input
                        value={editFormData.collegeName}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            collegeName: e.target.value,
                          })
                        }
                        className="bg-gray-800 border-gray-600 text-white text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <Label className="text-xs sm:text-sm text-gray-300">
                        College Address
                      </Label>
                      <Textarea
                        value={editFormData.collegeAddress}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            collegeAddress: e.target.value,
                          })
                        }
                        className="bg-gray-800 border-gray-600 text-white min-h-[80px] text-sm sm:text-base"
                      />
                    </div>
                  </div>
                </div>

                {/* Contingent Leader Information */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-yellow-400 mb-2 sm:mb-3">
                    Contingent Leader
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label className="text-xs sm:text-sm text-gray-300">
                        Name
                      </Label>
                      <Input
                        value={editFormData.clName}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            clName: e.target.value,
                          })
                        }
                        className="bg-gray-800 border-gray-600 text-white text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <Label className="text-xs sm:text-sm text-gray-300">
                        Year
                      </Label>
                      <Select
                        value={editFormData.clYear}
                        onValueChange={(value) =>
                          setEditFormData({ ...editFormData, clYear: value })
                        }
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white text-sm sm:text-base">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FY">FY</SelectItem>
                          <SelectItem value="SY">SY</SelectItem>
                          <SelectItem value="TY">TY</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="sm:col-span-2">
                      <Label className="text-xs sm:text-sm text-gray-300">
                        Contact
                      </Label>
                      <Input
                        value={editFormData.clContact}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            clContact: e.target.value,
                          })
                        }
                        className="bg-gray-800 border-gray-600 text-white text-sm sm:text-base"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label className="text-xs sm:text-sm text-gray-300">
                        Email
                      </Label>
                      <Input
                        type="email"
                        value={editFormData.clEmail}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            clEmail: e.target.value,
                          })
                        }
                        className="bg-gray-800 border-gray-600 text-white text-sm sm:text-base"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label className="text-xs sm:text-sm text-gray-300">
                        Fee Receipt URL
                      </Label>
                      <Input
                        value={editFormData.clFeeReceiptUrl}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            clFeeReceiptUrl: e.target.value,
                          })
                        }
                        className="bg-gray-800 border-gray-600 text-white text-sm sm:text-base"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label className="text-xs sm:text-sm text-gray-300">
                        Govt ID URL
                      </Label>
                      <Input
                        value={editFormData.clGovtIdUrl}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            clGovtIdUrl: e.target.value,
                          })
                        }
                        className="bg-gray-800 border-gray-600 text-white text-sm sm:text-base"
                      />
                    </div>
                  </div>
                </div>

                {/* Assistant Contingent Leader Information */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-yellow-400 mb-2 sm:mb-3">
                    Assistant Contingent Leader
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="sm:col-span-2">
                      <Label className="text-xs sm:text-sm text-gray-300">
                        Contact
                      </Label>
                      <Input
                        value={editFormData.aclContact}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            aclContact: e.target.value,
                          })
                        }
                        className="bg-gray-800 border-gray-600 text-white text-sm sm:text-base"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label className="text-xs sm:text-sm text-gray-300">
                        Email
                      </Label>
                      <Input
                        type="email"
                        value={editFormData.aclEmail}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            aclEmail: e.target.value,
                          })
                        }
                        className="bg-gray-800 border-gray-600 text-white text-sm sm:text-base"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label className="text-xs sm:text-sm text-gray-300">
                        Fee Receipt URL
                      </Label>
                      <Input
                        value={editFormData.aclFeeReceiptUrl}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            aclFeeReceiptUrl: e.target.value,
                          })
                        }
                        className="bg-gray-800 border-gray-600 text-white text-sm sm:text-base"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label className="text-xs sm:text-sm text-gray-300">
                        Govt ID URL
                      </Label>
                      <Input
                        value={editFormData.aclGovtIdUrl}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            aclGovtIdUrl: e.target.value,
                          })
                        }
                        className="bg-gray-800 border-gray-600 text-white text-sm sm:text-base"
                      />
                    </div>
                  </div>
                </div>

                {/* CL Meet & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label className="text-xs sm:text-sm text-gray-300">
                      Attending CL Meet
                    </Label>
                    <Select
                      value={editFormData.attendingClMeet ? "yes" : "no"}
                      onValueChange={(value) =>
                        setEditFormData({
                          ...editFormData,
                          attendingClMeet: value === "yes",
                        })
                      }
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white text-sm sm:text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm text-gray-300">
                      Verification Status
                    </Label>
                    <Select
                      value={editFormData.verificationStatus}
                      onValueChange={(value) =>
                        setEditFormData({
                          ...editFormData,
                          verificationStatus: value as
                            | "pending"
                            | "verified"
                            | "rejected",
                        })
                      }
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white text-sm sm:text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="verified">Verified</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                  <Button
                    onClick={handleSaveEdit}
                    className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto text-sm sm:text-base"
                    disabled={isSubmitting}
                  >
                    <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800 w-full sm:w-auto text-sm sm:text-base"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-3 sm:p-4 z-50">
            <Card className="bg-black border-red-500/30 max-w-md w-full">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl text-white">
                  Confirm Delete
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6">
                  Are you sure you want to delete this CL registration? This
                  action cannot be undone.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button
                    onClick={() => handleDeleteRegistration(deleteConfirmId)}
                    className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto text-sm sm:text-base"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Delete
                  </Button>
                  <Button
                    onClick={() => setDeleteConfirmId(null)}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800 w-full sm:w-auto text-sm sm:text-base"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CLAdmin;