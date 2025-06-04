import { Create, CreateButton, DeleteButton, EditButton, ListButton, RefreshButton, useAutocomplete } from "@refinedev/mui";
import { Box, Autocomplete, TextField, Button, Typography } from "@mui/material";
import ImageViewerModal from "../../components/image-viewer-modal";
import { useState } from "react";

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
import { d, k } from "../../common/constants";

const ResourceDisplay = ({
  resource,
  user,
  onSlotSelect,
  isSingleView = false,
}: {
  resource: any;
  user: any;
  onSlotSelect: (data: any) => void;
  isSingleView?: boolean;
}) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const handleImageClick = () => {
    setIsImageModalOpen(true);
  };

  const AdminControls = ({ resource }: { resource: any }) =>
    user?.roleId == k.ROLES.ADMIN ? (
      <>
        (<Link to={`/resources/edit/${resource?.id}`}>Resource ID {resource?.id}</Link>) [View{" "}
        <Link
          go={{
            query: {
              filters: [
                {
                  operator: "eq",
                  value: resource?.id,
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
          Schedules ({resource?.schedules?.length})
        </Link>
        {" or "}
        <Link
          go={{
            query: {
              filters: [
                {
                  operator: "eq",
                  value: resource?.id,
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
          Exceptions ({resource?.exceptions?.length})
        </Link>
        ]
      </>
    ) : null;

  return (
    <Box sx={{ gridColumn: "span 3", mb: 4 }} key={resource?.id}>
      <Box sx={{ display: "flex", alignItems: isSingleView ? "center" : "flex-start", mb: 4 }}>
        <Box
          sx={{
            mr: 3,
            "& img": {
              transition: "transform 0.2s ease",
              "&:hover": {
                transform: resource?.photo1 || d.RESOURCES.DEFAULTS.ROOM_IMG ? "scale(1.05)" : "none",
              },
            },
          }}
        >
          <img
            src={resource?.photo1 || d.RESOURCES.DEFAULTS.ROOM_IMG}
            alt={resource?.resourceName || "Resource"}
            style={{
              width: 100,
              height: 100,
              objectFit: "cover",
              borderRadius: 8,
              backgroundColor: resource?.photo1 ? "transparent" : "#f5f5f5",
              cursor: "pointer",
            }}
            onClick={handleImageClick}
          />
          <ImageViewerModal
            open={isImageModalOpen}
            onClose={() => setIsImageModalOpen(false)}
            imageSrc={resource?.photo1 || d.RESOURCES.DEFAULTS.ROOM_IMG}
            title={resource?.resourceName || "Resource Image"}
          />
        </Box>

        <Box sx={{ flex: 1 }}>
          <>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 800 }}>
                {resource?.resourceName} - {resource?.resourceType} <AdminControls resource={resource} />
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 0 }}>
              Location: {resource?.location}
            </Typography>
            <Typography variant="body2" sx={{ mb: 0 }}>
              Seating Capacity: {resource?.seatingCapacity}
            </Typography>
            <Typography variant="body2" sx={{ mb: 0 }}>
              Addons:{" "}
              {resource?.resourceAddons
                ? resource.resourceAddons
                    .map((addon: any) => addon.resourceAddon?.resourceName)
                    .filter(Boolean)
                    .join(", ")
                : null}
            </Typography>
          </>
        </Box>
      </Box>

      <Box sx={{ mt: isSingleView ? 0 : 2 }}>
        <AvailableDaysList onSlotSelect={onSlotSelect} resourceId={resource?.id} calendarHeight={550} />
      </Box>
    </Box>
  );
};

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
            {rid
              ? // Single resource view
                tgtResource && (
                  <ResourceDisplay resource={tgtResource} user={user} onSlotSelect={onSlotSelect} isSingleView={true} />
                )
              : // Multiple resources view
                resourceData?.data
                  ?.filter((x) => x.parentId == null)
                  .map((resource) => (
                    <ResourceDisplay
                      key={resource.id}
                      resource={resource}
                      user={user}
                      onSlotSelect={onSlotSelect}
                      isSingleView={false}
                    />
                  ))}
          </Box>
        </Box>
      </Create>
    );
  }
};
