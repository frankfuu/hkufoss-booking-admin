import React from "react";
import { useDataGrid, EditButton, ShowButton, DeleteButton, List, DateField, CloneButton } from "@refinedev/mui";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Button, Checkbox } from "@mui/material";
import { useGo, useNavigation, usePermissions, useResource } from "@refinedev/core";
import { useTranslation } from "react-i18next";
import { k } from "../../common/constants";
import { Link } from "react-router-dom";

export const ResourceListings = () => {
  const { t } = useTranslation();
  const { dataGridProps } = useDataGrid({
    filters: {
      permanent: [{ field: "parentId", operator: "eq", value: "null" }],
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

  const { edit } = useNavigation();
  const { resource } = useResource();
  const go = useGo();

  const CustomViewButton = ({ paramId }: { paramId: string }) => {
    return (
      <Button sx={{ my: 1 }} component={Link} to={`/bookings/create/${paramId}`}>
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
        minWidth: 150,
        headerName: t("resourceName"),
        renderCell: function render({ row }) {
          return (
            <Link to={`/resources/edit/${row.id}`} style={{ color: "inherit", textDecoration: "none" }}>
              {row.resourceName}
            </Link>
          );
        },
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
        field: "location",
        minWidth: 80,
        headerName: t("location"),
      },
      {
        sortable: false,
        field: "Seats",
        headerName: t("Seats"),
        minWidth: 50,
        renderCell: function render({ row }) {
          return row.subResources.length > 0 ? row.subResources.length : "-";
        },
      },

      {
        field: "updatedAt",
        filterable: false,
        headerName: t("updatedAt"),
        minWidth: 140,
        renderCell: function render({ value }) {
          return <DateField value={value} format={k.DATE_FM_DEFAULT} />;
        },
      },
      {
        field: "actions",
        headerName: t("Actions"),
        sortable: false,
        type: "actions",
        minWidth: 270,
        renderCell: function render({ row }) {
          const createBookingUrl = `/bookings/create/${row.id}`;
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
            cursor: "pointer", // Optional: remove this if you only want the link to be clickable
          },
        }}
        slots={{ toolbar: GridToolbar }}
      />
    </List>
  );
};
