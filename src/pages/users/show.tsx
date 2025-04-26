import { useShow, useOne } from "@refinedev/core";
import { Show, NumberField, TextFieldComponent as TextField, BooleanField, DateField } from "@refinedev/mui";
import { Typography, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

export const UserShow = () => {
  const { t } = useTranslation();

  const { query } = useShow();
  const { data, isLoading } = query;

  const record = data?.data;

  const { data: roleData, isLoading: roleIsLoading } = useOne({
    resource: "roles",
    id: record?.roleId || "",
    queryOptions: {
      enabled: !!record,
    },
  });

  return (
    <Show isLoading={isLoading}>
      <Stack gap={1}>
        <Typography variant="body1" fontWeight="bold">
          Id
        </Typography>
        <NumberField value={record?.id ?? ""} />
        <Typography variant="body1" fontWeight="bold">
          Role
        </Typography>

        {roleIsLoading ? <>{t("Loading...")}</> : <>{roleData?.data?.name}</>}
        <Typography variant="body1" fontWeight="bold">
          Username
        </Typography>
        <TextField value={record?.username} />
        <Typography variant="body1" fontWeight="bold">
          Enabled
        </Typography>
        <BooleanField value={record?.enabled} />
        <Typography variant="body1" fontWeight="bold">
          Created By
        </Typography>
        <TextField value={record?.createdBy} />
        <Typography variant="body1" fontWeight="bold">
          Created At
        </Typography>
        <DateField value={record?.createdAt} />
        <Typography variant="body1" fontWeight="bold">
          Updated At
        </Typography>
        <DateField value={record?.updatedAt} />
      </Stack>
    </Show>
  );
};
