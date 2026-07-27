"use client";

import { AdminLogin } from "@/components/admin-login";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import {
  Download,
  Eye,
  LogOut,
  Mail,
  MessageSquare,
  Phone,
  User
} from "lucide-react";
import { useState } from "react";

interface Contact {
  _id: string;
  _creationTime: number;
  name: string;
  email: string;
  phone: string;
  message: string;
}

const ContactList = () => {
  const { isAuthenticated, login, logout } = useAdminAuth();
  const contacts = useQuery(api.contact.listContacts);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onLogin={login} />;
  }

  if (contacts === undefined) {
    return (
      <div className="min-h-screen py-8 px-4 pt-32 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            <span className="ml-3 text-white">Loading contact submissions...</span>
          </div>
        </div>
      </div>
    );
  }

  const handleViewDetails = (contact: Contact) => {
    setSelectedContact(contact);
  };

  const handleCloseModal = () => {
    setSelectedContact(null);
  };

  const exportToCSV = () => {
    if (!contacts || contacts.length === 0) return;

    const headers = [
      "S.No",
      "Name",
      "Email",
      "Phone",
      "Message",
      "Submission Date",
      "Submission Time"
    ];

    const csvData = contacts.map((contact, index) => [
      index + 1,
      contact.name || "",
      contact.email || "",
      contact.phone || "",
      contact.message || "",
      new Date(contact._creationTime).toLocaleDateString(),
      new Date(contact._creationTime).toLocaleTimeString()
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dcc-contact-submissions-${new Date().toISOString().split('T')[0]}.csv`;
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
              Contact Submissions
            </h1>
            <p className="text-gray-400">
              Total Submissions: <span className="text-red-400 font-semibold">{contacts?.length || 0}</span>
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={exportToCSV}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={!contacts || contacts.length === 0}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-black border-blue-500/30">
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageSquare className="w-8 h-8 text-blue-400" />
                <div className="ml-4">
                  <p className="text-sm text-gray-400">Total Messages</p>
                  <p className="text-2xl font-bold text-white">{contacts?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Mail className="w-8 h-8 text-green-400" />
                <div className="ml-4">
                  <p className="text-sm text-gray-400">Unique Emails</p>
                  <p className="text-2xl font-bold text-white">
                    {new Set(contacts?.map(c => c.email)).size || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center">
                <User className="w-8 h-8 text-purple-400" />
                <div className="ml-4">
                  <p className="text-sm text-gray-400">Today</p>
                  <p className="text-2xl font-bold text-white">
                    {contacts?.filter(c =>
                      new Date(c._creationTime).toDateString() === new Date().toDateString()
                    ).length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contacts Table */}
        <Card className="bg-black border-red-500/30">
          <CardHeader>
            <CardTitle className="text-white">All Contact Submissions</CardTitle>
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
                    <TableHead className="text-gray-300">Message Preview</TableHead>
                    <TableHead className="text-gray-300">Date</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts?.map((contact, index) => (
                    <TableRow key={contact._id} className="border-gray-700 hover:bg-gray-900/50">
                      <TableCell className="text-gray-300">{index + 1}</TableCell>
                      <TableCell className="text-white font-medium">
                        {contact.name}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        <div className="max-w-[200px] truncate">
                          {contact.email}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">{contact.phone}</TableCell>
                      <TableCell className="text-gray-300">
                        <div className="max-w-[300px] truncate">
                          {contact.message}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300 text-sm">
                        {new Date(contact._creationTime).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleViewDetails(contact)}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Empty State */}
        {contacts && contacts.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No Contact Submissions Yet</h3>
            <p className="text-gray-500">Contact submissions will appear here once users start reaching out.</p>
          </div>
        )}

        {/* Detail Modal */}
        {selectedContact && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <Card className="bg-black border-red-500/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl text-white">
                    Contact Details - {selectedContact.name}
                  </CardTitle>
                  <Button variant="ghost" onClick={handleCloseModal} className="text-gray-400">
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-red-400 mb-3">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400">Name</label>
                      <p className="text-white">{selectedContact.name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Email</label>
                      <p className="text-white break-all">{selectedContact.email}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Phone</label>
                      <p className="text-white">{selectedContact.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Submission Date</label>
                      <p className="text-white">{new Date(selectedContact._creationTime).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <h3 className="text-lg font-semibold text-red-400 mb-3">Message</h3>
                  <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                    <p className="text-white whitespace-pre-wrap">{selectedContact.message}</p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h3 className="text-lg font-semibold text-red-400 mb-3">Quick Actions</h3>
                  <div className="flex gap-4">
                    <Button
                      onClick={() => window.open(`mailto:${selectedContact.email}`, '_blank')}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Reply via Email
                    </Button>
                    <Button
                      onClick={() => window.open(`tel:${selectedContact.phone}`, '_blank')}
                      variant="outline"
                      className="border-blue-500/30 text-blue-400 hover:bg-blue-900/10"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactList;
