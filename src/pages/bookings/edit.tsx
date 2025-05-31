import { Create, DeleteButton, Edit, SaveButton } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useTranslation } from "react-i18next";
import { Button, Typography } from "@mui/material";
import EditCreateBookings from "./edit-create-booking";
import { redirect, useNavigate, useParams } from "react-router-dom";
import { d, k } from "../../common/constants";
import { useCustomMutation, useGetIdentity, useGo, useResource } from "@refinedev/core";

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

  const p = useParams();
  const navigate = useNavigate();
  const booking = query?.data?.data;
  const isEditable = booking && booking.status != d.BOOKINGS.STATUS.LIST.CANCELLED;
  const { mutate } = useCustomMutation({});
  const go = useGo();

  const onSubmit = (data: any) => {
    // console.log("Intercepted data:", data);
    onFinish(data).then((x) => {
      navigate(user?.roleId == k.ROLES.ADMIN ? "/bookings" : "/home");
    });
  };

  const handleStatusUpdate = (newStatus: string) => {
    const targetUrl = `bookings/${p.id}`;
    mutate(
      {
        url: targetUrl,
        // @ts-ignore,
        // case sensitivity issue, need to fix on server, refine.dev expecting lower case but server expects upper case
        method: "PATCH",
        values: {
          status: newStatus,
        },
        successNotification: (data, values) => {
          return {
            message: `Booking ${data?.data?.status}`,
            type: "success",
          };
        },
      },
      {
        // onError: (error, variables, context) => {
        //   console.log(error);
        // },
        onSuccess: (data, variables, context) => {
          // query?.refetch();
          const navigateTo = user?.roleId == k.ROLES.ADMIN ? "/bookings" : "/";
          go({ to: navigateTo });
        },
      }
    );
  };

  return (
    <Edit
      title={<Typography variant="h5">{t("edit") + " " + t("booking")}</Typography>}
      headerButtons={<></>}
      footerButtons={({ saveButtonProps, deleteButtonProps }) => (
        <>
          {deleteButtonProps && <DeleteButton {...deleteButtonProps} />}
          {booking && booking.status !== d.BOOKINGS.STATUS.LIST.CANCELLED && (
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                if (window.confirm("Are you sure you want to cancel this booking?")) {
                  handleStatusUpdate(d.BOOKINGS.STATUS.LIST.CANCELLED);
                }
              }}
            >
              Cancel Booking
            </Button>
          )}

          <SaveButton {...saveButtonProps} disabled={!isEditable && user?.roleId != k.ROLES.ADMIN} />
        </>
      )}
      isLoading={formLoading}
      canDelete={user?.roleId == k.ROLES.ADMIN}
      saveButtonProps={{ ...saveButtonProps, onClick: handleSubmit(onSubmit) }}
    >
      <EditCreateBookings {...{ register, errors, control, action: "edit", setValue, query, isEditable }} />
    </Edit>
  );
};
