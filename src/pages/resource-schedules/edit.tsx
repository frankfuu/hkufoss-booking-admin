import { Create, Edit, SaveButton } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";
import EditCreateResourceExceptions from "./edit-create-resource-schedules";
import EditCreateResourceSchedules from "./edit-create-resource-schedules";

export const ResourceSchedulesEdit = () => {
  const { t } = useTranslation();

  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    control,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  return (
    <Edit
      title={<Typography variant="h5">{t("edit") + " " + t("resource-schedules")}</Typography>}
      isLoading={formLoading}
      saveButtonProps={saveButtonProps}
    >
      <EditCreateResourceSchedules {...{ register, errors, control, action: "edit", setValue, setError, clearErrors }} />
    </Edit>
  );
};
