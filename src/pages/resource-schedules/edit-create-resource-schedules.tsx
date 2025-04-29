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

      <TextField
        {...register("resourceId", {
          required: "This field is required",
        })}
        error={!!(errors as any)?.resourceId}
        placeholder="e.g. 5"
        helperText={(errors as any)?.resourceId?.message}
        margin="normal"
        fullWidth
        InputLabelProps={{ shrink: true }}
        label={t("Resource ID")}
        name="resourceId"
      />

      <TextField
        {...register("startDate", {
          required: "This field is required",
        })}
        error={!!(errors as any)?.startDate}
        helperText={(errors as any)?.startDate?.message}
        placeholder="e.g. 2025-07-22"
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
        placeholder="e.g. 2025-07-25"
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
        label="Tue"
        control={
          <Controller
            name="tuesday"
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
        label="Wed"
        control={
          <Controller
            name="wednesday"
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
        label="Thu"
        control={
          <Controller
            name="thursday"
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
        label="Fri"
        control={
          <Controller
            name="friday"
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
