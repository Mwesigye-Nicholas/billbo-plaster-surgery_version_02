import z from "zod";
import { sexSchema } from "./shared.schema";
import { PhoneNumberSchema } from "./shared.schema";
import { nextOfKinSchema } from "./shared.schema";



export const updateRegistrationSchema = z.object({
    name: z.string().min(2).optional(),
    sex: sexSchema.optional(),
    address: z.string().optional(),
    dateOfBirth: z.coerce.date().optional(),
    phoneNumbers: z.array(PhoneNumberSchema).optional(),
    email: z.email().optional(),
    nextOfKin: nextOfKinSchema.optional(),

});
