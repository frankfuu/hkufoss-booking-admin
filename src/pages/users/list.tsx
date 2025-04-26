import React from "react";
import { useDataGrid, EditButton, ShowButton, DeleteButton, List, DateField } from "@refinedev/mui";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { useList, useMany, useNavigation, usePermissions } from "@refinedev/core";
import { Checkbox, Typography } from "@mui/material";
import { k, s } from "../../common/constants";
import { useResourceNavigation } from "../../common/helpers";
import moment from "moment-timezone";
import { useTranslation } from "react-i18next";

export const UsersList = () => {
  const { t } = useTranslation();
  const { data: permissions }: { data: any[] | undefined } = usePermissions();

  const { edit } = useNavigation();
  const { dataGridProps } = useDataGrid({
    filters: {
      // permanent: [
      //   {
      //     field: "roleId",
      //     operator: "ne",
      //     value: 2,
      //   },
      // ],
    },
  });

  const { data: roleData, isLoading: roleIsLoading } = useMany({
    resource: "roles",
    ids: dataGridProps?.rows?.map((item: any) => item?.roleId) ?? [],
    queryOptions: {
      enabled: !!dataGridProps?.rows,
    },
  });

  const handleResourceNavigation = useResourceNavigation();

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
        field: "roleId",
        // flex: 1,
        headerName: "Role",
        maxWidth: 140,
        filterable: false,
        renderCell: function render({ value }) {
          return roleIsLoading ? <>{t("Loading...")}</> : roleData?.data?.find((item) => item.id === value)?.name;
        },
      },
      {
        field: "username",
        // flex: 1,
        headerName: "Username",
        minWidth: 230,
      },

      {
        field: "updatedAt",
        // flex: 1,
        filterable: false,
        headerName: "Updated At",
        minWidth: 130,
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
        minWidth: 220,
        renderCell: function render({ row }) {
          return (
            <>
              <EditButton recordItemId={row.id} />
            </>
          );
        },
        align: "left",
        headerAlign: "left",
        // minWidth: 80,
      },
    ],
    [permissions, roleData?.data]
  );

  return (
    <List>
      <DataGrid
        {...dataGridProps}
        columns={columns}
        autoHeight
        onRowClick={({ id }) => {
          edit("users", id);
        }}
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
