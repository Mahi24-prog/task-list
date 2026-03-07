import {
  Box,
  Typography,
  ListItem,
  ListItemText,
  IconButton,
  Checkbox,
  Chip,
} from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import type { Task } from "../../types";

interface TaskCardProps {
  task: Task;
  index: number;
  isLast: boolean;
  onToggleStatus: (task: Task) => void;
  onDeleteSelected: (taskId: string) => void;
  onClick: (taskId: string) => void;
}

export default function TaskCard({
  task,
  isLast,
  onToggleStatus,
  onDeleteSelected,
  onClick,
}: TaskCardProps) {
  return (
    <ListItem
      divider={!isLast}
      disablePadding
      sx={{
        transition: "background-color 0.2s",
        "&:hover": { bgcolor: "action.hover" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          p: 2,
          width: "100%",
          cursor: "pointer",
        }}
        onClick={(e) => {
          if (
            (e.target as HTMLElement).closest("button") ||
            (e.target as HTMLElement).closest("input")
          ) {
            return;
          }
          onClick(task.id);
        }}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") onClick(task.id);
        }}
      >
        <Checkbox
          edge="start"
          checked={task.completed}
          tabIndex={-1}
          disableRipple
          onChange={(e) => {
            e.stopPropagation();
            onToggleStatus(task);
          }}
          sx={{ mt: 0.5 }}
        />
        <ListItemText
          primary={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="subtitle1"
                component="span"
                sx={{
                  textDecoration: task.completed ? "line-through" : "none",
                  color: task.completed ? "text.secondary" : "text.primary",
                  fontWeight: 500,
                }}
              >
                {task.title}
              </Typography>
              {task.completed && (
                <Chip
                  label="Completed"
                  size="small"
                  color="success"
                  variant="outlined"
                />
              )}
            </Box>
          }
          secondary={
            task.description ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.5,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {task.description}
              </Typography>
            ) : null
          }
          sx={{ ml: 1, my: 0 }}
        />
        <IconButton
          edge="end"
          aria-label="delete"
          color="error"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteSelected(task.id);
          }}
        >
          <DeleteOutlinedIcon />
        </IconButton>
      </Box>
    </ListItem>
  );
}
