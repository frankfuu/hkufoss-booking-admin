import { Create, SaveButton } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";
import EditCreateFunders from "./edit-create-resources";
import EditCreateActivityNatures from "./edit-create-resources";
import EditCreateActivityTypes from "./edit-create-resources";
import EditCreateResourceAddons from "./edit-create-resources";
import EditCreateResources from "./edit-create-resources";

export const ResourcesCreate = () => {
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
      title={<Typography variant="h5">{t("create") + " " + t("Resources")}</Typography>}
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
      <EditCreateResources {...{ register, errors, control, action: "create" }} />
    </Create>
  );
};
