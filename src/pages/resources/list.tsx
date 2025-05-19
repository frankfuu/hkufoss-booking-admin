import React from "react";
import { useDataGrid, EditButton, ShowButton, DeleteButton, List, DateField, CloneButton } from "@refinedev/mui";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Button, Checkbox } from "@mui/material";
import { useGo, useNavigation, usePermissions, useResource } from "@refinedev/core";
import { useTranslation } from "react-i18next";
import { k } from "../../common/constants";

export const ResourceListings = () => {
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
        field: "resourceName",
        minWidth: 200,
        headerName: t("resourceName"),
      },
      {
        field: "resourceType",
        minWidth: 130,
        headerName: t("resourceType"),
      },
      {
        field: "seatingCapacity",
        minWidth: 50,
        headerName: t("seatingCapacity.short"),
      },
      {
        field: "location",
        minWidth: 80,
        headerName: t("location"),
      },
      {
        field: "floor",
        minWidth: 50,
        headerName: t("floor"),
      },

      {
        field: "updatedAt",
        filterable: false,
        headerName: t("updatedAt"),
        minWidth: 180,
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
    [t]
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
