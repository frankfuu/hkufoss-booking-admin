import { Create, Edit, SaveButton } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";
import EditCreateFunders from "./edit-create-resource-addons";
import EditCreateActivityNatures from "./edit-create-resource-addons";
import EditCreateActivityTypes from "./edit-create-resource-addons";

export const ResourceAddonsEdit = () => {
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
      title={<Typography variant="h5">{t("edit") + " " + t("resourceAddons")}</Typography>}
      isLoading={formLoading}
      saveButtonProps={saveButtonProps}
    >
      <EditCreateActivityTypes {...{ register, errors, control, action: "edit" }} />
    </Edit>
  );
};
