/**
 * resume.data.ts
 * -----------------------------------------------------------------------------
 * THE single place to edit résumé content. Nothing here is hard-coded inside
 * visual components — components receive typed props derived from this object.
 *
 * The object is passed through `resumeSchema.parse(...)`, so:
 *   • If a field is missing/mis-typed, `astro check` and `astro build` FAIL
 *     with a precise Zod error message (build-time validation).
 *   • The exported `resume` is fully typed (autocomplete everywhere).
 *
 * Data provenance:
 *   • Values below are taken from the owner-supplied CV and brand guidelines.
 *   • No metrics have been invented; unquantified wins are flagged as such.
 * -----------------------------------------------------------------------------
 */
import { resumeSchema, type Resume } from "../schemas/resume.schema";

const data: Resume = resumeSchema.parse({
  /* ------------------------------------------------------------------ */
  /* Hero / above-the-fold profile                                       */
  /* ------------------------------------------------------------------ */
  profile: {
    fullName: "Giorgio Tsoupis",
    headline: "Enterprise AI Adoption & Transformation Program Manager",
    summary:
      "Enterprise AI adoption leader who scales Microsoft 365 Copilot from " +
      "pilot to governed production. I turn AI strategy into measurable " +
      "business value through stakeholder alignment, adoption telemetry, " +
      "compliance-by-design governance, and role-based enablement — moving " +
      "AI beyond proof-of-concept into outcomes organizations can own and " +
      "continuously improve.",
    location: {
      city: "Warsaw",
      country: "Poland",
      remotePreference: "Remote-first",
    },
    workAuthorization: {
      summary: "EU work rights",
      regions: ["European Union"],
    },
    photo: {
      // Files live at /public/images/profile-480.* and profile-960.*
      srcBase: "/images/profile",
      alt: "Portrait of Giorgio Tsoupis, smiling and wearing a dark suit.",
      width: 480,
      height: 480,
    },
  },

  /* ------------------------------------------------------------------ */
  /* Contact + reveal configuration (all contact values live here)       */
  /* ------------------------------------------------------------------ */
  contact: {
    email: "george@copilotadoption.uk",
    // International digits only. Source number: 0048 577 654 530 → 48577654530
    whatsappNumber: "48577654530",
    emailSubject: "Résumé enquiry — Giorgio Tsoupis",
    emailBody:
      "Hello Giorgio,\n\nI viewed your online résumé and would like to get in " +
      "touch about a potential opportunity.\n\nBest regards,\n",
    whatsappMessage:
      "Hello Giorgio — I viewed your online résumé and would like to connect.",
    revealPersistence: "session", // "none" | "session" | "local"
    links: [
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/george-tsoupis-ai-program-manager/",
        handle: "george-tsoupis-ai-program-manager",
      },
      {
        label: "Website",
        href: "https://www.copilotadoption.uk/",
        handle: "copilotadoption.uk",
      },
      {
        label: "GitHub",
        href: "https://github.com/giorgiocopilot/polymarket-tracker",
        handle: "giorgiocopilot",
      },
      {
        label: "Portfolio",
        href: "https://gamma.app/docs/AI-Keynote-Talks-Training-ji96hqomgxi5r2m",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* SEO / sharing                                                       */
  /* ------------------------------------------------------------------ */
  seo: {
    canonicalUrl: "https://resume.copilotadoption.uk",
    title: "Giorgio Tsoupis — Enterprise AI Adoption Program Manager",
    description:
      "Résumé of Giorgio Tsoupis: enterprise Microsoft 365 Copilot adoption " +
      "and transformation program manager. Governance, telemetry, and " +
      "role-based enablement that moves AI from pilot to production.",
    ogImage: "/images/og-cover.png",
    twitterHandle: undefined, // Optional: set your X handle (no "@") if any.
    robots: "index, follow",
    // Keep contact OUT of structured data by default (privacy).
    exposeContactInStructuredData: false,
  },

  /* ------------------------------------------------------------------ */
  /* Experience                                                          */
  /* ------------------------------------------------------------------ */
  experience: [
    {
      role: "Copilot Adoption Lead",
      organization: "Hilti Corporation",
      location: "Schaan, Liechtenstein (Remote)",
      dates: { start: "2025-09", end: "present" },
      summary:
        "Own the enterprise Microsoft 365 Copilot adoption operating model " +
        "across regional and cross-functional programs.",
      responsibilities: [
        "Built the enterprise adoption operating model from zero: steering cadences, sprint planning, KPI reviews, backlog prioritization, Champion Program governance, and Microsoft alignment.",
        "Co-led the Copilot product roadmap for the enterprise AI portfolio, prioritizing use cases by business impact, defining release criteria, and managing backlog flow from ideation to sustained adoption.",
        "Operationalized AI governance for license allocation, data handling, Copilot Studio, Agent Builder, and custom-agent controls, maintaining EU-aligned deployment boundaries and responsible-AI guardrails.",
        "Coordinated concurrent AI workstreams across Copilot M365, Copilot Studio agents, and Entra / Power Platform automation, preventing scope collision across business units.",
      ],
      achievements: [
        {
          quantified: true,
          result:
            "Scaled Microsoft 365 Copilot from pilot to governed production across 13 markets, establishing the value case for expansion toward 35,000 enterprise licenses.",
          impact: {
            value: 98,
            unit: "% active adoption",
            basis: "2,161 active of 2,211 licensed users",
          },
          evidence:
            "Telemetry, Viva Insights, and 1,494 survey responses evidencing 98% license-retention intent and 88–91% positive productivity perception.",
          actions:
            "Established governance, telemetry, and a CIO-facing value case; role-based enablement and champion networks.",
          context: "Governed enterprise environment with EU data boundaries.",
          verification: "self-reported",
        },
        {
          quantified: true,
          result:
            "Sustained production adoption across Finance, IT, Sales, HR, and Knowledge Management within 90 days of program launch.",
          impact: {
            value: 95,
            unit: "%+ adoption",
            basis: "three consecutive quarters",
          },
          actions:
            "Role-based enablement, champion networks, and structured success tracking.",
          verification: "self-reported",
        },
      ],
    },
    {
      role: "Global Microsoft 365 Copilot Program Manager",
      organization: "Microsoft Corporation",
      location: "Redmond, Washington (Remote)",
      dates: { start: "2024-11", end: "2025-08" },
      responsibilities: [
        "Coordinated execution across Microsoft and partner teams, improving rollout consistency, stakeholder alignment, and operational readiness.",
        "Contributed to evaluation of AI pipeline options across Azure AI Foundry and related environments to inform Copilot Studio integration and LLM deployment decisions.",
      ],
      achievements: [
        {
          quantified: true,
          result:
            "Operationalized Copilot Studio and Power Platform workflows in a 700+ engineer environment while maintaining service continuity.",
          impact: {
            value: 72,
            unit: "% reduction",
            basis: "support ticket costs",
          },
          actions:
            "Workflow automation and service-metric alignment with business KPIs.",
          verification: "self-reported",
        },
        {
          quantified: true,
          result:
            "Aligned AI delivery with business KPIs and service metrics, translating operational signals into executive-ready decision inputs for Copilot activation, growth, and renewal.",
          impact: {
            value: 1_100_000,
            unit: "Copilot users",
            basis: "FY2025 activation, growth and renewal",
          },
          verification: "self-reported",
        },
      ],
    },
    {
      role: "Global Business Development Manager — Microsoft Channel",
      organization: "Noventiq (formerly Softline)",
      location: "London, United Kingdom (Remote)",
      dates: { start: "2022-12", end: "2024-12" },
      responsibilities: [
        "Established Microsoft 365 Copilot delivery across 55+ countries and 14 companies, providing consistent regional coordination in the global CSP channel.",
        "Standardized enablement through multilingual Copilot handbooks and virtual programs, improving readiness across distributed teams.",
      ],
      achievements: [
        {
          quantified: true,
          result:
            "Operationalized adoption and expansion GTM programs with structured execution controls.",
          impact: {
            value: 58,
            unit: "% higher conversion",
            basis: "alongside a 90% reduction in acquisition cost",
          },
          verification: "self-reported",
        },
        {
          quantified: true,
          result:
            "Governed a $5M+ budget with disciplined execution and cost control.",
          impact: {
            value: 33,
            unit: "% gross-profit growth",
            basis: "year over year, with 15–25% cost optimization",
          },
          verification: "self-reported",
        },
      ],
    },
    {
      role: "Senior Partnerships Development Manager",
      organization: "InterWorks.Cloud",
      location: "Athens, Greece",
      dates: { start: "2020-03", end: "2022-11" },
      responsibilities: [
        "Standardized onboarding and enablement for 150+ channel partners and ISVs, improving modernization readiness.",
      ],
      achievements: [
        {
          quantified: true,
          result:
            "Established partner development programs that grew revenue and converted pipeline across cloud portfolios.",
          impact: {
            value: 30,
            unit: "% revenue increase",
            basis: "with $5M+ pipeline converted",
          },
          verification: "self-reported",
        },
      ],
    },
    {
      role: "Regional Business Development Manager (Part-Time)",
      organization: "Huawei Consumer Business Group",
      location: "Warsaw, Poland",
      dates: { start: "2020-04", end: "2021-12" },
      responsibilities: [
        "Coordinated growth programs across 13 countries through consistent regional execution.",
      ],
      achievements: [
        {
          quantified: true,
          result:
            "Drove monthly active user and revenue growth across the regional portfolio.",
          impact: {
            value: 87.5,
            unit: "% MAU growth",
            basis: "with 40% revenue growth",
          },
          verification: "self-reported",
        },
      ],
    },
    {
      role: "Cloud Partner Development Manager",
      organization: "Microsoft Corporation",
      location: "Central & Eastern Europe",
      dates: { start: "2017-07", end: "2020-04" },
      responsibilities: [
        "Activated 100+ ISVs and 90 SMB providers to establish Azure adoption across Central and Eastern Europe.",
      ],
      achievements: [
        {
          quantified: true,
          result:
            "Sustained execution discipline through KPI-led pipeline management.",
          impact: {
            value: 11,
            unit: "consecutive quarters",
            basis: "of quota attainment; 100%+ Azure consumption growth",
          },
          verification: "self-reported",
        },
      ],
    },
  ],

  /* ------------------------------------------------------------------ */
  /* Projects (optional — hides cleanly if emptied)                      */
  /* ------------------------------------------------------------------ */
  projects: [
    {
      name: "Polymarket Tracker",
      description:
        "A lightweight, static web app that tracks and visualizes Polymarket " +
        "prediction-market data in the browser — built as a personal project " +
        "to explore live market data with a zero-backend, client-side approach.",
      url: "https://github.com/giorgiocopilot/polymarket-tracker",
      technologies: ["HTML", "CSS", "JavaScript"],
    },
  ],

  /* ------------------------------------------------------------------ */
  /* Skills                                                              */
  /* ------------------------------------------------------------------ */
  skills: [
    {
      category: "Enterprise AI Adoption",
      skills: [
        "Microsoft 365 Copilot",
        "Copilot Studio",
        "Copilot Chat",
        "Champion Communities",
        "ADKAR / change enablement",
      ],
    },
    {
      category: "AI Governance & Operating Models",
      skills: [
        "License governance",
        "Responsible-AI controls",
        "Compliance-by-design",
        "EU data-boundary awareness",
        "Adoption policies",
      ],
    },
    {
      category: "Program & Product Execution",
      skills: [
        "PoC-to-production delivery",
        "Roadmap ownership",
        "Backlog prioritization",
        "KPI definition",
        "Executive reporting",
        "Stakeholder alignment",
      ],
    },
    {
      category: "Technical Fluency",
      skills: [
        "Power Platform",
        "Azure",
        "Azure AI Foundry",
        "RAG / LLM applications",
        "Telemetry & adoption analytics",
        "Viva Insights",
      ],
    },
  ],

  /* ------------------------------------------------------------------ */
  /* Education                                                           */
  /* ------------------------------------------------------------------ */
  education: [
    {
      credential: "Master's Degree in International Relations",
      institution: "Università degli Studi Roma Tre, Italy",
    },
  ],

  /* ------------------------------------------------------------------ */
  /* Certifications                                                      */
  /* ------------------------------------------------------------------ */
  certifications: [
    { name: "Microsoft Copilot Sales Champion", issuer: "Microsoft" },
    { name: "Copilot for M365 Technical Champion", issuer: "Microsoft" },
    { name: "Copilot Partner Bootcamp", issuer: "Microsoft" },
    {
      name: "Microsoft 365 Business Value Sales Proficiency Badge",
      issuer: "Microsoft",
    },
    { name: "Implement Copilot for Microsoft 365", issuer: "Microsoft" },
    { name: "Fundamental AI Concepts", issuer: "Microsoft" },
    { name: "Career Essentials in Generative AI", issuer: "Microsoft / LinkedIn" },
    { name: "Building in Microsoft Copilot Studio", issuer: "Microsoft" },
    { name: "Learning Microsoft 365 Copilot (2024)", issuer: "Microsoft" },
  ],

  /* ------------------------------------------------------------------ */
  /* Languages                                                           */
  /* ------------------------------------------------------------------ */
  languages: [
    { language: "English", proficiency: "Professional" },
    { language: "Italian", proficiency: "Native" },
    { language: "Greek", proficiency: "Native" },
    { language: "Spanish", proficiency: "Elementary (learning)" },
  ],

  /* ------------------------------------------------------------------ */
  /* Publications (optional — hides cleanly when empty)                  */
  /* ------------------------------------------------------------------ */
  publications: [],
});

export const resume: Resume = data;
export default resume;
