export const TRUST_BADGES = [
  { label: "Verified authors" },
  { label: "Full transcripts, not summaries" },
];

export const FEATURE_CARDS = [
  {
    icon: "VerifiedUser",
    title: "100% Verified Authors",
    description:
      "Every expert is vetted for their real-world experience and domain expertise.",
  },
  {
    icon: "Description",
    title: "Straight From The Source",
    description:
      "No filters, no rewrites. Read the expert's insights exactly as delivered.",
  },
  {
    icon: "Bolt",
    title: "Instant Access",
    description:
      "Skip the wait. Get immediate access to transcripts, reports, and insights that matter.",
  },
  {
    icon: "Headset",
    title: "Go Deeper with Live Experts",
    description:
      "Need more clarity? Connect with the expert live and get your questions answered.",
  },
] as const;

export type FaqItem = {
  question: string;
  answer: string;
};

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What is a session transcript?",
    answer:
      "A full written record of an expert's insights on a specific topic, captured either through a recorded conversation or a submitted report, then reviewed internally and formatted so it's ready to read and publish.",
  },
  {
    question: "Who creates these transcripts, and can I trust the content?",
    answer:
      "Every transcript comes from a real expert with hands-on experience in that domain. Nothing goes live until our team has reviewed it for compliance, accuracy and completeness.",
  },
  {
    question: "Do I need an account to buy a transcript?",
    answer:
      "Yes,  you'll need an account to purchase and access transcripts. It only takes a minute to sign up.",
  },
  {
    question: "Can I preview a transcript before buying, and what do I get after I purchase?",
    answer:
      "You can see the topic, summary, and key insights before you buy. Once purchased, you get instant, full access to the complete transcript.",
  },
  {
    question: "Can I use a transcript however I want?",
    answer:
      "Transcripts are for your own research and decision making. You're free to read, reference, and act on the insights in your work.",
  },
  {
    question: "Who do I contact if I run into an issue?",
    answer:
      "Reach out to us at syndicatesupport@infollion.com, we're happy to help with anything from access issues to account questions.",
  }
];
export type TermsOfUseSection = {
  heading: string;
  body: string[];
};

export const TERMS_OF_USE_TITLE = "Terms of Use";

export const TERMS_OF_USE_INTRO: string[] = [
  'By accessing or using Syndicated Sessions ("the Platform," "we," "us," or "our"), a product of Infollion Research Services, you ("you," "your," or "user") agree to be bound by these Terms of Use ("Agreement"). The Platform provides transcripts, summaries, and related content ("Content") sourced from experts and researchers across various industries. If you do not agree to these terms, please discontinue use of the Platform.',
  "This Agreement constitutes the entire understanding between you and us regarding your use of the Platform, unless a separate written agreement between you and us specifically covers that use in which case the separate agreement governs, and this Agreement applies to everything else. If we introduce new features or services, your use of them is covered by this Agreement unless we state otherwise.",
  "Some parts of the Platform may carry additional terms specific to that feature or content. Where those terms conflict with this Agreement, the feature-specific terms take precedence for that feature only.",
  "We may update this Agreement from time to time. The current version will always be available on this page. Continuing to use the Platform after an update means you accept the revised terms.",
];

export const TERMS_OF_USE_SECTIONS: TermsOfUseSection[] = [
  {
    heading: "Permitted Use",
    body: [
      "You may access Content for your own research and internal decision making. You may view Content through the Platform and retain a personal copy for your own reference. You shall not republish, redistribute, resell, or make Content available to third parties, and you shall not use Content for any purpose beyond your own individual or organizational research use, except as expressly permitted here.",
      "Unless you've received our prior written approval, you also may not use Content with any third-party artificial intelligence tool, machine learning model, large language model, or similar automated system, including for training, processing, summarizing, or repackaging the Content.",
    ],
  },
  {
    heading: "Platform Integrity",
    body: [
      "You agree not to interfere with, disrupt, or attempt to compromise the Platform or its Content, including attempting to access accounts, data, or systems that aren't yours, or using automated tools to scrape or extract Content at scale without our prior written permission.",
    ],
  },
  {
    heading: "No Professional Advice",
    body: [
      "Content on the Platform reflects the views and experience of individual experts and is provided for informational purposes only. It is not a substitute for professional, financial, legal, or investment advice, and should be treated as one input among others in your own research and decision-making.",
    ],
  },
  {
    heading: "Third-Party Links",
    body: [
      "The Platform may contain links to external websites. We don't control these sites and aren't responsible for their content. Links are provided for convenience only and don't imply our endorsement.",
    ],
  },
  {
    heading: "Limitation of Liability",
    body: [
      'You\'re responsible for your own use of the Platform. While we review Content before publishing, we don\'t guarantee its accuracy, completeness, or currency, and we aren\'t liable for decisions made based on it. The Platform is provided "as is," without warranties of any kind, express or implied. To the fullest extent permitted by law, we are not liable for any loss or damage arising from your use of, or inability to use, the Platform.',
      "We are not a party to any transaction or dispute between you and any third party, including experts whose Content appears on the Platform.",
    ],
  },
  {
    heading: "Governing Law",
    body: [
      "This Agreement is governed by the laws of India, and any disputes arising from it are subject to the exclusive jurisdiction of the courts of Gurugram, Haryana. If any provision of this Agreement is found unenforceable, the rest of the Agreement remains in effect.",
    ],
  },
  {
    heading: "Ownership & Intellectual Property",
    body: [
      "Unless otherwise stated, all Content on the Platform is owned by us or licensed to us by the experts who created it. Purchasing access to a transcript gives you the right to use it as described under Permitted Use, it doesn't transfer ownership of the Content itself to you.",
    ],
  },
  {
    heading: "Trademarks",
    body: [
      "Our name, logo, and branding are our property and may not be used without prior written permission. If you're a business client, we may reference your name or logo in our marketing materials (e.g., case studies, customer lists) to identify you as a customer, unless you tell us otherwise.",
    ],
  },
  {
    heading: "Changes & Conflicts with Direct Agreements",
    body: [
      "If you or your organization have a separately signed agreement with us that conflicts with this document, the signed agreement takes precedence.",
    ],
  },
  {
    heading: "Contact",
    body: [
      "Questions about these terms can be sent to syndicatesupport@infollion.com",
    ],
  },
];