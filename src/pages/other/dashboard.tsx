import { useNavigation, useCustom, useList, BaseRecord, useGo, useMany, usePermissions } from "@refinedev/core";
import { Show, NumberField, DateField, useAutocomplete, Create, useDataGrid, ListButton, RefreshButton } from "@refinedev/mui";
import { Typography, Stack, Box, Button, Autocomplete, TextField, createFilterOptions, Grid, Chip } from "@mui/material";
import InfiniteScrollAutocompleteAlt from "../../components/infinite-scroll-autocomplete";
import { k, s } from "../../common/constants";
import { useEffect, useRef, useState } from "react";
import DynamicModal from "../../components/dynamic-modal";
import QRCode from "react-qr-code";
import { useUserOptionsContext } from "../../components/user-options-context";
import CropFreeIcon from "@mui/icons-material/CropFree";
import { Jclogo } from "../../components/icons/jclogo";
import { useForm, useModalForm } from "@refinedev/react-hook-form";
import { FieldValues } from "react-hook-form";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { defaultMutationOptions, useResourceNavigation } from "../../common/helpers";
import React from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Article, Assignment, Build, Note, PendingActions } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

export const Dashboard = () => {
  const { data: permissions }: { data: any[] | undefined } = usePermissions();

  const { t } = useTranslation();

  const {
    dataGridProps: reservationsGridProps,
    tableQuery: { data: reservationsData, isFetched: reservationsGridFetched },
  } = useDataGrid({
    resource: "reservations",
    filters: {
      // permanent: [{ field: "userId", operator: "eq" as const, value: record?.userId }],
    },
    sorters: {
      initial: [{ field: "updatedAt", order: "desc" }],
    },
    pagination: { pageSize: 5 },
  });

  const { centreGlobal } = useUserOptionsContext();

  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    serviceIds: [] as number[],
    serviceTypeIds: [] as number[],
    centreIds: [] as number[],
    districtIds: [] as number[],
  });

  useEffect(() => {
    const newIds: number[] = centreGlobal?.id ? [centreGlobal?.id] : [];
    setFilters((prev) => ({ ...prev, centreIds: newIds }));
  }, [centreGlobal?.id]);

  const {
    dataGridProps: servicesSessionsDGP,
    tableQuery: { data: servicesData, isFetched: serviceSessionsIsFetched },
  } = useDataGrid({
    resource: "service-sessions",
    filters: { permanent: [{ field: "service.centreId", operator: "eq" as const, value: centreGlobal?.id }] },
    sorters: {
      initial: [{ field: "updatedAt", order: "desc" }],
    },
    pagination: { pageSize: 5 },
  });

  const {
    data: formCodeMappingData,
    isLoading: formCodeMappingIsLoading,
    isFetching: formCodeMappingIsFetching,
  } = useList({
    resource: "form-code-mappings",
  });

  return (
    <Show
      title={t("nav.dashboard")}
      headerButtons={({ defaultButtons }) => (
        <>
          <ListButton />
          <RefreshButton>{t("Refresh")}</RefreshButton>
        </>
      )}
    >
      {/* <Grid container spacing={2} sx={{ height: "70vh" }}> */}
      <Grid container spacing={2}>
        {(permissions?.includes("full-intake_Dashboard") ||
          permissions?.includes("lite-intake_Dashboard") ||
          permissions?.includes("screening-tool_Dashboard") ||
          permissions?.includes("manage_all")) && (
          <Grid item xs={12} lg={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                minHeight: "200px",
                border: "2px dotted grey",
                // p: 2,
              }}
            >
              {(permissions?.includes("full-intake_Dashboard") || permissions?.includes("manage_all")) && (
                <Button
                  sx={{
                    backgroundColor: "#88b08e",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    margin: 2,
                    padding: 2,
                    width: 200,
                  }}
                  variant="contained"
                  color="success"
                  onClick={() => {
                    navigate(`/forms/show/${formCodeMappingData?.data?.find((x) => x.formCode == "MEMBER_INTAKE")?.formId}`);
                  }}
                >
                  <Assignment fontSize="large" sx={{ marginBottom: 1 }} />
                  <Typography>{t("FULL_INTAKE_FORM")}</Typography>
                </Button>
              )}

              {(permissions?.includes("lite-intake_Dashboard") || permissions?.includes("manage_all")) && (
                <Button
                  sx={{
                    backgroundColor: "#ff9987",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    margin: 2,
                    padding: 2,
                    width: 200,
                  }}
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    navigate(`/forms/show/${formCodeMappingData?.data?.find((x) => x.formCode == "MEMBER_INTAKE_LITE")?.formId}`);
                  }}
                >
                  <Note fontSize="large" sx={{ marginBottom: 1 }} />
                  <Typography>{t("LITE_INTAKE_FORM")}</Typography>
                </Button>
              )}

              {(permissions?.includes("screening-tool_Dashboard") || permissions?.includes("manage_all")) && (
                <Button
                  sx={{
                    backgroundColor: "#1b789f",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    margin: 2,
                    padding: 2,
                    width: 200,
                  }}
                  variant="contained"
                  color="info"
                  onClick={() => {
                    navigate(`/forms/show/${formCodeMappingData?.data?.find((x) => x.formCode == "NEED_ASSESSMENT")?.formId}`);
                  }}
                >
                  <Build fontSize="large" sx={{ marginBottom: 1 }} />
                  <Typography>{t("SCREENING_TOOL_FORM")}</Typography>
                </Button>
              )}

              {(permissions?.includes("check-in_Dashboard") || permissions?.includes("manage_all")) && (
                <Button
                  sx={{
                    backgroundColor: "#fece92",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    margin: 2,
                    padding: 2,
                    width: 200,
                  }}
                  variant="contained"
                  color="warning"
                  onClick={() => {
                    navigate("/check-in");
                  }}
                >
                  <PendingActions fontSize="large" sx={{ marginBottom: 1 }} />
                  <Typography>{t("nav.checkIn")}</Typography>
                </Button>
              )}
            </Box>
          </Grid>
        )}

        {(permissions?.includes("service-list_Dashboard") || permissions?.includes("manage_all")) && (
          <Grid item xs={12} lg={12}>
            <Box
              sx={{
                // display: "flex",
                // justifyContent: "center",
                // alignItems: "center",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                border: "2px dotted grey",
                p: 2,
              }}
            >
              <Typography sx={{ fontWeight: "bold", fontSize: 20, marginBottom: 2, marginTop: 2 }}>
                {t("TODAYS_SERVICES")}
              </Typography>
              <TodaysServices filters={filters} />
            </Box>
          </Grid>
        )}

        {(permissions?.includes("reminders_Dashboard") || permissions?.includes("manage_all")) && (
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                // justifyContent: "center",
                // alignItems: "center",
                flexDirection: "column",
                height: "100%",
                minHeight: "200px",
                border: "2px dotted grey",
                p: 2,
              }}
            >
              <Typography sx={{ fontWeight: "bold", fontSize: 20, marginBottom: 2, marginTop: 2 }}>{t("Reminders")}</Typography>
              <RemindersTable />
            </Box>
          </Grid>
        )}
      </Grid>
    </Show>
  );
};

