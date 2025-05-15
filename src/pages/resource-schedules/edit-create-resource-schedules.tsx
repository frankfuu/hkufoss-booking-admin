import { Edit, useAutocomplete } from "@refinedev/mui";
import { Box, TextField, Autocomplete, createFilterOptions, Checkbox, FormControlLabel } from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useState } from "react";
import { useGetIdentity } from "@refinedev/core";
import { DatePicker, DateTimePicker, TimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { d, k } from "../../common/constants";

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
        // defaultValue={null as any}
        defaultValue={1}
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
        defaultValue={"My Schedule Name"}
        error={!!(errors as any)?.name}
        helperText={(errors as any)?.name?.message}
        margin="normal"
        fullWidth
        InputLabelProps={{ shrink: true }}
        label={t("scheduleName")}
        placeholder="e.g. Schedule FY25"
        name="name"
      />

      <Controller
        control={control}
        name="startDate"
        defaultValue={dayjs().format(k.DATE_ONLY_FM_DEFAULT)}
        render={({ field }) => (
          <DatePicker
            {...field}
            format={k.DATE_ONLY_FM_DEFAULT}
            views={["year", "month", "day"]}
            value={field.value ? dayjs(field.value) : null}
            onChange={(date) => {
              const dateString = date ? dayjs(date).format(k.DATE_ONLY_FM_DEFAULT) : null; // ensure no time component
              field.onChange(dateString);
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                margin: "normal",
                label: t("Start Date"),
                InputLabelProps: { shrink: true },
              },
            }}
          />
        )}
      />

      <Controller
        control={control}
        name="endDate"
        defaultValue={dayjs().add(7, "day").format(k.DATE_ONLY_FM_DEFAULT)}
        render={({ field }) => (
          <DatePicker
            {...field}
            format={k.DATE_ONLY_FM_DEFAULT}
            views={["year", "month", "day"]}
            value={field.value ? dayjs(field.value) : null}
            onChange={(date) => {
              const dateString = date ? dayjs(date).format(k.DATE_ONLY_FM_DEFAULT) : null; // ensure no time element
              field.onChange(dateString);
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                margin: "normal",
                label: t("End Date"),
                InputLabelProps: { shrink: true },
              },
            }}
          />
        )}
      />

      <Controller
        control={control}
        name="startTime"
        rules={{ required: "This field is required" }}
        defaultValue={"09:00:00"}
        render={({ field, fieldState }) => (
          <TimePicker
            {...field}
            views={["hours", "minutes"]}
            format={k.TIME_ONLY_FM_DEFAULT}
            ampm={false}
            value={field.value ? dayjs(`${k.DUMMY_DATE_ONLY_PREFIX}T${field.value}`) : null}
            onChange={(time) => {
              const timeString = time ? dayjs(time).format(k.TIME_ONLY_RETAIN_SECS_FM_DEFAULT) : null; // display HH:mm but send HH:mm:00
              field.onChange(timeString);
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                margin: "normal",
                label: t("Start Time"),
                error: !!fieldState.error,
                helperText: fieldState.error?.message,
                InputLabelProps: { shrink: true },
                placeholder: "e.g. 13:00",
              },
            }}
          />
        )}
      />

      <Controller
        control={control}
        name="endTime"
        rules={{ required: "This field is required" }}
        defaultValue={"16:00:00"}
        render={({ field, fieldState }) => (
          <TimePicker
            {...field}
            views={["hours", "minutes"]}
            format={k.TIME_ONLY_FM_DEFAULT}
            ampm={false}
            value={field.value ? dayjs(`${k.DUMMY_DATE_ONLY_PREFIX}T${field.value}`) : null}
            onChange={(time) => {
              const timeString = time ? dayjs(time).format(k.TIME_ONLY_RETAIN_SECS_FM_DEFAULT) : null; // display HH:mm but send HH:mm:00
              field.onChange(timeString);
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                margin: "normal",
                label: t("End Time"),
                error: !!fieldState.error,
                helperText: fieldState.error?.message,
                InputLabelProps: { shrink: true },
                placeholder: "e.g. 18:00",
              },
            }}
          />
        )}
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
              <Checkbox {...field} checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
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
              <Checkbox {...field} checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
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
              <Checkbox {...field} checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
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
              <Checkbox {...field} checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
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
              <Checkbox {...field} checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
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
              <Checkbox {...field} checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
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
              <Checkbox {...field} checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
            )}
          />
        }
      />
    </Box>
  );
}
