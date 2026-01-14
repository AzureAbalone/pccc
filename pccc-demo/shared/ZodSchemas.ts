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
  escapeSolutions: z.array(z.object({
    content: z.string(),
    references: z.array(z.object({
      source: z.string(),
      text: z.string(),
      link: z.string().optional()
    })).optional()
  })),
  fireSpreadPrevention: z.array(z.object({
    content: z.string(),
    references: z.array(z.object({
      source: z.string(),
      text: z.string(),
      link: z.string().optional()
    })).optional()
  })),
  fireTraffic: z.array(z.object({
    content: z.string(),
    references: z.array(z.object({
      source: z.string(),
      text: z.string(),
      link: z.string().optional()
    })).optional()
  })),
  technicalSystems: z.array(z.object({
    content: z.string(),
    references: z.array(z.object({
      source: z.string(),
      text: z.string(),
      link: z.string().optional()
    })).optional()
  })),
  citations: z.array(z.object({
    source: z.string(), // e.g., "QCVN 06:2022/BXD"
    text: z.string(),   // e.g., "Table H.4"
    link: z.string().optional()
  }))
});

export type ComplianceResponse = z.infer<typeof ComplianceResponseSchema>;
