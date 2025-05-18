import { Edit, useAutocomplete } from "@refinedev/mui";
import {
  Box,
  TextField,
  Autocomplete,
  createFilterOptions,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Typography,
} from "@mui/material";
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

export default function EditCreateResourceSchedules({ register, errors, control, action, setError, setValue, clearErrors }: any) {
  const { t } = useTranslation();

  const { data: user } = useGetIdentity<IUser>();
  const isCreate = action === "create";

  const [timeError, setTimeError] = useState<string | null>(null);

  const { autocompleteProps: resourceAutocompleteProps } = useAutocomplete({
    resource: "resources",
  });

  const filterOptionsResources = createFilterOptions({
    matchFrom: "any",
    stringify: (option: any) => `${option?.resourceId} ${option?.resourceName} ${option?.resourceType}`,
  });

  const TIME_CONSTRAINT_ERROR = t("pages.common.startBeforeEndTime");

  const validateTimeConstraint = () => {
    const { endDate, startDate, startTime, endTime } = control._formValues;

    if (!startDate || !endDate || !startTime || !endTime) {
      setTimeError(t(TIME_CONSTRAINT_ERROR));
      return;
    }

    if (startDate !== endDate) {
      setTimeError(dayjs(endDate).isAfter(dayjs(startDate)) ? null : t(TIME_CONSTRAINT_ERROR));
      return;
    }

    setTimeError(endTime >= startTime ? null : t(TIME_CONSTRAINT_ERROR));
  };

  useEffect(() => {
    if (timeError) {
      setError("timingValidation", {
        type: "custom",
        message: timeError,
      });
    } else {
      clearErrors();
    }
  }, [timeError, setError]);

  return (
    <>
      <Box component="form" sx={{ display: "flex", flexDirection: "row" }} autoComplete="off">
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", padding: 2 }}>
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
            // defaultValue={1}
            render={({ field }) => (
              <Autocomplete
                {...resourceAutocompleteProps}
                {...field}
                onChange={(_, value) => field.onChange(value?.id ?? value)}
                filterOptions={filterOptionsResources}
                onInputChange={(event, value) => {}}
                value={resourceAutocompleteProps?.options?.find((option) => option.id === field.value) || null}
                getOptionLabel={(option) => `(ID: ${option?.id}) ${option?.resourceName} - ${option?.resourceType}`}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t("Resource")}
                    margin="normal"
                    variant="outlined"
                    placeholder="Choose resource"
                    required
                    InputLabelProps={{ shrink: true }}
                    error={!!(errors as any)?.resourceId}
                    helperText={(errors as any)?.resourceId?.message}
                  />
                )}
              />
            )}
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
                  validateTimeConstraint();
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
                  validateTimeConstraint();
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

          <Box sx={{ flexDirection: "row", padding: 1 }}>
            <Typography variant="subtitle1">Available days</Typography>
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
        </Box>
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", padding: 2 }}>
          {!isCreate && (
            <Controller
              disabled
              control={control}
              name="updatedAt"
              render={({ field }) => (
                <DateTimePicker
                  {...field}
                  sx={{ mt: 2 }}
                  format={k.DATE_FM_DEFAULT}
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) => field.onChange(date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: "normal",
                      label: t("updatedAt"),
                      InputLabelProps: { shrink: true },
                    },
                  }}
                />
              )}
            />
          )}
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
            name="endDate"
            defaultValue={dayjs().add(7, "day").format(k.DATE_ONLY_FM_DEFAULT)}
            render={({ field }) => (
              <>
                <DatePicker
                  {...field}
                  format={k.DATE_ONLY_FM_DEFAULT}
                  views={["year", "month", "day"]}
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) => {
                    const dateString = date ? dayjs(date).format(k.DATE_ONLY_FM_DEFAULT) : null; // ensure no time element
                    field.onChange(dateString);
                    validateTimeConstraint();
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: "normal",
                      label: t("End Date"),
                      InputLabelProps: { shrink: true },
                      error: !!timeError,
                    },
                  }}
                />
                {timeError && <FormHelperText error>{timeError}</FormHelperText>}
              </>
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
                  validateTimeConstraint();
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
        </Box>
      </Box>
    </>
  );
}
