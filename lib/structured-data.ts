export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "JHC Dot Com Club",
    legalName: "Jai Hind College Dot Com Club",
    url: "https://www.jhcdotcomclub.com",
    logo: "https://www.jhcdotcomclub.com/images/logo.png",
    description:
      "Official technology community of Jai Hind College, organizing tech events, workshops, and innovation programs in Mumbai.",
    foundingDate: "2024",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Mumbai",
      addressRegion: "Maharashtra",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      url: "https://www.jhcdotcomclub.com/contact-us",
    },
    sameAs: ["https://www.jhcdotcomclub.com"],
    event: {
      "@type": "Event",
      name: "Cyberstrike 2025",
      organizer: {
        "@type": "Organization",
        name: "JHC Dot Com Club",
      },
    },
  };
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "JHC Dot Com Club",
    url: "https://www.jhcdotcomclub.com",
    description:
      "Official website of Jai Hind College Dot Com Club - Premier technology community",
    publisher: {
      "@type": "Organization",
      name: "Jai Hind College",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.jhcdotcomclub.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateEducationalOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "JHC Dot Com Club",
    url: "https://www.jhcdotcomclub.com",
    description:
      "Technology education and innovation community at Jai Hind College",
    parentOrganization: {
      "@type": "CollegeOrUniversity",
      name: "Jai Hind College",
    },
    offers: {
      "@type": "Course",
      name: "Technology Workshops and Events",
      provider: {
        "@type": "Organization",
        name: "JHC Dot Com Club",
      },
    },
  };
}
