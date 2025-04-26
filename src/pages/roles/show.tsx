import { Show } from "@refinedev/mui";
import { Typography, Stack, Box, Grid, FormControlLabel, Checkbox, TextField } from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { useList, useShow } from "@refinedev/core";
import { k } from "../../common/constants";
import { useTranslation } from "react-i18next";

export const RoleShow = () => {
  const { query } = useShow();
  const { t } = useTranslation();

  const rolesData = query?.data?.data;

  if (query.isLoading || !rolesData) {
    return <div>{t("Loading...")}</div>;
  }
  return (
    <Show isLoading={query.isLoading}>
      <Box component="form" sx={{ display: "flex", flexDirection: "column" }} autoComplete="off">
        <TextField value={rolesData?.id} margin="normal" label="Id" disabled />
        <TextField value={rolesData?.name} margin="normal" label="Name" disabled />
      </Box>
    </Show>
  );
};
