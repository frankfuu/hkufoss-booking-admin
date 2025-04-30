import React from "react";
import { useDataGrid, EditButton, ShowButton, DeleteButton, List, DateField, CloneButton } from "@refinedev/mui";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Checkbox } from "@mui/material";
import { useNavigation, usePermissions, useResource } from "@refinedev/core";
import moment from "moment-timezone";
import { k } from "../../common/constants";

export const FunderListings = () => {
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
        minWidth: 150,
        headerName: "Name",
      },
      {
        field: "accountCode",
        minWidth: 250,
        headerName: "Account Code",
      },
      {
        field: "updatedAt",
        filterable: false,
        headerName: "Updated At",
        minWidth: 180,
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
          "& .MuiDataGrid-row": { cursor: "pointer" },
        }}
        slots={{ toolbar: GridToolbar }}
      />
    </List>
  );
};
