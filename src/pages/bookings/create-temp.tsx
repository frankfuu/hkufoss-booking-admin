import { Create, SaveButton } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";
import EditCreateBookings from "./edit-create-booking";

export const BookingsCreateTemp = () => {
  const { t } = useTranslation();

  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    control,
    formState: { errors },
  } = useForm();

  return (
    <Create
      title={<Typography variant="h5">{t("create") + " " + t("Booking")}</Typography>}
      isLoading={formLoading}
      saveButtonProps={saveButtonProps}
      footerButtons={({ defaultButtons }) => (
        <>
          <SaveButton variant="contained" {...saveButtonProps}>
            {t("save")}
          </SaveButton>
        </>
      )}
    >
      <EditCreateBookings {...{ register, errors, control, action: "create" }} />
    </Create>
  );
};