const TodaysServices = ({ filters }: any) => {
  const { data: permissions }: { data: any[] | undefined } = usePermissions();

  const { t } = useTranslation();

  const { createUrl, listUrl } = useNavigation();
  const go = useGo();

  const buildQueryString = (filters: {
    serviceIds: number[];
    serviceTypeIds: number[];
    centreIds: number[];
    districtIds: number[];
  }) => {
    const queryString = Object.entries(filters)
      .map(([key, values]) => {
        // Join array values with a comma
        if (values.length > 0) {
          return `${key}=${values.join(",")}`;
        }
        return null; // Skip keys with empty arrays
      })
      .filter(Boolean) // Remove null values
      .join("&"); // Join each key=value pair with '&'

    return queryString;
  };

  const today = format(new Date(), "yyyy-MM-dd");

  const { data, isLoading, error, refetch } = useCustom({
    // url: `service-sessions/available-days?from=${from}&to=${to}&${buildQueryString(filters)}`,
    // url: `service-sessions/available-days?from=${`2024-12-27`}&to=${today}&${buildQueryString(filters)}`,
    url: `service-sessions/available-days?from=${today}&to=${today}&${buildQueryString(filters)}`,
    method: "get",
    queryOptions: {
      // enabled: !!selectedService?.id,
    },
  });

  const rows =
    data?.data?.flatMap((item: any) =>
      item.timeSlots.map((slot: any) => ({
        id: `${item.date}-${item.dayOfWeek}-${slot.from}-${slot.serviceId}`,
        ...slot,
        date: item.date,
        dayOfWeek: item.dayOfWeek,
      }))
    ) ?? [];

  const { data: servicesData, isLoading: servicesIsLoading } = useList({
    resource: "services",
    pagination: {
      pageSize: k.DROPDOWN_PAGE_SIZE_DEFAULT,
    },
  });

  interface SlotData {
    date: string;
    slot: {
      from: string;
      to: string;
      quota: number;
      serviceId: number;
    };
    service: BaseRecord | undefined;
    sessions: {
      from: string;
      to: string;
    }[];
  }

  const [slotData, setSlotData] = useState<SlotData | null>(null);

  const createModalFormProps = useModalForm({
    refineCoreProps: {
      action: "create",
      resource: "reservations",
      createMutationOptions: defaultMutationOptions(),
      onMutationSuccess: () => {
        refetch();
        closeCreateModal();
      },
      redirect: false,
    },
  });

  const {
    modal: { show: showCreateModal, close: closeCreateModal },
    refineCore: { onFinish },
    handleSubmit,
  } = createModalFormProps;

  const handleReserveClick = (row: any) => {
    const { from, to, quota, serviceId } = row;
    const slotDt = {
      date: row.date,
      slot: { from, to, quota, serviceId },
      service: servicesData?.data.find((x) => x.id == serviceId),
      sessions: [
        {
          from: `${row.date} ${from}:00`,
          to: `${row.date} ${to}:00`,
        },
      ],
    };
    setSlotData(slotDt);
    showCreateModal();
  };

  const handleScanClick = (row: any) => {
    const from = `${row.date} ${row.from}:00`;
    const to = `${row.date} ${row.to}:00`;
    go({
      to: { resource: "attendance", action: "list" },
      query: { svcId: row.serviceId, from, to },
    });
  };

  const handleAttendClick = (row: any) => {
    const from = `${row.date}T${row.from}:00Z`;
    const to = `${row.date}T${row.to}:00Z`;
    const svcId = row.serviceId;
    go({
      to: { resource: "reservations", action: "list" },
      query: { svcId, from, to },
    });
  };

  const columns: GridColDef[] = [
    // { field: "id", minWidth: 200 },
    // { field: "from" },
    // { field: "to" },
    // { field: "serviceId" },
    // { field: "date" },
    // { field: "dayOfWeek" },
    { field: "date", headerName: t("Date"), sortable: false, filterable: false },
    {
      field: "Time",
      headerName: t("Time"),
      renderCell: ({ row }) => `${row.from} - ${row.to}`,
      sortable: false,
      filterable: false,
    },

    {
      field: "serviceId",
      sortable: false,
      filterable: false,
      headerName: t("Service"),
      renderCell: ({ value }) => {
        if (servicesIsLoading) {
          return "Loading..";
        } else {
          const svc = servicesData?.data?.find((x) => x.id === value);
          return svc?.name;
        }
      },
      minWidth: 180,
    },
    {
      field: "quotas",
      flex: 1,
      maxWidth: 250,
      headerName: t("Remaining Quota"),
      align: "left",
      renderCell: ({ row }) => {
        return `${row.quota - row.quotaRemainder}/${row.quota}`;
      },
    },
    {
      field: "actions",
      headerName: t("Actions"),
      type: "actions",
      sortable: false,
      filterable: false,
      minWidth: 286,
      renderCell: function render({ row }) {
        return (
          <>
            {(permissions?.includes("service-reserve_Dashboard") || permissions?.includes("manage_all")) && (
              <Button onClick={() => handleReserveClick(row)} sx={{ mr: 1 }} variant="outlined">
                {t("reserve")}
              </Button>
            )}

            {(permissions?.includes("service-attend_Dashboard") || permissions?.includes("manage_all")) && (
              <Button onClick={() => handleAttendClick(row)} sx={{ mr: 1 }} variant="outlined">
                {t("attendees")}
              </Button>
            )}

            {(permissions?.includes("service-scan_Dashboard") || permissions?.includes("manage_all")) && (
              <Button onClick={() => handleScanClick(row)} variant="outlined">
                {t("scan")}
              </Button>
            )}
          </>
        );
      },
      align: "left",
      headerAlign: "center",
    },
  ];
  return (
    <>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={isLoading || servicesIsLoading}
        autoHeight
        localeText={{
          noRowsLabel: t("No rows"),
          MuiTablePagination: {
            labelRowsPerPage: t("Rows per page"),
          },
        }}
      />
    </>
  );
};

