import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { styles } from "./styles";
import MyModal from "../modal";

interface ConfirmModalProps {
  open: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
  message: string;
  title: string;
  isLoading?: boolean;
  showCloseIcon?: boolean;
  cancelCta?: string;
  confirmCtaLabel?: string;
}

const ConfirmModal = ({
  open,
  handleClose,
  handleConfirm,
  message,
  title,
  isLoading,
  showCloseIcon = true,
  cancelCta = "No, Cancel",
  confirmCtaLabel = "Yes, Confirm",
}: ConfirmModalProps) => {
  const actions = (
    <Stack direction="row" spacing={2} justifyContent="center">
      <Button
        variant="outlined"
        color="secondary"
        onClick={handleClose}
        disabled={isLoading}
      >
        {cancelCta}
      </Button>
      <Button variant="contained" onClick={handleConfirm} disabled={isLoading}>
        {isLoading ? <CircularProgress size={20} /> : confirmCtaLabel}
      </Button>
    </Stack>
  );

  return (
    <MyModal
      open={open}
      handleClose={handleClose}
      showCloseIcon={showCloseIcon}
      actions={actions}
      modalContainerStyle={styles.modal}
      isLoading={isLoading}
    >
      <Box sx={styles.modalContainer}>
        <Typography variant="h6" sx={styles.title}>
          {title}
        </Typography>

        <Typography variant="body1" sx={styles.subTitle}>
          {message}
        </Typography>
      </Box>
    </MyModal>
  );
};

export default ConfirmModal;
