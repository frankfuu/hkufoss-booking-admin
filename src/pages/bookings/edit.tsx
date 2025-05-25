import { Create, Edit, SaveButton } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";
import EditCreateBookings from "./edit-create-booking";
import { useNavigate } from "react-router-dom";
import { k } from "../../common/constants";
import { useGetIdentity } from "@refinedev/core";

export const BookingsEdit = () => {
  const { t } = useTranslation();
  const { data: user } = useGetIdentity<IUser>();

  const {
    saveButtonProps,
    refineCore: { query, formLoading, onFinish },
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    refineCoreProps: {
      redirect: false,
    },
  });

  const navigate = useNavigate();

  const onSubmit = (data: any) => {
    // console.log("Intercepted data:", data);
    onFinish(data).then((x) => {
      navigate(user?.roleId == k.ROLES.ADMIN ? "/bookings" : "/home");
    });
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
