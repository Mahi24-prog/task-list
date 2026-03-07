import {
  Box,
  Button,
  TextField,
  CircularProgress,
  Stack,
  Paper,
} from "@mui/material";
import { useCreateTask } from "../../hooks/useTasks";
import MyModal from "../ui/modal/modal";
import { useFormik } from "formik";
import * as yup from "yup";

const validationSchema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string(),
});

interface IAddTaskModalProps {
  open: boolean;
  handleClose: () => void;
}

export default function AddTaskModal({
  open,
  handleClose,
}: IAddTaskModalProps) {
  const createTask = useCreateTask();

  const formik = useFormik({
    initialValues: { title: "", description: "" },
    validationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      createTask.mutate(values, {
        onSuccess: () => {
          resetForm();
          handleClose();
        },
        onSettled: () => {
          setSubmitting(false);
        },
      });
    },
  });

  return (
    <MyModal
      open={open}
      handleClose={handleClose}
      showCloseIcon
      title="Add New Task"
    >
      <Paper>
        <Stack direction="column" sx={{ padding: "14px", minWidth: "400px" }}>
          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
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
              disabled={createTask.isPending}
            />
            <TextField
              fullWidth
              id="description"
              name="description"
              label="Description (Optional)"
              multiline
              size="small"
              rows={2}
              value={formik.values.description}
              onChange={formik.handleChange}
              disabled={createTask.isPending}
            />
            <Button
              color="primary"
              variant="contained"
              fullWidth
              type="submit"
              disabled={createTask.isPending}
            >
              {createTask.isPending ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Add Task"
              )}
            </Button>
          </Box>
        </Stack>
      </Paper>
    </MyModal>
  );
}
