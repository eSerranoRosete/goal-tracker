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

  const [addOverlay, setAddOverlay] = useState(false);

  const [goalDescription, setGoalDescription] = useState("");

  const createGoal = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    goalMutation.mutate(
      {
        description: goalDescription,
      },
      {
        onSuccess: () => {
          goals.refetch();
          setAddOverlay(!addOverlay);
          e.currentTarget.reset();
        },
      }
    );
  };

  const currentDay = new Date().getDate();

  if (!goals.data)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex items-center">
          <svg
            className="mr-2 h-6 w-6 animate-spin"
            viewBox="0 0 236 236"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M118 236C183.17 236 236 183.17 236 118C236 52.8303 183.17 0 118 0C52.8303 0 0 52.8303 0 118C0 183.17 52.8303 236 118 236ZM118.5 195C160.75 195 195 160.75 195 118.5C195 76.2502 160.75 42 118.5 42C76.2502 42 42 76.2502 42 118.5C42 160.75 76.2502 195 118.5 195Z"
              className="fill-neutral-500/50"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M2.27774 97.0337C0.223963 108.487 9.85314 118 21.4887 118V118C33.0716 118 42.1874 108.471 45.3853 97.3381C54.565 65.3815 84.0123 42 118.921 42C154.004 42 183.571 65.6159 192.592 97.8179C195.642 108.706 204.547 118 215.854 118V118C227.213 118 236.608 108.716 234.651 97.5277C224.958 42.1162 176.608 0 118.421 0C60.4065 0 12.1706 41.8661 2.27774 97.0337Z"
              fill="#4C46E3"
            />
          </svg>
          Loading Goals...
        </div>
      </div>
    );

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
                  className="rounded-md border border-indigo-600 bg-indigo-600 py-1 hover:bg-opacity-40"
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
                  className="rounded-md border border-neutral-700 bg-neutral-800 py-1 hover:bg-opacity-40"
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
                  className="mt-2 w-full rounded-md border border-rose-800 bg-rose-900/5 py-1 text-base text-neutral-100 hover:bg-rose-900/20"
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

      {addOverlay && (
        <div className="absolute z-50 flex h-screen w-full items-center justify-center bg-black/80 p-5">
          <div className="relative w-full max-w-md rounded-md border border-neutral-800 bg-neutral-900 p-5">
            <div className="mb-5 text-xl">Set New Goal</div>
            <form className="m-auto w-full" onSubmit={(e) => createGoal(e)}>
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
              <div className="mt-3 grid grid-cols-2 gap-3">
                <button
                  type="submit"
                  className="rounded-md border border-indigo-600 bg-indigo-600 py-1 hover:bg-opacity-40"
                >
                  Set Goal
                </button>
                <button
                  type="button"
                  className="rounded-md border border-neutral-700 bg-neutral-800 py-1 hover:bg-opacity-40"
                  onClick={() => setAddOverlay(!addOverlay)}
                >
                  Cancel
                </button>
              </div>
            </form>
            <XMarkIcon
              onClick={() => setAddOverlay(!addOverlay)}
              className="absolute top-2 right-2 w-5 cursor-pointer"
            />
          </div>
        </div>
      )}
      <div className="m-auto max-w-md p-10">
        <div className="flex items-center">
          <span className="grow">My Goals:</span>
          <button
            onClick={() => setAddOverlay(!addOverlay)}
            className="rounded-full border border-indigo-600 bg-indigo-600 px-4 py-1 text-sm hover:bg-opacity-40"
          >
            Set New
          </button>
        </div>
        <hr className="mt-2 mb-5 opacity-20" />
        <ul>
          {goals.data.map((goal) => (
            <li
              key={goal.id}
              className="mb-5 cursor-pointer rounded-md border border-neutral-800 bg-neutral-800/30 p-2 hover:bg-neutral-800/50"
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
                    className={`relative mr-1.5 inline-flex h-4 w-4 items-center justify-center rounded-sm border leading-none ${
                      day.isCompleted
                        ? "border-green-500 bg-green-500/80 shadow-md shadow-green-500/30"
                        : "border-neutral-500/20 bg-neutral-800/50"
                    }`}
                  >
                    {index + 1 == currentDay && (
                      <div className="absolute h-1.5 w-1.5 rounded-full bg-white"></div>
                    )}
                  </div>
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
