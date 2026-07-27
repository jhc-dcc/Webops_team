"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Users, Vote } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import Image from 'next/image';
import { api } from '@/convex/_generated/api';

interface Poll {
  _id: string;
  question: string;
  options: string[];
  isActive: boolean;
  broadcastAt?: number;
}

interface PollContextType {
  currentPoll: Poll | null;
  isSubmitting: boolean;
}

const PollContext = createContext<PollContextType | undefined>(undefined);

export const usePoll = () => {
  const context = useContext(PollContext);
  if (!context) {
    throw new Error('usePoll must be used within a PollProvider');
  }
  return context;
};

export const PollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showPollDialog, setShowPollDialog] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSeenPollId, setLastSeenPollId] = useState<string | null>(null);

  // Get the current active poll using Convex
  const currentPoll = useQuery(api.polls.getActivePoll);
  
  // Mutation to submit poll response
  const submitPollResponseMutation = useMutation(api.polls.submitPollResponse);
  
  // Mutation to expire old polls
  const expireOldPollsMutation = useMutation(api.polls.expireOldPolls);

  // Generate a simple user identifier (in production, use proper session/user management)
  const getUserIdentifier = () => {
    let identifier = localStorage.getItem('user_poll_id');
    if (!identifier) {
      identifier = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('user_poll_id', identifier);
    }
    return identifier;
  };

  // Periodically clean up expired polls
  useEffect(() => {
    const cleanupInterval = setInterval(async () => {
      try {
        await expireOldPollsMutation();
      } catch (error) {
        console.log('Error cleaning up expired polls:', error);
      }
    }, 60000); // Check every minute

    return () => clearInterval(cleanupInterval);
  }, [expireOldPollsMutation]);

  // Show poll when a new one becomes active (only when freshly broadcasted)
  useEffect(() => {
    if (currentPoll && currentPoll.isActive && currentPoll.broadcastAt) {
      const pollId = currentPoll._id;
      
      // Check if this is a new poll we haven't seen
      if (pollId !== lastSeenPollId) {
        // Check if this poll was just broadcasted (within last 30 seconds)
        const now = Date.now();
        const timeSinceBroadcast = now - currentPoll.broadcastAt;
        const thirtySecondsInMs = 30 * 1000;
        
        // Only show polls that were recently broadcasted
        const isRecentlyBroadcast = timeSinceBroadcast < thirtySecondsInMs;
        
        if (isRecentlyBroadcast) {
          setLastSeenPollId(pollId);
          setShowPollDialog(true);
          setHasVoted(false);
          setSelectedOption('');

          // Show enhanced toast notification
          toast.success("🎯 DCC Team Poll is Live!", {
            description: "Help us understand which team interests you most",
            duration: 8000,
            action: {
              label: "🗳️ Vote Now",
              onClick: () => setShowPollDialog(true),
            },
            className: "border-l-4 border-l-red-500 bg-gradient-to-r from-red-50 to-white",
          });
        } else {
          // This is an existing poll that wasn't recently broadcasted, just update the seen ID
          setLastSeenPollId(pollId);
        }
      }
    }
  }, [currentPoll, lastSeenPollId]);

  const handleSubmitVote = async () => {
    if (!currentPoll || !selectedOption) return;
    
    setIsSubmitting(true);
    
    try {
      await submitPollResponseMutation({
        pollId: currentPoll._id,
        response: selectedOption,
        userIdentifier: getUserIdentifier(),
      });

      setHasVoted(true);
      toast.success("🎉 Vote Submitted Successfully!", {
        description: `Your vote for "${selectedOption}" has been recorded. Thank you for participating in DCC!`,
        duration: 4000,
        className: "border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-white",
      });

      // Close dialog after 2 seconds
      setTimeout(() => {
        setShowPollDialog(false);
      }, 2000);

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to submit vote. Please try again.";
      
      if (errorMessage.includes("already voted")) {
        toast.info("📊 You've Already Voted!", {
          description: "Thanks for your participation in DCC! You can only vote once per poll.",
          duration: 3000,
          className: "border-l-4 border-l-red-500 bg-gradient-to-r from-red-50 to-white",
        });
        setHasVoted(true);
        setTimeout(() => {
          setShowPollDialog(false);
        }, 1000);
      } else {
        toast.error("❌ Vote Submission Failed", {
          description: errorMessage,
          duration: 4000,
          className: "border-l-4 border-l-red-500 bg-gradient-to-r from-red-50 to-white",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PollContext.Provider value={{ currentPoll: currentPoll || null, isSubmitting }}>
      {children}
      
      {/* Enhanced Poll Dialog - Red & White Theme - Mobile Friendly */}
      <Dialog open={showPollDialog} onOpenChange={setShowPollDialog}>
        <DialogContent className="bg-gradient-to-br from-white to-red-50 dark:from-gray-900 dark:to-red-900/20 w-[95vw] max-w-lg max-h-[85vh] overflow-y-auto border-0 shadow-2xl mx-auto">
          <DialogHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mb-3 sm:mb-4 shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-white/20 rounded-full"></div>
              <Image 
                src="/images/dcc-logo.png" 
                alt="DCC Logo" 
                width={40}
                height={40}
                className="object-contain relative z-10 sm:w-12 sm:h-12"
              />
            </div>
            <DialogTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent leading-tight">
              DCC Team Interest Poll
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300 text-sm sm:text-base mt-2 px-2">
              {currentPoll?.question}
            </DialogDescription>
          </DialogHeader>
          
          {currentPoll && !hasVoted && (
            <div className="space-y-4 sm:space-y-6 px-1">
              <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-3 sm:p-4 rounded-xl border border-red-200 dark:border-red-700">
                <div className="flex items-center gap-2 sm:gap-3 text-red-700 dark:text-red-300">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                  <span className="font-medium text-sm sm:text-base">Select the team you&apos;re most interested in joining</span>
                </div>
              </div>
              
              <div className="space-y-2 sm:space-y-3">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 sm:mb-3 text-center text-sm sm:text-base">Available Teams:</h4>
                <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
                  <div className="max-h-48 sm:max-h-64 overflow-y-auto space-y-2 pr-1 sm:pr-2">
                    {currentPoll.options.map((option: string, index: number) => (
                      <div key={option} className="group">
                        <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 cursor-pointer">
                          <RadioGroupItem 
                            value={option} 
                            id={option}
                            className="border-2 border-gray-300 data-[state=checked]:border-red-500 data-[state=checked]:bg-red-500 flex-shrink-0"
                          />
                          <Label 
                            htmlFor={option}
                            className="text-xs sm:text-sm font-medium cursor-pointer flex-1 text-gray-700 dark:text-gray-300 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors"
                          >
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-red-400 to-red-600 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0">
                                {index + 1}
                              </div>
                              <span className="leading-tight">{option}</span>
                            </div>
                          </Label>
                        </div>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowPollDialog(false)}
                  className="w-full sm:flex-1 border-gray-300 hover:border-red-400 hover:bg-red-50 dark:border-gray-600 dark:hover:border-red-500 dark:hover:bg-red-900/20 hover:text-red-700 text-sm py-2"
                >
                  Maybe Later
                </Button>
                <Button
                  onClick={handleSubmitVote}
                  disabled={!selectedOption || isSubmitting}
                  className="w-full sm:flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm py-2"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Vote className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Submit Vote</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          )}

          {hasVoted && (
            <div className="text-center py-4 sm:py-8 px-2">
              <div className="relative mx-auto mb-4 sm:mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <Image 
                    src="/images/dcc-logo.png" 
                    alt="DCC Logo" 
                    width={32}
                    height={32}
                    className="object-contain sm:w-12 sm:h-12"
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full"></div>
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-red-700 dark:text-red-300 mb-2 sm:mb-3 leading-tight">
                Vote Submitted Successfully! 🎉
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">
                Thank you for participating in our DCC team interest poll.
              </p>
              <div className="bg-red-50 dark:bg-red-900/20 p-3 sm:p-4 rounded-xl border border-red-200 dark:border-red-700">
                <p className="text-xs sm:text-sm text-red-700 dark:text-red-300 font-medium">
                  Your response has been recorded and will help us understand team preferences.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PollContext.Provider>
  );
};
