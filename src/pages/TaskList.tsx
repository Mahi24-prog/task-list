import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  CircularProgress,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { useTasks, useUpdateTask, useDeleteTask } from "../hooks/useTasks";
import type { Task } from "../types";
import AddTaskModal from "../components/taskList/AddTaskModal";
import TaskCard from "../components/taskList/TaskCard";
import { ConfirmModal } from "../components/ui/modal";

export default function TaskList() {
  const navigate = useNavigate();
  const { data: tasks, isLoading, isError, error } = useTasks();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const [showAddTask, setShowAddTask] = useState<boolean>(false);
  const [filter, setFilter] = useState<"all" | "completed" | "incomplete">(
    "all",
  );
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const handleToggleStatus = (task: Task) => {
    updateTask.mutate({ id: task.id, updates: { completed: !task.completed } });
  };

  const handleAddTaskOpen = () => {
    setShowAddTask(true);
  };

  const handleShowAddTaskClose = () => {
    setShowAddTask(false);
  };

  const filteredTasks = tasks?.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "incomplete") return !task.completed;
    return true;
  });

  return (
    <Layout>
      {showAddTask && (
        <AddTaskModal open={showAddTask} handleClose={handleShowAddTaskClose} />
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5" component="h2" fontWeight="bold">
          Tasks
        </Typography>
        <Stack direction="row" gap={2}>
          <ToggleButtonGroup
            color="primary"
            value={filter}
            exclusive
            onChange={(_, newFilter) => newFilter && setFilter(newFilter)}
            size="small"
          >
            <ToggleButton value="all">All</ToggleButton>
            <ToggleButton value="incomplete">Active</ToggleButton>
            <ToggleButton value="completed">Completed</ToggleButton>
          </ToggleButtonGroup>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddTaskOpen}
          >
            Add Task
          </Button>
        </Stack>
      </Box>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : isError ? (
        <Alert severity="error">
          Error loading tasks: {(error as Error).message}
        </Alert>
      ) : (
        <Paper
          elevation={0}
          variant="outlined"
          sx={{ borderRadius: 2, overflow: "hidden" }}
        >
          <List sx={{ p: 0 }}>
            {filteredTasks?.length === 0 ? (
              <ListItem sx={{ py: 3, justifyContent: "center" }}>
                <Typography color="text.secondary">No tasks found.</Typography>
              </ListItem>
            ) : (
              filteredTasks?.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  isLast={index === filteredTasks.length - 1}
                  onToggleStatus={handleToggleStatus}
                  onDeleteSelected={setTaskToDelete}
                  onClick={(taskId) => navigate(`/task/${taskId}`)}
                />
              ))
            )}
          </List>
        </Paper>
      )}

      <ConfirmModal
        open={!!taskToDelete}
        handleClose={() => setTaskToDelete(null)}
        title="Delete this task?"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmCtaLabel="Delete"
        cancelCta="Cancel"
        isLoading={deleteTask.isPending}
        showCloseIcon={false}
        handleConfirm={() => {
          if (taskToDelete) {
            deleteTask.mutate(taskToDelete, {
              onSuccess: () => setTaskToDelete(null),
            });
          }
        }}
      />
    </Layout>
  );
}
