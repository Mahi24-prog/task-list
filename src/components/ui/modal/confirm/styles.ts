import type { SxProps, Theme } from "@mui/material/styles";

const modal: SxProps<Theme> = {
  width: "520px",
};

const modalContainer: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  textAlign: "center",
  padding: "48px 24px",
};

const headerContainer: SxProps<Theme> = {
  borderBottom: "1px solid #EEEEEE",
  padding: "15px 12px",
  backgroundColor: "#eae9ec",
  direction: "row",
  justifyContent: "space-between",
  alignItems: "center",
};

const title: SxProps<Theme> = {
  fontWeight: 500,
  marginBottom: "6px",
};

const subTitle: SxProps<Theme> = {
  fontWeight: 500,
  color: "rgba(51, 51, 51, 0.75)",
  listStyleType: "none",
};

const closeBtn: SxProps<Theme> = {};
const confirmBtn: SxProps<Theme> = {};

export const styles = {
  modal,
  modalContainer,
  headerContainer,
  title,
  subTitle,
  closeBtn,
  confirmBtn,
};
