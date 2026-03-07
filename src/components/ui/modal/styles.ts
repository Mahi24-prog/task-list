import type { SxProps, Theme } from "@mui/material/styles";

const modal: SxProps<Theme> = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalContainer: SxProps<Theme> = {
  backgroundColor: "#ffffff",
  border: 0,
  borderRadius: "6px",
  outline: "none",
  overflow: "hidden",
  maxHeight: "100vh",
  position: "relative",
  display: "flex",
};

const childrenContainer: SxProps<Theme> = {
  overflowY: "auto",
  flexGrow: "1",
};

const headerContainer: SxProps<Theme> = {
  borderBottom: "1px solid #e0e0e0",
  padding: "4px 16px 4px 25px",
  backgroundColor: "#f5f5f5",
  direction: "row",
  justifyContent: "space-between",
  alignItems: "center",
  flexDirection: "row",
};

const title: SxProps<Theme> = {
  textAlign: "left",
};
const subTitle: SxProps<Theme> = {};

const closeBtn: SxProps<Theme> = {
  alignSelf: "end",
  marginLeft: 1,
};
const footerContainer: SxProps<Theme> = {
  flexDirection: "row",
  gap: 2,
  justifyContent: "right",
  alignItems: "center",
  borderTop: "1px solid #e0e0e0",
  padding: "8px 16px 8px 25px",
  backgroundColor: "#fafafa",
  width: "100%",
};
export const styles = {
  modal,
  modalContainer,
  headerContainer,
  title,
  subTitle,
  closeBtn,
  footerContainer,
  childrenContainer,
};
