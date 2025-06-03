import { Create, SaveButton } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import EditCreateBookings from "./edit-create-booking";
import { useGetIdentity, useGo } from "@refinedev/core";
import { k } from "../../common/constants";
import EditCreateSubBookings from "./edit-create-sub-booking";
import { FormControl, FormControlLabel, Switch } from "@mui/material";
import { useEffect, useState } from "react";

export const BookingsCreateDetail = () => {
  const { t } = useTranslation();

  const location = useLocation();
  const slotData = location.state;
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
      resource: "bookings",
      redirect: false,
    },
  });

  const navigate = useNavigate();

  const onSubmit = (data: any) => {
    // console.log("Intercepted data:", data);
    const sameParentAndChild = data.resourceId && data.parentResourceId && data.resourceId === data.parentResourceId;
    if (overrideForSubResource && sameParentAndChild) {
      alert("Please choose a seat");
    } else {
      // remove parentResourceId if it is same as resourceId
      if (sameParentAndChild) {
        delete data.parentResourceId;
      }

      onFinish(data).then((x) => {
        navigate(user?.roleId == k.ROLES.ADMIN ? "/bookings" : "/home");
      });
    }
  };

  const getAvailableBookingTypes = (slotData: any, user: IUser | undefined) => {
    if (user && (user.roleId == k.ROLES.ADMIN || user.roleId == k.ROLES.STAFF)) {
      return ["parentResource", "subResource"];
    } else {
      return ["subResource"];
    }
  };

  const availBookingTypes = getAvailableBookingTypes(slotData, user);

  const forSubResource = slotData.slot.subResourcesMeta.resourcesCount > 0;

  const getBookingTypeDefault = () => {
    if (user?.roleId == k.ROLES.STUDENT) {
      return "subResource";
    }

    return "parentResource";
  };

  const [overrideForSubResource, setOverrideForSubResource] = useState<boolean | null>(null);

  useEffect(() => {
    if (user) {
      setOverrideForSubResource(getBookingTypeDefault() === "subResource");
    }
  }, [user]);

  const effectiveForSubResource = overrideForSubResource !== null ? overrideForSubResource : forSubResource;
  const canOverride = user?.roleId == k.ROLES.ADMIN || user?.roleId == k.ROLES.STAFF;

  // UI to override forSubResource
  const BookingTypeSwitch = (
    <FormControl component="fieldset" sx={{ mb: 2 }}>
      <FormControlLabel
        control={
          <Switch
            checked={overrideForSubResource ?? forSubResource}
            onChange={(e) => setOverrideForSubResource(e.target.checked)}
            color="primary"
          />
        }
        label="Book Seat only"
      />
    </FormControl>
  );

  return (
    <Create
      title={<Typography variant="h5">{t("create") + " " + t("booking")}</Typography>}
      isLoading={formLoading}
      saveButtonProps={{ ...saveButtonProps, onClick: handleSubmit(onSubmit) }}
    >
      {canOverride && BookingTypeSwitch}
      {overrideForSubResource ? (
        <>
          <EditCreateSubBookings
            {...{ register, errors, control, action: "create", slotData: slotData, setValue, query, isEditable: true }}
          />
        </>
      ) : (
        <EditCreateBookings
          {...{ register, errors, control, action: "create", slotData: slotData, setValue, query, isEditable: true }}
        />
      )}
    </Create>
  );
};
