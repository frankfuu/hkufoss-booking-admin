import React from "react";
import { useDataGrid, EditButton, ShowButton, DeleteButton, List, DateField, CloneButton } from "@refinedev/mui";
import { DataGrid, GridColDef, GridToolbar, getGridSingleSelectOperators } from "@mui/x-data-grid";
import { Box, Button, ButtonGroup, Checkbox, Chip, Grid, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useCustomMutation, useList, useNavigation, usePermissions, useResource } from "@refinedev/core";
import { d, k } from "../../common/constants";
import { useTranslation } from "react-i18next";
import { getChipProps } from "../../common/helpers";

export const BookingsList = () => {
  const { t } = useTranslation();
  const [selectedStatus, setSelectedStatus] = React.useState<string | null>("ALL");
  const [selectedTimeRange, setSelectedTimeRange] = React.useState<string | null>("ALL");
  const [selectedResource, setSelectedResource] = React.useState<string | null>("ALL");
  const [selectedResourceType, setSelectedResourceType] = React.useState<string | null>("ALL");
  const {
    dataGridProps,
    setFilters,
    tableQuery: { refetch },
  } = useDataGrid({
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
    data: resourcesDataAll,
    isLoading: resourcesDataAllLoading,
    isError: resourcesDataAllError,
  } = useList({
    resource: "resources",
    pagination: {
      pageSize: k.GET_MANY_DEFAULT,
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
    filters: [{ field: "parentId", operator: "eq", value: "null" }],
  });

  const { edit } = useNavigation();
  const { resource } = useResource();

  const { mutate } = useCustomMutation({});

  const handleStatusUpdate = (row: any, newStatus: string) => {
    const targetUrl = `bookings/${row.id}`;
    mutate(
      {
        url: targetUrl,
        // @ts-ignore,
        // case sensitivity issue, need to fix on server, refine.dev expecting lower case but server expects upper case
        method: "PATCH",
        values: {
          status: newStatus,
        },
        successNotification: (data, values) => {
          return {
            message: `Booking ${data?.data?.status}`,
            type: "success",
          };
        },
      },
      {
        // onError: (error, variables, context) => {
        //   console.log(error);
        // },
        onSuccess: (data, variables, context) => {
          refetch();
        },
      }
    );
  };

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: "id",
        headerName: "Id",
        type: "number",
        minWidth: 10,
        filterable: false,
      },
      {
        field: "activityName",
        minWidth: 180,
        headerName: t("activity.short"),
      },
      {
        field: "status",
        headerName: t("status"),
        minWidth: 120,
        type: "singleSelect",
        valueOptions: d.BOOKINGS.STATUS.OPTIONS,
        getOptionValue: (value: any) => value?.value,
        getOptionLabel: (value: any) => value?.label,
        filterOperators: getGridSingleSelectOperators().filter((operator) => {
          return operator.value === "is" || operator.value === "not";
        }),
        renderCell: ({ row }) => {
          return <Chip label={row.status} size="small" variant="outlined" {...getChipProps(row.status)} />;
        },
      },
      // {
      //   field: "noAttendees",
      //   minWidth: 80,
      //   headerName: "No. Attendees",
      // },
      {
        field: "resourceId",
        minWidth: 220,
        headerName: t("resource"),
        renderCell: ({ row }) => {
          const resource = resourcesDataAll?.data.find((r) => r.id == row.resourceId);
          const isSubresource = resource?.parentId != null;
          let label = "";
          if (isSubresource) {
            const parentResource = resourcesDataAll?.data.find((r) => r.id == resource.parentId);
            label = `${parentResource?.resourceName} (${resource?.resourceName})`;
          } else {
            label = `${resource?.resourceName}`;
          }
          return label;
        },
      },
      // {
      //   field: "scheduleId",
      //   minWidth: 50,
      //   headerName: "Schedule ID",
      // },
      {
        field: "startTime",
        minWidth: 130,
        headerName: t("Start Time"),
        renderCell: function render({ value }) {
          return <DateField value={value} format={k.DATE_FM_DEFAULT} />;
        },
      },
      {
        field: "duration",
        minWidth: 10,
        headerName: t("Duration"),
        align: "center",
        headerAlign: "center",
      },
      {
        field: "user.username",
        minWidth: 150,
        maxWidth: 150,
        headerName: t("bookedBy"),
        renderCell: ({ row }) => {
          return row?.user?.username;
        },
      },
      // {
      //   field: "endTime",
      //   minWidth: 130,
      //   headerName: t("End Time"),
      //   renderCell: function render({ value }) {
      //     return <DateField value={value} format={k.DATE_FM_DEFAULT} />;
      //   },
      // },

      {
        field: "actions",
        headerName: t("Actions"),
        sortable: false,
        type: "actions",
        minWidth: 200,
        renderCell: function render({ row }) {
          return (
            <>
              {/* <EditButton recordItemId={row.id} /> */}

              {row.status == d.BOOKINGS.STATUS.LIST.PENDING ? (
                <>
                  <Button
                    size="small"
                    sx={{ mr: 2 }}
                    onClick={() => handleStatusUpdate(row, d.BOOKINGS.STATUS.LIST.CONFIRMED)}
                    variant="outlined"
                    color="success"
                  >
                    Confirm
                  </Button>
                  <Button
                    size="small"
                    sx={{ mr: 2 }}
                    onClick={() => {
                      if (window.confirm(t("bookingCancelPrompt"))) {
                        handleStatusUpdate(row, d.BOOKINGS.STATUS.LIST.CANCELLED);
                      }
                    }}
                    variant="outlined"
                    color="error"
                  >
                    Cancel
                  </Button>
                </>
              ) : null}

              {row.status == d.BOOKINGS.STATUS.LIST.CONFIRMED || row.status == d.BOOKINGS.STATUS.LIST.CANCELLED ? (
                <Button
                  size="small"
                  sx={{ mr: 2 }}
                  onClick={() => handleStatusUpdate(row, d.BOOKINGS.STATUS.LIST.PENDING)}
                  variant="outlined"
                  color="warning"
                >
                  Change to pending
                </Button>
              ) : null}
            </>
          );
        },
        align: "left",
        headerAlign: "left",
      },
      {
        field: "updatedAt",
        // flex: 1,
        filterable: false,
        headerName: t("updatedAt"),
        minWidth: 130,
        renderCell: function render({ value }) {
          return <DateField value={value} format={k.DATE_FM_DEFAULT} />;
        },
      },
    ],
    [resourcesData, t]
  );

  const handleResourceChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const resourceId = event.target.value as string;
    setSelectedResource(resourceId);

    if (resourceId === "ALL") {
      setFilters((prevFilters) => [
        // remove any existing 'resourceId' filter
        ...prevFilters
          .filter((f) => "field" in f && f.field !== "resourceId")
          .filter((f) => "field" in f && f.field !== "parentResourceId"),
      ]);
    } else {
      setFilters((prevFilters) => [
        // remove any existing 'resourceId' filter
        ...prevFilters
          .filter((f) => "field" in f && f.field !== "resourceId")
          .filter((f) => "field" in f && f.field !== "parentResourceId"),
        // ...prevFilters,
        {
          field: "resourceId",
          operator: "eq",
          value: resourceId,
        },
        {
          field: "parentResourceId",
          operator: "eq",
          value: resourceId,
        },
      ]);
    }
  };

  const handleResourceTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const resourceType = event.target.value as string;
    setSelectedResourceType(resourceType);

    if (resourceType === "ALL") {
      setFilters((prevFilters) => [
        // remove any existing 'resourceType' filter
        ...prevFilters.filter((f) => "field" in f && f.field !== "resource.resourceType"),
      ]);
    } else {
      setFilters((prevFilters) => [
        // remove any existing 'resourceType' filter
        ...prevFilters.filter((f) => "field" in f && f.field !== "resource.resourceType"),
        {
          field: "resource.resourceType",
          operator: "eq",
          value: resourceType,
        },
      ]);
    }
  };

  return (
    <List headerButtons={({ defaultButtons }) => <>{defaultButtons}</>}>
      <Grid container spacing={1} sx={{ mb: 2 }}>
        {/* Resource filter  */}
        <Grid item xs={12} md={2}>
          <Box sx={{ mb: 0.5 }}>
            <Box component="span" sx={{ fontWeight: "bold", display: "block", mb: 0.5 }}>
              Filter by Resource:
            </Box>
            <FormControl size="small">
              <Select
                size="small"
                value={selectedResource}
                onChange={handleResourceChange as any}
                displayEmpty
                sx={{
                  minWidth: "200px",
                  height: "32px",
                  "& .MuiSelect-select": {
                    padding: "4px 14px",
                  },
                }}
              >
                <MenuItem value="ALL">All</MenuItem>
                {resourcesData?.data?.map((resource) => (
                  <MenuItem key={resource.id ?? ""} value={resource.id?.toString() ?? ""}>
                    {resource.resourceName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Grid>

        {/* Resource Type filter  */}
        <Grid item xs={12} md={2}>
          <Box sx={{ mb: 0.5 }}>
            <Box component="span" sx={{ fontWeight: "bold", display: "block", mb: 0.5 }}>
              Filter by Resource Type:
            </Box>
            <FormControl size="small">
              <Select
                size="small"
                value={selectedResourceType}
                onChange={handleResourceTypeChange as any}
                displayEmpty
                sx={{
                  minWidth: "200px",
                  height: "32px",
                  "& .MuiSelect-select": {
                    padding: "4px 14px",
                  },
                }}
              >
                <MenuItem value="ALL">All</MenuItem>
                {d.RESOURCES.TYPES.OPTIONS.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Grid>

        {/* Status filter  */}
        <Grid item xs={12} md={3}>
          <Box sx={{ mb: 0.5 }}>
            <Box component="span" sx={{ fontWeight: "bold", display: "block", mb: 0.5 }}>
              Filter by Status:
            </Box>
            <ButtonGroup aria-label="Status filter button group" size="small" sx={{ flexWrap: "wrap" }}>
              <Button
                variant={selectedStatus === "ALL" ? "contained" : "outlined"}
                onClick={() => {
                  setSelectedStatus("ALL");
                  setFilters((prevFilters) => [...prevFilters.filter((f) => "field" in f && f.field !== "status")]);
                }}
              >
                ALL
              </Button>
              <Button
                variant={selectedStatus === d.BOOKINGS.STATUS.LIST.PENDING ? "contained" : "outlined"}
                onClick={() => {
                  setSelectedStatus(d.BOOKINGS.STATUS.LIST.PENDING);
                  setFilters((prevFilters) => [
                    ...prevFilters.filter((f) => "field" in f && f.field !== "status"),
                    {
                      field: "status",
                      operator: "eq",
                      value: d.BOOKINGS.STATUS.LIST.PENDING,
                    },
                  ]);
                }}
              >
                {d.BOOKINGS.STATUS.LIST.PENDING}
              </Button>
              <Button
                variant={selectedStatus === d.BOOKINGS.STATUS.LIST.CANCELLED ? "contained" : "outlined"}
                onClick={() => {
                  setSelectedStatus(d.BOOKINGS.STATUS.LIST.CANCELLED);
                  setFilters((prevFilters) => [
                    ...prevFilters.filter((f) => "field" in f && f.field !== "status"),
                    {
                      field: "status",
                      operator: "eq",
                      value: d.BOOKINGS.STATUS.LIST.CANCELLED,
                    },
                  ]);
                }}
              >
                {d.BOOKINGS.STATUS.LIST.CANCELLED}
              </Button>
              <Button
                variant={selectedStatus === d.BOOKINGS.STATUS.LIST.CONFIRMED ? "contained" : "outlined"}
                onClick={() => {
                  setSelectedStatus(d.BOOKINGS.STATUS.LIST.CONFIRMED);
                  setFilters((prevFilters) => [
                    // Remove any existing 'status' filter
                    ...prevFilters.filter((f) => "field" in f && f.field !== "status"),
                    {
                      field: "status",
                      operator: "eq",
                      value: d.BOOKINGS.STATUS.LIST.CONFIRMED,
                    },
                  ]);
                }}
              >
                {d.BOOKINGS.STATUS.LIST.CONFIRMED}
              </Button>
            </ButtonGroup>
          </Box>
        </Grid>

        {/* Time range filter */}
        <Grid item xs={12} md={3}>
          <Box sx={{ mb: 0.5 }}>
            <Box component="span" sx={{ fontWeight: "bold", display: "block", mb: 0.5 }}>
              Filter by Time Range:
            </Box>
            <ButtonGroup aria-label="Time range filter button group" size="small">
              <Button
                variant={selectedTimeRange === "ALL" ? "contained" : "outlined"}
                onClick={() => {
                  setSelectedTimeRange("ALL");
                  setFilters((prevFilters) => [...prevFilters.filter((f) => "field" in f && f.field !== "startTime")]);
                }}
              >
                ALL
              </Button>
              <Button
                variant={selectedTimeRange === "PAST" ? "contained" : "outlined"}
                onClick={() => {
                  setSelectedTimeRange("PAST");
                  setFilters((prevFilters) => [
                    ...prevFilters.filter((f) => "field" in f && f.field !== "startTime"),
                    {
                      field: "startTime",
                      operator: "lte",
                      value: new Date().toISOString(),
                    },
                  ]);
                }}
              >
                {"PAST"}
              </Button>
              <Button
                variant={selectedTimeRange === "FUTURE" ? "contained" : "outlined"}
                onClick={() => {
                  setSelectedTimeRange("FUTURE");
                  setFilters((prevFilters) => [
                    ...prevFilters.filter((f) => "field" in f && f.field !== "startTime"),
                    {
                      field: "startTime",
                      operator: "gte",
                      value: new Date().toISOString(),
                    },
                  ]);
                }}
              >
                {"FUTURE"}
              </Button>
            </ButtonGroup>
          </Box>
        </Grid>
      </Grid>

      <DataGrid
        {...dataGridProps}
        columns={columns}
        autoHeight
        onRowClick={({ id }) => resource?.name && edit(resource.name, id)}
        sx={{
          "& .MuiDataGrid-row": {
            cursor: "pointer",
          },
        }}
        slots={{ toolbar: GridToolbar }}
      />
    </List>
  );
};
