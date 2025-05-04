import { Create, SaveButton } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";
import EditCreateFunders from "./edit-create-courses";
import EditCreateCourses from "./edit-create-courses";

export const CoursesCreate = () => {
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
      title={<Typography variant="h5">{t("create") + " " + t("Course")}</Typography>}
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
      <EditCreateCourses {...{ register, errors, control, action: "create" }} />
    </Create>
  );
};
