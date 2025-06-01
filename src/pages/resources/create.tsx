import { Create, SaveButton } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";
import EditCreateFunders from "./edit-create-resources";
import EditCreateActivityNatures from "./edit-create-resources";
import EditCreateActivityTypes from "./edit-create-resources";
import EditCreateResourceAddons from "./edit-create-resources";
import EditCreateResources from "./edit-create-resources";
import { useNavigate, useParams } from "react-router-dom";
import { useGetIdentity } from "@refinedev/core";
import { k } from "../../common/constants";

export const ResourcesCreate = () => {
  const { t } = useTranslation();

  const {
    saveButtonProps,
    refineCore: { formLoading, onFinish },
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    refineCoreProps: {
      resource: "resources",
      redirect: false,
    },
  });

  const p = useParams();

  const isChildPage = p.parentId !== undefined && p.parentId !== null;

  const navigate = useNavigate();

  const onSubmit = (data: any) => {
    // console.log("Intercepted data:", data);
    onFinish(data).then((x) => {
      navigate(isChildPage ? `/resources/edit/${p.parentId}` : "/resources");
    });
  };

  return (
    <Create
      title={<Typography variant="h5">{t("create") + " " + t("Resources")}</Typography>}
      isLoading={formLoading}
      saveButtonProps={{ ...saveButtonProps, onClick: handleSubmit(onSubmit) }}
    >
      <EditCreateResources {...{ register, errors, control, action: "create" }} />
    </Create>
  );
};
