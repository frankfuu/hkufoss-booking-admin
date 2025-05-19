import { Edit, useAutocomplete } from "@refinedev/mui";
import { Box, TextField, Autocomplete, createFilterOptions, Checkbox, FormControlLabel, FormHelperText } from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useState } from "react";
import { useGetIdentity } from "@refinedev/core";
import { d, k } from "../../common/constants";

import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";

type IUser = {
  id: number;
  username: string;
  centreId: number;
};

function roundToNearestHour(date: Dayjs) {
  // Get the current minutes
  const minutes = date.minute();

  // Round the time:
  // If minutes are 30 or more, round up to the next hour
  // Otherwise, round down to the current hour
  if (minutes >= 30) {
    return date.startOf("hour").add(1, "hour");
  } else {
    return date.startOf("hour");
  }
}

export default function EditCreateResourceExceptions({
  register,
  errors,
  control,
  action,
  setValue,
  setError,
  clearErrors,
}: any) {
  const { t } = useTranslation();
  const [timeError, setTimeError] = useState<string | null>(null);

  const { data: user } = useGetIdentity<IUser>();
  const isCreate = action === "create";

  const TIME_CONSTRAINT_ERROR = t("pages.common.startBeforeEndTime");

  const validateTimeConstraint = () => {
    const { startTime, endTime } = control._formValues;

    if (!startTime || !endTime) {
      setTimeError(t(TIME_CONSTRAINT_ERROR));
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

  const { autocompleteProps: resourceAutocompleteProps } = useAutocomplete({
    resource: "resources",
    pagination: {
      pageSize: k.GET_MANY_DEFAULT,
    },
  });

  const filterOptionsResources = createFilterOptions({
    matchFrom: "any",
    stringify: (option: any) => `${option?.resourceId} ${option?.resourceName} ${option?.resourceType}`,
  });

  return (
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
                  label={t("resource")}
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
          // disabled
          control={control}
          name="startTime"
          defaultValue={roundToNearestHour(dayjs())}
          render={({ field }) => (
            <DateTimePicker
              {...field}
              format={k.DATE_FM_DEFAULT}
              value={field.value ? dayjs(field.value) : null}
              onChange={(date) => {
                field.onChange(date);
                const endTime = control._formValues.endTime;
                validateTimeConstraint();
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: "normal",
                  label: t("Start Time"),
                },
              }}
            />
          )}
        />
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
          error={!!(errors as any)?.name}
          helperText={(errors as any)?.name?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          label={t("name")}
          placeholder="e.g. Monthly Maintenance, Christmas Shutdown, Chinese New Year etc"
          name="name"
        />
        <Controller
          // disabled
          control={control}
          name="endTime"
          defaultValue={roundToNearestHour(dayjs().add(2, "day"))}
          render={({ field }) => (
            <>
              <DateTimePicker
                {...field}
                format={k.DATE_FM_DEFAULT}
                value={field.value ? dayjs(field.value) : null}
                onChange={(date) => {
                  field.onChange(date);
                  const startTime = control._formValues.startTime;
                  validateTimeConstraint();
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: "normal",
                    label: t("End Time"),
                    InputLabelProps: { shrink: true },
                    error: !!timeError,
                  },
                }}
              />
              {timeError && <FormHelperText error>{timeError}</FormHelperText>}
            </>
          )}
        />
      </Box>
    </Box>
  );
}
