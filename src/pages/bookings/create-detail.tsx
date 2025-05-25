import { Create, SaveButton } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import EditCreateBookings from "./edit-create-booking";
import { useGetIdentity, useGo } from "@refinedev/core";
import { k } from "../../common/constants";

export const BookingsCreateDetail = () => {
  const { t } = useTranslation();

  const location = useLocation();
  const slotData = location.state;
  const { data: user } = useGetIdentity<IUser>();

  const go = useGo();

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
      resource: "bookings",
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
    <Create
      title={<Typography variant="h5">{t("create") + " " + t("booking")}</Typography>}
      isLoading={formLoading}
      saveButtonProps={{ ...saveButtonProps, onClick: handleSubmit(onSubmit) }}
    >
      <EditCreateBookings {...{ register, errors, control, action: "create", slotData: slotData, setValue, query }} />
    </Create>
  );
};
