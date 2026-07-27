"use client";

import { circular, satoshi, zentry } from "@/fonts/font";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRef } from "react";

const RefundPolicy = () => {
  // Create individual refs for sections
  const headerRef = useRef(null);
  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);
  const section4Ref = useRef(null);
  const section5Ref = useRef(null);

  // Fade-in animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  // Stagger children animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div
      className={`container mx-auto px-4 py-12 max-w-4xl ${satoshi.variable} ${circular.variable} ${zentry.variable} mt-20`}
    >
      <motion.div
        className="bg-card text-card-foreground p-8 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          ref={headerRef}
        >
          <h1
            className={cn(
              "text-6xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent",
              zentry.className
            )}
          >
            REFUND POLICY
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            Last Updated: June 21, 2025
          </p>
        </motion.div>

        <div className="space-y-8">
          <motion.section
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <p className="text-foreground">
              This Refund Policy outlines the guidelines and procedures for refunds related to services, events, 
              and club memberships provided by Dot Com Club (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). 
              By making a payment for any of our services, events, or memberships, you agree to the terms 
              outlined in this Refund Policy.
            </p>
          </motion.section>

          <motion.section
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2
              id="table-of-contents"
              className="text-3xl font-bold mb-4 text-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
            >
              TABLE OF CONTENTS
            </h2>
            <motion.ol
              className="list-decimal pl-6 space-y-2 text-foreground"
              variants={container}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {[
                "GENERAL PRINCIPLES",
                "CLUB MEMBERSHIP FEES",
                "EVENT REGISTRATION FEES",
                "HOW TO REQUEST A REFUND",
                "CONTACT US",
              ].map((title, index) => (
                <motion.li
                  key={index}
                  variants={fadeIn}
                  className="hover:-translate-y-0.5 transition-transform duration-300"
                >
                  <a
                    href={`#section${index + 1}`}
                    className="text-accent-foreground hover:underline hover:text-primary transition-colors duration-300"
                  >
                    {title}
                  </a>
                </motion.li>
              ))}
            </motion.ol>
          </motion.section>

          <motion.section
            id="section1"
            className="border-t border-border pt-6"
            ref={section1Ref}
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-4 text-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              1. GENERAL PRINCIPLES
            </h2>

            <p className="text-foreground">
              All fees and payments made to Dot Com Club are intended to cover costs related to organizing events, 
              providing services, maintaining club operations, and supporting our educational initiatives. We strive 
              to be transparent about our fees and refund policies to ensure that all parties understand the terms 
              before making any payments.
            </p>
            
            <p className="text-foreground mt-4">
              All refund requests are evaluated on a case-by-case basis, taking into consideration the circumstances, 
              timing of the request, and the specific nature of the service or event for which payment was made.
            </p>
            
            <p className="text-foreground mt-4">
              <strong>Please note:</strong> All refund decisions made by Dot Com Club management are final. We reserve 
              the right to modify this Refund Policy at any time. Any changes will be effective immediately upon posting 
              the revised policy on our website.
            </p>
          </motion.section>

          <motion.section
            id="section2"
            className="border-t border-border pt-6"
            ref={section2Ref}
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-4 text-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              2. CLUB MEMBERSHIP FEES
            </h2>

            <h3 className="text-xl font-medium mt-6 mb-2 text-secondary-foreground">
              Non-Refundable Membership
            </h3>
            <p className="text-foreground">
              <strong className="text-secondary-foreground">Club membership registration fees are non-refundable.</strong> When 
              you register as a member of Dot Com Club, you gain immediate access to our resources, community, and benefits. 
              As these benefits begin immediately upon registration, we cannot offer refunds for membership fees.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-2 text-secondary-foreground">
              Exceptions
            </h3>
            <p className="text-foreground">
              In extraordinary circumstances, such as:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground mt-2">
              <li>
                Technical errors resulting in duplicate payments
              </li>
              <li>
                Club dissolution or significant changes to membership benefits before the membership period begins
              </li>
            </ul>
            <p className="text-foreground mt-4">
              In these rare cases, please contact us within 7 days of payment to request consideration for a refund. Each request 
              will be reviewed individually by our management team.
            </p>
          </motion.section>

          <motion.section
            id="section3"
            className="border-t border-border pt-6"
            ref={section3Ref}
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-4 text-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              3. EVENT REGISTRATION FEES
            </h2>

            <h3 className="text-xl font-medium mt-6 mb-2 text-secondary-foreground">
              24-Hour Refund Window
            </h3>
            <p className="text-foreground">
              For most events organized by Dot Com Club, we offer a 24-hour refund window from the time of registration. If you 
              cancel your registration within 24 hours of payment, you will receive a full refund minus any transaction fees 
              that may have been incurred.
            </p>
            
            <h3 className="text-xl font-medium mt-6 mb-2 text-secondary-foreground">
              Late Cancellations
            </h3>
            <p className="text-foreground">
              For cancellations made after the 24-hour:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground mt-2">
              <li>
                No refund will be provided
              </li>
            </ul>
            
            <h3 className="text-xl font-medium mt-6 mb-2 text-secondary-foreground">
              Event Cancellation By Dot Com Club
            </h3>
            <p className="text-foreground">
              If an event is canceled by Dot Com Club, all registered participants will receive a full refund of their registration fees.
            </p>
            
            <h3 className="text-xl font-medium mt-6 mb-2 text-secondary-foreground">
              Event Postponement
            </h3>
            <p className="text-foreground">
              If an event is postponed, registrations will automatically be transferred to the new date. If you cannot attend on the 
              new date, please contact us within 7 days of the postponement announcement to request a refund.
            </p>
          </motion.section>

          <motion.section
            id="section4"
            className="border-t border-border pt-6"
            ref={section4Ref}
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-4 text-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              4. HOW TO REQUEST A REFUND
            </h2>

            <p className="text-foreground">
              To request a refund, please follow these steps:
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-foreground mt-2">
              <li>
                Send an email to <a href="mailto:jhcdotcomclub.offical@gmail.com" className="text-accent-foreground hover:underline">
                jhcdotcomclub.offical@gmail.com</a> with the subject line &quot;Refund Request&quot;
              </li>
              <li>
                Include your full name, the email address used for registration or purchase
              </li>
              <li>
                Provide details about what you&apos;re requesting a refund for (event name, membership type, merchandise, etc.)
              </li>
              <li>
                Explain the reason for your refund request
              </li>
              <li>
                Include proof of payment (transaction ID, receipt, etc.)
              </li>
            </ol>
            
            <p className="text-foreground mt-4">
              We aim to process all refund requests within 7 business days of receiving a complete request. Approved refunds will be 
              issued using the original payment method when possible. Please note that it may take 5-10 business days for the refund 
              to appear in your account, depending on your payment provider.
            </p>
          </motion.section>

          <motion.section
            id="section5"
            className="border-t border-border pt-6"
            ref={section5Ref}
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-4 text-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              5. CONTACT US
            </h2>

            <p className="text-foreground">
              If you have any questions about our Refund Policy, please contact us:
            </p>

            <div className="mt-4 text-foreground">
              <p className="font-medium">Dot Com Club</p>
              <p>Jai Hind College</p>
              <p>A-Road, Churchgate</p>
              <p>Mumbai, Maharashtra 400020</p>
              <p>India</p>
              <p className="mt-2">
                Email:{" "}
                <a
                  href="mailto:jhcdotcomclub.offical@gmail.com"
                  className="text-accent-foreground hover:underline"
                >
                  jhcdotcomclub.offical@gmail.com
                </a>
              </p>
            </div>
          </motion.section>

          <motion.div
            className="mt-12 pt-6 border-t border-border flex justify-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col items-center">
              <p className="text-foreground text-center">
                Thank you for reviewing our Refund Policy
              </p>
              <motion.div
                className="mt-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/"
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-md shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Back to Home
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default RefundPolicy;