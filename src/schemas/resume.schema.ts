/**
 * resume.schema.ts
 * -----------------------------------------------------------------------------
 * Single source of truth for the SHAPE of all résumé content.
 *
 * We define Zod schemas and derive TypeScript types from them with `z.infer`.
 * This gives us BOTH:
 *   1. Compile-time type-safety (autocomplete / red squiggles in the editor).
 *   2. Runtime validation (the build fails loudly if `resume.data.ts` is wrong).
 *
 * The data file (`src/data/resume.data.ts`) imports `resumeSchema.parse(...)`,
 * so an invalid shape throws during `astro build` / `astro check` — exactly the
 * "build-time validation that fails with a clear message" the brief requires.
 * -----------------------------------------------------------------------------
 */
import { z } from "zod";

/* ----------------------------------------------------------------------------
 * Primitive / reusable building blocks
 * ------------------------------------------------------------------------- */

/** An absolute URL. Zod enforces a valid URL string at runtime. */
export const urlSchema = z
  .string()
  .url("Must be a valid absolute URL, e.g. https://example.com");

/**
 * A month-precision date: "YYYY-MM" (ISO-8601 compatible calendar month).
 * We deliberately keep résumé dates to month precision for privacy + tidiness.
 */
export const yearMonthSchema = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Date must be "YYYY-MM", e.g. "2025-09"');

/**
 * A full ISO date "YYYY-MM-DD" — used only where a precise day is genuinely
 * required (e.g. a certification issue date). Optional everywhere.
 */
export const isoDateSchema = z
  .string()
  .regex(
    /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
    'Date must be a full ISO date "YYYY-MM-DD"',
  );

/**
 * A date range. `end` may be the literal string "present" for ongoing roles,
 * a "YYYY-MM" month, OR omitted entirely (rendered as "present" downstream).
 */
export const dateRangeSchema = z
  .object({
    start: yearMonthSchema,
    end: z.union([yearMonthSchema, z.literal("present")]).optional(),
  })
  .strict();

/* ----------------------------------------------------------------------------
 * Contact + configuration
 * ------------------------------------------------------------------------- */

/** How long the "revealed résumé" UI state should persist. */
export const revealPersistenceSchema = z.enum(["none", "session", "local"]);

/**
 * Typed labelled link (LinkedIn, GitHub, portfolio, …).
 * `rel` defaults are applied in the components, not here.
 */
export const contactLinkSchema = z
  .object({
    label: z.string().min(1),
    href: urlSchema,
    /** Optional short handle shown next to the label, e.g. "@giorgio". */
    handle: z.string().min(1).optional(),
  })
  .strict();

/**
 * Contact + reveal configuration. All contact values live HERE (one file),
 * per the privacy requirement.
 */
export const contactConfigSchema = z
  .object({
    email: z.string().email(),
    /** WhatsApp number, INTERNATIONAL DIGITS ONLY (no "+", spaces or dashes). */
    whatsappNumber: z
      .string()
      .regex(/^\d{6,15}$/, "WhatsApp number must be 6–15 digits, no symbols"),
    emailSubject: z.string().min(1),
    emailBody: z.string().min(1),
    whatsappMessage: z.string().min(1),
    /** Where the "revealed" flag is stored. Defaults to "session". */
    revealPersistence: revealPersistenceSchema.default("session"),
    /** Labelled external links shown in the header/footer. */
    links: z.array(contactLinkSchema).default([]),
  })
  .strict();

/* ----------------------------------------------------------------------------
 * Personal profile / hero
 * ------------------------------------------------------------------------- */

export const locationSchema = z
  .object({
    /** City or region ONLY — never a street address (privacy requirement). */
    city: z.string().min(1),
    country: z.string().min(1),
    /** e.g. "Remote-first", "Hybrid", "On-site". Optional. */
    remotePreference: z.string().min(1).optional(),
  })
  .strict();

export const workAuthorizationSchema = z
  .object({
    /** e.g. "EU work rights". */
    summary: z.string().min(1),
    /** Optional list of regions where the person can legally work. */
    regions: z.array(z.string().min(1)).optional(),
  })
  .strict();

export const profileSchema = z
  .object({
    fullName: z.string().min(1),
    headline: z.string().min(1),
    /** Executive summary shown ABOVE the reveal fold. Plain text. */
    summary: z.string().min(1),
    location: locationSchema,
    workAuthorization: workAuthorizationSchema,
    photo: z
      .object({
        /** Path under /public, e.g. "/images/profile". Sizes appended later. */
        srcBase: z.string().min(1),
        alt: z.string().min(1),
        width: z.number().int().positive(),
        height: z.number().int().positive(),
      })
      .strict(),
  })
  .strict();

/* ----------------------------------------------------------------------------
 * Achievements — Minto Pyramid Principle
 * ------------------------------------------------------------------------- */

/**
 * A measurable impact. Value + unit are required; comparison basis optional.
 * Example: { value: 98, unit: "%", basis: "active adoption of licensed users" }
 */
export const impactSchema = z
  .object({
    value: z.number(),
    unit: z.string().min(1),
    /** What the number is measured against, e.g. "year over year". */
    basis: z.string().min(1).optional(),
  })
  .strict();

/**
 * Achievement modelled on the Minto Pyramid Principle.
 *
 * Discriminated union on `quantified`:
 *  - quantified: true  → an `impact` object is REQUIRED (no invented numbers).
 *  - quantified: false → NO impact; transparently flagged as unquantified.
 */
