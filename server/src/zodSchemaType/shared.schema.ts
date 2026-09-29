import z from "zod";

export const sexSchema = z.enum(["Male", "Female", "Prefer Not Say"]);

export const PhoneNumberSchema = z.object({
    phoneType: z.enum(["Home", "Work", "Mobile"]),
    number: z.string().min(10)
});

export const nextOfKinSchema = z.object({
    name: z.string().min(1),
    contactNumber: z.array(z.string().min(10)).min(1)
});