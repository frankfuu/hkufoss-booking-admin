import React from "react";
import { useDataGrid, EditButton, ShowButton, DeleteButton, List, DateField, CloneButton } from "@refinedev/mui";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Button, Checkbox } from "@mui/material";
import { useGo, useList, useNavigation, usePermissions, useResource } from "@refinedev/core";
import { k } from "../../common/constants";
import { useTranslation } from "react-i18next";
import dayjs, { Dayjs } from "dayjs";
import { useSearchParams } from "react-router-dom";

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

  const CustomViewButton = ({ paramId }: { paramId: string }) => {
    const handleClick = () => {
      go({
        to: `/bookings/create/${paramId}`,
      });
    };

    return (
      <Button sx={{ my: 1 }} onClick={handleClick}>
        {t("view")}
      </Button>
    );
  };

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
              <CustomViewButton paramId={row.resourceId} />
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
