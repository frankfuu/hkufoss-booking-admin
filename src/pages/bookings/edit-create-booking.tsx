import { Edit, useAutocomplete } from "@refinedev/mui";
import {
  Box,
  TextField,
  Autocomplete,
  createFilterOptions,
  Checkbox,
  FormControlLabel,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
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

export default function EditCreateBookings({ register, errors, control, action, slotData }: any) {
  const { t } = useTranslation();

  const { data: user } = useGetIdentity<IUser>();
  const isCreate = action === "create";

  const { autocompleteProps: activityTypeAutocompleteProps } = useAutocomplete({
    resource: "activity-types",
    pagination: {
      pageSize: k.DROPDOWN_PAGE_SIZE_DEFAULT,
    },
  });

  const filterOptionsActivityTypes = createFilterOptions({
    matchFrom: "any",
    stringify: (option: any) => `${option?.id} ${option?.name}`,
  });

  const { autocompleteProps: activityNatureAutocompleteProps } = useAutocomplete({
    resource: "activity-natures",
    pagination: {
      pageSize: k.DROPDOWN_PAGE_SIZE_DEFAULT,
    },
  });

  const filterOptionsactivityNatures = createFilterOptions({
    matchFrom: "any",
    stringify: (option: any) => `${option?.id} ${option?.name}`,
  });

  const { autocompleteProps: courseAutocompleteProps } = useAutocomplete({
    resource: "courses",
    pagination: {
      pageSize: k.DROPDOWN_PAGE_SIZE_DEFAULT,
    },
  });

  const filterOptionsCourses = createFilterOptions({
    matchFrom: "any",
    stringify: (option: any) => `${option?.id} ${option?.name} ${option?.code}`,
  });

  const { autocompleteProps: funderAutocompleteProps } = useAutocomplete({
    resource: "funders",
    pagination: {
      pageSize: k.DROPDOWN_PAGE_SIZE_DEFAULT,
    },
  });

  const filterOptionsFunders = createFilterOptions({
    matchFrom: "any",
    stringify: (option: any) => `${option?.id} ${option?.name} ${option?.accountCode}`,
  });

  const { autocompleteProps: resourceAutocompleteProps } = useAutocomplete({
    resource: "resources",
    pagination: {
      pageSize: k.DROPDOWN_PAGE_SIZE_DEFAULT,
    },
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
        defaultValue={slotData ? slotData.slot.resourceId : null}
        render={({ field }) => (
          <Autocomplete
            {...resourceAutocompleteProps}
            {...field}
            disabled
            onChange={(_, value) => field.onChange(value?.id ?? value)}
            filterOptions={filterOptionsResources}
            onInputChange={(event, value) => {}}
            value={resourceAutocompleteProps?.options?.find((option) => option.id === field.value) || null}
            getOptionLabel={(option) => `(RID ${option?.id}) ${option?.resourceName} - ${option?.resourceType}`}
            renderInput={(params) => <TextField {...params} label={t("resource")} margin="normal" variant="outlined" required />}
          />
        )}
      />
      <Controller
        control={control}
        name="status"
        rules={{ required: "This field is required" }}
        defaultValue={d.BOOKINGS.STATUS.DEFAULT}
        render={({ field }) => (
          <Autocomplete
            {...field}
            options={d.BOOKINGS.STATUS.OPTIONS}
            disabled={isCreate}
            getOptionLabel={(option) => t(option.label)}
            value={d.BOOKINGS.STATUS.OPTIONS.find((option) => option.value === field.value) || null}
            onChange={(_, newValue) => {
              field.onChange(newValue?.value);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t("status")}
                margin="normal"
                variant="outlined"
                error={!!(errors as any)?.status}
                helperText={(errors as any)?.status?.message}
                required
              />
            )}
          />
        )}
      />

      <Controller
        control={control}
        name="startTime"
        defaultValue={slotData ? dayjs(slotData.slot.fromDateTimeISOString) : null}
        render={({ field }) => (
          <DateTimePicker
            {...field}
            disabled
            format={k.DATE_FM_DEFAULT}
            value={field.value ? dayjs(field.value) : null}
            onChange={(date) => field.onChange(date)}
            slotProps={{
              textField: {
                fullWidth: true,
                margin: "normal",
                label: t("Start Time"),
                InputLabelProps: { shrink: true },
              },
            }}
          />
        )}
      />

      <Controller
        control={control}
        name="duration"
        rules={{ required: "This field is required" }}
        defaultValue={d.BOOKINGS.DURATION.DEFAULT}
        render={({ field }) => (
          <Autocomplete
            options={d.BOOKINGS.DURATION.OPTIONS}
            getOptionLabel={(option) => option.label}
            onChange={(_, value) => field.onChange(value?.value ?? value)}
            onInputChange={(event, value) => {}}
            value={d.BOOKINGS.DURATION.OPTIONS.find((option) => option.value === field.value) || null}
            sx={{ mt: 2 }}
            renderInput={(params) => <TextField {...params} label={t("Duration")} InputLabelProps={{ shrink: true }} />}
          />
        )}
      />

      <TextField
        {...register("noAttendees", {
          required: "This field is required",
        })}
        error={!!(errors as any)?.noAttendees}
        helperText={(errors as any)?.noAttendees?.message}
        margin="normal"
        fullWidth
        defaultValue={10}
        InputLabelProps={{ shrink: true }}
        label={t("noAttendees")}
        name="noAttendees"
        required
      />
      <TextField
        {...register("activityName", {
          required: "This field is required",
        })}
        error={!!(errors as any)?.activityName}
        helperText={(errors as any)?.activityName?.message}
        margin="normal"
        fullWidth
        defaultValue={"My Activity name"}
        InputLabelProps={{ shrink: true }}
        label={t("activity.full")}
        name="activityName"
        required
      />
      <TextField
        {...register("contactPerson", {
          required: "This field is required",
        })}
        error={!!(errors as any)?.contactPerson}
        helperText={(errors as any)?.contactPerson?.message}
        margin="normal"
        fullWidth
        defaultValue={"Contact Person Name"}
        InputLabelProps={{ shrink: true }}
        label={t("contactPerson")}
        name="contactPerson"
      />
      <Controller
        control={control}
        name="activityNatureId"
        // rules={{ required: "This field is required" }}
        defaultValue={null as any}
        render={({ field }) => (
          <Autocomplete
            {...activityNatureAutocompleteProps}
            {...field}
            filterOptions={filterOptionsactivityNatures}
            onChange={(_, value) => field.onChange(value?.id ?? value)}
            onInputChange={(event, value) => {}}
            value={activityNatureAutocompleteProps?.options?.find((option) => option.id === field.value) || null}
            getOptionLabel={(option) => `(ANID ${option?.id}) ${option?.name}`}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t("activity-natures")}
                margin="normal"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        )}
      />
      <Controller
        control={control}
        name="activityTypeId"
        // rules={{ required: "This field is required" }}
        defaultValue={null as any}
        render={({ field }) => (
          <Autocomplete
            {...activityTypeAutocompleteProps}
            {...field}
            filterOptions={filterOptionsActivityTypes}
            onChange={(_, value) => field.onChange(value?.id ?? value)}
            onInputChange={(event, value) => {}}
            value={activityTypeAutocompleteProps?.options?.find((option) => option.id === field.value) || null}
            getOptionLabel={(option) => `(ATID ${option?.id}) ${option?.name}`}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t("activity-types")}
                margin="normal"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        )}
      />
      <Controller
        control={control}
        name="courseId"
        // rules={{ required: "This field is required" }}
        defaultValue={null as any}
        render={({ field }) => (
          <Autocomplete
            {...courseAutocompleteProps}
            {...field}
            filterOptions={filterOptionsCourses}
            onChange={(_, value) => field.onChange(value?.id ?? value)}
            onInputChange={(event, value) => {}}
            value={courseAutocompleteProps?.options?.find((option) => option.id === field.value) || null}
            getOptionLabel={(option) => `(CID ${option?.id}) ${option?.name} ${option?.code}`}
            renderInput={(params) => (
              <TextField {...params} label={t("courses")} margin="normal" variant="outlined" InputLabelProps={{ shrink: true }} />
            )}
          />
        )}
      />
      <Controller
        control={control}
        name="funderId"
        // rules={{ required: "This field is required" }}
        defaultValue={null as any}
        render={({ field }) => (
          <Autocomplete
            {...funderAutocompleteProps}
            {...field}
            filterOptions={filterOptionsFunders}
            onChange={(_, value) => field.onChange(value?.id ?? value)}
            onInputChange={(event, value) => {}}
            value={funderAutocompleteProps?.options?.find((option) => option.id === field.value) || null}
            getOptionLabel={(option) => `(FID ${option?.id}) ${option?.name} (Acc. ${option?.accountCode})`}
            renderInput={(params) => (
              <TextField {...params} label={t("funders")} margin="normal" variant="outlined" InputLabelProps={{ shrink: true }} />
            )}
          />
        )}
      />

      <TextField
        {...register("externalSpeakers", {})}
        error={!!(errors as any)?.externalSpeakers}
        helperText={(errors as any)?.externalSpeakers?.message}
        margin="normal"
        fullWidth
        InputLabelProps={{ shrink: true }}
        label={t("externalSpeakers")}
        name="externalSpeakers"
      />
      <TextField
        {...register("specialRequests", {})}
        error={!!(errors as any)?.specialRequests}
        helperText={(errors as any)?.specialRequests?.message}
        margin="normal"
        fullWidth
        InputLabelProps={{ shrink: true }}
        label={t("specialRequests")}
        name="specialRequests"
      />
      <TextField
        {...register("scheduleId", {
          required: "This field is required",
        })}
        error={!!(errors as any)?.scheduleId}
        placeholder="e.g. 5"
        helperText={(errors as any)?.scheduleId?.message}
        margin="normal"
        fullWidth
        InputLabelProps={{ shrink: true }}
        label={t("Schedule ID")}
        defaultValue={slotData ? slotData.slot?.scheduleId : null}
        name="scheduleId"
        disabled
      />

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
    </Box>
  );
}
