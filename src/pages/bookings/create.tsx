import { Create, CreateButton, DeleteButton, EditButton, ListButton, RefreshButton, useAutocomplete } from "@refinedev/mui";
import { Box, Autocomplete, TextField, Button, Typography } from "@mui/material";

interface Service {
  id: string;
  name: string;
}
import { useGetIdentity, useGo, useList, useNotification, useRefineOptions, useResourceParams, useShow } from "@refinedev/core";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AvailableDaysList from "./available-days";

type IUser = {
  id: number;
  username: string;
  centreId: number;
};

export const BookingCreate = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const go = useGo();

  const onSlotSelect = (data: any) => {
    if (!data.slot.hasBookingConflict && !data.slot.hasException) {
      navigate(`details`, { state: { ...data } });
    }

    if (data.slot.hasBookingConflict && data.slot.bookingId) {
      go({
        to: { resource: "bookings", action: "edit", id: data.slot.bookingId },
      });
    }
  };

  const { data: resourceData, isLoading: resourceDataLoading } = useList({ resource: "resources" });

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
            {resourceData?.data?.map((r) => (
              <Box sx={{ gridColumn: "span 3" }} key={r.id}>
                <h3>
                  {r.resourceName} - {r.resourceType} (Resource ID: {r.id})
                </h3>
                <AvailableDaysList onSlotSelect={onSlotSelect} resourceId={r.id} />
              </Box>
            ))}
          </Box>
        </Box>
      </Create>
    );
  }
};
