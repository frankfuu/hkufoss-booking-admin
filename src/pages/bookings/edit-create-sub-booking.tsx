import { Edit, useAutocomplete, useDataGrid } from "@refinedev/mui";
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
  Button,
} from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useState } from "react";
import { useCustom, useGetIdentity, useGo, useList, useOne, useResource } from "@refinedev/core";
import { d, k } from "../../common/constants";

import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React from "react";
import { start } from "repl";

export default function EditCreateSubBookings({
  register,
  errors,
  control,
  action,
  slotData,
  setValue,
  query,
  isEditable = true,
  setError,
}: any) {
  const { t } = useTranslation();

  const { data: user } = useGetIdentity<IUser>();
  const isCreate = action === "create";
  const booking = query.data?.data;

  const { autocompleteProps: resourceAutocompleteProps } = useAutocomplete({
    resource: "resources",
    pagination: {
      pageSize: k.DROPDOWN_PAGE_SIZE_DEFAULT,
    },
  });

  const { autocompleteProps: parentResourceAutocompleteProps } = useAutocomplete({
    resource: "resources",
    pagination: {
      pageSize: k.DROPDOWN_PAGE_SIZE_DEFAULT,
    },
  });

  const filterOptionsResources = createFilterOptions({
    matchFrom: "any",
    stringify: (option: any) => `${option?.resourceId} ${option?.resourceName} ${option?.resourceType}`,
  });

  const resourcesQuery = useOne({
    resource: "resources",
    id: slotData ? slotData?.slot.resourceId : booking?.resourceId,
  });

  const [currentDuration, setCurrentDuration] = useState<number | null>(booking?.duration ?? 1);

  if (!booking && !isCreate) {
    return t("loading");
  } else {
    return (
      <>
        {booking && booking.status == d.BOOKINGS.STATUS.LIST.CANCELLED && (
          <Typography variant="h4" textAlign="center" color="red">
            This booking has been cancelled
          </Typography>
        )}
        <Box component="form" sx={{ display: "flex", flexDirection: "row" }} autoComplete="off">
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", padding: 2 }}>
            {!isCreate && (
              <>
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
                <TextField
                  margin="normal"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  label={t("bookedBy")}
                  name="id"
                  value={booking?.user?.username}
                  disabled
                />
              </>
            )}

            <Controller
              control={control}
              name="parentResourceId"
              defaultValue={slotData ? slotData.slot.resourceId : null}
              render={({ field }) => (
                <Autocomplete
                  {...parentResourceAutocompleteProps}
                  {...field}
                  disabled
                  onChange={(_, value) => field.onChange(value?.id ?? value)}
                  filterOptions={filterOptionsResources}
                  onInputChange={(event, value) => {}}
                  value={parentResourceAutocompleteProps?.options?.find((option) => option.id === field.value) || null}
                  getOptionLabel={(option) => `(ID: ${option?.id}) ${option?.resourceName} - ${option?.resourceType}`}
                  renderInput={(params) => (
                    <TextField {...params} label={t("Parent Resource")} margin="normal" variant="outlined" />
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
          </Box>
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", padding: 2 }}>
            {!isCreate && (
              <>
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
                <Controller
                  control={control}
                  name="status"
                  rules={{ required: "This field is required" }}
                  defaultValue={d.BOOKINGS.STATUS.DEFAULT}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={d.BOOKINGS.STATUS.OPTIONS}
                      disabled={isCreate || user?.roleId != k.ROLES.ADMIN}
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
              </>
            )}

            <Controller
              control={control}
              name="duration"
              disabled={!isEditable}
              rules={{ required: "This field is required" }}
              defaultValue={d.BOOKINGS.DURATION.SEAT_DEFAULT}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={d.BOOKINGS.DURATION.OPTIONS}
                  getOptionLabel={(option) => option.label}
                  onChange={(_, value) => {
                    field.onChange(value?.value ?? value);
                    setCurrentDuration(typeof value === "number" ? value : value?.value ?? null);
                  }}
                  onInputChange={(event, value) => {}}
                  value={d.BOOKINGS.DURATION.OPTIONS.find((option) => option.value === field.value) || null}
                  sx={{ mt: 2, mb: 1 }}
                  renderInput={(params) => <TextField {...params} label={t("Duration")} InputLabelProps={{ shrink: true }} />}
                />
              )}
            />
            <TextField
              {...register("activityName", {
                // required: "This field is required",
              })}
              error={!!(errors as any)?.activityName}
              helperText={(errors as any)?.activityName?.message}
              margin="normal"
              fullWidth
              disabled={!isEditable}
              defaultValue={"My Activity name"}
              InputLabelProps={{ shrink: true }}
              label={t("activity.full")}
              name="activityName"
              // required
            />
          </Box>
        </Box>

        <Box>
          <SubResources
            parentId={slotData ? slotData.slot.resourceId : booking?.parentResourceId}
            setValue={setValue}
            resourceId={slotData ? slotData.slot.resourceId : booking?.resourceId}
            startTime={slotData ? slotData.slot.fromDateTimeISOString : booking?.startTime}
            duration={currentDuration}
          />
        </Box>
      </>
    );
  }
}

const SubResources = ({
  parentId,
  setValue,
  resourceId,
  startTime,
  duration,
}: {
  parentId: number;
  setValue: any;
  resourceId: number;
  startTime: string;
  duration: number | null;
}) => {
  // const p = useParams();

  const { t } = useTranslation();
  const {
    dataGridProps,
    tableQuery: { refetch },
  } = useDataGrid({
    resource: "resources",
    filters: {
      permanent: [
        {
          field: "parentId",
          operator: "eq",
          value: parentId ?? 0,
        },
      ],
    },
    sorters: {
      initial: [
        {
          field: "updatedAt",
          order: "desc",
        },
      ],
    },
  });

  const {
    data: resourcesData,
    isLoading: resourcesDataLoading,
    isError: resourcesDataError,
  } = useList({
    resource: "resources",
    pagination: {
      pageSize: k.GET_MANY_DEFAULT,
    },
  });
  const go = useGo();

  const [selectedResourceId, setSelectedResourceId] = useState<number | null>(resourceId ?? null);

  const onSeatSelect = (row: any) => {
    setValue("resourceId", row.id);
    setSelectedResourceId(row.id);
  };

  // const startTime = 2025-06-03T06:00:00.000Z;
  const from = startTime ? dayjs(startTime).format("YYYY-MM-DD") : "";
  const to = startTime ? dayjs(startTime).format("YYYY-MM-DD") : "";
  const hh = startTime ? dayjs(startTime).format("HH:mm") : "";
  const {
    data: availabilityData,
    isLoading: availabilityDataLoading,
    error,
  } = useCustom({
    url: `resources/available-days?from=${from}&to=${to}&resourceId=${parentId}`,
    method: "get",
    queryOptions: {
      // enabled: !!selectedService?.id,
    },
  });

  const availTimeslots = availabilityData?.data[0]?.timeSlots;
  console.log(`availTimeslots`, availTimeslots);

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: "id",
        headerName: "Id",
        type: "number",
        minWidth: 50,
        filterable: false,
      },
      {
        field: "resourceName",
        minWidth: 150,
        headerName: t("resourceName"),
      },
      {
        field: "coordX",
        minWidth: 50,
        headerName: t("X-Coordinate"),
      },
      {
        field: "coordY",
        minWidth: 50,
        headerName: t("Y-Coordinate"),
      },
      {
        field: "tba",
        minWidth: 180,
        headerName: t("Max Duration"),
        renderCell: ({ row }) => {
          if (availTimeslots) {
            const d = findLongestAvailabilityFromTime(availTimeslots, row.id, hh);
            return d.duration;
          } else {
            return "empty";
          }
        },
      },
      {
        field: "actions",
        headerName: t("Actions"),
        sortable: false,
        type: "actions",
        minWidth: 200,
        renderCell: function render({ row }) {
          const current = row.id == selectedResourceId;
          let raAvail = false;
          if (availTimeslots) {
            const t = availTimeslots?.find((x: any) => x.from == hh);
            const avails = t?.subResourcesMeta?.resourceAvailbilities;
            const ra = avails.find((x: any) => x.id == row.id);

            let withinDuration = false;
            if (duration) {
              const d = findLongestAvailabilityFromTime(availTimeslots, row.id, hh);
              withinDuration = duration <= d.duration;
            }
            raAvail = ra?.available && withinDuration;
          }

          return (
            <>
              <Button
                variant={current ? "contained" : "contained"}
                color={current ? "primary" : raAvail ? "info" : "error"}
                onClick={() => {
                  if (raAvail) {
                    onSeatSelect(row);
                  }
                }}
                sx={{ minWidth: 150 }}
                disabled={!raAvail && !current}
              >
                {current ? "Selected" : raAvail ? "Select" : "Not available"}
              </Button>
            </>
          );
        },
        align: "left",
        headerAlign: "left",
      },
    ],
    [resourcesData, t, selectedResourceId, availabilityData, duration]
  );

  return (
    <>
      {/* <h2>
        resourceId {resourceId}, parentId {parentId}, duration {duration}
      </h2> */}
      {/* <h2>
        from {from}, to {to}, hh {hh}
      </h2> */}
      <Typography variant="h4" textAlign="center" sx={{ my: 2 }}>
        Seat Selection
      </Typography>
      <DataGrid {...dataGridProps} columns={columns} autoHeight />
    </>
  );
};

