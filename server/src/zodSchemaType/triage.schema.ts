import z from "zod";

export const triageSchema = z.object({
  systolicBP: z.number().positive({ message: "Systolic BP must be a positive value" }).optional(),
  diastolicBP: z.number().positive({ message: "diastolic BP must be a positve value" }).optional(),
  pulse: z.number().positive({ message: "Pulse must be a positive value" }).optional(),
  temp: z.number().positive({ message: "Temp must be a positive value" }).optional(),
  spo2: z.number().positive({ message: "SPO2 must be a positive value" }).optional(),
  height: z.number().positive({ message: "Height must be a positive value" }).optional(),
  weight: z.number().positive({ message: "Weight  must be a positive value" }).optional(),
});


export type TriageSchema = z.infer<typeof triageSchema>;
