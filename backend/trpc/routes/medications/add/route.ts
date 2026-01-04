import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";

// Define the reminder schema
const reminderSchema = z.object({
  time: z.string(),
  days: z.array(z.string())
});

// Define the medication schema
const medicationSchema = z.object({
  name: z.string(),
  dosage: z.string(),
  frequency: z.string(),
  time: z.string().nullable(),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  instructions: z.string(),
  purpose: z.string(),
  prescribedBy: z.string(),
  prescriptionDate: z.string(),
  prescriptionId: z.string(),
  reminders: z.array(reminderSchema),
  medicationType: z.enum(["regular", "sos"]),
  // We can't store the actual image in the backend, so we'll just store a flag
  hasPrescriptionImage: z.boolean().optional()
});

export const addMedicationProcedure = publicProcedure
  .input(medicationSchema)
  .mutation(async ({ input }) => {
    // In a real application, you would save this to a database
    // For now, we'll just return the input with a generated ID
    
    return {
      id: Math.floor(Math.random() * 10000),
      ...input,
      createdAt: new Date(),
    };
  });