/**
 * Find the longest continuous availability period for a specific resource ID starting from a specific time
 * @param {Array} scheduleData - Array of schedule slots
 * @param {number} targetResourceId - The ID of the subresource to check availability for
 * @param {string} startTime - The time to start looking for availability (format: "HH:MM")
 * @returns {Object} Object containing the duration in hours and the time range
 */
function findLongestAvailabilityFromTime(scheduleData: string | any[], targetResourceId: any, startTime: string) {
  // Validate input
  if (!Array.isArray(scheduleData) || scheduleData.length === 0) {
    return { duration: 0, startTime: null, endTime: null };
  }

  // Sort data by time
  const sortedData = [...scheduleData].sort(
    (a, b) => new Date(a.fromDateTimeISOString).getTime() - new Date(b.fromDateTimeISOString).getTime()
  );

  // Find starting slot for the given startTime
  const startSlot = sortedData.find((slot) => slot.from === startTime);
  if (!startSlot) {
    return { duration: 0, startTime: null, endTime: null };
  }

  // Check if the resource is available in the starting slot
  const isAvailableAtStart = startSlot.subResourcesMeta.resourceAvailbilities.some(
    (resource: any) => resource.id === targetResourceId && resource.available
  );

  // If not available at the requested start time, return 0 duration
  if (!isAvailableAtStart) {
    return { duration: 0, startTime: null, endTime: null };
  }

  // Find the index of the starting slot
  const startIndex = sortedData.indexOf(startSlot);
  let currentStreak = 0;

  // Loop through each time slot starting from the start index
  for (let i = startIndex; i < sortedData.length; i++) {
    const slot = sortedData[i];

    // Find the subresource in the current slot
    const resourceEntry = slot.subResourcesMeta.resourceAvailbilities.find((resource: any) => resource.id === targetResourceId);

    if (resourceEntry && resourceEntry.available) {
      currentStreak++;
    } else {
      // Resource is not available, end of streak
      break;
    }
  }

  // Calculate end time if there is a streak
  let endTime = null;
  if (currentStreak > 0) {
    const endIndex = startIndex + currentStreak - 1;
    endTime = sortedData[endIndex].to;
  }

  return {
    duration: currentStreak,
    startTime: startTime,
    endTime: endTime,
  };
}
