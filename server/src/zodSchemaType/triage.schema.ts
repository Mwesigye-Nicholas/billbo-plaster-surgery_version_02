import z from "zod";

export const triageSchema = z.object({
  systolicBP: z.number().optional(),
  diastolicBP: z.number().optional(),
  pulse: z.number().optional(),
  temp: z.number().optional(),
  spo2: z.number().optional(),
  height: z.number().optional(),
  weight: z.number().optional(),
  date: z.date().optional(),
}); 

export type TriageSchema = z.infer<typeof triageSchema>;
