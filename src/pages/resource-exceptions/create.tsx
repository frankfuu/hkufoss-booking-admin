import { Create, SaveButton } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";
import EditCreateResourceExceptions from "./edit-create-resource-exceptions";

export const ResourceExceptionsCreate = () => {
  const { t } = useTranslation();

  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    control,
    formState: { errors },
  } = useForm();

  return (
    <Create
      title={<Typography variant="h5">{t("create") + " " + t("Resource Exceptions")}</Typography>}
      isLoading={formLoading}
      saveButtonProps={saveButtonProps}
      footerButtons={({ defaultButtons }) => (
        <>
          <SaveButton variant="contained" {...saveButtonProps}>
            {t("save")}
          </SaveButton>
        </>
      )}
    >
      <EditCreateResourceExceptions {...{ register, errors, control, action: "create" }} />
    </Create>
  );
};
