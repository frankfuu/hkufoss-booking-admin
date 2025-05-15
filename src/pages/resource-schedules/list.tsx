import React from "react";
import { useDataGrid, EditButton, ShowButton, DeleteButton, List, DateField, CloneButton } from "@refinedev/mui";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Checkbox } from "@mui/material";
import { useList, useNavigation, usePermissions, useResource } from "@refinedev/core";
import { k } from "../../common/constants";
import { useTranslation } from "react-i18next";
import dayjs, { Dayjs } from "dayjs";

export const ResourceScheduleListings = () => {
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

  const {
    data: resourcesData,
    isLoading: resourcesDataLoading,
    isError: resourcesDataError,
  } = useList({
    resource: "resources",
  });

  const { edit } = useNavigation();
  const { resource } = useResource();

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
          return `${resource?.resourceName}`;
        },
      },

      {
        field: "name",
        minWidth: 140,
        headerName: t("scheduleName"),
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
      {
        field: "startTime",
        minWidth: 50,
        headerName: t("Start Time"),
      },
      {
        field: "endTime",
        minWidth: 50,
        headerName: t("End Time"),
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
        headerName: "Actions",
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
