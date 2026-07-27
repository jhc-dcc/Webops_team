"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from '@/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { BarChart3, Eye, EyeOff, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const teamOptions = [
  "Hackathon",
  "Contingent",
  "Events",
  "ESports",
  "Marketing",
  "PR (Public Relations)",
  "WebOps",
  "Media and Graphics",
  "Photography",
  "Decor",
  "Editorial",
  "Security and Logistics"
];

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isPollDialogOpen, setIsPollDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Convex hooks
  const createPollMutation = useMutation(api.polls.createPoll);
  const currentPoll = useQuery(api.polls.getActivePoll);
  const pollResults = useQuery(
    api.polls.getPollResults,
    currentPoll ? { pollId: currentPoll._id } : "skip"
  );

  // Check if user is already authenticated (persist login)
  useEffect(() => {
    const auth = localStorage.getItem("admin_authenticated");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (username === "admin" && password === "bhadra") {
      setIsAuthenticated(true);
      localStorage.setItem("admin_authenticated", "true");
      toast.success("Welcome to Admin Panel! 🎉");
    } else {
      setLoginError("Invalid credentials. Please try again.");
      toast.error("Invalid credentials!");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("admin_authenticated");
    setUsername("");
    setPassword("");
    toast.success("Logged out successfully");
  };

  const broadcastPoll = async () => {
    setIsLoading(true);

    try {
      // Create the poll using Convex - this will automatically broadcast to all connected clients
      await createPollMutation({
        question: 'Which team are you interested in?',
        options: teamOptions,
      });

      setIsPollDialogOpen(false);
      toast.success("Poll successfully broadcasted to all users! 🚀", {
        description: "Users will see the poll notification on their screens",
        duration: 4000,
      });

    } catch (error) {
      toast.error("Failed to broadcast poll. Please try again.");
      console.error("Error creating poll:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen gradient-ember-fade flex items-center justify-center p-4">
        <Card className="w-full max-w-sm sm:max-w-md bg-card/50 border-border backdrop-blur-sm">
          <CardHeader className="space-y-1 px-4 sm:px-6">
            <CardTitle className="text-xl sm:text-2xl font-bold text-center text-foreground">
              Admin Panel
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground text-sm sm:text-base">
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-foreground text-sm sm:text-base">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-muted border-border text-foreground placeholder:text-muted-foreground text-sm sm:text-base"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground text-sm sm:text-base">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-muted border-border text-foreground placeholder:text-muted-foreground pr-10 text-sm sm:text-base"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-3 h-3 sm:h-4 sm:w-4" /> : <Eye className="h-3 w-3 sm:h-4 sm:w-4" />}
                  </Button>
                </div>
              </div>
              {loginError && (
                <div className="text-destructive text-xs sm:text-sm text-center">
                  {loginError}
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm sm:text-base py-2 sm:py-3"
              >
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-volcanic-flow p-2 sm:p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Manage polls and broadcasts</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-destructive text-destructive hover:text-destructive-foreground hover:bg-destructive w-full sm:w-auto"
          >
            Logout
          </Button>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-card/50 border-border backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Poll Responses
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-foreground">
                {pollResults?.totalResponses || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Total responses received
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Poll Status
              </CardTitle>
              <Send className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-foreground">
                {currentPoll?.isActive ? "Active" : "Inactive"}
              </div>
              <p className="text-xs text-muted-foreground">
                Current poll status
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {/* Broadcast Poll Section */}
          <Card className="bg-card/50 border-border backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-foreground text-lg sm:text-xl">Broadcast Team Poll</CardTitle>
              <CardDescription className="text-muted-foreground text-sm sm:text-base">
                Send a poll to all users currently on the website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Dialog open={isPollDialogOpen} onOpenChange={setIsPollDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground text-sm sm:text-base py-2 sm:py-3"
                    size="lg"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Broadcast Team Poll
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border text-card-foreground w-[95vw] max-w-md mx-auto">
                  <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl">Confirm Poll Broadcast</DialogTitle>
                    <DialogDescription className="text-muted-foreground text-sm sm:text-base">
                      This will send a poll to all users currently on the website asking which team they&apos;re interested in.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="bg-muted p-3 sm:p-4 rounded-lg">
                      <h4 className="font-semibold mb-2 text-sm sm:text-base">Poll Question:</h4>
                      <p className="text-muted-foreground text-sm sm:text-base">&quot;Which team are you interested in?&quot;</p>
                    </div>
                    <div className="bg-muted p-3 sm:p-4 rounded-lg">
                      <h4 className="font-semibold mb-2 text-sm sm:text-base">Options:</h4>
                      <div className="grid grid-cols-1 gap-1 text-xs sm:text-sm text-muted-foreground max-h-32 overflow-y-auto">
                        {teamOptions.map((team) => (
                          <div key={team}>• {team}</div>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        onClick={() => setIsPollDialogOpen(false)}
                        variant="outline"
                        className="w-full sm:flex-1 border-border text-muted-foreground hover:text-foreground hover:bg-muted text-sm"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={broadcastPoll}
                        disabled={isLoading}
                        className="w-full sm:flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-sm"
                      >
                        {isLoading ? "Broadcasting..." : "Broadcast Poll"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Poll Results Section */}
          <Card className="bg-card/50 border-border backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-foreground text-lg sm:text-xl">Live Poll Results</CardTitle>
              <CardDescription className="text-muted-foreground text-sm sm:text-base">
                Real-time responses from users
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!pollResults?.results ? (
                <div className="text-center text-muted-foreground py-6 sm:py-8 text-sm sm:text-base">
                  No active poll. Broadcast a poll to see results here.
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3 max-h-64 sm:max-h-80 overflow-y-auto">
                  {teamOptions.map((team) => {
                    const count = pollResults.results[team] || 0;
                    const total = pollResults.totalResponses || 0;
                    const percentage = total > 0 ? (count / total) * 100 : 0;

                    return (
                      <div key={team} className="space-y-1">
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-muted-foreground truncate pr-2">{team}</span>
                          <span className="text-foreground font-semibold flex-shrink-0">{count}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5 sm:h-2">
                          <div
                            className="bg-gradient-to-r from-primary to-secondary h-1.5 sm:h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
