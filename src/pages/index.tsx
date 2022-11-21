import type { NextPage } from "next";
import { trpc } from "../utils/trpc";
import type { FormEvent } from "react";
import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import type { Goal } from "@prisma/client";

const GoalPage: NextPage = () => {
  const goals = trpc.goal.getAll.useQuery();
  const goalMutation = trpc.goal.create.useMutation();
  const dayMutation = trpc.goal.update.useMutation();
  const deleteGoalMutation = trpc.goal.delete.useMutation();

  const [targetGoal, setTargetGoal] = useState<{ goal: Goal; dayId: string }>();

  const [updateOverlay, setUpdateOverlay] = useState(false);

  const [goalDescription, setGoalDescription] = useState("");

  const createGoal = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    goalMutation.mutate(
      {
        description: goalDescription,
      },
      {
        onSuccess: () => goals.refetch(),
      }
    );
    e.currentTarget.reset();
  };

  const currentDay = new Date().getDate();

  if (!goals.data) return <div>Loading Goals...</div>;

  return (
    <div className="w-full">
      {updateOverlay && (
        <div className="absolute z-50 flex h-screen w-full items-center justify-center bg-black/80 p-5">
          <div className="relative w-full max-w-md rounded-md border border-neutral-800 bg-neutral-900 p-5">
            <div className="mb-5 text-xl">{targetGoal?.goal.description}</div>
            <form>
              <p>Have you completed this goal for today?</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="rounded-md border border-indigo-600 bg-indigo-600 py-1 hover:bg-indigo-800"
                  onClick={() => {
                    dayMutation.mutate(
                      {
                        id: targetGoal?.dayId || "",
                        completed: true,
                      },
                      {
                        onSuccess: () => {
                          goals.refetch();
                          setUpdateOverlay(!updateOverlay);
                        },
                      }
                    );
                  }}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className="rounded-md border border-neutral-700 bg-neutral-800 py-1 hover:bg-transparent"
                  onClick={() => {
                    dayMutation.mutate(
                      {
                        id: targetGoal?.dayId || "",
                        completed: false,
                      },
                      {
                        onSuccess: () => {
                          goals.refetch();
                          setUpdateOverlay(!updateOverlay);
                        },
                      }
                    );
                  }}
                >
                  No
                </button>
              </div>
              <details className="mt-10 text-sm text-neutral-400">
                <summary className="cursor-pointer">More Options</summary>
                <button
                  type="button"
                  className="mt-2 w-full rounded-md border border-rose-800 bg-rose-800/10 py-1 text-base text-rose-500 hover:bg-rose-800/5"
                  onClick={() => {
                    deleteGoalMutation.mutate(
                      {
                        id: targetGoal?.goal.id || "",
                      },
                      {
                        onSuccess: () => {
                          goals.refetch();
                          setUpdateOverlay(!updateOverlay);
                        },
                      }
                    );
                  }}
                >
                  Delete this goal
                </button>
              </details>
            </form>
            <XMarkIcon
              onClick={() => setUpdateOverlay(!updateOverlay)}
              className="absolute top-2 right-2 w-5 cursor-pointer"
            />
          </div>
        </div>
      )}
      <div className="m-auto max-w-md p-10">
        <form className="m-auto mb-10 w-full" onSubmit={(e) => createGoal(e)}>
          <label htmlFor="name">
            Goal Description:
            <input
              type="text"
              name="name"
              className="mt-2 block w-full rounded-md border border-neutral-700 bg-transparent py-2 px-4 text-neutral-100"
              required
              onChange={(e) => setGoalDescription(e.target.value)}
            />
          </label>
          <button
            type="submit"
            className="mt-2 w-full rounded-md border border-indigo-600 bg-indigo-600 p-2 text-center text-white hover:bg-indigo-800"
          >
            Set Goal
          </button>
        </form>
        <h5>My Goals:</h5>
        <hr className="mt-2 mb-5 opacity-20" />
        <ul>
          {goals.data.map((goal) => (
            <li
              key={goal.id}
              className="mb-5 cursor-pointer rounded-md p-2 hover:bg-neutral-800/50"
              onClick={() => {
                setUpdateOverlay(!updateOverlay);
                setTargetGoal({
                  goal,
                  dayId: goal.days[currentDay - 1]?.id || "",
                });
              }}
            >
              <div className="flex">
                <div className="grow">{goal.description}</div>
              </div>
              <div className="mt-2">
                {goal.days.map((day, index) => (
                  <div
                    key={day.id}
                    className={`mr-1.5 inline-block h-4 w-4 rounded-sm border leading-none ${
                      index + 1 < currentDay
                        ? "border-neutral-100/10 bg-neutral-800"
                        : day.isCompleted
                        ? "border-green-500 bg-green-500/80 shadow-md shadow-green-500/30"
                        : "border-green-500/30 bg-green-500/10"
                    }`}
                  ></div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GoalPage;
