import {
  useNavigation,
  useCustom,
  useList,
  BaseRecord,
  useGo,
  useMany,
  usePermissions,
  useCustomMutation,
  useResource,
  useGetIdentity,
} from "@refinedev/core";

import { Show, NumberField, DateField, useAutocomplete, Create, useDataGrid, ListButton, RefreshButton } from "@refinedev/mui";
import { Typography, Stack, Box, Button, Autocomplete, TextField, createFilterOptions, Grid, Chip } from "@mui/material";
import InfiniteScrollAutocompleteAlt from "../../components/infinite-scroll-autocomplete";
import { d, k, s } from "../../common/constants";
import { useEffect, useRef, useState } from "react";
import DynamicModal from "../../components/dynamic-modal";
import QRCode from "react-qr-code";
import { useUserOptionsContext } from "../../components/user-options-context";
import CropFreeIcon from "@mui/icons-material/CropFree";
import { Jclogo } from "../../components/icons/jclogo";
import { useForm, useModalForm } from "@refinedev/react-hook-form";
import { FieldValues } from "react-hook-form";
import { DataGrid, GridColDef, getGridSingleSelectOperators } from "@mui/x-data-grid";
import { defaultMutationOptions, getChipProps, useResourceNavigation } from "../../common/helpers";
import React from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Article, Assignment, Build, Note, PendingActions } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BlockIcon from "@mui/icons-material/Block";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import { startOfDay, endOfDay } from "date-fns";

export const Home = () => {
  const { data: permissions }: { data: any[] | undefined } = usePermissions();

  const { t } = useTranslation();

  const go = useGo();

  return (
    <Show
      title={t("nav.home")}
      headerButtons={({ defaultButtons }) => (
        <>
          <ListButton />
          <RefreshButton>{t("Refresh")}</RefreshButton>
        </>
      )}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} lg={12}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              border: "2px dotted grey",
              p: 2,
            }}
          >
            <Typography sx={{ fontWeight: "bold", fontSize: 20, marginBottom: 2, marginTop: 2 }}>{t("mybookings")}</Typography>
            <MyBookings />
          </Box>
        </Grid>
        <Grid item xs={12} lg={12}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              border: "2px dotted grey",
              p: 2,
            }}
          >
            <Typography sx={{ fontWeight: "bold", fontSize: 20, marginBottom: 2, marginTop: 2 }}>{t("bookaroom")}</Typography>
            <BookARoom />
          </Box>
        </Grid>
      </Grid>
    </Show>
  );
};

const MyBookings = () => {
  const { t } = useTranslation();
  const { data: user } = useGetIdentity<IUser>();

  const beginningOfDay = startOfDay(new Date());
  const conclusionOfDay = endOfDay(new Date());
  const { dataGridProps } = useDataGrid({
    resource: "bookings",
    filters: {
      permanent: [
        {
          field: "startTime",
          operator: "gte",
          value: beginningOfDay.toISOString(),
        },
        {
          field: "userId",
          operator: "eq",
          value: user?.id,
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

  const { edit } = useNavigation();

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
        field: "activityName",
        minWidth: 180,
        headerName: t("activity.short"),
      },
      {
        field: "resourceId",
        minWidth: 100,
        headerName: t("resource"),
        renderCell: ({ row }) => {
          const resource = resourcesData?.data.find((r) => r.id == row.resourceId);
          return `${resource?.resourceName} `;
        },
      },
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
    ],
    [resourcesData, t]
  );

  return (
    <DataGrid
      {...dataGridProps}
      columns={columns}
      autoHeight
      // onRowClick={({ id }) => resource?.name && edit(resource.name, id)}
      onRowClick={({ id }) => edit("bookings", id)}
      sx={{
        "& .MuiDataGrid-row": {
          cursor: "pointer",
        },
      }}
      // slots={{ toolbar: GridToolbar }}
    />
  );
};

const BookARoom = () => {
  const { t } = useTranslation();
  const {
    dataGridProps,
    tableQuery: { refetch },
  } = useDataGrid({
    resource: "resources",
    filters: {
      // permanent: [
      //   {
      //     field: "status",
      //     operator: "eq",
      //     value: "PENDING",
      //   },
      // ],
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
  const { edit } = useNavigation();
  const go = useGo();

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
        field: "resourceType",
        minWidth: 150,
        headerName: t("resourceType"),
      },
      {
        field: "seatingCapacity",
        minWidth: 50,
        headerName: t("seatingCapacity.short"),
      },

      {
        field: "floor",
        minWidth: 50,
        headerName: t("floor"),
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
              <Button
                size="small"
                sx={{ mr: 2 }}
                onClick={() =>
                  go({
                    to: `/bookings/create/${row.id}`,
                  })
                }
                variant="contained"
                color="primary"
              >
                {t("book")}
              </Button>
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
    <DataGrid
      {...dataGridProps}
      columns={columns}
      autoHeight
      // onRowClick={({ id }) => edit("resources", id)}
      sx={{
        "& .MuiDataGrid-row": {
          cursor: "pointer",
        },
      }}
      // slots={{ toolbar: GridToolbar }}
    />
  );
};
