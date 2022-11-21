import { z } from "zod";
import { router, publicProcedure } from "../trpc";

export const taskRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.task.findMany();
  }),
  create: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ input, ctx }) => {
      const task = ctx.prisma.task.create({
        data: {
          name: input.name,
          isDone: false,
        },
      });
      return task;
    }),
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.task.delete({
        where: {
          id: input.id,
        },
      });
    }),
  toggleCheck: publicProcedure
    .input(z.object({ id: z.string(), isDone: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.task.update({
        where: {
          id: input.id,
        },
        data: {
          isDone: !input.isDone,
        },
      });
    }),
});
