import { Create, Edit, SaveButton } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";
import EditCreateResourceExceptions from "./edit-create-resource-exceptions";

export const ResourceExceptionsEdit = () => {
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
      title={<Typography variant="h5">{t("edit") + " " + t("resource-exceptions")}</Typography>}
      isLoading={formLoading}
      saveButtonProps={saveButtonProps}
    >
      <EditCreateResourceExceptions {...{ register, errors, control, action: "edit" }} />
    </Edit>
  );
};
