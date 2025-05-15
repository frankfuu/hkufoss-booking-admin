import React from "react";
import { useDataGrid, EditButton, ShowButton, DeleteButton, List, DateField, CloneButton } from "@refinedev/mui";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Checkbox } from "@mui/material";
import { useList, useNavigation, usePermissions, useResource } from "@refinedev/core";
import { k } from "../../common/constants";
import { useTranslation } from "react-i18next";

export const ResourceExceptionListings = () => {
  const { t } = useTranslation();

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
        headerName: t("resourceName"),
        renderCell: ({ row }) => {
          const resource = resourcesData?.data.find((r) => r.id == row.resourceId);
          return `${resource?.resourceName} ${resource?.resourceType}`;
        },
      },
      {
        field: "name",
        minWidth: 240,
        headerName: t("name"),
      },
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
