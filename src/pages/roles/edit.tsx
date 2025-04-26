import { Edit, useAutocomplete } from "@refinedev/mui";
import {
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  Autocomplete,
  MenuItem,
  ListItemText,
  FormGroup,
  Typography,
  Grid,
} from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import { useList } from "@refinedev/core";
import { k } from "../../common/constants";
import { useTranslation } from "react-i18next";

export const RoleEdit = () => {
  const { t } = useTranslation();
  const {
    saveButtonProps,
    refineCore: { query },
    register,
    control,
    formState: { errors, isLoading: formLoading },
  } = useForm();

  const rolesData = query?.data?.data;

  if (!rolesData) {
    return <div>{t("Loading...")}</div>;
  } else {
    return (
      <Edit saveButtonProps={saveButtonProps} isLoading={formLoading}>
        <Box component="form" sx={{ display: "flex", flexDirection: "column" }} autoComplete="off">
          <TextField
            {...register("id", {
              required: t("This field is required"),
              valueAsNumber: true,
            })}
            error={!!(errors as any)?.id}
            helperText={(errors as any)?.id?.message}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            type="number"
            label="Id"
            name="id"
            disabled
          />
          <TextField
            {...register("name", {
              required: t("This field is required"),
            })}
            error={!!(errors as any)?.name}
            helperText={(errors as any)?.name?.message}
            margin="normal"
            fullWidth
            InputLabelProps={{ shrink: true }}
            type="text"
            label="Name"
            name="name"
          />
        </Box>
      </Edit>
    );
  }
};
