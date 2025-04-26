import { Link } from "react-router-dom";
import Box from "@mui/material/Box";

import { Jclogo, JclogoMini } from "../icons/jclogo";

type TitleProps = {
  collapsed: boolean;
};

export const Title: React.FC<TitleProps> = ({ collapsed }) => {
  return (
    <Link to="/">
      <Box
        display="flex"
        alignItems="center"
        gap={"12px"}
        sx={{
          color: "text.primary",
        }}
      >
        {collapsed ? (
          // <Box sx={{ ml: 1.5, pl: 0 }}>
          //   <JclogoMini />
          // </Box>
          <Box sx={{ pl: 0 }}>
            <Box component="img" sx={{ maxHeight: 50, maxWidth: 180 }} src="/admin/fosslogo_1_mini.png" />
          </Box>
        ) : (
          <>
            <Box sx={{ pl: 0 }}>
              <Box component="img" sx={{ maxHeight: 50, maxWidth: 180 }} src="/admin/fosslogo_1.png" />
            </Box>
          </>
        )}
      </Box>
    </Link>
  );
};
