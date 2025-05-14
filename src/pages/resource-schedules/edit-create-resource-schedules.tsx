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

export default function EditCreateResourceSchedules({ register, errors, control, action }: any) {
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
            renderInput={(params) => (
              <TextField
                {...params}
                label={t("Resource")}
                margin="normal"
                variant="outlined"
                placeholder="Choose resource"
                required
                InputLabelProps={{ shrink: true }}
              />
            )}
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
        label={t("scheduleName")}
        placeholder="e.g. Schedule FY25"
        name="name"
      />

      <TextField
        {...register("startDate", {
          required: "This field is required",
        })}
        error={!!(errors as any)?.startDate}
        helperText={(errors as any)?.startDate?.message}
        placeholder="e.g. 2025-07-22"
        defaultValue={"2025-07-22"}
        margin="normal"
        fullWidth
        InputLabelProps={{ shrink: true }}
        label={t("Start Date")}
        name="startDate"
      />

      <TextField
        {...register("endDate", {
          required: "This field is required",
        })}
        error={!!(errors as any)?.endDate}
        defaultValue={"2025-08-22"}
        helperText={(errors as any)?.endDate?.message}
        margin="normal"
        fullWidth
        InputLabelProps={{ shrink: true }}
        label={t("End Date")}
        name="endDate"
      />

      <TextField
        {...register("startTime", {
          required: "This field is required",
        })}
        error={!!(errors as any)?.startTime}
        placeholder="e.g. 13:00:00"
        defaultValue={"09:00:00"}
        helperText={(errors as any)?.startTime?.message}
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
        placeholder="e.g. 18:00:00"
        defaultValue={"16:00:00"}
        helperText={(errors as any)?.endTime?.message}
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
        label="Mon"
        control={
          <Controller
            name="monday"
            control={control}
            defaultValue={true}
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
      <FormControlLabel
        label="Tue"
        control={
          <Controller
            name="tuesday"
            control={control}
            defaultValue={true}
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
      <FormControlLabel
        label="Wed"
        control={
          <Controller
            name="wednesday"
            control={control}
            defaultValue={true}
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
      <FormControlLabel
        label="Thu"
        control={
          <Controller
            name="thursday"
            control={control}
            defaultValue={true}
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
      <FormControlLabel
        label="Fri"
        control={
          <Controller
            name="friday"
            control={control}
            defaultValue={true}
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
      <FormControlLabel
        label="Sat"
        control={
          <Controller
            name="saturday"
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
      <FormControlLabel
        label="Sun"
        control={
          <Controller
            name="sunday"
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
