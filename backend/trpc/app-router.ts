import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import { addMedicationProcedure } from "./routes/medications/add/route";
import listMedicationsRoute from "./routes/medications/list/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  medications: createTRPCRouter({
    add: addMedicationProcedure,
    list: listMedicationsRoute,
  }),
});

export type AppRouter = typeof appRouter;