"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Users, Vote } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

interface Poll {
  _id: string;
  _creationTime: number;
  question: string;
  options: string[];
  isActive: boolean;
  broadcastAt?: number;
  endedAt?: number;
  createdAt: number;
}

interface PollContextType {
  currentPoll: Poll | null | undefined;
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

  // Generate a simple user identifier (in production, use proper session/user management)
  const getUserIdentifier = () => {
    let identifier = localStorage.getItem('user_poll_id');
    if (!identifier) {
      identifier = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('user_poll_id', identifier);
    }
    return identifier;
  };

  // Show poll when a new one becomes active
  useEffect(() => {
    if (currentPoll && currentPoll.isActive) {
      const pollId = currentPoll._id;
      
      // Check if this is a new poll we haven't seen
      if (pollId !== lastSeenPollId) {
        setLastSeenPollId(pollId);
        setShowPollDialog(true);
        setHasVoted(false);
        setSelectedOption('');

        // Show toast notification
        toast.success("📊 New Poll Available!", {
          description: currentPoll.question,
          duration: 5000,
          action: {
            label: "Vote Now",
            onClick: () => setShowPollDialog(true),
          },
        });
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
      toast.success("Vote submitted successfully! 🎉", {
        description: `You voted for: ${selectedOption}`,
      });

      // Close dialog after 2 seconds
      setTimeout(() => {
        setShowPollDialog(false);
      }, 2000);

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to submit vote. Please try again.";
      toast.error(errorMessage);
      
      // If user already voted, mark as voted and close dialog
      if (errorMessage.includes("already voted")) {
        setHasVoted(true);
        setTimeout(() => {
          setShowPollDialog(false);
        }, 1000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PollContext.Provider value={{ currentPoll, isSubmitting }}>
      {children}
      
      {/* Poll Dialog - Mobile Friendly */}
      <Dialog open={showPollDialog} onOpenChange={setShowPollDialog}>
        <DialogContent className="bg-white dark:bg-gray-800 w-[95vw] max-w-md max-h-[85vh] overflow-y-auto mx-auto">
          <DialogHeader className="pb-2">
            <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Vote className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
              Team Interest Poll
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              {currentPoll?.question}
            </DialogDescription>
          </DialogHeader>
          
          {currentPoll && !hasVoted && (
            <div className="space-y-3 sm:space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-2 sm:p-3 rounded-lg">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-blue-700 dark:text-blue-300">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span>Select the team you&apos;re most interested in joining</span>
                </div>
              </div>
              
              <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
                <div className="max-h-48 sm:max-h-60 overflow-y-auto space-y-2 pr-1">
                  {currentPoll.options.map((option: string) => (
                    <div key={option} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <RadioGroupItem value={option} id={option} className="flex-shrink-0" />
                      <Label 
                        htmlFor={option}
                        className="text-xs sm:text-sm cursor-pointer flex-1 py-1 leading-tight"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
              
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowPollDialog(false)}
                  className="w-full sm:flex-1 text-sm"
                >
                  Maybe Later
                </Button>
                <Button
                  onClick={handleSubmitVote}
                  disabled={!selectedOption || isSubmitting}
                  className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm"
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
            <div className="text-center py-4 sm:py-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Vote className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-green-700 dark:text-green-300 mb-2">
                Vote Submitted!
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Thank you for participating in the poll.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PollContext.Provider>
  );
};
