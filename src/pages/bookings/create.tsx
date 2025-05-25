import { Create, CreateButton, DeleteButton, EditButton, ListButton, RefreshButton, useAutocomplete } from "@refinedev/mui";
import { Box, Autocomplete, TextField, Button, Typography } from "@mui/material";

interface Service {
  id: string;
  name: string;
}
import {
  Link,
  useGetIdentity,
  useGo,
  useList,
  useNotification,
  useRefineOptions,
  useResourceParams,
  useShow,
} from "@refinedev/core";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AvailableDaysList from "./available-days";
import { k } from "../../common/constants";

export const BookingCreate = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const go = useGo();

  const p = useParams();
  const rid = p.id;

  const { data: user } = useGetIdentity<IUser>();

  const onSlotSelect = (data: any) => {
    // create new booking
    if (!data.slot.hasBookingConflict && !data.slot.hasException) {
      navigate(`details`, { state: { ...data } });
    }

    // view existing booking
    if (data.slot.hasBookingConflict && data.slot.bookingId) {
      if (user?.roleId == k.ROLES.ADMIN) {
        go({
          to: { resource: "bookings", action: "edit", id: data.slot.bookingId },
        });
      }
    }

    // view resource exception
    if (data.slot.hasException && data.slot.exceptionId) {
      if (user?.roleId == k.ROLES.ADMIN) {
        go({
          to: { resource: "resource-exceptions", action: "edit", id: data.slot.exceptionId },
        });
      }
    }
  };

  const { data: resourceData, isLoading: resourceDataLoading } = useList({
    resource: "resources",
    pagination: {
      pageSize: k.GET_MANY_DEFAULT,
    },
  });

  // view single resource
  const tgtResource = resourceData?.data.find((r) => r.id == rid);

  console.log(`targetResource`, tgtResource);

  if (resourceDataLoading) {
    return <>Loading..</>;
  } else {
    return (
      <Create
        title={<Typography variant="h5">{t("create") + " " + t("booking")}</Typography>}
        headerButtons={({ defaultButtons }) => (
          <>
            <ListButton />
          </>
        )}
        footerButtons={({ defaultButtons }) => <>{/* <CreateButton /> */}</>}
      >
        <Box component="form" sx={{ display: "grid", my: 3, px: 2 }} autoComplete="off">
          <Button onClick={() => {}}></Button>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr", // Two columns of equal width
              gap: 1, // Spacing between items
            }}
          >
            {rid ? (
              <Box sx={{ gridColumn: "span 3" }} key={tgtResource?.id}>
                <h3 style={{ margin: 0 }}>
                  {tgtResource?.resourceName} - {tgtResource?.resourceType} (Resource ID: {tgtResource?.id}){" "}
                  {user?.roleId == k.ROLES.ADMIN && (
                    <>
                      [View{" "}
                      <Link
                        go={{
                          query: {
                            filters: [
                              {
                                operator: "eq",
                                value: tgtResource?.id,
                                field: "resourceId",
                              },
                            ],
                          },
                          to: {
                            resource: "resource-schedules",
                            action: "list",
                          },
                        }}
                      >
                        Schedules ({tgtResource?.schedules?.length})
                      </Link>
                      {" or "}
                      <Link
                        go={{
                          query: {
                            filters: [
                              {
                                operator: "eq",
                                value: tgtResource?.id,
                                field: "resourceId",
                              },
                            ],
                          },
                          to: {
                            resource: "resource-exceptions",
                            action: "list",
                          },
                        }}
                      >
                        Exceptions ({tgtResource?.exceptions?.length})
                      </Link>
                      ]
                    </>
                  )}
                </h3>
                <AvailableDaysList onSlotSelect={onSlotSelect} resourceId={tgtResource?.id} calendarHeight={500} />
              </Box>
            ) : (
              <>
                {resourceData?.data?.map((r) => (
                  <Box sx={{ gridColumn: "span 3" }} key={r.id}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <h3 style={{ margin: 0 }}>
                        {r?.resourceName} - {r?.resourceType} (Resource ID: {r?.id}){" "}
                        {user?.roleId == k.ROLES.ADMIN && (
                          <>
                            [View{" "}
                            <Link
                              go={{
                                query: {
                                  filters: [
                                    {
                                      operator: "eq",
                                      value: r?.id,
                                      field: "resourceId",
                                    },
                                  ],
                                },
                                to: {
                                  resource: "resource-schedules",
                                  action: "list",
                                },
                              }}
                            >
                              Schedules ({r?.schedules?.length})
                            </Link>
                            {" or "}
                            <Link
                              go={{
                                query: {
                                  filters: [
                                    {
                                      operator: "eq",
                                      value: r?.id,
                                      field: "resourceId",
                                    },
                                  ],
                                },
                                to: {
                                  resource: "resource-exceptions",
                                  action: "list",
                                },
                              }}
                            >
                              Exceptions ({r?.exceptions?.length})
                            </Link>
                            ]
                          </>
                        )}
                      </h3>
                    </Box>
                    <AvailableDaysList onSlotSelect={onSlotSelect} resourceId={r.id} />
                  </Box>
                ))}
              </>
            )}
          </Box>
        </Box>
      </Create>
    );
  }
};
