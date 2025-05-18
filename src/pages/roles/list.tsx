import React from "react";
import { useDataGrid, EditButton, ShowButton, DeleteButton, List, DateField } from "@refinedev/mui";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Checkbox } from "@mui/material";
import { k } from "../../common/constants";
import { useNavigation, usePermissions, useResource } from "@refinedev/core";

export const RolesList = () => {
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
        field: "name",
        // flex: 1,
        minWidth: 200,
        headerName: "Name",
      },
      // {
      //   field: "enabled",
      //   headerName: "Enabled",
      //   minWidth: 100,
      //   renderCell: function render({ value }) {
      //     return <Checkbox checked={!!value} />;
      //   },
      // },
      {
        field: "updatedAt",
        // flex: 1,
        filterable: false,
        headerName: "Updated At",
        minWidth: 180,
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
              <ShowButton hideText recordItemId={row.id} />
            </>
          );
        },
        align: "left",
        headerAlign: "left",
      },
    ],
    []
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
