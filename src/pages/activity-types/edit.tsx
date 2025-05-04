import { Create, Edit, SaveButton } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";
import EditCreateFunders from "./edit-create-activity-types";
import EditCreateActivityNatures from "./edit-create-activity-types";
import EditCreateActivityTypes from "./edit-create-activity-types";

export const ActivityTypesEdit = () => {
  const { t } = useTranslation();

  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    control,
    formState: { errors },
  } = useForm();

  return (
    <Edit
      title={<Typography variant="h5">{t("edit") + " " + t("Activity Types")}</Typography>}
      isLoading={formLoading}
      saveButtonProps={saveButtonProps}
    >
      <EditCreateActivityTypes {...{ register, errors, control, action: "edit" }} />
    </Edit>
  );
};
