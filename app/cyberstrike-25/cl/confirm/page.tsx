"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  CheckCircle2,
  Calendar,
  Mail,
  Building2,
  Download,
  ArrowLeft,
} from "lucide-react";
import * as htmlToImage from "html-to-image";

// Generate barcode for CL/ACL
const generateBarcode = (
  collegeName: string,
  name: string,
  email: string,
  role: string
) => {
  const source = `${collegeName}|${name}|${email.toLowerCase()}|${role}`;
  let hash = 2166136261;

  for (let i = 0; i < source.length; i++) {
    hash ^= source.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  const normalized = hash >>> 0;
  return (normalized % 1000000000).toString().padStart(9, "0");
};

// Access Card Component
const AccessCard = ({
  name,
  email,
  contact,
  role,
  year,
  collegeName,
  cardRef,
}: {
  name: string;
  email: string;
  contact: string;
  role: "CL" | "ACL";
  year?: string;
  collegeName: string;
  cardRef?: (node: HTMLDivElement | null) => void;
}) => {
  const barcode = useMemo(
    () => generateBarcode(collegeName, name, email, role),
    [collegeName, name, email, role]
  );

  const barcodeLabel = useMemo(() => {
    const groups = barcode.match(/.{1,3}/g);
    return groups ? groups.join(" ") : barcode;
  }, [barcode]);

  const aesthetic = useMemo(() => {
    const source = `${name}|${email}|${collegeName}|${role}`.toLowerCase();
    let hash = 2166136261;

    for (let i = 0; i < source.length; i++) {
      hash ^= source.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }

    const normalized = hash >>> 0;
    const accentHue = normalized % 360;
    const accentColor = `hsl(${accentHue} 82% 60%)`;
    const accentGlow = `hsla(${accentHue} 82% 60% / 0.35)`;

    return { accentColor, accentGlow };
  }, [name, email, collegeName, role]);

  const accentStyles = useMemo(
    () =>
      ({
        "--accent-color": aesthetic.accentColor,
        "--accent-glow": aesthetic.accentGlow,
      } as CSSProperties),
    [aesthetic.accentColor, aesthetic.accentGlow]
  );

  const accentGradient = useMemo(
    () =>
      `linear-gradient(145deg, ${aesthetic.accentGlow} 0%, rgba(11,13,23,0.25) 45%, rgba(11,13,23,0.9) 100%)`,
    [aesthetic.accentGlow]
  );

  const barcodePattern = useMemo(
    () =>
      `repeating-linear-gradient(90deg, ${aesthetic.accentColor} 0px, ${aesthetic.accentColor} 2px, transparent 2px, transparent 5px)`,
    [aesthetic.accentColor]
  );

  const roleTitle =
    role === "CL" ? "Contingent Leader" : "Assistant Contingent Leader";
  const roleBadge = role === "CL" ? "Leader" : "Assistant";

  return (
    <div
      ref={cardRef}
      style={accentStyles}
      className="relative flex w-full max-w-[320px] flex-col overflow-hidden rounded-[36px] border border-white/12 bg-[#080911] text-white shadow-[0_32px_70px_rgba(0,0,0,0.45)] min-h-[500px]"
    >
      <div className="pointer-events-none absolute -top-7 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-white/10 text-base font-semibold text-slate-900 shadow-[0_12px_30px_rgba(0,0,0,0.35)]"></div>
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_60%)]"
        aria-hidden
      />
      <div className="relative flex h-full flex-col gap-6 px-7 pb-8 pt-16">
        <div className="relative flex min-h-[200px] flex-col overflow-hidden rounded-[28px] border border-white/12">
          <div
            className="absolute inset-0"
            style={{ backgroundImage: accentGradient }}
            aria-hidden
          />
          <div
            className="absolute inset-0 opacity-45 mix-blend-screen"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.35), transparent 55%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.2), transparent 45%), repeating-linear-gradient(135deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 2px, transparent 2px, transparent 6px)",
            }}
            aria-hidden
          />
          <div className="relative flex items-center justify-between px-6 pt-6 text-[0.55rem] uppercase tracking-[0.45em] text-white/75">
            <span>Cyberstrike • 2025</span>
            <span className="rounded-full border border-white/25 px-3 py-1 text-[0.55rem] uppercase tracking-[0.4em] text-white/75">
              {roleBadge}
            </span>
          </div>
          <div className="relative mx-6 mt-2 h-px bg-white/20" aria-hidden />
          <div className="relative mt-auto px-6 pb-6">
            <p className="text-[0.55rem] uppercase tracking-[0.4em] text-white/65">
              {roleTitle}
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-white">
              {name}
            </p>
            {year && (
              <p className="mt-2 text-[0.55rem] uppercase tracking-[0.4em] text-white/60">
                Year: {year}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-3 text-[0.58rem] uppercase tracking-[0.35em] text-white/55">
          <div className="flex items-center justify-between">
            <span>College</span>
            <span className="text-white/85 text-[0.64rem] tracking-[0.2em] text-right max-w-[180px] truncate">
              {collegeName}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Contact</span>
            <span className="text-white/80 text-[0.68rem] tracking-[0.2em]">
              {contact}
            </span>
          </div>
          <div className="flex items-start justify-between">
            <span>Email</span>
            <span className="text-white/70 text-[0.60rem] tracking-tight text-right break-all max-w-[160px]">
              {email}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="relative rounded-2xl border border-white/12 bg-white/5 px-5 py-4">
            <div className="flex items-center justify-between text-[0.55rem] uppercase tracking-[0.35em] text-white/55">
              <span>Barcode</span>
              <span className="text-white/75 tracking-[0.3em]">
                {barcodeLabel}
              </span>
            </div>
            <div className="mt-3 flex justify-center">
              <div
                className="flex h-14 w-full max-w-[200px] items-center justify-center rounded-lg bg-white/85 p-2"
                style={{ boxShadow: "inset 0 0 0 1px rgba(8,9,17,0.15)" }}
              >
                <div
                  className="h-full w-full rounded-[3px]"
                  style={{ backgroundImage: barcodePattern }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between text-[0.55rem] uppercase tracking-[0.35em] text-white/45">
          <span>Event Date</span>
          <span className="text-white/60">Nov 12, 2025</span>
        </div>
      </div>
    </div>
  );
};

export default function CLConfirmation() {
  const router = useRouter();
  const [registrationId, setRegistrationId] =
    useState<Id<"clRegistrations"> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const clCardRef = useRef<HTMLDivElement | null>(null);
  const aclCardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem("clRegistrationData");

    if (storedData) {
      try {
        const { id, expiry } = JSON.parse(storedData);
        const now = new Date().getTime();

        if (now > expiry) {
          localStorage.removeItem("clRegistrationData");
          router.push("/cyberstrike-25/cl");
          return;
        }

        setRegistrationId(id as Id<"clRegistrations">);
        setIsLoading(false);
      } catch {
        localStorage.removeItem("clRegistrationData");
        router.push("/cyberstrike-25/cl");
      }
    } else {
      setTimeout(() => {
        router.push("/cyberstrike-25/cl");
      }, 1000);
    }
  }, [router]);

  const registration = useQuery(
    api.clRegistrations.getCLRegistration,
    registrationId ? { id: registrationId } : "skip"
  );

  const downloadCard = async (
    cardRef: React.RefObject<HTMLDivElement | null>,
    filename: string
  ) => {
    const node = cardRef.current;
    if (!node) return;

    try {
      const dataUrl = await htmlToImage.toPng(node, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#080911",
        skipFonts: true,
      });

      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to export card", error);
    }
  };

  if (isLoading || !registrationId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050509]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          <p className="text-gray-400 text-sm">Loading your confirmation...</p>
        </div>
      </div>
    );
  }

  if (!registration) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050509]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          <p className="text-gray-400 text-sm">
            Loading your registration details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050509] text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-16 md:px-8 pt-32">
        {/* Header */}
        <div className="flex flex-col gap-6">
          <Button
            variant="ghost"
            asChild
            className="w-fit text-zinc-300 hover:bg-white/5"
          >
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </button>
          </Button>

          <div className="flex flex-col gap-4">
            <Badge className="w-fit bg-white/10 text-xs uppercase tracking-[0.35em] text-white">
              CL Registration • Cyberstrike 2025
            </Badge>
            <h1 className="text-3xl font-bold md:text-4xl">
              Registration Confirmed!
            </h1>
            <p className="max-w-2xl text-sm text-zinc-300 md:text-base">
              Your Contingent Leader registration has been successfully
              submitted. Below are your digital access cards for the CL and
              Assistant CL. Save these for the event on 12th November 2025.
            </p>
          </div>
        </div>

        {/* Main Content: Two Column Layout - Cards first on mobile, left on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Right Column on Desktop, First on Mobile: Access Cards */}
          <div className="flex flex-col gap-8 lg:order-2">
            {/* CL Card */}
            <div className="flex flex-col items-center gap-4">
              <AccessCard
                name={registration.clName}
                email={registration.clEmail}
                contact={registration.clContact}
                role="CL"
                year={registration.clYear}
                collegeName={registration.collegeName}
                cardRef={(node) => (clCardRef.current = node)}
              />
              <Button
                variant="secondary"
                className="w-full max-w-[320px] gap-2 bg-white/10 hover:bg-white/20 border border-white/20"
                onClick={() =>
                  downloadCard(
                    clCardRef,
                    `${registration.collegeName.replace(
                      /\s+/g,
                      "-"
                    )}-cl-card.png`
                  )
                }
              >
                <Download className="h-4 w-4" /> Download CL Card
              </Button>
            </div>

            {/* ACL Card */}
            <div className="flex flex-col items-center gap-4">
              <AccessCard
                name="Assistant CL"
                email={registration.aclEmail}
                contact={registration.aclContact}
                role="ACL"
                collegeName={registration.collegeName}
                cardRef={(node) => (aclCardRef.current = node)}
              />
              <Button
                variant="secondary"
                className="w-full max-w-[320px] gap-2 bg-white/10 hover:bg-white/20 border border-white/20"
                onClick={() =>
                  downloadCard(
                    aclCardRef,
                    `${registration.collegeName.replace(
                      /\s+/g,
                      "-"
                    )}-acl-card.png`
                  )
                }
              >
                <Download className="h-4 w-4" /> Download ACL Card
              </Button>
            </div>
          </div>

          {/* Left Column on Desktop, Second on Mobile: Registration Info */}
          <div className="flex flex-col gap-6 lg:order-1">
            {/* CL Meet Info */}
            <div className="rounded-lg border border-red-500/30 bg-red-900/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="h-5 w-5 text-red-400" />
                <h3 className="text-lg font-semibold text-white">
                  CL Meet - 12th November 2025
                </h3>
              </div>
              <div className="space-y-3 text-sm text-zinc-300">
                {registration.attendingClMeet ? (
                  <>
                    <p className="text-green-400 font-semibold">
                      You have confirmed your attendance!
                    </p>
                    <p>
                      The CL Meet will provide you with all the essential
                      information about Cyberstrike 2025, including event rules,
                      registration process, and important dates.
                    </p>
                    <p className="text-zinc-400 text-xs">
                      Further details about the venue and timing will be shared
                      via email before the event.
                    </p>
                  </>
                ) : (
                  <p>
                    You have indicated that you will not be attending the CL
                    Meet. Important information will be shared via email.
                  </p>
                )}
              </div>
            </div>

            {/* College Info */}
            <div className="rounded-lg border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="h-5 w-5 text-zinc-400" />
                <h3 className="text-lg font-semibold text-white">
                  College Information
                </h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-400">
                    College Name
                  </p>
                  <p className="mt-1 text-sm text-white">
                    {registration.collegeName}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-400">
                    Address
                  </p>
                  <p className="mt-1 text-sm text-white">
                    {registration.collegeAddress}
                  </p>
                </div>
              </div>
            </div>

            {/* What's Next */}
            <div className="rounded-lg border border-blue-500/30 bg-blue-900/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                What&apos;s Next?
              </h3>
              <ul className="space-y-3 text-sm text-zinc-300">
                <li className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>
                    Confirmation emails have been sent to both CL (
                    {registration.clEmail}) and Assistant CL (
                    {registration.aclEmail})
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>Your documents are being verified by our team</span>
                </li>
                <li className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>
                    Further details about Cyberstrike 2025 will be shared before
                    the event
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Building2 className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>
                    Start preparing your college contingent for the event!
                  </span>
                </li>
              </ul>
            </div>

            {/* Registration Details */}
            <div className="rounded-lg border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Registration Details
              </h3>
              <div className="grid gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Submitted on</span>
                  <span className="text-white">
                    {new Date(registration.submittedAt).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Status</span>
                  <Badge
                    className={
                      registration.verificationStatus === "verified"
                        ? "bg-green-600"
                        : registration.verificationStatus === "rejected"
                        ? "bg-red-600"
                        : "bg-yellow-600"
                    }
                  >
                    {registration.verificationStatus}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="rounded-lg border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Need Help?
              </h3>
              <p className="text-sm text-zinc-300 mb-4">
                If you have any questions or need assistance, feel free to reach
                out to us.
              </p>
              <a
                href="mailto:jhcdotcomclub.official@gmail.com"
                className="inline-flex items-center gap-2 text-sm text-red-400 hover:text-red-300"
              >
                <Mail className="h-4 w-4" />
                jhcdotcomclub.official@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}