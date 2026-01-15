import { z } from 'zod';

export const ComplianceRequestSchema = z.object({
  description: z.string().min(10, "Project description must be at least 10 characters"),
  type: z.enum(['F1.2', 'F1.3', 'Other']).optional(), // Extend as needed
  height: z.number().positive().optional(),
  floors: z.number().int().positive().optional(),
});

export type ComplianceRequest = z.infer<typeof ComplianceRequestSchema>;

// Reference schema - supports both old (url) and new (clause) formats
const ReferenceSchema = z.object({
  source: z.string(),
  text: z.string().optional(),
  url: z.string().optional(),
  clause: z.string().optional(),      // NEW: Specific clause/article reference
  requirement: z.string().optional()   // NEW: Requirement description
});

// Compliance item schema - now with optional title
const ComplianceItemSchema = z.object({
  title: z.string().optional(),    // NEW: Short title for the solution
  content: z.string(),
  references: z.array(ReferenceSchema).optional()
});

export const ComplianceResponseSchema = z.object({
  buildingInfo: z.object({
    floors: z.number().nullable(),
    height: z.number().nullable(),
    floorArea: z.number().nullable(),
    buildingType: z.string().nullable(),
    fireClass: z.string().nullable(),
    hazardGroup: z.string().nullable(),
  }),
  escapeSolutions: z.array(ComplianceItemSchema),
  fireSpreadPrevention: z.array(ComplianceItemSchema),
  fireTraffic: z.array(ComplianceItemSchema),
  technicalSystems: z.array(ComplianceItemSchema),
  citations: z.array(z.object({
    source: z.string(),
    text: z.string(),
    url: z.string().nullable().optional(),
    clause: z.string().optional(),       // NEW: Specific clause reference
    category: z.string().optional()      // For frontend categorization
  }))
});

export type ComplianceResponse = z.infer<typeof ComplianceResponseSchema>;
export type ComplianceItem = z.infer<typeof ComplianceItemSchema>;
export type Reference = z.infer<typeof ReferenceSchema>;
