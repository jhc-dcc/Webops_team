
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { api } from "@/convex/_generated/api";
import { satoshi, zentry } from "@/fonts/font";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import {
  ArrowLeft,
  Award,
  Building,
  Calendar,
  Crown,
  Medal,
  Recycle,
  TrendingUp,
  Trophy,
  Users
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface IndividualLeaderboardEntry {
  rank: number;
  name: string;
  wasteWeight: number;
  wasteTypes: string[];
  submittedAt: number;
}

interface OrganizationLeaderboardEntry {
  rank: number;
  organizationName: string;
  representativeName: string;
  totalWeight: number;
  entries: number;
  lastSubmission: number;
}

export default function EwasteLeaderboardPage() {
  const [activeTab, setActiveTab] = useState("individuals");

  const individuals = useQuery(api.ewaste.getIndividualLeaderboard, {});
  const organizations = useQuery(api.ewaste.getOrganizationLeaderboard, {});
  const stats = useQuery(api.ewaste.getEwasteStats, {});

  if (individuals === undefined || organizations === undefined || stats === undefined) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading full leaderboard...</p>
        </div>
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return (
          <div className="w-6 h-6 flex items-center justify-center text-sm font-bold text-muted-foreground">
            {rank}
          </div>
        );
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-500/20 to-yellow-500/10 border border-yellow-500/30 text-yellow-700";
      case 2:
        return "bg-gradient-to-r from-gray-400/20 to-gray-400/10 border border-gray-400/30 text-gray-700";
      case 3:
        return "bg-gradient-to-r from-amber-600/20 to-amber-600/10 border border-amber-600/30 text-amber-700";
      default:
        return "bg-muted/50 border border-border text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background py-4 sm:py-8 px-3 sm:px-4 mt-5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2 sm:gap-4 mb-6 sm:mb-8">
          <Link href="/ewaste">
            <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10 text-xs sm:text-sm">
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Back to</span> Overview
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8 sm:mb-12">
          <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-primary/20 rounded-full flex items-center justify-center mb-4 sm:mb-6">
            <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
          </div>
          <h1 className={cn("text-2xl sm:text-4xl md:text-6xl font-bold text-foreground mb-3 sm:mb-4 px-2", zentry.className)}>
            FULL <span className="text-primary">LEADERBOARD</span>
          </h1>
          <p className={cn("text-sm sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4", satoshi.className)}>
            Complete rankings for all participants in the E-waste Drive 2025
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20">
            <CardContent className="p-4 sm:p-6 text-center">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-2" />
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1">
                {stats.totalWeight.toFixed(1)} kg
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">Total E-waste Collected</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border-blue-500/20">
            <CardContent className="p-4 sm:p-6 text-center">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1">{stats.individualCount}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Individual Participants</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 border-purple-500/20 sm:col-span-2 lg:col-span-1">
            <CardContent className="p-4 sm:p-6 text-center">
              <Building className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500 mx-auto mb-2" />
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1">{stats.organizationCount}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Organizations</p>
            </CardContent>
          </Card>
        </div>

        {/* Environmental Impact Section */}
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-green-500/20 mb-8 sm:mb-12">
          <CardHeader className="text-center p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-foreground flex items-center justify-center gap-2 flex-wrap">
              <Recycle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
              Environmental Impact
            </CardTitle>
            <p className="text-sm sm:text-base text-muted-foreground px-2">Collective impact of our e-waste collection drive</p>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="text-center p-4 sm:p-6 bg-background/50 rounded-lg border border-green-500/20">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg sm:text-2xl">🌱</span>
                </div>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-1">
                  {(stats.totalWeight * 1.5).toFixed(1)} kg
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">CO₂e Saved</p>
                <p className="text-xs text-muted-foreground mt-1">~1.5 kg per kg of e-waste</p>
              </div>

              <div className="text-center p-4 sm:p-6 bg-background/50 rounded-lg border border-green-500/20">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg sm:text-2xl">⚡</span>
                </div>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-1">
                  {(stats.totalWeight * 80).toFixed(0)} kWh
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">Energy Saved</p>
                <p className="text-xs text-muted-foreground mt-1">~80 kWh per kg of e-waste</p>
              </div>

              <div className="text-center p-4 sm:p-6 bg-background/50 rounded-lg border border-green-500/20 sm:col-span-2 lg:col-span-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg sm:text-2xl">💧</span>
                </div>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-1">
                  {(stats.totalWeight * 10000).toLocaleString('en-IN')} L
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">Water Protected</p>
                <p className="text-xs text-muted-foreground mt-1">~10,000 L per kg of e-waste</p>
              </div>
            </div>
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                * These are approximate conversions based on industry standards. Actual impact may vary depending on the type of e-waste and recycling methods used.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="mb-6 sm:mb-8">
            <SegmentedControl
              options={[
                {
                  value: "individuals",
                  label: "Individuals",
                  count: stats.individualCount,
                  icon: <Users className="w-4 h-4" />,
                },
                {
                  value: "organizations",
                  label: "Organizations",
                  count: stats.organizationCount,
                  icon: <Building className="w-4 h-4" />,
                },
              ]}
              value={activeTab}
              onChange={setActiveTab}
              layoutId="leaderboard-segmented-pill"
              className="bg-muted border-border p-1"
              activeBgClass="bg-primary shadow-sm"
              activeTextColorClass="text-primary-foreground font-bold"
              inactiveTextColorClass="text-muted-foreground hover:text-foreground"
            />
          </div>

          {/* Individual Leaderboard */}
          <TabsContent value="individuals">
            <Card className="bg-card border-primary/20">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  Individual Participants Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {individuals.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <Users className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg sm:text-xl text-muted-foreground mb-2">No individual submissions yet</p>
                    <p className="text-sm sm:text-base text-muted-foreground">Be the first to submit your e-waste!</p>
                    <Link href="/ewaste/submit" className="mt-4 inline-block">
                      <Button className="bg-primary hover:bg-primary/90 text-sm sm:text-base">
                        Submit E-waste Entry
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {individuals.map((individual: IndividualLeaderboardEntry) => (
                      <div
                        key={individual.rank}
                        className={cn(
                          "flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 rounded-lg transition-all hover:scale-[1.02] gap-3 sm:gap-4",
                          getRankBadge(individual.rank)
                        )}
                      >
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                          <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-background/50 flex-shrink-0">
                            {getRankIcon(individual.rank)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-base sm:text-lg text-foreground truncate">{individual.name}</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                              Submitted on {formatDate(individual.submittedAt)}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {individual.wasteTypes.map((type: string) => (
                                <Badge key={type} variant="outline" className="text-xs">
                                  {type}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-center sm:text-right flex-shrink-0">
                          <div className="text-xl sm:text-2xl font-bold text-foreground">
                            {individual.wasteWeight} <span className="text-sm">kg</span>
                          </div>
                          <Badge
                            variant="secondary"
                            className={cn(
                              "mt-1",
                              individual.rank <= 3 ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                            )}
                          >
                            #{individual.rank}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Organization Leaderboard */}
          <TabsContent value="organizations">
            <Card className="bg-card border-primary/20">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
                  <Building className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  Organization Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {organizations.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <Building className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg sm:text-xl text-muted-foreground mb-2">No organization submissions yet</p>
                    <p className="text-sm sm:text-base text-muted-foreground">Register your organization today!</p>
                    <Link href="/ewaste/submit" className="mt-4 inline-block">
                      <Button className="bg-primary hover:bg-primary/90 text-sm sm:text-base">
                        Submit E-waste Entry
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {organizations.map((org: OrganizationLeaderboardEntry) => (
                      <div
                        key={org.rank}
                        className={cn(
                          "flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 rounded-lg transition-all hover:scale-[1.02] gap-3 sm:gap-4",
                          getRankBadge(org.rank)
                        )}
                      >
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                          <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-background/50 flex-shrink-0">
                            {getRankIcon(org.rank)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-base sm:text-lg text-foreground truncate">{org.organizationName}</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              Representative: {org.representativeName}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                              <Calendar className="w-3 h-3" />
                              Last submission: {formatDate(org.lastSubmission)}
                            </p>
                          </div>
                        </div>
                        <div className="text-center sm:text-right flex-shrink-0">
                          <div className="text-xl sm:text-2xl font-bold text-foreground">
                            {org.totalWeight} <span className="text-sm">kg</span>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground">{org.entries} submission(s)</p>
                          <Badge
                            variant="secondary"
                            className={cn(
                              "mt-1",
                              org.rank <= 3 ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                            )}
                          >
                            #{org.rank}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <div className="mt-12 sm:mt-16 text-center">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 max-w-2xl mx-auto">
            <CardContent className="p-6 sm:p-8">
              <Recycle className="w-10 h-10 sm:w-12 sm:h-12 text-primary mx-auto mb-3 sm:mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">Join the Leaderboard</h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 px-2">
                Don&apos;t see your name here? Submit your e-waste contribution and
                help us reach our sustainability goals!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Link href="/ewaste/submit" className="w-full sm:w-auto">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                    Submit E-waste Entry
                  </Button>
                </Link>
                <Link href="/ewaste" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 w-full sm:w-auto">
                    Back to Overview
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
