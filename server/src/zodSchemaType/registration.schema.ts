import z from "zod";
import { sexSchema } from "./shared.schema";
import { PhoneNumberSchema } from "./shared.schema";
import { nextOfKinSchema } from "./shared.schema";

export const registrationSchema = z.object({
  name: z.string().min(2),
  sex: sexSchema,
  address: z.string(),
  dateOfBirth: z.coerce.date(),
  phoneNumbers: z.array(PhoneNumberSchema),
  email: z.email(),
  nextOfKin: nextOfKinSchema,
  patientId: z.string().min(1),
});

export type Registration = z.infer<typeof registrationSchema>;
