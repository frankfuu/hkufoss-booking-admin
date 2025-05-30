import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useGetIdentity, usePermissions } from "@refinedev/core";
import { RefineThemedLayoutV2HeaderProps, useAutocomplete } from "@refinedev/mui";
import React, { useContext, useEffect } from "react";
import { ColorModeContext } from "../../contexts/color-mode";
import { Autocomplete, Box, Button, createFilterOptions, Menu, TextField } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { HamburgerMenu } from "../../common/burger";
import { useUserOptionsContext } from "../user-options-context";
import { k } from "../../common/constants";
import { useResourceNavigation } from "../../common/helpers";
import { useTranslation } from "react-i18next";
import { useTranslation as refineUseTranslation } from "@refinedev/core";

type IUser = {
  id: number;
  username: string;
  avatar: string;
  roleId: number;
};

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({ sticky = true }) => {
  const { mode, setMode } = useContext(ColorModeContext);

  const { t } = useTranslation();
  const { getLocale, changeLocale } = refineUseTranslation();
  const currentLocale = getLocale();

  const { data: user } = useGetIdentity<IUser>();

  const LOGO_MAX_HEIGHT = 60;
  const LOGO_MAX_WIDTH = 220;
  const LOGO_PARTNER_MAX_HEIGHT = 40;
  const LOGO_PARTNER_MAX_WIDTH = 60;

  const { centreGlobal, setCentreGlobal } = useUserOptionsContext();

  const handleResourceNavigation = useResourceNavigation();

  return (
    <AppBar position={sticky ? "sticky" : "relative"} sx={{ backgroundColor: "white" }}>
      <Toolbar>
        <Stack direction="row" width="100%" justifyContent="flex-end" alignItems="center">
          <HamburgerMenu />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flex: 1,
              py: 2,
            }}
          ></Box>

          <Stack direction="row" width="100%" justifyContent="flex-end" alignItems="center">
            {/* <Button
              sx={{ mx: 2 }}
              onClick={() => {
                changeLocale(currentLocale == "en" ? "zh_HK" : "en");
              }}
            >
              {currentLocale == "en" ? "繁" : "Eng"}
            </Button> */}

            {(user?.avatar || user?.username) && (
              <Stack direction="row" gap="16px" alignItems="center" justifyContent="center">
                {user?.username && (
                  <Typography
                    sx={{
                      display: {
                        xs: "none",
                        sm: "inline-block",
                      },
                      color: "black",
                      fontSize: 15,
                      mt: 0,
                    }}
                    variant="subtitle2"
                    onClick={() => {
                      console.log(user);
                    }}
                  >
                    {user?.username}
                  </Typography>
                )}
              </Stack>
            )}
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
