import { Create, SaveButton } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import EditCreateBookings from "./edit-create-booking";

export const BookingsCreateDetail = () => {
  const { t } = useTranslation();

  const location = useLocation();
  const slotData = location.state;

  console.log(`BookingsCreateTemp, data`, slotData);

  const {
    saveButtonProps,
    refineCore: { formLoading, onFinish },
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    refineCoreProps: {
      resource: "bookings",
    },
  });

  const onSubmit = (data: any) => {
    // console.log("Intercepted data:", data);
    onFinish(data);
  };

  return (
    <Create
      title={<Typography variant="h5">{t("create") + " " + t("Booking")}</Typography>}
      isLoading={formLoading}
      saveButtonProps={{ ...saveButtonProps, onClick: handleSubmit(onSubmit) }}
    >
      <EditCreateBookings {...{ register, errors, control, action: "create", slotData: slotData }} />
    </Create>
  );
};
