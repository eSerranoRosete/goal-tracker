import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const goalRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.goal.findMany({ include: { days: true } });
  }),
  create: publicProcedure
    .input(z.object({ description: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const date = new Date();
      const daysInMonth = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
      ).getDate();

      const days = [];

      for (let i = 0; i < daysInMonth; i++) {
        days.push({
          isCompleted: false,
        });
      }

      const goal = await ctx.prisma.goal.create({
        data: {
          description: input.description,
          days: {
            create: days,
          },
        },
      });

      return goal;
    }),
  update: publicProcedure
    .input(z.object({ id: z.string(), completed: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.day.update({
        where: {
          id: input.id,
        },
        data: {
          isCompleted: input.completed,
        },
      });
    }),
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.goal.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
