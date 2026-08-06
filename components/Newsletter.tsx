"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Command, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { satoshi, zentry } from "@/fonts/font";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const COMMON_DOMAINS = [
    "@gmail.com",
    "@yahoo.com",
    "@outlook.com",
    "@iitm.ac.in",
    "@hotmail.com",
    "@protonmail.com"
];

export const Newsletter = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [suggestion, setSuggestion] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [error, setError] = useState("");
    const [isEmailSending, setIsEmailSending] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    
    const subscribe = useMutation(api.newsletter.subscribe);
    
    // Escape key handler
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                setIsOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Reset states when modal opens
    useEffect(() => {
        if (isOpen) {
            setError("");
            setSubmitted(false);
            setIsSubscribed(false);
            setIsEmailSending(false);
        }
    }, [isOpen]);

    // Type-ahead suggestions
    useEffect(() => {
        if (!email.includes("@") && email.length > 0) {
            setSuggestion(email + COMMON_DOMAINS[0]);
        } else if (email.includes("@")) {
            const [prefix, partialDomain] = email.split("@");
            if (partialDomain) {
                const matchingDomain = COMMON_DOMAINS.find((domain) =>
                    domain.substring(1).startsWith(partialDomain)
                );

                if (matchingDomain) {
                    setSuggestion(prefix + matchingDomain);
                } else {
                    setSuggestion("");
                }
            }
        } else {
            setSuggestion("");
        }
    }, [email]);

    // Send newsletter welcome email
    const sendNewsletterEmail = async (email: string) => {
        try {
            setIsEmailSending(true);
            const response = await fetch("/api/send-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    type: "newsletter",
                    email: email,
                }),
            });

            const result = await response.json();
            
            if (response.ok) {
                console.log("Newsletter welcome email sent successfully:", result.message);
            } else {
                console.warn("Email API returned non-200 status:", result);
            }
        } catch (error) {
            console.error("Error sending newsletter email:", error);
            // Don't show error to user as subscription was successful
        } finally {
            setIsEmailSending(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const trimmedEmail = email.trim();
        if (!trimmedEmail) return;

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
            setError("Please enter a valid email address");
            return;
        }
        
        setSubmitted(true);
        setError("");
        
        try {
            // Subscribe to newsletter
            const result = await subscribe({
                email: trimmedEmail,
                source: "newsletter-section"
            });
            
            if (result.success) {
                setIsSubscribed(true);
                
                // Send welcome email in the background
                sendNewsletterEmail(trimmedEmail);
                
                setTimeout(() => {
                    setIsOpen(false);
                    setEmail("");
                    setSubmitted(false);
                    // Keep subscribed state for a moment
                    setTimeout(() => setIsSubscribed(false), 1000);
                }, 3000); // Extended time to show email sending status
            } else {
                // Handle case where email already exists but subscription was successful
                setIsSubscribed(true);
                setTimeout(() => {
                    setIsOpen(false);
                    setEmail("");
                    setSubmitted(false);
                    setTimeout(() => setIsSubscribed(false), 1000);
                }, 2000);
            }
        } catch (error) {
            console.error("Newsletter subscription error:", error);
            setError("Failed to subscribe. Please try again.");
            setSubmitted(false);
        }
    };

    return (
        <section className="relative py-20 bg-black overflow-hidden">
            {/* Background Effects - Removed blur */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/5 rounded-full animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-500/5 rounded-full animate-pulse delay-1000" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Header - Updated to match home page style */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-12"
                    >
                        <h2 className={cn(
                            "text-4xl md:text-5xl font-bold text-white mb-6",
                            satoshi.className
                        )}>
                            Stay Connected with{" "}
                            <span className={cn("text-red-500 tracking-wide", zentry.className)}>
                                DCC
                            </span>
                        </h2>
                        
                        <p className={cn(
                            "text-lg text-gray-300 max-w-2xl mx-auto mb-8",
                            satoshi.className
                        )}>
                            Get exclusive updates about our latest events, hackathons, workshops, and tech innovations. 
                            Join our community of tech enthusiasts.
                        </p>
                    </motion.div>

                    {/* CTA Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        {/* Subscribe Button */}
                        <motion.button
                            onClick={() => setIsOpen(true)}
                            className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/25"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Command className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                            Subscribe to Updates
                            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-400 to-red-500 opacity-0 group-hover:opacity-20 transition-opacity" />
                        </motion.button>
                    </motion.div>
                </div>
            </div>

            {/* Command Palette Modal - Removed backdrop blur */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            className="bg-black/95 w-full max-w-lg border border-red-500/30 shadow-2xl rounded-xl overflow-hidden relative"
                            onClick={(e) => e.stopPropagation()}
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-red-500/20">
                                <div className={cn(
                                    "flex items-center text-gray-400 text-sm mb-2",
                                    satoshi.className
                                )}>
                                    <Command className="w-4 h-4 mr-2 text-red-400" />
                                    <span>Enter your email and press Enter to subscribe.</span>
                                </div>
                                <p className={cn(
                                    "text-gray-500 text-xs",
                                    satoshi.className
                                )}>
                                    Get exclusive DCC updates and event notifications.
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="p-6 relative">
                                {/* Input Section - Hide when submitted */}
                                <div className={cn(
                                    "flex items-center relative transition-opacity duration-200",
                                    submitted ? "opacity-0" : "opacity-100"
                                )}>
                                    <span className={cn(
                                        "text-red-400 mr-3 font-mono text-sm",
                                        satoshi.className
                                    )}>
                                        subscribe
                                    </span>
                                    
                                    <div className="relative flex-1">
                                        {/* Type-ahead suggestion */}
                                        {suggestion && email && (
                                            <div className={cn(
                                                "absolute inset-0 text-gray-600 pointer-events-none flex items-center font-mono text-sm",
                                                satoshi.className
                                            )}>
                                                {suggestion}
                                            </div>
                                        )}

                                        {/* Main input */}
                                        <input
                                            ref={inputRef}
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className={cn(
                                                "w-full bg-transparent border-none outline-none text-white font-mono text-sm relative z-10",
                                                "focus:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-shadow duration-300",
                                                "caret-red-500",
                                                satoshi.className
                                            )}
                                            placeholder="your@email.com"
                                            disabled={submitted}
                                            autoComplete="email"
                                        />
                                    </div>
                                </div>

                                {/* Error message */}
                                {error && !submitted && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={cn(
                                            "flex items-center text-red-400 text-xs mt-2",
                                            satoshi.className
                                        )}
                                    >
                                        <AlertCircle className="w-3 h-3 mr-1" />
                                        {error}
                                    </motion.div>
                                )}

                                {/* Submit button (hidden, triggered by Enter) */}
                                <button type="submit" className="hidden">
                                    Subscribe
                                </button>

                                {/* Loading/Success State - Positioned to replace input */}
                                <AnimatePresence>
                                    {submitted && (
                                        <motion.div
                                            className="flex items-center justify-center h-6"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {!isSubscribed ? (
                                                <div className={cn(
                                                    "flex items-center text-gray-400",
                                                    satoshi.className
                                                )}>
                                                    <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin mr-3" />
                                                    <span className="text-sm">Subscribing...</span>
                                                </div>
                                            ) : (
                                                <motion.div
                                                    className={cn(
                                                        "flex flex-col items-center text-green-400 text-center",
                                                        satoshi.className
                                                    )}
                                                    initial={{ scale: 0.8 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: "spring", damping: 15 }}
                                                >
                                                    <div className="flex items-center mb-1">
                                                        <Check className="w-4 h-4 mr-2" />
                                                        <span className="text-sm">Subscribed! Welcome to DCC.</span>
                                                    </div>
                                                    {isEmailSending && (
                                                        <div className="flex items-center text-gray-400 text-xs">
                                                            <div className="w-3 h-3 border border-gray-500 border-t-transparent rounded-full animate-spin mr-2" />
                                                            <span>Sending welcome email...</span>
                                                        </div>
                                                    )}
                                                    {!isEmailSending && (
                                                        <span className="text-xs text-gray-400">Check your email for confirmation!</span>
                                                    )}
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </form>

                            {/* Footer */}
                            <div className={cn(
                                "px-6 pb-4 text-xs text-gray-500 flex items-center justify-between",
                                satoshi.className
                            )}>
                                <span>Join 300+ tech enthusiasts</span>
                                <span className="text-gray-600">ESC to close</span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};