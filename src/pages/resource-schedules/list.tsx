import React from "react";
import { useDataGrid, EditButton, ShowButton, DeleteButton, List, DateField, CloneButton } from "@refinedev/mui";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Button, Checkbox } from "@mui/material";
import { useGo, useList, useNavigation, usePermissions, useResource } from "@refinedev/core";
import { k, s } from "../../common/constants";
import { useTranslation } from "react-i18next";
import dayjs, { Dayjs } from "dayjs";
import { Link, useSearchParams } from "react-router-dom";

export const ResourceScheduleListings = () => {
  const { t } = useTranslation();
  const { dataGridProps } = useDataGrid({
    syncWithLocation: true,
    sorters: {
      initial: [
        {
          field: "updatedAt",
          order: "desc",
        },
      ],
    },
  });

  const [searchParams] = useSearchParams();
  const rid = searchParams.get("rid");

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
  const { resource } = useResource();

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
        field: "resourceId",
        minWidth: 140,
        headerName: t("resource"),
        renderCell: ({ row }) => {
          const resource = resourcesData?.data.find((x) => x.id == row.resourceId);
          return (
            <Link
              style={s.underlinedLinkStyle}
              to={`/resources/edit/${row.resourceId}`}
              onClick={(e: any) => e.stopPropagation()}
            >
              {resource?.resourceName}
            </Link>
          );
        },
      },

      {
        field: "name",
        minWidth: 150,
        headerName: t("name"),
        renderCell: ({ row }) => {
          return (
            <Link
              style={s.underlinedLinkStyle}
              to={`/resource-schedules/edit/${row.id}`}
              onClick={(e: any) => e.stopPropagation()}
            >
              {row?.name}
            </Link>
          );
        },
      },

      {
        field: "startDate",
        minWidth: 50,
        headerName: t("Start Date"),
      },
      {
        field: "endDate",
        minWidth: 50,
        headerName: t("End Date"),
      },
      // {
      //   field: "startTime",
      //   minWidth: 50,
      //   headerName: t("Start Time"),
      // },
      // {
      //   field: "endTime",
      //   minWidth: 50,
      //   headerName: t("End Time"),
      // },
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
        headerName: "Actions",
        sortable: false,
        type: "actions",
        minWidth: 270,
        renderCell: function render({ row }) {
          const createBookingUrl = `/bookings/create/${row.resourceId}`;

          return (
            <>
              <Button variant="outlined" color="info" component={Link} to={createBookingUrl}>
                View Calendar
              </Button>
              <EditButton hideText recordItemId={row.id} />
              <CloneButton hideText recordItemId={row.id} />
              <DeleteButton hideText recordItemId={row.id} />
            </>
          );
        },
        align: "left",
        headerAlign: "left",
      },
    ],
    [resourcesDataLoading, t]
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
