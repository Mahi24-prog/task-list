import type { Task } from "./types";

const tasks: Task[] = [
  {
    id: "1",
    title: "Learn React Fundamentals",
    description: "Understand hooks, state, and props in React.",
    completed: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "2",
    title: "Set up Vite environment",
    description: "Install dependencies and configure Vite for React + TS.",
    completed: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: "3",
    title: "Build Task App",
    description:
      "Create a CRUD task application using Material UI and React Query.",
    completed: false,
    createdAt: new Date().toISOString(),
  },
];

const DELAY = 500;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  getTasks: async (): Promise<Task[]> => {
    await delay(DELAY);
    return [...tasks].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  },

  getTask: async (id: string): Promise<Task> => {
    await delay(DELAY);
    const task = tasks.find((t) => t.id === id);
    if (!task) {
      throw new Error("Task not found");
    }
    return { ...task };
  },

  createTask: async (
    taskData: Omit<Task, "id" | "createdAt" | "completed">,
  ): Promise<Task> => {
    await delay(DELAY);
    const newTask: Task = {
      ...taskData,
      id: Math.random().toString(36).substr(2, 9),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  updateTask: async (id: string, updates: Partial<Task>): Promise<Task> => {
    await delay(DELAY);
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error("Task not found");
    }
    tasks[index] = { ...tasks[index], ...updates };
    return { ...tasks[index] };
  },

  deleteTask: async (id: string): Promise<void> => {
    await delay(DELAY);
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error("Task not found");
    }
    tasks.splice(index, 1);
  },
};
