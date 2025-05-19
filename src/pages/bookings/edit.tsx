import { Create, Edit, SaveButton } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";
import EditCreateBookings from "./edit-create-booking";

export const BookingsEdit = () => {
  const { t } = useTranslation();

  const {
    saveButtonProps,
    refineCore: { query, formLoading, onFinish },
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    // console.log("Intercepted data:", data);
    onFinish(data);
  };

  return (
    <Edit
      title={<Typography variant="h5">{t("edit") + " " + t("booking")}</Typography>}
      isLoading={formLoading}
      saveButtonProps={{ ...saveButtonProps, onClick: handleSubmit(onSubmit) }}
    >
      <EditCreateBookings {...{ register, errors, control, action: "edit", setValue, query }} />
    </Edit>
  );
};
