"use client";

import { AdminLogin } from "@/components/admin-login";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import {
  Calendar,
  CreditCard,
  Database,
  FileText,
  GraduationCap,
  LogOut,
  Mail,
  MessageSquare,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const { isAuthenticated, login, logout } = useAdminAuth();
  const members = useQuery(api.registration.listMembers);
  const contacts = useQuery(api.contact.listContacts);
  const router = useRouter();

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onLogin={login} />;
  }

  return (
    <div className="min-h-screen py-8 px-4 pt-32 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-400">Welcome to DCC Administration Panel</p>
          </div>
          <Button
            onClick={logout}
            variant="outline"
            className="border-red-500/30 text-red-400 hover:bg-red-900/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-black border-red-500/30">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-red-400" />
                <div className="ml-4">
                  <p className="text-sm text-gray-400">Total Members</p>
                  <p className="text-2xl font-bold text-white">
                    {members?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black border-blue-500/30">
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageSquare className="w-8 h-8 text-blue-400" />
                <div className="ml-4">
                  <p className="text-sm text-gray-400">Contact Messages</p>
                  <p className="text-2xl font-bold text-white">
                    {contacts?.length || 0}
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
                    {new Set(members?.map((m) => m.department)).size || 0}
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
                    {members?.filter(
                      (m) =>
                        new Date(m._creationTime).toDateString() ===
                        new Date().toDateString()
                    ).length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-black border-red-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Database className="w-5 h-5 mr-2 text-red-400" />
                Registration Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">
                View, manage, and export all DCC member registrations.
              </p>
              <Button
                onClick={() => router.push("/admin/regi")}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                <FileText className="w-4 h-4 mr-2" />
                View All Registrations
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <GraduationCap className="w-5 h-5 mr-2 text-purple-400" />
                CL Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">
                Manage Contingent Leader registrations and verification.
              </p>
              <Button
                onClick={() => router.push("/admin/cl")}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Users className="w-4 h-4 mr-2" />
                View CL Registrations
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Mail className="w-5 h-5 mr-2 text-blue-400" />
                Contact Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">
                View and manage contact form submissions from visitors.
              </p>
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-300">
                  <span className="text-blue-400 font-medium">
                    {contacts?.length || 0} total messages
                  </span>
                </p>
                <p className="text-sm text-gray-300">
                  <span className="text-green-400 font-medium">
                    {contacts?.filter(
                      (c) =>
                        new Date(c._creationTime).toDateString() ===
                        new Date().toDateString()
                    ).length || 0}{" "}
                    today
                  </span>
                </p>
              </div>
              <Button
                onClick={() => router.push("/admin/contact")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                View All Messages
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black border-green-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-green-400" />
                Payment Verification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">
                Review and verify payment screenshots from members.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-300">
                  <span className="text-green-400 font-medium">
                    {members?.filter((m) => m.paymentScreenshotUrl).length || 0}{" "}
                    verified
                  </span>
                </p>
                <p className="text-sm text-gray-300">
                  <span className="text-yellow-400 font-medium">
                    {members?.filter((m) => !m.paymentScreenshotUrl).length ||
                      0}{" "}
                    pending
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Registrations */}
        <Card className="bg-black border-red-500/30 mt-8">
          <CardHeader>
            <CardTitle className="text-white">Recent Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            {members && members.length > 0 ? (
              <div className="space-y-3">
                {members.slice(0, 5).map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center justify-between p-3 bg-gray-900/50 rounded"
                  >
                    <div>
                      <p className="text-white font-medium">
                        {member.fullName}
                      </p>
                      <p className="text-gray-400 text-sm">{member.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-300 text-sm">
                        {new Date(member._creationTime).toLocaleDateString()}
                      </p>
                      <p className="text-red-400 text-sm">{member.team}</p>
                    </div>
                  </div>
                ))}
                {members.length > 5 && (
                  <Button
                    onClick={() => router.push("/admin/regi")}
                    variant="outline"
                    className="w-full border-red-500/30 text-red-400 hover:bg-red-900/10"
                  >
                    View All {members.length} Registrations
                  </Button>
                )}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">
                No registrations yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
