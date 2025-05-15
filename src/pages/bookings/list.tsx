import React from "react";
import { useDataGrid, EditButton, ShowButton, DeleteButton, List, DateField, CloneButton } from "@refinedev/mui";
import { DataGrid, GridColDef, GridToolbar, getGridSingleSelectOperators } from "@mui/x-data-grid";
import { Button, Checkbox, Chip } from "@mui/material";
import { useCustomMutation, useList, useNavigation, usePermissions, useResource } from "@refinedev/core";
import { d, k } from "../../common/constants";
import { useTranslation } from "react-i18next";

export const BookingsList = () => {
  const { t } = useTranslation();
  const {
    dataGridProps,
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
    data: resourcesData,
    isLoading: resourcesDataLoading,
    isError: resourcesDataError,
  } = useList({
    resource: "resources",
  });

  const { edit } = useNavigation();
  const { resource } = useResource();

  const getChipProps = (status: string) => {
    if (status == d.BOOKINGS.STATUS.LIST.CONFIRMED) {
      return {
        color: "success" as "success",
        variant: "filled" as "filled",
      };
    }

    if (status == d.BOOKINGS.STATUS.LIST.PENDING) {
      return {
        color: "warning" as "warning",
        variant: "filled" as "filled",
      };
    }

    if (status == d.BOOKINGS.STATUS.LIST.ATTENDED) {
      return {
        color: "success" as "success",
        variant: "filled" as "filled",
      };
    }

    if (status == d.BOOKINGS.STATUS.LIST.CANCELLED) {
      return {
        color: "error" as "error",
        variant: "filled" as "filled",
      };
    }

    return {
      color: "default" as "default",
    };
  };

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
        minWidth: 150,
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
        minWidth: 240,
        headerName: t("resources"),
        renderCell: ({ row }) => {
          const resource = resourcesData?.data.find((r) => r.id == row.resourceId);
          return `${resource?.resourceName} ${resource?.resourceType}`;
        },
      },
      // {
      //   field: "scheduleId",
      //   minWidth: 50,
      //   headerName: "Schedule ID",
      // },
      {
        field: "startTime",
        minWidth: 150,
        headerName: t("Start Time"),
        renderCell: function render({ value }) {
          return <DateField value={value} format={k.DATE_FM_DEFAULT} />;
        },
      },
      {
        field: "endTime",
        minWidth: 150,
        headerName: t("End Time"),
        renderCell: function render({ value }) {
          return <DateField value={value} format={k.DATE_FM_DEFAULT} />;
        },
      },
      {
        field: "updatedAt",
        // flex: 1,
        filterable: false,
        headerName: t("updatedAt"),
        minWidth: 150,
        renderCell: function render({ value }) {
          return <DateField value={value} format={k.DATE_FM_DEFAULT} />;
        },
      },
      {
        field: "actions",
        headerName: t("Actions"),
        sortable: false,
        type: "actions",
        minWidth: 200,
        renderCell: function render({ row }) {
          return (
            <>
              {/* <EditButton hideText recordItemId={row.id} /> */}

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
                    onClick={() => handleStatusUpdate(row, d.BOOKINGS.STATUS.LIST.CANCELLED)}
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
    ],
    [resourcesData, t]
  );

  return (
    <List>
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
