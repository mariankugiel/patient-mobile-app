import { publicProcedure } from "@/backend/trpc/create-context";
import { medications } from "@/constants/patient";

export default publicProcedure
  .query(async () => {
    // In a real application, you would fetch this from a database
    // For now, we'll just return the mock data
    return medications;
  });