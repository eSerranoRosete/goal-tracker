import { router } from "../trpc";
import { taskRouter } from "./task";
import { goalRouter } from "./goal";

export const appRouter = router({
  task: taskRouter,
  goal: goalRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
