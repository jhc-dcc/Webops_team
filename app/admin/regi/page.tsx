"use client";

import { AdminLogin } from "@/components/admin-login";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import {
  Calendar,
  CreditCard,
  Download,
  Edit,
  Eye,
  GraduationCap,
  Image as LucideImage,
  LogOut,
  Save,
  Trash2,
  Users,
  X
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";

interface Member {
  _id: string;
  _creationTime: number;
  fullName: string;
  email: string;
  uid: string;
  contactNo: string;
  department: string;
  departmentOther?: string;
  year: string;
  team: string;
  tshirtSize: string;
  tshirtSizeOther?: string;
  paymentScreenshotUrl?: string;
  hearAboutDCC: string;
  hearAboutDCCOther?: string;
  imageUrl?: string;
}

interface EditFormData {
  fullName: string;
  email: string;
  uid: string;
  contactNo: string;
  department: string;
  departmentOther?: string;
  year: string;
  team: string;
  tshirtSize: string;
  tshirtSizeOther?: string;
  hearAboutDCC: string;
  hearAboutDCCOther?: string;
  imageUrl?: string;
  paymentScreenshotUrl?: string;
}

const RegiList = () => {
  const { isAuthenticated, login, logout } = useAdminAuth();
  const members = useQuery(api.registration.listMembers);
  const updateMember = useMutation(api.registration.updateMember);
  const deleteMember = useMutation(api.registration.deleteMember);
  
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onLogin={login} />;
  }

  if (members === undefined) {
    return (
      <div className="min-h-screen py-8 px-4 pt-32 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            <span className="ml-3 text-white">Loading registrations...</span>
          </div>
        </div>
      </div>
    );
  }

  const handleViewDetails = (member: Member) => {
    setSelectedMember(member);
  };

  const handleEditMember = (member: Member) => {
    setEditingMember(member);
    setEditFormData({
      fullName: member.fullName,
      email: member.email,
      uid: member.uid,
      contactNo: member.contactNo,
      department: member.department,
      departmentOther: member.departmentOther,
      year: member.year,
      team: member.team,
      tshirtSize: member.tshirtSize,
      tshirtSizeOther: member.tshirtSizeOther,
      hearAboutDCC: member.hearAboutDCC,
      hearAboutDCCOther: member.hearAboutDCCOther,
      imageUrl: member.imageUrl,
      paymentScreenshotUrl: member.paymentScreenshotUrl,
    });
  };

  const handleSaveEdit = async () => {
    if (!editingMember || !editFormData) return;

    setIsSubmitting(true);
    try {
      await updateMember({
        id: editingMember._id as Id<"registeration">,
        ...editFormData
      });
      setEditingMember(null);
      setEditFormData(null);
    } catch (error) {
      console.error("Error updating member:", error);
      alert("Failed to update member. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMember = async (id: string) => {
    try {
      await deleteMember({ id: id as Id<"registeration"> });
      setDeleteConfirmId(null);
    } catch (error) {
      console.error("Error deleting member:", error);
      alert("Failed to delete member. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setSelectedMember(null);
  };

  const handleCancelEdit = () => {
    setEditingMember(null);
    setEditFormData(null);
  };

  const exportToCSV = () => {
    if (!members || members.length === 0) return;

    const headers = [
      "S.No",
      "Full Name",
      "Email",
      "UID",
      "Contact No",
      "Department",
      "Department Other",
      "Year",
      "Team",
      "T-Shirt Size",
      "T-Shirt Size Other",
      "How heard about DCC",
      "How heard about DCC Other",
      "Image URL",
      "Payment Screenshot URL",
      "Registration Date",
      "Registration Time"
    ];

    const csvData = members.map((member, index) => [
      index + 1,
      member.fullName || "",
      member.email || "",
      member.uid || "",
      member.contactNo || "",
      member.department || "",
      member.departmentOther || "",
      member.year || "",
      member.team || "",
      member.tshirtSize || "",
      member.tshirtSizeOther || "",
      member.hearAboutDCC || "",
      member.hearAboutDCCOther || "",
      member.imageUrl || "",
      member.paymentScreenshotUrl || "",
      new Date(member._creationTime).toLocaleDateString(),
      new Date(member._creationTime).toLocaleTimeString()
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dcc-registrations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen py-8 px-4 pt-32 bg-black">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              DCC Registrations
            </h1>
            <p className="text-gray-400">
              Total Registrations: <span className="text-red-400 font-semibold">{members?.length || 0}</span>
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={exportToCSV}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={!members || members.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button
              onClick={logout}
              variant="outline"
              className="border-red-500/30 text-red-400 hover:bg-red-900/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-black border-red-500/30">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-red-400" />
                <div className="ml-4">
                  <p className="text-sm text-gray-400">Total Members</p>
                  <p className="text-2xl font-bold text-white">{members?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black border-blue-500/30">
            <CardContent className="p-6">
              <div className="flex items-center">
                <CreditCard className="w-8 h-8 text-blue-400" />
                <div className="ml-4">
                  <p className="text-sm text-gray-400">With Payment</p>
                  <p className="text-2xl font-bold text-white">
                    {members?.filter(m => m.paymentScreenshotUrl).length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center">
                <GraduationCap className="w-8 h-8 text-green-400" />
                <div className="ml-4">
                  <p className="text-sm text-gray-400">Departments</p>
                  <p className="text-2xl font-bold text-white">
                    {new Set(members?.map(m => m.department)).size || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-purple-400" />
                <div className="ml-4">
                  <p className="text-sm text-gray-400">Today</p>
                  <p className="text-2xl font-bold text-white">
                    {members?.filter(m =>
                      new Date(m._creationTime).toDateString() === new Date().toDateString()
                    ).length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Members Table */}
        <Card className="bg-black border-red-500/30">
          <CardHeader>
            <CardTitle className="text-white">All Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">#</TableHead>
                    <TableHead className="text-gray-300">Name</TableHead>
                    <TableHead className="text-gray-300">Email</TableHead>
                    <TableHead className="text-gray-300">UID</TableHead>
                    <TableHead className="text-gray-300">Contact</TableHead>
                    <TableHead className="text-gray-300">Department</TableHead>
                    <TableHead className="text-gray-300">Year</TableHead>
                    <TableHead className="text-gray-300">Team</TableHead>
                    <TableHead className="text-gray-300">T-Shirt</TableHead>
                    <TableHead className="text-gray-300">Payment</TableHead>
                    <TableHead className="text-gray-300">Date</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members?.map((member, index) => (
                    <TableRow key={member._id} className="border-gray-700 hover:bg-gray-900/50">
                      <TableCell className="text-gray-300">{index + 1}</TableCell>
                      <TableCell className="text-white font-medium">
                        {member.fullName}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        <div className="max-w-[200px] truncate">
                          {member.email}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">{member.uid}</TableCell>
                      <TableCell className="text-gray-300">{member.contactNo}</TableCell>
                      <TableCell className="text-gray-300">
                        <div className="max-w-[120px] truncate">
                          {member.departmentOther || member.department}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">{member.year}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-red-400 border-red-400">
                          {member.team}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {member.tshirtSizeOther || member.tshirtSize}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={member.paymentScreenshotUrl ? "default" : "secondary"}
                            className={member.paymentScreenshotUrl ? "bg-green-600" : "bg-yellow-600"}
                          >
                            {member.paymentScreenshotUrl ? "Paid" : "Pending"}
                          </Badge>
                          {member.paymentScreenshotUrl && (
                            <LucideImage className="w-4 h-4 text-green-400"  />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300 text-sm">
                        {new Date(member._creationTime).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleViewDetails(member)}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleEditMember(member)}
                            size="sm"
                            className="bg-yellow-600 hover:bg-yellow-700 text-white"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => setDeleteConfirmId(member._id)}
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            <Trash2 className="w-4 h-4" />
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
        {members && members.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No Registrations Yet</h3>
            <p className="text-gray-500">Registrations will appear here once users start signing up.</p>
          </div>
        )}

        {/* Detail Modal */}
        {selectedMember && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <Card className="bg-black border-red-500/30 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl text-white">
                    Registration Details - {selectedMember.fullName}
                  </CardTitle>
                  <Button variant="ghost" onClick={handleCloseModal} className="text-gray-400">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-red-400 mb-3">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400">Full Name</label>
                      <p className="text-white">{selectedMember.fullName}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Email</label>
                      <p className="text-white break-all">{selectedMember.email}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">UID</label>
                      <p className="text-white">{selectedMember.uid}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Contact Number</label>
                      <p className="text-white">{selectedMember.contactNo}</p>
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-red-400 mb-3">Academic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400">Department</label>
                      <p className="text-white">{selectedMember.department}</p>
                      {selectedMember.departmentOther && (
                        <p className="text-gray-300 text-sm">Other: {selectedMember.departmentOther}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Year</label>
                      <p className="text-white">{selectedMember.year}</p>
                    </div>
                  </div>
                </div>

                {/* DCC Information */}
                <div>
                  <h3 className="text-lg font-semibold text-red-400 mb-3">DCC Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400">Team</label>
                      <p className="text-white">{selectedMember.team}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">T-Shirt Size</label>
                      <p className="text-white">{selectedMember.tshirtSize}</p>
                      {selectedMember.tshirtSizeOther && (
                        <p className="text-gray-300 text-sm">Other: {selectedMember.tshirtSizeOther}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="text-sm text-gray-400">How did you hear about DCC?</label>
                    <p className="text-white">{selectedMember.hearAboutDCC}</p>
                    {selectedMember.hearAboutDCCOther && (
                      <p className="text-gray-300 text-sm">Other: {selectedMember.hearAboutDCCOther}</p>
                    )}
                  </div>
                </div>

                {/* Registration Details */}
                <div>
                  <h3 className="text-lg font-semibold text-red-400 mb-3">Registration Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400">Registration Date</label>
                      <p className="text-white">{new Date(selectedMember._creationTime).toLocaleDateString()}</p>     
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Registration Time</label>
                      <p className="text-white">{new Date(selectedMember._creationTime).toLocaleTimeString()}</p>     
                    </div>
                  </div>
                </div>

                {/* Images */}
                <div>
                  <h3 className="text-lg font-semibold text-red-400 mb-3">Images</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedMember.imageUrl && (
                      <div>
                        <label className="text-sm text-gray-400">Profile Image</label>
                        <div className="mt-2">
                          <Image
                            src={selectedMember.imageUrl}
                            alt="Profile"
                            width={300}
                            height={300}
                            className="max-w-full h-auto rounded border border-gray-600 max-h-64 object-cover"        
                          />
                        </div>
                      </div>
                    )}

                    {selectedMember.paymentScreenshotUrl && (
                      <div>
                        <label className="text-sm text-gray-400">Payment Screenshot</label>
                        <div className="mt-2">
                          <Image
                            src={selectedMember.paymentScreenshotUrl}
                            alt="Payment Screenshot"
                            width={300}
                            height={300}
                            className="max-w-full h-auto rounded border border-gray-600 max-h-64 object-cover"        
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {!selectedMember.imageUrl && !selectedMember.paymentScreenshotUrl && (
                    <p className="text-gray-400 text-sm">No images uploaded</p>
                  )}
                </div>

                {/* URLs for Reference */}
                <div>
                  <h3 className="text-lg font-semibold text-red-400 mb-3">File URLs</h3>
                  <div className="space-y-3">
                    {selectedMember.imageUrl && (
                      <div>
                        <label className="text-sm text-gray-400">Profile Image URL</label>
                        <p className="text-white text-xs break-all bg-gray-900 p-2 rounded">
                          {selectedMember.imageUrl}
                        </p>
                      </div>
                    )}

                    {selectedMember.paymentScreenshotUrl && (
                      <div>
                        <label className="text-sm text-gray-400">Payment Screenshot URL</label>
                        <p className="text-white text-xs break-all bg-gray-900 p-2 rounded">
                          {selectedMember.paymentScreenshotUrl}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Edit Modal */}
        {editingMember && editFormData && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <Card className="bg-black border-yellow-500/30 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl text-white">
                    Edit Registration - {editingMember.fullName}
                  </CardTitle>
                  <Button variant="ghost" onClick={handleCancelEdit} className="text-gray-400">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-yellow-400 mb-3">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300">Full Name</Label>
                      <Input
                        value={editFormData.fullName}
                        onChange={(e) => setEditFormData({...editFormData, fullName: e.target.value})}
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Email</Label>
                      <Input
                        type="email"
                        value={editFormData.email}
                        onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">UID</Label>
                      <Input
                        value={editFormData.uid}
                        onChange={(e) => setEditFormData({...editFormData, uid: e.target.value})}
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Contact Number</Label>
                      <Input
                        value={editFormData.contactNo}
                        onChange={(e) => setEditFormData({...editFormData, contactNo: e.target.value})}
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-yellow-400 mb-3">Academic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300">Department</Label>
                      <Select
                        value={editFormData.department}
                        onValueChange={(value) => setEditFormData({...editFormData, department: value})}
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BSC IT">BSC IT</SelectItem>
                          <SelectItem value="BVOC SD">BVOC SD</SelectItem>
                          <SelectItem value="BVOC TT">BVOC TT</SelectItem>
                          <SelectItem value="BCOM">BCOM</SelectItem>
                          <SelectItem value="BBA">BBA</SelectItem>
                          <SelectItem value="BSC">BSC</SelectItem>
                          <SelectItem value="BIOTECH">BIOTECH</SelectItem>
                          <SelectItem value="BMS">BMS</SelectItem>
                          <SelectItem value="BMM">BMM</SelectItem>
                          <SelectItem value="BFM">BFM</SelectItem>
                          <SelectItem value="BAF">BAF</SelectItem>
                          <SelectItem value="BBI">BBI</SelectItem>
                          <SelectItem value="BA">BA</SelectItem>
                          <SelectItem value="BDS">BDS</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {editFormData.department === "Other" && (
                      <div>
                        <Label className="text-gray-300">Department (Other)</Label>
                        <Input
                          value={editFormData.departmentOther || ""}
                          onChange={(e) => setEditFormData({...editFormData, departmentOther: e.target.value})}
                          className="bg-gray-800 border-gray-600 text-white"
                        />
                      </div>
                    )}
                    <div>
                      <Label className="text-gray-300">Year</Label>
                      <Select
                        value={editFormData.year}
                        onValueChange={(value) => setEditFormData({...editFormData, year: value})}
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FY">FY</SelectItem>
                          <SelectItem value="SY">SY</SelectItem>
                          <SelectItem value="TY">TY</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* DCC Information */}
                <div>
                  <h3 className="text-lg font-semibold text-yellow-400 mb-3">DCC Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300">Team</Label>
                      <Select
                        value={editFormData.team}
                        onValueChange={(value) => setEditFormData({...editFormData, team: value})}
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Hackathon">Hackathon</SelectItem>
                          <SelectItem value="Contingent">Contingent</SelectItem>
                          <SelectItem value="Events">Events</SelectItem>
                          <SelectItem value="ESports">ESports</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="PR (Public Relations)">PR (Public Relations)</SelectItem>
                          <SelectItem value="WebOps">WebOps</SelectItem>
                          <SelectItem value="Media and Graphics">Media and Graphics</SelectItem>
                          <SelectItem value="Photography">Photography</SelectItem>
                          <SelectItem value="Decor">Decor</SelectItem>
                          <SelectItem value="Editorial">Editorial</SelectItem>
                          <SelectItem value="Security and Logistics">Security and Logistics</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-300">T-Shirt Size</Label>
                      <Select
                        value={editFormData.tshirtSize}
                        onValueChange={(value) => setEditFormData({...editFormData, tshirtSize: value})}
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="XS - 34">XS - 34</SelectItem>
                          <SelectItem value="S - 36">S - 36</SelectItem>
                          <SelectItem value="M - 38">M - 38</SelectItem>
                          <SelectItem value="L - 40">L - 40</SelectItem>
                          <SelectItem value="XL - 42">XL - 42</SelectItem>
                          <SelectItem value="XXL - 44">XXL - 44</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {editFormData.tshirtSize === "Other" && (
                      <div>
                        <Label className="text-gray-300">T-Shirt Size (Other)</Label>
                        <Input
                          value={editFormData.tshirtSizeOther || ""}
                          onChange={(e) => setEditFormData({...editFormData, tshirtSizeOther: e.target.value})}
                          className="bg-gray-800 border-gray-600 text-white"
                        />
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <Label className="text-gray-300">How did you hear about DCC?</Label>
                    <Select
                      value={editFormData.hearAboutDCC}
                      onValueChange={(value) => setEditFormData({...editFormData, hearAboutDCC: value})}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Social Media">Social Media</SelectItem>
                        <SelectItem value="On Campus">On Campus</SelectItem>
                        <SelectItem value="Via Email">Via Email</SelectItem>
                        <SelectItem value="Friends">Friends</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {editFormData.hearAboutDCC === "Other" && (
                      <div className="mt-2">
                        <Input
                          placeholder="Please specify..."
                          value={editFormData.hearAboutDCCOther || ""}
                          onChange={(e) => setEditFormData({...editFormData, hearAboutDCCOther: e.target.value})}
                          className="bg-gray-800 border-gray-600 text-white"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* File URLs */}
                <div>
                  <h3 className="text-lg font-semibold text-yellow-400 mb-3">File URLs</h3>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-300">Profile Image URL</Label>
                      <Input
                        value={editFormData.imageUrl || ""}
                        onChange={(e) => setEditFormData({...editFormData, imageUrl: e.target.value})}
                        className="bg-gray-800 border-gray-600 text-white"
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Payment Screenshot URL</Label>
                      <Input
                        value={editFormData.paymentScreenshotUrl || ""}
                        onChange={(e) => setEditFormData({...editFormData, paymentScreenshotUrl: e.target.value})}
                        className="bg-gray-800 border-gray-600 text-white"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={handleSaveEdit}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    disabled={isSubmitting}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
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
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <Card className="bg-black border-red-500/30 max-w-md w-full">
              <CardHeader>
                <CardTitle className="text-xl text-white">Confirm Delete</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-6">
                  Are you sure you want to delete this registration? This action cannot be undone.
                </p>
                <div className="flex gap-4">
                  <Button
                    onClick={() => handleDeleteMember(deleteConfirmId)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                  <Button
                    onClick={() => setDeleteConfirmId(null)}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
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

export default RegiList;