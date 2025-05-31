import { Edit, useAutocomplete } from "@refinedev/mui";
import { Box, TextField, Autocomplete, createFilterOptions } from "@mui/material";
import { useTranslation } from "react-i18next";

import { useGetIdentity } from "@refinedev/core";
import { d, k } from "../../common/constants";
import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { Controller } from "react-hook-form";

type IUser = {
  id: number;
  username: string;
  centreId: number;
};

export default function EditCreateResourceAddons({ register, errors, control, action }: any) {
  const { t } = useTranslation();

  const { data: user } = useGetIdentity<IUser>();
  const isCreate = action === "create";

  return (
    <Box component="form" sx={{ display: "flex", flexDirection: "column" }} autoComplete="off">
      {!isCreate && (
        <TextField
          {...register("id", {
            valueAsNumber: true,
          })}
          error={!!(errors as any)?.id}
          helperText={(errors as any)?.id?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="number"
          label={t("id")}
          name="id"
          disabled
        />
      )}

      <TextField
        {...register("resourceName", {
          required: "This field is required",
        })}
        error={!!(errors as any)?.resourceName}
        helperText={(errors as any)?.resourceName?.message}
        margin="normal"
        fullWidth
        InputLabelProps={{ shrink: true }}
        label={t("resourceName")}
        name="resourceName"
        required
      />

      {!isCreate && (
        <Controller
          disabled
          control={control}
          name="updatedAt"
          render={({ field }) => (
            <DateTimePicker
              {...field}
              format={k.DATE_FM_DEFAULT}
              value={field.value ? dayjs(field.value) : null}
              onChange={(date) => field.onChange(date)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: "normal",
                  label: t("updatedAt"),
                  InputLabelProps: { shrink: true },
                },
              }}
            />
          )}
        />
      )}
    </Box>
  );
}
