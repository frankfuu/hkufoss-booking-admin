import { Create, Edit, SaveButton } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";
import EditCreateFunders from "./edit-create-resources";
import EditCreateActivityNatures from "./edit-create-resources";
import EditCreateActivityTypes from "./edit-create-resources";
import EditCreateResources from "./edit-create-resources";

export const ResourcesEdit = () => {
  const { t } = useTranslation();

  const {
    saveButtonProps,
    refineCore: { query, formLoading, onFinish },
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <Edit
      title={<Typography variant="h5">{t("edit") + " " + t("Resources")}</Typography>}
      isLoading={formLoading}
      saveButtonProps={saveButtonProps}
    >
      <EditCreateResources {...{ register, errors, control, action: "edit", setValue, handleSubmit, onFinish, query }} />
    </Edit>
  );
};
