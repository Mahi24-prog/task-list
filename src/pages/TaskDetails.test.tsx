import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskDetails from "./TaskDetails";
import { api } from "../api";
import { Route, Routes, MemoryRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { createTestQueryClient } from "../test-utils";

jest.mock("../api", () => ({
  api: {
    getTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
  },
}));

const mockTask = {
  id: "1",
  title: "Task 1",
  description: "Desc 1",
  completed: false,
  createdAt: "2023-01-01T00:00:00Z",
};

describe("TaskDetails Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (api.getTask as jest.Mock).mockResolvedValue(mockTask);
  });

  const renderComponent = () => {
    const queryClient = createTestQueryClient();
    return render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={createTheme()}>
          <MemoryRouter initialEntries={["/task/1"]}>
            <Routes>
              <Route path="/task/:id" element={<TaskDetails />} />
              <Route path="/" element={<div>Home Page</div>} />
            </Routes>
          </MemoryRouter>
        </ThemeProvider>
      </QueryClientProvider>,
    );
  };

  it("renders loading state initially", () => {
    renderComponent();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("renders task details after loading", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Task 1")).toBeInTheDocument();
      expect(screen.getByText("Desc 1")).toBeInTheDocument();
    });
  });

  it("navigates back to list when back button is clicked", async () => {
    renderComponent();
    await waitFor(() => expect(screen.getByText("Task 1")).toBeInTheDocument());

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /back to list/i }));

    await waitFor(() => {
      expect(screen.getByText("Home Page")).toBeInTheDocument();
    });
  });

  it("toggles edit mode", async () => {
    renderComponent();
    await waitFor(() => expect(screen.getByText("Task 1")).toBeInTheDocument());

    const user = userEvent.setup();
    const editButton = screen.getByRole("button", { name: /edit task/i });

    await user.click(editButton);
    expect(screen.getByText("Edit Task")).toBeInTheDocument();
    expect(screen.getByLabelText(/task title/i)).toHaveValue("Task 1");
    expect(screen.getByLabelText(/description/i)).toHaveValue("Desc 1");

    const cancelButton = screen.getByText("Cancel");
    await user.click(cancelButton);
    expect(screen.queryByText("Edit Task")).not.toBeInTheDocument();
  });

  it("updates task", async () => {
    renderComponent();
    await waitFor(() => expect(screen.getByText("Task 1")).toBeInTheDocument());

    (api.updateTask as jest.Mock).mockResolvedValue({
      ...mockTask,
      title: "Updated Task 1",
    });

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /edit task/i }));

    const titleInput = screen.getByLabelText(/task title/i);
    await user.clear(titleInput);
    await user.type(titleInput, "Updated Task 1");

    await user.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() => {
      expect(api.updateTask).toHaveBeenCalledWith("1", {
        title: "Updated Task 1",
        description: "Desc 1",
      });
    });
  });

  it("deletes task", async () => {
    renderComponent();
    await waitFor(() => expect(screen.getByText("Task 1")).toBeInTheDocument());

    (api.deleteTask as jest.Mock).mockResolvedValue(undefined);

    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /delete task/i }));

    const confirmButton = await screen.findByRole("button", {
      name: /^delete$/i,
    });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(api.deleteTask).toHaveBeenCalledWith("1", expect.anything());
      expect(screen.getByText("Home Page")).toBeInTheDocument();
    });
  });

  it("marks task as complete", async () => {
    renderComponent();
    await waitFor(() => expect(screen.getByText("Task 1")).toBeInTheDocument());

    (api.updateTask as jest.Mock).mockResolvedValue({
      ...mockTask,
      completed: true,
    });

    const completeButton = screen.getByRole("button", {
      name: /mark as complete/i,
    });
    fireEvent.click(completeButton);

    await waitFor(() => {
      expect(api.updateTask).toHaveBeenCalledWith("1", { completed: true });
    });
  });
});
