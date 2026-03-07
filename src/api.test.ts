import { api } from "./api";

describe("api service", () => {
  it("should fetch tasks successfully", async () => {
    const tasks = await api.getTasks();
    expect(tasks).toBeDefined();
    expect(tasks.length).toBeGreaterThan(0);
  });

  it("should fetch a single task by id", async () => {
    const tasks = await api.getTasks();
    const task = await api.getTask(tasks[0].id);
    expect(task).toBeDefined();
    expect(task.id).toBe(tasks[0].id);
  });

  it("should throw error when getting non-existent task", async () => {
    await expect(api.getTask("invalid-id")).rejects.toThrow("Task not found");
  });

  it("should create a new task", async () => {
    const newTaskParams = {
      title: "Test Create Task",
      description: "Test description",
    };
    const newTask = await api.createTask(newTaskParams);
    expect(newTask.title).toBe(newTaskParams.title);
    expect(newTask.description).toBe(newTaskParams.description);
    expect(newTask.id).toBeDefined();
    expect(newTask.completed).toBe(false);
  });

  it("should update a task", async () => {
    const tasks = await api.getTasks();
    const taskToUpdate = tasks[0];

    const updatedTask = await api.updateTask(taskToUpdate.id, {
      completed: !taskToUpdate.completed,
    });
    expect(updatedTask.id).toBe(taskToUpdate.id);
    expect(updatedTask.completed).not.toBe(taskToUpdate.completed);
  });

  it("should delete a task", async () => {
    const tasks = await api.getTasks();
    const taskCount = tasks.length;

    await api.deleteTask(tasks[0].id);
    const updatedTasks = await api.getTasks();
    expect(updatedTasks.length).toBe(taskCount - 1);
  });
});
