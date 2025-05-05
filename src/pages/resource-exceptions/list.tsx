import React from "react";
import { useDataGrid, EditButton, ShowButton, DeleteButton, List, DateField, CloneButton } from "@refinedev/mui";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Checkbox } from "@mui/material";
import { useList, useNavigation, usePermissions, useResource } from "@refinedev/core";
import moment from "moment-timezone";
import { k } from "../../common/constants";

export const ResourceExceptionListings = () => {
  const { dataGridProps } = useDataGrid({
    sorters: {
      initial: [
        {
          field: "updatedAt",
          order: "desc",
        },
      ],
    },
  });

  const { edit } = useNavigation();
  const { resource } = useResource();

  const {
    data: resourcesData,
    isLoading: resourcesDataLoading,
    isError: resourcesDataError,
  } = useList({
    resource: "resources",
  });

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
        minWidth: 240,
        headerName: "Resource",
        renderCell: ({ row }) => {
          const resource = resourcesData?.data.find((r) => r.id == row.resourceId);
          return `${resource?.resourceName} ${resource?.resourceType}`;
        },
      },
      {
        field: "startTime",
        minWidth: 150,
        headerName: "Start",
        renderCell: function render({ value }) {
          const localTime = moment.utc(value).tz(moment.tz.guess()).toDate();
          return <DateField value={localTime} format={k.DATE_FM_DEFAULT} />;
        },
      },
      {
        field: "endTime",
        minWidth: 150,
        headerName: "End",
        renderCell: function render({ value }) {
          const localTime = moment.utc(value).tz(moment.tz.guess()).toDate();
          return <DateField value={localTime} format={k.DATE_FM_DEFAULT} />;
        },
      },
      {
        field: "updatedAt",
        // flex: 1,
        filterable: false,
        headerName: "Updated At",
        minWidth: 150,
        renderCell: function render({ value }) {
          const localTime = moment.utc(value).tz(moment.tz.guess()).toDate();
          return <DateField value={localTime} format={k.DATE_FM_DEFAULT} />;
        },
      },
      {
        field: "actions",
        headerName: "Actions",
        sortable: false,
        type: "actions",
        minWidth: 200,
        renderCell: function render({ row }) {
          return (
            <>
              <EditButton hideText recordItemId={row.id} />
              <CloneButton hideText recordItemId={row.id} />
            </>
          );
        },
        align: "left",
        headerAlign: "left",
      },
    ],
    [resourcesData]
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
