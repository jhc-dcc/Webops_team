
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { satoshi, zentry } from "@/fonts/font";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { Building, Plus, Recycle, TrendingUp, Trophy, Users } from "lucide-react";
import Link from "next/link";

export default function EwastePage() {
  const topFive = useQuery(api.ewaste.getTopFive);
  const stats = useQuery(api.ewaste.getEwasteStats);

  if (topFive === undefined || stats === undefined) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Trophy className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Trophy className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold">{rank}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mx-auto w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6">
            <Recycle className="w-10 h-10 text-primary" />
          </div>
          <h1 className={cn("text-4xl md:text-6xl font-bold text-foreground mb-4", zentry.className)}>
            E-WASTE <span className="text-primary">DRIVE</span> 2025
          </h1>
          <p className={cn("text-xl text-muted-foreground max-w-3xl mx-auto", satoshi.className)}>
            Join the movement to create a sustainable future. Track the impact of our collective effort.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total E-waste</p>
                  <p className="text-3xl font-bold text-foreground">
                    {stats.totalWeight.toFixed(1)} <span className="text-lg">kg</span>
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/20 to-green-500/5 border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Participants</p>
                  <p className="text-3xl font-bold text-foreground">{stats.totalParticipants}</p>
                </div>
                <Users className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border-blue-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Individuals</p>
                  <p className="text-3xl font-bold text-foreground">{stats.individualCount}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Organizations</p>
                  <p className="text-3xl font-bold text-foreground">{stats.organizationCount}</p>
                </div>
                <Building className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Environmental Impact Section */}
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-green-500/20 mb-12">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
              <Recycle className="w-6 h-6 text-green-500" />
              Our Environmental Impact
            </CardTitle>
            <p className="text-muted-foreground">Collective impact of our e-waste collection drive</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-background/50 rounded-lg border border-green-500/20">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🌱</span>
                </div>
                <p className="text-2xl font-bold text-foreground mb-1">
                  {(stats.totalWeight * 1.5).toFixed(1)} kg
                </p>
                <p className="text-sm text-muted-foreground">CO₂e Saved</p>
                <p className="text-xs text-muted-foreground mt-1">~1.5 kg per kg of e-waste</p>
              </div>

              <div className="text-center p-6 bg-background/50 rounded-lg border border-green-500/20">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">⚡</span>
                </div>
                <p className="text-2xl font-bold text-foreground mb-1">
                  {(stats.totalWeight * 80).toFixed(0)} kWh
                </p>
                <p className="text-sm text-muted-foreground">Energy Saved</p>
                <p className="text-xs text-muted-foreground mt-1">~80 kWh per kg of e-waste</p>
              </div>

              <div className="text-center p-6 bg-background/50 rounded-lg border border-green-500/20">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">💧</span>
                </div>
                <p className="text-2xl font-bold text-foreground mb-1">
                  {(stats.totalWeight * 10000).toLocaleString('en-IN')} L
                </p>
                <p className="text-sm text-muted-foreground">Water Protected</p>
                <p className="text-xs text-muted-foreground mt-1">~10,000 L per kg of e-waste</p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                * These are approximate conversions based on industry standards. Actual impact may vary depending on the type of e-waste and recycling methods used.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/ewaste/submit">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="w-5 h-5 mr-2" />
              Submit E-waste Entry
            </Button>
          </Link>
          <Link href="/ewaste/leaderboard">
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
              <Trophy className="w-5 h-5 mr-2" />
              View Full Leaderboard
            </Button>
          </Link>
        </div>

        {/* Top 5 Leaderboards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Individual Leaderboard */}
          <Card className="bg-card border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
                <Users className="w-6 h-6 text-primary" />
                Top Individuals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topFive.individuals.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No individual submissions yet</p>
                </div>
              ) : (
                topFive.individuals.map((individual) => (
                  <div
                    key={individual.rank}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-lg transition-colors",
                      individual.rank === 1
                        ? "bg-gradient-to-r from-yellow-500/20 to-yellow-500/10 border border-yellow-500/30"
                        : individual.rank === 2
                          ? "bg-gradient-to-r from-gray-400/20 to-gray-400/10 border border-gray-400/30"
                          : individual.rank === 3
                            ? "bg-gradient-to-r from-amber-600/20 to-amber-600/10 border border-amber-600/30"
                            : "bg-muted/50 hover:bg-muted"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {getRankIcon(individual.rank)}
                      <div>
                        <p className="font-semibold text-foreground">{individual.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Submitted on {formatDate(individual.submittedAt)}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-primary/20 text-primary">
                      {individual.wasteWeight} kg
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Organization Leaderboard */}
          <Card className="bg-card border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
                <Building className="w-6 h-6 text-primary" />
                Top Organizations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topFive.organizations.length === 0 ? (
                <div className="text-center py-8">
                  <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No organization submissions yet</p>
                </div>
              ) : (
                topFive.organizations.map((org) => (
                  <div
                    key={org.rank}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-lg transition-colors",
                      org.rank === 1
                        ? "bg-gradient-to-r from-yellow-500/20 to-yellow-500/10 border border-yellow-500/30"
                        : org.rank === 2
                          ? "bg-gradient-to-r from-gray-400/20 to-gray-400/10 border border-gray-400/30"
                          : org.rank === 3
                            ? "bg-gradient-to-r from-amber-600/20 to-amber-600/10 border border-amber-600/30"
                            : "bg-muted/50 hover:bg-muted"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {getRankIcon(org.rank)}
                      <div>
                        <p className="font-semibold text-foreground">{org.organizationName}</p>
                        <p className="text-sm text-muted-foreground">
                          Rep: {org.representativeName}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-primary/20 text-primary">
                      {org.totalWeight} kg
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <Recycle className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-4">Make a Difference Today</h2>
              <p className="text-muted-foreground mb-6">
                Every kilogram of e-waste you contribute helps build a more sustainable future.
                Join the movement and see your impact on the leaderboard!
              </p>
              <Link href="/ewaste/submit">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <Plus className="w-5 h-5 mr-2" />
                  Submit Your E-waste
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}