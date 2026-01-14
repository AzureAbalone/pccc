import { z } from 'zod';

export const ComplianceRequestSchema = z.object({
  description: z.string().min(10, "Project description must be at least 10 characters"),
  type: z.enum(['F1.2', 'F1.3', 'Other']).optional(), // Extend as needed
  height: z.number().positive().optional(),
  floors: z.number().int().positive().optional(),
});

export type ComplianceRequest = z.infer<typeof ComplianceRequestSchema>;

export const ComplianceResponseSchema = z.object({
  buildingInfo: z.object({
    floors: z.number().nullable(),
    height: z.number().nullable(),
    floorArea: z.number().nullable(),
    buildingType: z.string().nullable(),
    fireClass: z.string().nullable(),
    hazardGroup: z.string().nullable(),
  }),
  escapeSolutions: z.array(z.string()),
  fireSpreadPrevention: z.array(z.string()),
  fireTraffic: z.array(z.string()),
  technicalSystems: z.array(z.string()),
  citations: z.array(z.object({
    source: z.string(),
    text: z.string(),
    url: z.string().nullable().optional(),
    category: z.string().optional() // Added for frontend categorization
  }))
});

export type ComplianceResponse = z.infer<typeof ComplianceResponseSchema>;
