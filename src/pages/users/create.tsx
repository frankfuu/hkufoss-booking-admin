import { Create, useAutocomplete } from "@refinedev/mui";
import { Box, Autocomplete, TextField, Checkbox, FormControlLabel } from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import { k } from "../../common/constants";
import { useTranslation } from "react-i18next";

export const UserCreate = () => {
  const { t } = useTranslation();
  
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    control,
    formState: { errors },
  } = useForm();

  const { autocompleteProps: roleAutocompleteProps } = useAutocomplete({
    resource: "roles",
    pagination: {
      pageSize: k.DROPDOWN_PAGE_SIZE_DEFAULT,
    },
  });

  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Box component="form" sx={{ display: "flex", flexDirection: "column" }} autoComplete="off">
        <Controller
          control={control}
          name="roleId"
          rules={{ required: t("This field is required") }}
          // eslint-disable-next-line
          defaultValue={null as any}
          render={({ field }) => (
            <Autocomplete
              {...roleAutocompleteProps}
              {...field}
              onChange={(_, value) => {
                field.onChange(value?.id ?? value);
              }}
              getOptionLabel={(item) => {
                return (
                  roleAutocompleteProps?.options?.find((p) => p?.id?.toString() === (item?.id ?? item)?.toString())?.name ?? ""
                );
              }}
              isOptionEqualToValue={(option, value) =>
                value === undefined || option?.id?.toString() === (value?.id ?? value)?.toString()
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Role"
                  margin="normal"
                  variant="outlined"
                  error={!!(errors as any)?.roleId}
                  helperText={(errors as any)?.roleId?.message}
                  required
                />
              )}
            />
          )}
        />
        <TextField
          {...register("username", {
            required: t("This field is required"),
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Username must be a valid email address",
            },
          })}
          error={!!(errors as any)?.username}
          helperText={(errors as any)?.username?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label="Username"
          name="username"
        />
        <TextField
          {...register("password", {
            required: t("This field is required"),
          })}
          error={!!(errors as any)?.password}
          helperText={(errors as any)?.password?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="password"
          label="Password"
          name="password"
        />
        <Controller
          control={control}
          name="enabled"
          // eslint-disable-next-line
          defaultValue={true}
          render={({ field }) => (
            <FormControlLabel
              label="Enabled"
              control={
                <Checkbox
                  {...field}
                  checked={field.value}
                  onChange={(event) => {
                    field.onChange(event.target.checked);
                  }}
                />
              }
            />
          )}
        />
        {/* <TextField
          {...register("createdBy", {
            // required: t("This field is required"),
          })}
          error={!!(errors as any)?.createdBy}
          helperText={(errors as any)?.createdBy?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label="Created By"
          name="createdBy"
        /> */}
        {/*
                    DatePicker component is not included in "@refinedev/mui" package.
                    To use a <DatePicker> component, you can follow the official documentation for Material UI.

                    Docs: https://mui.com/x/react-date-pickers/date-picker/#basic-usage
                */}
        {/* <TextField
          {...register("createdAt", {
            // required: t("This field is required"),
          })}
          error={!!(errors as any)?.createdAt}
          helperText={(errors as any)?.createdAt?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          label="Created At"
          name="createdAt"
        /> */}

        {/*
                    DatePicker component is not included in "@refinedev/mui" package.
                    To use a <DatePicker> component, you can follow the official documentation for Material UI.

                    Docs: https://mui.com/x/react-date-pickers/date-picker/#basic-usage
                */}
        {/* <TextField
          {...register("updatedAt", {
            // required: t("This field is required"),
          })}
          error={!!(errors as any)?.updatedAt}
          helperText={(errors as any)?.updatedAt?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          label="Updated At"
          name="updatedAt"
        /> */}
      </Box>
    </Create>
  );
};
