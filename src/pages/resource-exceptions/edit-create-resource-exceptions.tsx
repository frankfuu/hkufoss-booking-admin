import { Edit, useAutocomplete } from "@refinedev/mui";
import { Box, TextField, Autocomplete, createFilterOptions, Checkbox, FormControlLabel } from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useState } from "react";
import { useGetIdentity } from "@refinedev/core";
import { d } from "../../common/constants";

type IUser = {
  id: number;
  username: string;
  centreId: number;
};

export default function EditCreateResourceExceptions({ register, errors, control, action }: any) {
  const { t } = useTranslation();

  const { data: user } = useGetIdentity<IUser>();
  const isCreate = action === "create";

  const { autocompleteProps: resourceAutocompleteProps } = useAutocomplete({
    resource: "resources",
  });

  const filterOptionsResources = createFilterOptions({
    matchFrom: "any",
    stringify: (option: any) => `${option?.resourceId} ${option?.resourceName} ${option?.resourceType}`,
  });

  return (
    <Box component="form" sx={{ display: "flex", flexDirection: "column" }} autoComplete="off">
      {!isCreate && (
        <TextField
          {...register("id", {
            valueAsNumber: true,
          })}
          error={!!(errors as any)?.id}
          helperText={(errors as any)?.id?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="number"
          label={t("id")}
          name="id"
          disabled
        />
      )}

      <Controller
        control={control}
        name="resourceId"
        rules={{ required: "This field is required" }}
        defaultValue={null as any}
        render={({ field }) => (
          <Autocomplete
            {...resourceAutocompleteProps}
            {...field}
            onChange={(_, value) => field.onChange(value?.id ?? value)}
            filterOptions={filterOptionsResources}
            onInputChange={(event, value) => {}}
            value={resourceAutocompleteProps?.options?.find((option) => option.id === field.value) || null}
            getOptionLabel={(option) => `(RID ${option?.id}) ${option?.resourceName} - ${option?.resourceType}`}
            renderInput={(params) => <TextField {...params} label={t("resource")} margin="normal" variant="outlined" required />}
          />
        )}
      />

      <TextField
        {...register("name", {
          required: "This field is required",
        })}
        error={!!(errors as any)?.name}
        helperText={(errors as any)?.name?.message}
        margin="normal"
        fullWidth
        InputLabelProps={{ shrink: true }}
        label={t("name")}
        placeholder="e.g. Monthly Maintenance, Christmas Shutdown, Chinese New Year etc"
        name="name"
      />

      <TextField
        {...register("startTime", {
          required: "This field is required",
        })}
        error={!!(errors as any)?.startTime}
        helperText={(errors as any)?.startTime?.message}
        placeholder="e.g. 2025-06-13T14:00:00.000Z"
        defaultValue={"2025-06-13T14:00:00.000Z"}
        margin="normal"
        fullWidth
        InputLabelProps={{ shrink: true }}
        label={t("Start Time")}
        name="startTime"
      />

      <TextField
        {...register("endTime", {
          required: "This field is required",
        })}
        error={!!(errors as any)?.endTime}
        helperText={(errors as any)?.endTime?.message}
        placeholder="e.g. 2025-06-28T17:00:00.000Z"
        defaultValue={"2025-06-28T17:00:00.000Z"}
        margin="normal"
        fullWidth
        InputLabelProps={{ shrink: true }}
        label={t("End Time")}
        name="endTime"
      />

      {!isCreate && (
        <TextField
          {...register("updatedAt", {})}
          error={!!(errors as any)?.updatedAt}
          helperText={(errors as any)?.updatedAt?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          label={t("updatedAt")}
          name="updatedAt"
          disabled
        />
      )}

      <FormControlLabel
        label="Is Available"
        control={
          <Controller
            name="isAvailable"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <Checkbox
                {...field}
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)} // Update the value on change
              />
            )}
          />
        }
      />
    </Box>
  );
}
