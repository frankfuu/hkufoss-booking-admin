import { Create, Edit, SaveButton } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";
import EditCreateFunders from "./edit-create-activity-natures";
import EditCreateActivityNatures from "./edit-create-activity-natures";

export const ActivityNaturesEdit = () => {
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
      title={<Typography variant="h5">{t("edit") + " " + t("Activity Nature")}</Typography>}
      isLoading={formLoading}
      saveButtonProps={saveButtonProps}
    >
      <EditCreateActivityNatures {...{ register, errors, control, action: "edit" }} />
    </Edit>
  );
};
