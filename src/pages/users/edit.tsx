import { Edit, ListButton, RefreshButton, SaveButton, useAutocomplete } from "@refinedev/mui";
import { Box, TextField, Autocomplete, Checkbox, FormControlLabel, Typography, createFilterOptions } from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { Controller, SubmitHandler } from "react-hook-form";
import { k } from "../../common/constants";
import { useDataProvider, useGetIdentity } from "@refinedev/core";
import { myDataProvider } from "../../products/data-provider";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

type IUser = {
  id: number;
  username: string;
  centreId: number;
};

export const UserEdit = () => {
  const { t } = useTranslation();

  const {
    saveButtonProps,
    refineCore: { query },
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const usersData = query?.data?.data;

  const [centreFilters, setCentreFilters] = useState<any[]>([]);

  const { data: user } = useGetIdentity<IUser>();

  useEffect(() => {
    if (user?.centreId) {
      setCentreFilters([{ field: "id", operator: "eq", value: user?.centreId }]);
    }
  }, [user]);

  const { autocompleteProps: roleAutocompleteProps } = useAutocomplete({
    resource: "roles",
    defaultValue: usersData?.roleId,
    pagination: {
      pageSize: k.DROPDOWN_PAGE_SIZE_DEFAULT,
    },
  });

  // const { autocompleteProps: centreControlAutocompleteProps } = useAutocomplete({
  //   resource: "centre-controls",
  //   defaultValue: usersData?.centreControlId,
  //   pagination: {
  //     pageSize: k.DROPDOWN_PAGE_SIZE_DEFAULT,
  //   },
  // });

  // const { autocompleteProps: centreAutocompleteProps } = useAutocomplete({
  //   resource: "centres",
  //   defaultValue: usersData?.centreId,
  //   filters: centreFilters,
  // });

  const filterOptions = createFilterOptions({
    matchFrom: "any",
    // stringify: (option: any) => option.nameTc
    stringify: (option: any) => `${option?.nameEn} ${option?.nameTc}`,
  });

  return (
    <Edit
      title={<Typography variant="h5">{t("edit") + " " + t("User")}</Typography>}
      saveButtonProps={saveButtonProps}
      headerButtons={({ defaultButtons }) => (
        <>
          <ListButton />
          <RefreshButton>{t("Refresh")}</RefreshButton>
        </>
      )}
      footerButtons={({ defaultButtons }) => (
        <>
          <SaveButton variant="contained" {...saveButtonProps}>
            {t("save")}
          </SaveButton>
        </>
      )}
    >
      <Box component="form" sx={{ display: "flex", flexDirection: "column" }} autoComplete="off">
        <TextField
          {...register("id", {
            required: t("This field is required"),
            valueAsNumber: true,
          })}
          error={!!(errors as any)?.id}
          helperText={(errors as any)?.id?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="number"
          label="Id"
          name="id"
          disabled
        />
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
          {...register("password")}
          defaultValue={undefined}
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
          defaultValue={null as any}
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
        <TextField
          {...register("createdBy", {
            required: t("This field is required"),
          })}
          error={!!(errors as any)?.createdBy}
          helperText={(errors as any)?.createdBy?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label="Created By"
          name="createdBy"
          disabled={true}
        />
        {/*
                    DatePicker component is not included in "@refinedev/mui" package.
                    To use a <DatePicker> component, you can follow the official documentation for Material UI.

                    Docs: https://mui.com/x/react-date-pickers/date-picker/#basic-usage
                */}
        <TextField
          {...register("createdAt", {
            required: t("This field is required"),
          })}
          error={!!(errors as any)?.createdAt}
          helperText={(errors as any)?.createdAt?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          label="Created At"
          name="createdAt"
          disabled={true}
        />

        {/*
                    DatePicker component is not included in "@refinedev/mui" package.
                    To use a <DatePicker> component, you can follow the official documentation for Material UI.

                    Docs: https://mui.com/x/react-date-pickers/date-picker/#basic-usage
                */}
        <TextField
          {...register("updatedAt", {
            required: t("This field is required"),
          })}
          error={!!(errors as any)?.updatedAt}
          helperText={(errors as any)?.updatedAt?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          label="Updated At"
          name="updatedAt"
          disabled={true}
        />
      </Box>
    </Edit>
  );
};
