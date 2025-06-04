import { Box, Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";

interface ImageViewerModalProps {
  open: boolean;
  onClose: () => void;
  imageSrc: string | null;
  title?: string;
}

const ImageViewerModal = ({ open, onClose, imageSrc, title = "Image" }: ImageViewerModalProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {t(title)}
        <IconButton aria-label="close" onClick={onClose} sx={{ color: (theme) => theme.palette.grey[500] }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {imageSrc ? (
          <img
            src={imageSrc}
            alt="Image enlarged"
            style={{
              width: "100%",
              maxHeight: "80vh",
              objectFit: "contain",
            }}
          />
        ) : (
          <Typography variant="body1" align="center">
            {t("No image available")}
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImageViewerModal;
