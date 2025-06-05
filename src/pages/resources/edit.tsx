import { Create, Edit, SaveButton } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useTranslation } from "react-i18next";
import { Button, Typography } from "@mui/material";
import EditCreateResources from "./edit-create-resources";
import { useGo } from "@refinedev/core";
import { useNavigate, useParams, Link } from "react-router-dom";

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

  const p = useParams();
  // const isChildPage = p.parentId !== undefined && p.parentId !== null;

  const navigate = useNavigate();
  const go = useGo();
  const resource = query?.data?.data;
  const isSubResource = !!resource?.parentId;

  return (
    <Edit
      title={<Typography variant="h5">{t("edit") + " " + t("resources")}</Typography>}
      isLoading={formLoading || !resource}
      headerButtons={
        <>
          <Button
            variant="outlined"
            component={Link}
            to={{
              pathname: "/resource-schedules",
              search: `?filters[0][operator]=eq&filters[0][value]=${
                !isSubResource ? resource?.id : resource?.parentId
              }&filters[0][field]=resourceId`,
            }}
          >
            View Schedules
          </Button>
          <Button
            variant="outlined"
            component={Link}
            to={{
              pathname: "/resource-exceptions",
              search: `?filters[0][operator]=eq&filters[0][value]=${
                !isSubResource ? resource?.id : resource?.parentId
              }&filters[0][field]=resourceId`,
            }}
          >
            View Exceptions
          </Button>
          <Button
            variant="contained"
            component={Link}
            to={`/bookings/create/${!isSubResource ? resource?.id : resource?.parentId}`}
          >
            View Availabilities
          </Button>
        </>
      }
      saveButtonProps={saveButtonProps}
    >
      <EditCreateResources {...{ register, errors, control, action: "edit", setValue, handleSubmit, onFinish, query }} />
    </Edit>
  );
};
