import type { FormEvent } from "react";
import { useState } from "react";
import { trpc } from "../utils/trpc";
import { TrashIcon } from "@heroicons/react/20/solid";

const Home = () => {
  const [taskName, setTaskName] = useState("");

  const tasks = trpc.task.getAll.useQuery();

  const createTask = trpc.task.create.useMutation();
  const deleteTask = trpc.task.delete.useMutation();
  const toggleChecked = trpc.task.toggleCheck.useMutation();

  const handleCreateTask = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createTask.mutate(
      { name: taskName },
      {
        onSuccess: () => tasks.refetch(),
      }
    );
    e.currentTarget.reset();
  };

  const handleDeleteTask = (id: string) => {
    deleteTask.mutate(
      { id },
      {
        onSuccess: () => tasks.refetch(),
      }
    );
  };

  const handleToggleChecked = (id: string, isDone: boolean) => {
    toggleChecked.mutate({ id, isDone });
  };

  if (!tasks.data)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        Loading Tasks...
      </div>
    );

  return (
    <div className="w-full">
      <div className="m-auto max-w-md p-10">
        <form
          className="m-auto mb-10 w-full"
          onSubmit={(e) => handleCreateTask(e)}
        >
          <label htmlFor="name">
            Task Name:
            <input
              type="text"
              name="name"
              className="mt-2 block w-full rounded-md border border-neutral-700 bg-transparent p-2 text-neutral-100"
              onChange={(e) => setTaskName(e.target.value)}
              required
            />
          </label>
          <button
            type="submit"
            className="mt-2 w-full rounded-md bg-indigo-600 p-2 text-center text-white hover:bg-indigo-800"
          >
            Add task
          </button>
        </form>
        <h5>To Do:</h5>
        <hr className="mt-2 mb-5 opacity-20" />
        <ul>
          {tasks.data.map((task) => (
            <li
              key={task.id}
              className="flex items-center px-2 py-1 hover:bg-neutral-800"
            >
              <input
                type="checkbox"
                className="peer mr-2"
                defaultChecked={task.isDone}
                onChange={() => handleToggleChecked(task.id, task.isDone)}
              />
              <span className="grow peer-checked:line-through">
                {task.name}
              </span>
              <button
                className="cursor-pointer text-rose-500"
                onClick={() => handleDeleteTask(task.id)}
              >
                <TrashIcon className="w-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
