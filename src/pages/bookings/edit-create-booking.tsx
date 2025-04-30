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

export default function EditCreateBookings({ register, errors, control, action }: any) {
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
        {...register("status", {
          required: "This field is required",
        })}
        error={!!(errors as any)?.status}
        helperText={(errors as any)?.status?.message}
        margin="normal"
        fullWidth
        InputLabelProps={{ shrink: true }}
        label={t("Status")}
        name="status"
      />

      <TextField
        {...register("noAttendees", {
          required: "This field is required",
        })}
        error={!!(errors as any)?.noAttendees}
        helperText={(errors as any)?.noAttendees?.message}
        margin="normal"
        fullWidth
        InputLabelProps={{ shrink: true }}
        label={t("No. Attendees")}
        name="noAttendees"
      />

      <TextField
        {...register("activityName", {
          required: "This field is required",
        })}
        error={!!(errors as any)?.activityName}
        helperText={(errors as any)?.activityName?.message}
        margin="normal"
        fullWidth
        InputLabelProps={{ shrink: true }}
        label={t("Activity Name")}
        name="activityName"
      />

      <TextField
        {...register("contactPerson", {
          required: "This field is required",
        })}
        error={!!(errors as any)?.contactPerson}
        helperText={(errors as any)?.contactPerson?.message}
        margin="normal"
        fullWidth
        InputLabelProps={{ shrink: true }}
        label={t("Contact Person")}
        name="contactPerson"
      />

      <TextField
        {...register("externalSpeakers", {
          required: "This field is required",
        })}
        error={!!(errors as any)?.externalSpeakers}
        helperText={(errors as any)?.externalSpeakers?.message}
        margin="normal"
        fullWidth
        InputLabelProps={{ shrink: true }}
        label={t("External Speakers")}
        name="externalSpeakers"
      />

      <TextField
        {...register("specialRequests", {
          required: "This field is required",
        })}
        error={!!(errors as any)?.specialRequests}
        helperText={(errors as any)?.specialRequests?.message}
        margin="normal"
        fullWidth
        InputLabelProps={{ shrink: true }}
        label={t("Special Requests")}
        name="specialRequests"
      />

      <TextField
        {...register("activityNatureId", {
          required: "This field is required",
        })}
        error={!!(errors as any)?.activityNatureId}
        helperText={(errors as any)?.activityNatureId?.message}
        margin="normal"
        fullWidth
        InputLabelProps={{ shrink: true }}
        label={t("Activity Nature")}
        name="activityNatureId"
      />

      <TextField
        {...register("activityTypeId", {
          required: "This field is required",
        })}
        error={!!(errors as any)?.activityTypeId}
        helperText={(errors as any)?.activityTypeId?.message}
        margin="normal"
        fullWidth
        InputLabelProps={{ shrink: true }}
        label={t("Activity Type")}
        name="activityTypeId"
      />

      <TextField
        {...register("courseId", {
          required: "This field is required",
        })}
        error={!!(errors as any)?.courseId}
        helperText={(errors as any)?.courseId?.message}
        margin="normal"
        fullWidth
        InputLabelProps={{ shrink: true }}
        label={t("Course")}
        name="courseId"
      />

      <TextField
        {...register("funderId", {
          required: "This field is required",
        })}
        error={!!(errors as any)?.funderId}
        helperText={(errors as any)?.funderId?.message}
        margin="normal"
        fullWidth
        InputLabelProps={{ shrink: true }}
        label={t("Funder")}
        name="funderId"
      />

      <TextField
        {...register("startTime", {
          required: "This field is required",
        })}
        error={!!(errors as any)?.startTime}
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
        helperText={(errors as any)?.endTime?.message}
        margin="normal"
        fullWidth
        InputLabelProps={{ shrink: true }}
        label={t("End Time")}
        name="endTime"
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
        disabled
        InputLabelProps={{ shrink: true }}
        label={t("Schedule ID")}
        name="scheduleId"
      />

      <TextField
        {...register("userId", {
          required: "This field is required",
        })}
        error={!!(errors as any)?.userId}
        helperText={(errors as any)?.userId?.message}
        margin="normal"
        disabled
        fullWidth
        InputLabelProps={{ shrink: true }}
        label={t("User")}
        name="userId"
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
    </Box>
  );
}
