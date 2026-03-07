import { screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskList from "./TaskList";
import { renderWithMemoryRouter } from "../test-utils";
import { api } from "../api";

jest.mock("../api", () => ({
  api: {
    getTasks: jest.fn(),
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
  },
}));

const mockTasks = [
  {
    id: "1",
    title: "Task 1",
    description: "Desc 1",
    completed: false,
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "2",
    title: "Task 2",
    description: "Desc 2",
    completed: true,
    createdAt: "2023-01-02T00:00:00Z",
  },
];

describe("TaskList Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (api.getTasks as jest.Mock).mockResolvedValue(mockTasks);
  });

  it("renders loading state initially", () => {
    renderWithMemoryRouter(<TaskList />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("renders tasks after loading", async () => {
    renderWithMemoryRouter(<TaskList />);

    await waitFor(() => {
      expect(screen.getByText("Task 1")).toBeInTheDocument();
      expect(screen.getByText("Task 2")).toBeInTheDocument();
    });
  });

  it("filters tasks correctly", async () => {
    renderWithMemoryRouter(<TaskList />);

    await waitFor(() => {
      expect(screen.getByText("Task 1")).toBeInTheDocument();
    });

    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /active/i }));
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.queryByText("Task 2")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /completed/i }));
    expect(screen.queryByText("Task 1")).not.toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
  });

  it("creates a new task", async () => {
    renderWithMemoryRouter(<TaskList />);
    await waitFor(() => expect(screen.getByText("Task 1")).toBeInTheDocument());

    const user = userEvent.setup();
    (api.createTask as jest.Mock).mockResolvedValue({
      id: "3",
      title: "Task 3",
      completed: false,
      createdAt: "2023-01-03T00:00:00Z",
    });

    const openModalButton = screen.getByRole("button", { name: /add task/i });
    await user.click(openModalButton);

    const titleInput = await screen.findByLabelText(/task title/i);
    await user.type(titleInput, "Task 3");

    const addButtons = screen.getAllByRole("button", { name: /add task/i });
    await user.click(addButtons[addButtons.length - 1]);

    await waitFor(() => {
      expect(api.createTask).toHaveBeenCalledWith(
        {
          title: "Task 3",
          description: "",
        },
        expect.anything(),
      );
    });
  });

  it("toggles task status", async () => {
    renderWithMemoryRouter(<TaskList />);
    await waitFor(() => expect(screen.getByText("Task 1")).toBeInTheDocument());

    (api.updateTask as jest.Mock).mockResolvedValue({
      ...mockTasks[0],
      completed: true,
    });

    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);

    await waitFor(() => {
      expect(api.updateTask).toHaveBeenCalledWith("1", { completed: true });
    });
  });

  it("deletes a task", async () => {
    renderWithMemoryRouter(<TaskList />);
    await waitFor(() => expect(screen.getByText("Task 1")).toBeInTheDocument());

    (api.deleteTask as jest.Mock).mockResolvedValue(undefined);

    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    const confirmButton = await screen.findByRole("button", {
      name: /^delete$/i,
    });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(api.deleteTask).toHaveBeenCalledWith("1", expect.anything());
    });
  });
});
