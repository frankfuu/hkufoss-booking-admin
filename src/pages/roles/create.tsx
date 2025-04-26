import { Create } from "@refinedev/mui";
import {
  Box,
  TextField,
  Checkbox,
  MenuItem,
  ListItemText,
  Autocomplete,
  FormGroup,
  FormControlLabel,
  Grid,
  Typography,
} from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import { useList } from "@refinedev/core";
import { useTranslation } from "react-i18next";

export const RoleCreate = () => {
  const { t } = useTranslation();

  const {
    saveButtonProps,
    refineCore: { formLoading, onFinish },
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    // console.log("Intercepted data:", data);
    onFinish(data);
  };

  if (formLoading) {
    return <div>{t("Loading...")}</div>;
  } else {
    return (
      <Create isLoading={formLoading} saveButtonProps={{ ...saveButtonProps, onClick: handleSubmit(onSubmit) }}>
        <Box component="form" sx={{ display: "flex", flexDirection: "column" }} autoComplete="off">
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
      </Create>
    );
  }
};
