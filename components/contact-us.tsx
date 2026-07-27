"use client"

import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Code, Instagram, Linkedin, Mail, MapPin, Phone, Terminal, Youtube, Zap } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";

type Step = "name" | "email" | "phone" | "message" | "complete"

export default function ContactPage() {
  const submitContact = useMutation(api.contact.createContact);


  const [currentStep, setCurrentStep] = useState<Step>("name")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const [currentInput, setCurrentInput] = useState("")
  const [error, setError] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [hackerText, setHackerText] = useState("")
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    "DCC Terminal v17.2 - Secure Connection Established",
    "Initializing contact protocol...",
    "Ready to receive transmission.",
    "",
    "Please provide the following information:",
  ])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; speed: number }>>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Floating particles animation
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 2 + 1,
    }))
    setParticles(newParticles)

    const animateParticles = () => {
      setParticles(prev =>
        prev.map(particle => ({
          ...particle,
          y: particle.y > 100 ? -5 : particle.y + particle.speed * 0.1,
          x: particle.x + Math.sin(Date.now() * 0.001 + particle.id) * 0.1,
        }))
      )
    }

    const interval = setInterval(animateParticles, 50)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (inputRef.current && !isProcessing) {
      inputRef.current.focus()
    }

    // Auto-scroll to bottom of terminal
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [currentStep, terminalHistory, isProcessing])

  // Hacker animation effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isProcessing) {
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?"
      const hackerMessages = [
        "DECRYPTING DATA...",
        "ACCESSING MAINFRAME...",
        "BYPASSING FIREWALL...",
        "ESTABLISHING SECURE CONNECTION...",
        "VALIDATING CREDENTIALS...",
        "PROCESSING TRANSMISSION...",
      ]

      let messageIndex = 0
      let charIndex = 0
      let currentMessage = hackerMessages[0]

      interval = setInterval(() => {
        if (charIndex < currentMessage.length) {
          // Show random characters before revealing the actual character
          const revealed = currentMessage.substring(0, charIndex)
          const scrambled = Array.from(
            { length: currentMessage.length - charIndex },
            () => characters[Math.floor(Math.random() * characters.length)],
          ).join("")

          setHackerText(revealed + scrambled)

          // Occasionally reveal the next character
          if (Math.random() > 0.7) {
            charIndex++
          }
        } else {
          // Move to next message or cycle through random characters
          if (messageIndex < hackerMessages.length - 1) {
            messageIndex++
            currentMessage = hackerMessages[messageIndex]
            charIndex = 0
          } else {
            // Show random characters
            setHackerText(
              Array.from({ length: 30 }, () => characters[Math.floor(Math.random() * characters.length)]).join(""),
            )
          }
        }
      }, 50)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isProcessing])

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validatePhone = (phone: string) => {
    // Basic phone validation - accepts various formats
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
    return phoneRegex.test(phone.replace(/[\s\-$$$$]/g, ""))
  }

  const getPrompt = () => {
    switch (currentStep) {
      case "name":
        return "> Enter your name: "
      case "email":
        return "> Enter your email: "
      case "phone":
        return "> Enter your phone number: "
      case "message":
        return "> Enter your message/enquiry: "
      default:
        return "> "
    }
  }

  const processWithHackerAnimation = (callback: () => void, duration = 2000) => {
    setIsProcessing(true)
    setHackerText("")

    setTimeout(() => {
      setIsProcessing(false)
      setHackerText("")
      callback()
    }, duration)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentInput.trim()) {
      setError("Field cannot be empty")
      return
    }

    setError("")

    switch (currentStep) {
      case "name":
        processWithHackerAnimation(() => {
          setFormData((prev) => ({ ...prev, name: currentInput }))
          setTerminalHistory((prev) => [
            ...prev,
            `> Enter your name: ${currentInput}`,
            "✓ Name recorded successfully.",
            "✓ Identity verified.",
            "",
          ])
          setCurrentStep("email")
          setCurrentInput("")
        })
        break
      case "email":
        if (!validateEmail(currentInput)) {
          setError("Invalid email format")
          return
        }
        processWithHackerAnimation(() => {
          setFormData((prev) => ({ ...prev, email: currentInput }))
          setTerminalHistory((prev) => [
            ...prev,
            `> Enter your email: ${currentInput}`,
            "✓ Email validated.",
            "✓ Communication channel established.",
            "",
          ])
          setCurrentStep("phone")
          setCurrentInput("")
        })
        break
      case "phone":
        if (!validatePhone(currentInput)) {
          setError("Invalid phone number format")
          return
        }
        processWithHackerAnimation(() => {
          setFormData((prev) => ({ ...prev, phone: currentInput }))
          setTerminalHistory((prev) => [
            ...prev,
            `> Enter your phone number: ${currentInput}`,
            "✓ Phone number validated.",
            "✓ Contact channel secured.",
            "",
          ])
          setCurrentStep("message")
          setCurrentInput("")
        })
        break
      case "message":
        processWithHackerAnimation(async () => {
          const completeFormData = { ...formData, message: currentInput }
          setFormData(completeFormData)
          setTerminalHistory((prev) => [
            ...prev,
            `> Enter your message/enquiry: ${currentInput}`,
            "",
            "✓ Message encrypted and transmitted.",
            "✓ Secure channel established.",
            ">> TRANSMISSION SUCCESSFUL. MESSAGE RECEIVED.",
            ">> Data integrity verified.",
            "Connection will terminate in 5 seconds...",
          ])
          setCurrentStep("complete")
          setCurrentInput("")

          try {
            await submitContact({
              name: completeFormData.name!,
              email: completeFormData.email!,
              phone: completeFormData.phone!,
              message: completeFormData.message!,
            })
          } catch (e) {
            console.error(e)
          }

          setTimeout(() => {
            setCurrentStep("name")
            setFormData({ name: "", email: "", phone: "", message: "" })
            setTerminalHistory([
              "DCC Terminal v17.2 - Secure Connection Established",
              "Initializing contact protocol...",
              "Ready to receive transmission.",
              "",
              "Please provide the following information:",
            ])
          }, 5000)
        }, 3000) // Longer animation for final submission
        break
    }
  }

  return (
    <div className="min-h-screen bg-primary/10 relative overflow-hidden pt-20">
      {/* Floating Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full opacity-30 animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: `oklch(from var(--destructive) l c h / 0.6)`,
            animation: `float ${particle.speed + 3}s ease-in-out infinite`,
          }}
        />
      ))}

      {/* Main Content */}
      <div
        className="relative z-10 container mx-auto px-4 py-8 md:py-16"
        style={{
          transform: `perspective(1000px) rotateX(${mousePosition.y * 0.05}deg) rotateY(${mousePosition.x * 0.05}deg)`,
        }}
      >
        {/* Hero Header */}
        <div className="text-center mb-8 sm:mb-12 px-2">
          <div className="flex flex-col sm:inline-flex sm:flex-row items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <Terminal className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-bold font-mono bg-gradient-to-r from-primary via-destructive to-primary bg-clip-text text-transparent">
              [CONTACT_DCC]
            </h1>
            <Code className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          </div>
          <p className="text-sm sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-mono px-4">
            {">"} Initialize secure communication channel with the DCC Terminal
          </p>
          <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-green-400 font-mono opacity-70 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6">
            <span>{">"} System_Status: <span className="text-green-400 bg-green-400/30 rounded-lg p-1 animate-pulse">ACTIVE</span></span>
            <span>{">"} Security_Level: <span className="text-yellow-400 bg-yellow-400/30 rounded-lg p-1 animate-pulse">MAXIMUM</span></span>
          </div>
        </div>

        {/* Terminal Interface */}
        <div className="max-w-4xl mx-auto mb-8 sm:mb-12 px-2 sm:px-4">
          <div className="bg-card/90 backdrop-blur-xl border-2 border-border rounded-lg sm:rounded-xl overflow-hidden shadow-2xl shadow-destructive/20">
            {/* Terminal Header */}
            <div className="bg-muted px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b-2 border-border">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex gap-1 sm:gap-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500 animate-pulse"></div>
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500 animate-pulse delay-100"></div>
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500 animate-pulse delay-200"></div>
                </div>
                <span className="text-[#4AF626] font-mono text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
                  <Terminal className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">DCC_TERMINAL_v17.2</span>
                  <span className="sm:hidden">DCC_TERM</span>
                </span>
              </div>
              <div className="text-[#4AF626] text-xs sm:text-sm font-mono">
                {">"} <span className="hidden sm:inline">STATUS:</span> <span className="text-[#4AF626] animate-pulse">ONLINE</span>
              </div>
            </div>

            {/* Terminal Content */}
            <div className="p-3 sm:p-6 bg-background/50">
              <div
                ref={terminalRef}
                className="font-mono text-xs sm:text-sm max-h-[50vh] sm:max-h-[60vh] overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-border scrollbar-track-background/50"
              >
                {/* Terminal History */}
                {terminalHistory.map((line, index) => (
                  <div
                    key={index}
                    className={`${line.startsWith('✓') ? 'text-[#4AF626]' :
                      line.startsWith('ERROR') ? 'text-[#F62626]' :
                        line.startsWith('>') ? 'text-[#4AF626]' :
                          'text-[#4AF626]'
                      } leading-relaxed`}
                  >
                    {line}
                  </div>
                ))}

                {/* Processing Animation */}
                {isProcessing && (
                  <div className="text-green-400 flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-[#4AF626] rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-[#4AF626] rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-[#4AF626] rounded-full animate-bounce delay-200"></div>
                    </div>
                    <span className="animate-pulse text-[#4AF626]">[{hackerText}]</span>
                  </div>
                )}

                {/* Input Form */}
                {currentStep !== "complete" && !isProcessing && (
                  <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-4">
                    <span className="text-cyan-400 font-mono text-xs sm:text-sm whitespace-nowrap">{getPrompt()}</span>
                    <div className="flex-1 w-full sm:w-auto relative">
                      <input
                        ref={inputRef}
                        type={currentStep === "email" ? "email" : currentStep === "phone" ? "tel" : "text"}
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        placeholder={`Enter your ${currentStep}...`}
                        className="w-full bg-transparent text-[#4AF626] outline-none border-b-2 border-gray-600 focus:border-green-400 transition-colors duration-300 px-2 py-1 font-mono placeholder-green-500/50 text-xs sm:text-sm"
                        autoComplete="off"
                        disabled={isProcessing}
                        suppressHydrationWarning
                      />
                      <div className="absolute right-0 top-1/2 -translate-y-1/2">
                        <div className="w-1 h-3 sm:w-2 sm:h-4 bg-[#4AF626] animate-pulse"></div>
                      </div>
                    </div>
                  </form>
                )}

                {/* Error Display */}
                {error && !isProcessing && (
                  <div className="text-red-400 bg-red-900/20 border-2 border-red-500/30 rounded px-3 py-2 mt-2 flex flex-col sm:flex-row items-start sm:items-center gap-2 font-mono text-xs sm:text-sm">
                    <Zap className="w-4 h-4 flex-shrink-0" />
                    <span>[ERROR]: {error}</span>
                  </div>
                )}

                {/* Instructions */}
                {currentStep !== "complete" && !isProcessing && (
                  <div className="text-[#4AF626]/70 mt-2 text-xs font-mono">
                    {">"} Press [ENTER] to continue...
                  </div>
                )}

                {/* Success Message */}
                {currentStep === "complete" && (
                  <div className="text-center mt-6 sm:mt-8">
                    <div className="text-[#4AF626] text-lg sm:text-2xl font-bold mb-4 animate-pulse font-mono">
                      [✓] TRANSMISSION_SUCCESSFUL [✓]
                    </div>
                    <div className="text-[#4AF626]/70 font-mono text-xs sm:text-sm">
                      {">"} Message encrypted and delivered to DCC servers
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information Cards */}
        <div className="max-w-6xl mx-auto px-2 sm:px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Contact Details */}
            <div className="bg-card/60 backdrop-blur-xl border-2 border-border rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 shadow-xl shadow-destructive/5 hover:shadow-destructive/10 transition-all duration-300">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-destructive mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 font-mono">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
                [CONTACT_INFO]
              </h2>

              <div className="space-y-4 sm:space-y-6">
                <div className="group cursor-pointer">
                  <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-muted/50 border-2 border-border hover:border-destructive/50 transition-all duration-300">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-destructive mt-1 group-hover:scale-110 transition-transform flex-shrink-0" />
                    <div>
                      <h3 className="text-destructive font-semibold mb-1 font-mono text-sm sm:text-base">{">"} ADDRESS</h3>
                      <p className="text-foreground leading-relaxed font-mono text-xs sm:text-sm">
                        Jai Hind College, &quot;A&quot; Road, Churchgate,<br />
                        Mumbai, Maharashtra 400020
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group cursor-pointer">
                  <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-muted/50 border-2 border-border hover:border-destructive/50 transition-all duration-300">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-destructive mt-1 group-hover:scale-110 transition-transform flex-shrink-0" />
                    <div>
                      <h3 className="text-destructive font-semibold mb-1 font-mono text-sm sm:text-base">{">"} EMAIL</h3>
                      <p className="text-foreground font-mono text-xs sm:text-sm break-all">jhcdotcomclub.official@gmail.com</p>
                    </div>
                  </div>
                </div>

                <div className="group cursor-pointer">
                  <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-muted/50 border-2 border-border hover:border-destructive/50 transition-all duration-300">
                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-destructive mt-1 group-hover:scale-110 transition-transform flex-shrink-0" />
                    <div>
                      <h3 className="text-destructive font-semibold mb-1 font-mono text-sm sm:text-base">{">"} PHONE</h3>
                      <p className="text-foreground font-mono text-xs sm:text-sm">Sahil Manoj Modi</p>
                      <p className="text-foreground font-mono text-xs sm:text-sm">+91 81087 16051</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media & Quick Actions */}
            <div className="bg-card/60 backdrop-blur-xl border-2 border-border rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 shadow-xl shadow-destructive/5 hover:shadow-destructive/10 transition-all duration-300">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-destructive mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 font-mono">
                <Code className="w-5 h-5 sm:w-6 sm:h-6" />
                [CONNECT_DCC]
              </h2>

              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h3 className="text-destructive font-semibold mb-3 sm:mb-4 font-mono text-sm sm:text-base">{">"} FOLLOW_US</h3>
                  <div className="flex gap-3 sm:gap-4">
                    {[
                      { icon: Instagram, label: "Instagram", color: "hover:text-accent" },
                      { icon: Youtube, label: "Youtube", color: "hover:text-primary" },
                      { icon: Linkedin, label: "LinkedIn", color: "hover:text-secondary" },
                    ].map(({ icon: Icon, label, color }) => (
                      <button
                        key={label}
                        title={`Follow us on ${label}`}
                        aria-label={`Follow us on ${label}`}
                        className={`p-3 sm:p-4 bg-muted/50 border-2 border-border rounded-lg hover:border-destructive/50 transition-all duration-300 group ${color}`}
                        suppressHydrationWarning
                      >
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-destructive group-hover:scale-110 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="gradient-ember-fade border-2 border-destructive/20 rounded-lg p-4 sm:p-6">
                  <h3 className="text-destructive font-semibold mb-2 flex items-center gap-2 font-mono text-sm sm:text-base">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                    {">"} QUICK_RESPONSE
                  </h3>
                  <p className="text-foreground text-xs sm:text-sm mb-3 sm:mb-4 font-mono leading-relaxed">
                    Get in touch with us for any queries related to events, memberships, or collaborations.
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs font-mono">
                    <span className="px-2 py-1 bg-primary/20 text-primary rounded border border-primary/30">[ONLINE]</span>
                    <span className="px-2 py-1 bg-accent/20 text-accent rounded border border-accent/30">[FAST_REPLY]</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Footer */}
        <div className="text-center mt-8 sm:mt-12 text-green-500/70 font-mono text-xs sm:text-sm px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 flex-wrap">
            <span>{">"} System_Status: <span className="text-green-400">ONLINE</span></span>
            <span>{">"} Security_Level: <span className="text-yellow-400">MAXIMUM</span></span>
            <span>{">"} Connection: <span className="text-green-400">ENCRYPTED</span></span>
          </div>
          <div className="mt-2 text-xs opacity-60 text-green-400/60">
            DCC Terminal Interface © 2025 | All transmissions secured
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: oklch(from var(--background) l c h);
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: oklch(from var(--border) l c h);
          border-radius: 2px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: oklch(from var(--primary) l c h);
        }
      `}</style>
    </div>
  )
}