const achievementBase = z.object({
  /** 1. Result-led summary that stands on its own. */
  result: z.string().min(1),
  /** 3. Supporting evidence (telemetry, survey n, source). Optional. */
  evidence: z.string().min(1).optional(),
  /** 4. Actions / methods that produced the result. Optional. */
  actions: z.string().min(1).optional(),
  /** 5. Business context. Optional. */
  context: z.string().min(1).optional(),
  /** 6. Confidence / verification status. Optional. */
  verification: z
    .enum(["verified", "self-reported", "estimated"])
    .optional(),
});

export const quantifiedAchievementSchema = achievementBase
  .extend({
    quantified: z.literal(true),
    /** 2. Measurable business impact — required when quantified. */
    impact: impactSchema,
  })
  .strict();

export const unquantifiedAchievementSchema = achievementBase
  .extend({
    quantified: z.literal(false),
  })
  .strict();

export const achievementSchema = z.discriminatedUnion("quantified", [
  quantifiedAchievementSchema,
  unquantifiedAchievementSchema,
]);

/* ----------------------------------------------------------------------------
 * Experience / projects / education / credentials
 * ------------------------------------------------------------------------- */

export const experienceSchema = z
  .object({
    role: z.string().min(1),
    organization: z.string().min(1),
    location: z.string().min(1).optional(),
    dates: dateRangeSchema,
    /** Short framing line for the role. Optional. */
    summary: z.string().min(1).optional(),
    responsibilities: z.array(z.string().min(1)).default([]),
    achievements: z.array(achievementSchema).default([]),
  })
  .strict();

export const projectSchema = z
  .object({
    name: z.string().min(1),
    description: z.string().min(1),
    url: urlSchema.optional(),
    technologies: z.array(z.string().min(1)).default([]),
    dates: dateRangeSchema.optional(),
  })
  .strict();

export const skillGroupSchema = z
  .object({
    category: z.string().min(1),
    skills: z.array(z.string().min(1)).min(1),
  })
  .strict();

export const educationSchema = z
  .object({
    credential: z.string().min(1),
    institution: z.string().min(1),
    dates: dateRangeSchema.optional(),
    details: z.string().min(1).optional(),
  })
  .strict();

export const certificationSchema = z
  .object({
    name: z.string().min(1),
    issuer: z.string().min(1).optional(),
    /** Precise issue date only when known. */
    issued: isoDateSchema.optional(),
    url: urlSchema.optional(),
  })
  .strict();

export const languageSchema = z
  .object({
    language: z.string().min(1),
    /** CEFR-style or plain proficiency, e.g. "Native", "Professional". */
    proficiency: z.string().min(1),
  })
  .strict();

export const publicationSchema = z
  .object({
    title: z.string().min(1),
    outlet: z.string().min(1).optional(),
    date: yearMonthSchema.optional(),
    url: urlSchema.optional(),
  })
  .strict();

/* ----------------------------------------------------------------------------
 * SEO / site configuration
 * ------------------------------------------------------------------------- */

export const seoConfigSchema = z
  .object({
    /** Canonical site origin, e.g. "https://resume.copilotadoption.uk". */
    canonicalUrl: urlSchema,
    title: z.string().min(1),
    description: z.string().min(1),
    /** Absolute or root-relative path to an Open Graph image. */
    ogImage: z.string().min(1),
    /** Twitter/X handle WITHOUT "@". Optional. */
    twitterHandle: z.string().min(1).optional(),
    /** robots directive, e.g. "index, follow". */
    robots: z.string().min(1).default("index, follow"),
    /**
     * When true, email/phone are exposed inside JSON-LD structured data.
     * Defaults to FALSE (privacy requirement).
     */
    exposeContactInStructuredData: z.boolean().default(false),
  })
  .strict();

/* ----------------------------------------------------------------------------
 * Top-level résumé document
 * ------------------------------------------------------------------------- */

export const resumeSchema = z
  .object({
    profile: profileSchema,
    contact: contactConfigSchema,
    seo: seoConfigSchema,
    experience: z.array(experienceSchema).default([]),
    projects: z.array(projectSchema).default([]),
    skills: z.array(skillGroupSchema).default([]),
    education: z.array(educationSchema).default([]),
    certifications: z.array(certificationSchema).default([]),
    languages: z.array(languageSchema).default([]),
    publications: z.array(publicationSchema).default([]),
  })
  .strict();

/* ----------------------------------------------------------------------------
 * Inferred TypeScript types (single source of truth)
 * ------------------------------------------------------------------------- */

export type Url = z.infer<typeof urlSchema>;
export type DateRange = z.infer<typeof dateRangeSchema>;
export type ContactLink = z.infer<typeof contactLinkSchema>;
export type RevealPersistence = z.infer<typeof revealPersistenceSchema>;
export type ContactConfig = z.infer<typeof contactConfigSchema>;
export type Location = z.infer<typeof locationSchema>;
export type WorkAuthorization = z.infer<typeof workAuthorizationSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type Impact = z.infer<typeof impactSchema>;
export type Achievement = z.infer<typeof achievementSchema>;
export type QuantifiedAchievement = z.infer<typeof quantifiedAchievementSchema>;
export type UnquantifiedAchievement = z.infer<
  typeof unquantifiedAchievementSchema
>;
export type Experience = z.infer<typeof experienceSchema>;
export type Project = z.infer<typeof projectSchema>;
export type SkillGroup = z.infer<typeof skillGroupSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Certification = z.infer<typeof certificationSchema>;
export type Language = z.infer<typeof languageSchema>;
export type Publication = z.infer<typeof publicationSchema>;
export type SeoConfig = z.infer<typeof seoConfigSchema>;
export type Resume = z.infer<typeof resumeSchema>;