const RemindersTable = () => {
  const { t, i18n } = useTranslation();

  const { memberGlobal, setMemberGlobal } = useUserOptionsContext();

  const {
    dataGridProps,
    tableQuery: { data: reminderData },
  } = useDataGrid({
    resource: "reminders",
    sorters: {
      initial: [{ field: "updatedAt", order: "desc" }],
    },
    pagination: { pageSize: 25 },
  });

  const {
    data: membersData,
    isLoading: membersIsLoading,
    isFetching: membersIsFetching,
  } = useMany({
    resource: "members",
    ids: dataGridProps?.rows?.filter((x) => x?.memberId !== undefined).map((item: any) => item?.memberId) ?? [],
    queryOptions: {
      enabled: !!dataGridProps?.rows,
    },
  });

  const { data: formCodeMappingData, isLoading: formCodeMappingIsLoading } = useList({
    resource: "form-code-mappings",
  });

  const handleResourceNavigation = useResourceNavigation();

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: "id",
        headerName: t("id"),
        type: "number",
        flex: 1,
        minWidth: 100,
      },
      {
        field: "memberId",
        headerName: t("Member"),
        filterable: false,
        flex: 1,
        minWidth: 300,
        renderCell: function render({ value }) {
          if (membersIsLoading) return t("Loading...");
          if (value === undefined) return t("N/A");
          const f = membersData?.data?.find((item) => item.id === value);
          return (
            <Typography
              onClick={(event) => {
                event.stopPropagation();
                handleResourceNavigation({
                  resource: "members",
                  action: "show",
                  id: value,
                  query: { tab: k.TABS.MEMBERS.SUBMISSIONS },
                });
              }}
              sx={s.hoverUnderlinePointer}
            >
              {f?.chineseName ?? f?.englishName}
            </Typography>
          );
        },
      },
      {
        field: "type",
        headerName: t("Type"),
        flex: 3,
        minWidth: 300,
        renderCell: function render(data) {
          const value = data.value;
          const member = membersData?.data?.find((item) => item.id === data.row.memberId);

          return (
            <Typography
              onClick={(event) => {
                event.stopPropagation();
                setMemberGlobal(member);

                var formCode =
                  value == "FULL_INTAKE" ? "MEMBER_INTAKE" : value == "LITE_INTAKE" ? "MEMBER_INTAKE" : "NEED_ASSESSMENT";
                const formId = formCodeMappingData?.data?.find((x) => x.formCode == formCode)?.formId;

                handleResourceNavigation({
                  resource: "forms",
                  action: "show",
                  id: formId,
                });
              }}
              sx={s.hoverUnderlinePointer}
            >
              {t(value)}
            </Typography>
          );
        },
      },
      {
        field: "lastSubmissionDate",
        headerName: t("lastSubmissionDate"),
        flex: 1,
        minWidth: 300,
        renderCell: function render(data) {
          return <Typography>{data.value}</Typography>;
        },
      },
    ],
    [membersData]
  );

  return (
    <DataGrid
      {...dataGridProps}
      columns={columns}
      loading={membersIsLoading}
      autoHeight
      localeText={{
        noRowsLabel: t("No rows"),
        MuiTablePagination: {
          labelRowsPerPage: t("Rows per page"),
        },
      }}
    />
  );
};
