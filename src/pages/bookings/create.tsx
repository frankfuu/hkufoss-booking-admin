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
    if (!data.slot.hasBookingConflict && !data.slot.hasException && !data.slot.inPast) {
      const isAdminOrStaff = user?.roleId === k.ROLES.ADMIN || user?.roleId === k.ROLES.STAFF;
      if (!isAdminOrStaff && data.slot.subResourcesMeta.resourcesCount === 0) {
        alert("Only Admin and Staff can book this resource");
      } else {
        navigate(`details`, { state: { ...data } });
      }
    }

    // view existing booking
    if (data.slot.hasBookingConflict && data.slot.bookingId) {
      if (user?.roleId == k.ROLES.ADMIN || user?.roleId == k.ROLES.STAFF) {
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
        title={<Typography variant="h5">{t("Booking Calendar")}</Typography>}
        headerButtons={({ defaultButtons }) => <>{/* <ListButton /> */}</>}
        footerButtons={({ defaultButtons }) => <>{/* <CreateButton /> */}</>}
      >
        <Box component="form" sx={{ display: "grid", my: 0, px: 2 }} autoComplete="off">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr", // Two columns of equal width
              gap: 1, // Spacing between items
            }}
          >
            {rid ? (
              <>
                <Box sx={{ gridColumn: "span 3", display: "flex", alignItems: "center", mb: 4 }} key={tgtResource?.id}>
                  {tgtResource?.photo1 && (
                    <Box sx={{ mr: 3 }}>
                      <img
                        src={tgtResource.photo1}
                        alt={tgtResource.resourceName}
                        style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 8 }}
                      />
                    </Box>
                  )}
                  <Box>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {tgtResource?.resourceName} - {tgtResource?.resourceType}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0 }}>
                      Location: {tgtResource?.location}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0 }}>
                      Seating Capacity: {tgtResource?.seatingCapacity}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0 }}>
                      Addons:{" "}
                      {tgtResource?.resourceAddons
                        ? tgtResource.resourceAddons
                            .map((addon: any) => addon.resourceAddon?.resourceName)
                            .filter(Boolean)
                            .join(", ")
                        : null}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ gridColumn: "span 3" }}>
                  <AvailableDaysList onSlotSelect={onSlotSelect} resourceId={tgtResource?.id} calendarHeight={550} />
                </Box>
              </>
            ) : (
              <>
                {resourceData?.data
                  ?.filter((x) => x.parentId == null)
                  .map((r) => (
                    <Box sx={{ gridColumn: "span 3", mb: 4 }} key={r.id}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <h3 style={{ marginBottom: 5 }}>
                          {r?.resourceName} - {r?.resourceType}{" "}
                          {user?.roleId == k.ROLES.ADMIN && (
                            <>
                              (<Link to={`/resources/edit/${r?.id}`}>Resource ID {r?.id}</Link>) [View{" "}
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
                      <Box sx={{ mt: 2 }}>
                        <AvailableDaysList onSlotSelect={onSlotSelect} resourceId={r.id} calendarHeight={550} />
                      </Box>
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
