import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Chip,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { useTask, useUpdateTask, useDeleteTask } from "../hooks/useTasks";
import { useFormik } from "formik";
import * as yup from "yup";
import { ConfirmModal } from "../components/ui/modal";

const validationSchema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string(),
});

export default function TaskDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: task, isLoading, isError, error } = useTask(id!);
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: task?.title || "",
      description: task?.description || "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      if (id) {
        updateTask.mutate(
          { id, updates: values },
          { onSuccess: () => setIsEditing(false) },
        );
      }
    },
  });

  const handleDelete = () => {
    setDeleteConfirm(true);
  };

  const handleToggleStatus = () => {
    if (task) {
      updateTask.mutate({
        id: task.id,
        updates: { completed: !task.completed },
      });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (isError || !task) {
    return (
      <Layout>
        <Alert severity="error">
          Error loading task: {(error as Error)?.message || "Task not found"}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
          sx={{ mt: 2 }}
        >
          Back to list
        </Button>
      </Layout>
    );
  }

  return (
    <Layout>
      {deleteConfirm && (
        <ConfirmModal
          open={deleteConfirm}
          handleClose={() => setDeleteConfirm(false)}
          title="Delete this task?"
          message="Are you sure you want to delete this task? This action cannot be undone."
          confirmCtaLabel="Delete"
          cancelCta="Cancel"
          isLoading={deleteTask.isPending}
          showCloseIcon={false}
          handleConfirm={() => {
            if (task) {
              deleteTask.mutate(task.id, {
                onSuccess: () => navigate("/"),
              });
            }
          }}
        />
      )}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/")}
        sx={{ mb: 2 }}
      >
        Back to list
      </Button>

      <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
        {!isEditing ? (
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 3,
              }}
            >
              <Box>
                <Typography
                  variant="h5"
                  component="h1"
                  gutterBottom
                  fontWeight="bold"
                  sx={{
                    textDecoration: task.completed ? "line-through" : "none",
                    color: task.completed ? "text.secondary" : "text.primary",
                  }}
                >
                  {task.title}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <Chip
                    label={task.completed ? "Completed" : "Active"}
                    color={task.completed ? "success" : "primary"}
                    variant="outlined"
                  />
                  <Typography variant="caption" color="text.secondary">
                    Created: {new Date(task.createdAt).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  onClick={() => setIsEditing(true)}
                  color="primary"
                  aria-label="edit task"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={handleDelete}
                  color="error"
                  aria-label="delete task"
                  disabled={deleteTask.isPending}
                >
                  <DeleteOutlinedIcon />
                </IconButton>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Typography
              variant="body1"
              sx={{
                whiteSpace: "pre-wrap",
                mb: 4,
                color: task.description ? "text.primary" : "text.secondary",
              }}
            >
              {task.description || "No description provided."}
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant={task.completed ? "outlined" : "contained"}
                color={task.completed ? "inherit" : "success"}
                onClick={handleToggleStatus}
                disabled={updateTask.isPending}
              >
                Mark as {task.completed ? "Incomplete" : "Complete"}
              </Button>
            </Box>
          </Box>
        ) : (
          <Box component="form" onSubmit={formik.handleSubmit}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h5">Edit Task</Typography>
              <IconButton
                onClick={() => setIsEditing(false)}
                aria-label="cancel editing"
              >
                <CloseIcon />
              </IconButton>
            </Box>

            <TextField
              fullWidth
              id="title"
              name="title"
              label="Task Title"
              size="small"
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
              sx={{ mb: 3 }}
              disabled={updateTask.isPending}
            />

            <TextField
              fullWidth
              id="description"
              name="description"
              label="Description"
              multiline
              size="small"
              rows={4}
              value={formik.values.description}
              onChange={formik.handleChange}
              sx={{ mb: 4 }}
              disabled={updateTask.isPending}
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
              <Button
                onClick={() => setIsEditing(false)}
                disabled={updateTask.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                disabled={updateTask.isPending}
              >
                {updateTask.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Layout>
  );
}
