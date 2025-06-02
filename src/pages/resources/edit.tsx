import { Create, Edit, SaveButton } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useTranslation } from "react-i18next";
import { Button, Typography } from "@mui/material";
import EditCreateFunders from "./edit-create-resources";
import EditCreateActivityNatures from "./edit-create-resources";
import EditCreateActivityTypes from "./edit-create-resources";
import EditCreateResources from "./edit-create-resources";
import { useGo } from "@refinedev/core";
import { useNavigate, useParams } from "react-router-dom";

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
      isLoading={formLoading}
      headerButtons={
        <>
          <Button
            variant="outlined"
            onClick={() => {
              go({
                query: {
                  filters: [
                    {
                      operator: "eq",
                      value: !isSubResource ? resource?.id : resource?.parentId,
                      field: "resourceId",
                    },
                  ],
                },
                to: {
                  resource: "resource-schedules",
                  action: "list",
                },
              });
            }}
          >
            View Schedules
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              go({
                query: {
                  filters: [
                    {
                      operator: "eq",
                      value: !isSubResource ? resource?.id : resource?.parentId,
                      field: "resourceId",
                    },
                  ],
                },
                to: {
                  resource: "resource-exceptions",
                  action: "list",
                },
              });
            }}
          >
            View Exceptions
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              const rid = !isSubResource ? resource?.id : resource?.parentId;
              navigate(`/bookings/create/${rid}`);
            }}
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
