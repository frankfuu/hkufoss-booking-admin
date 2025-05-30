import { Edit, useAutocomplete } from "@refinedev/mui";
import { Box, TextField, Autocomplete, createFilterOptions } from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useState } from "react";
import { useGetIdentity } from "@refinedev/core";
import { d, k } from "../../common/constants";
import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";

type IUser = {
  id: number;
  username: string;
  centreId: number;
};

export default function EditCreateActivityTypes({ register, errors, control, action }: any) {
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
        {...register("name", {
          required: "This field is required",
        })}
        error={!!(errors as any)?.name}
        helperText={(errors as any)?.name?.message}
        margin="normal"
        fullWidth
        InputLabelProps={{ shrink: true }}
        label={t("Name")}
        name="name"
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
