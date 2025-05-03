import { Create, CreateButton, DeleteButton, EditButton, ListButton, RefreshButton, useAutocomplete } from "@refinedev/mui";
import { Box, Autocomplete, TextField, Button, Typography } from "@mui/material";
import { useForm, useModalForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import { useEffect, useState } from "react";

interface Service {
  id: string;
  name: string;
}
import { useGetIdentity, useList, useNotification, useRefineOptions, useResourceParams, useShow } from "@refinedev/core";
import { useLocation, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AvailableDaysList from "./available-days";

type IUser = {
  id: number;
  username: string;
  centreId: number;
};

export const BookingCreate = () => {
  const { t } = useTranslation();

  const [slotData, setSlotData] = useState(null);

  const onSlotSelect = (data: any) => {
    const sessions = [
      {
        from: `${data.date} ${data.slot.from}:00`,
        to: `${data.date} ${data.slot.to}:00`,
      },
    ];
    const modifiedData = { ...data, sessions };

    setSlotData(modifiedData);
  };

  const { data: resourceData, isLoading: resourceDataLoading } = useList({ resource: "resources" });

  if (resourceDataLoading) {
    return <>Loading..</>;
  } else {
    return (
      <Create
        title={<Typography variant="h5">{t("create") + " " + t("Booking")}</Typography>}
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
              <Box sx={{ gridColumn: "span 3" }}>
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
