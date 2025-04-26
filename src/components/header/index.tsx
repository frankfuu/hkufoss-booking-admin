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
  centreId: number;
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

  // const { autocompleteProps } = useAutocomplete({
  //   resource: "centres",
  //   pagination: { pageSize: k.DROPDOWN_PAGE_SIZE_DEFAULT },
  // });

  // useEffect(() => {
  //   if (user?.centreId) {
  //     const centre = autocompleteProps?.options?.find((item: any) => item?.id === user?.centreId);
  //     setCentreGlobal(centre);
  //   }
  // }, [user, autocompleteProps?.options]);

  const handleResourceNavigation = useResourceNavigation();
  const onMemberSelected = (member: any) => {
    if (member && member.id) {
      handleResourceNavigation({ resource: "members", action: "show", id: member.id });
    }
  };

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
            {/* <Typography color="coral" sx={{ mr: 2 }}>
              {centreGlobal?.nameTc}
            </Typography> */}
            {/* <MemberSearchAsync onOptionSelected={onMemberSelected} sx={{ width: "100%" }} /> */}
            {/* <Autocomplete
              {...autocompleteProps}
              disabled={user?.centreId !== undefined}
              defaultValue={centreGlobal}
              value={centreGlobal}
              getOptionLabel={(item) => `${item?.nameTc}`}
              isOptionEqualToValue={(option, value) => value === undefined || option?.id?.toString() === value?.id?.toString()}
              onInputChange={(event, value) => { }} // this disabled auto server side fetching
              filterOptions={createFilterOptions({ stringify: (o) => `${o.nameEn} ${o.nameTc}` })}
              onChange={(event, value) => setCentreGlobal(value)}
              sx={{ minWidth: 278, mx: 2 }}
              renderInput={(params) => <TextField {...params} label={t("location")} margin="normal" variant="outlined" size="small" disabled={user?.centreId !== undefined} />}
            /> */}

            <Button
              sx={{ mx: 2 }}
              onClick={() => {
                changeLocale(currentLocale == "en" ? "zh_HK" : "en");
              }}
            >
              {currentLocale == "en" ? "繁" : "Eng"}
            </Button>
            {/* <IconButton
              color="primary"
              onClick={() => {
                setMode();
              }}
              sx={{ mr: 1, mt: 0 }}
            >
              {mode === "dark" ? <LightModeOutlined /> : <DarkModeOutlined />}
            </IconButton> */}

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
                  >
                    {user?.username}
                  </Typography>
                )}
                {/* <Avatar src={user?.avatar} alt={user?.username} /> */}
              </Stack>
            )}
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
