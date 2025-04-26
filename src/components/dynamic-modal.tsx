import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "33%",
  bgcolor: "background.paper",
  border: "2px solid rgb(234,65,38)",
  boxShadow: 24,
  p: 4,
  backdropFilter: "blur(5px)",
  borderRadius: 10,
};

export default function DynamicModal({ open, onClose, title, content }: any) {
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h5" component="h5" align="center">
          {title}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {content}
        </Typography>
      </Box>
    </Modal>
  );
}
