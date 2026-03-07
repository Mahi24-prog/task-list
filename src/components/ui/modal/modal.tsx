import { type ReactNode } from "react";
import type { SxProps, Theme } from "@mui/material/styles";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { styles } from "./styles";

interface MyModalProps {
  open: boolean;
  handleClose: () => void;
  children: ReactNode;
  title?: string;
  subTitle?: string;
  showCloseIcon?: boolean;
  actions?: ReactNode;
  disableScrollLock?: boolean;
  isLoading?: boolean;
  modalContainerStyle?: SxProps<Theme>;
}

const MyModal = ({
  open,
  handleClose,
  children,
  title,
  subTitle,
  showCloseIcon,
  actions,
  disableScrollLock,
  isLoading,
  modalContainerStyle = {},
}: MyModalProps) => {
  const handleCloseModal = (_: object, reason: string) => {
    if (reason === "backdropClick") {
      return;
    }
    handleClose();
  };

  return (
    <Modal
      disableScrollLock={disableScrollLock}
      open={open}
      onClose={handleCloseModal}
      sx={styles.modal}
    >
      <Stack sx={{ ...styles.modalContainer, ...modalContainerStyle }}>
        {title || showCloseIcon ? (
          <Stack sx={styles.headerContainer}>
            <Stack>
              {title ? (
                <Typography variant="h6" sx={styles.title}>
                  {title}
                </Typography>
              ) : null}
              {subTitle ? (
                <Typography sx={styles.subTitle}>{subTitle}</Typography>
              ) : null}
            </Stack>
            {showCloseIcon ? (
              <IconButton
                onClick={handleClose}
                sx={styles.closeBtn}
                disabled={isLoading}
              >
                <CloseIcon sx={{ color: "#77797c" }} />
              </IconButton>
            ) : null}
          </Stack>
        ) : null}
        <Box sx={styles.childrenContainer}>{children}</Box>
        {actions ? <Stack sx={styles.footerContainer}>{actions}</Stack> : null}
      </Stack>
    </Modal>
  );
};

export default MyModal;
