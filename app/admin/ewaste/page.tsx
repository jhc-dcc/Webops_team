
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
  LogOut,
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
  const [selectedSubmission, setSelectedSubmission] = useState<EwasteSubmission | null>(null);

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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              E-waste Submissions
            </h1>
            <p className="text-gray-400">
              Total Submissions: <span className="text-green-400 font-semibold">{submissions?.length || 0}</span>
            </p>
          </div>
          <div className="flex gap-4">
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