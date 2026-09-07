import z, { email } from "zod";

const sexSchema = z.enum(["Male", "Female", "Prefer Not Say"]);

const PhoneNumberSchema = z.object({
    phoneType: z.enum(["Home", "Work", "Mobile"]),
    number: z.string().min(10)
});

const nextOfKinSchema = z.object({
    name: z.string().min(1),
    contactNumber: z.array(z.string().min(10)).min(1)
});


export const registrationSchema = z.object({
    name: z.string().min(2),
    sex: sexSchema,
    address: z.string(),
    dateOfBirth: z.date(),
    PhoneNumbers: z.array(PhoneNumberSchema),
    email: z.email(),
    nextOfKin: nextOfKinSchema,
    patientId: z.string().min(1)

});

export type Registration = z.infer<typeof registrationSchema>;