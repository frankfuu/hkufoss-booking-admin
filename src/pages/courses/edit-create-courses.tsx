import { Edit, useAutocomplete } from "@refinedev/mui";
import { Box, TextField, Autocomplete, createFilterOptions } from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useState } from "react";
import { useGetIdentity } from "@refinedev/core";
import { d } from "../../common/constants";

type IUser = {
  id: number;
  username: string;
  centreId: number;
};

export default function EditCreateCourses({ register, errors, control, action }: any) {
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
        {...register("code", {
          required: "This field is required",
        })}
        error={!!(errors as any)?.code}
        helperText={(errors as any)?.code?.message}
        margin="normal"
        fullWidth
        InputLabelProps={{ shrink: true }}
        label={t("Code")}
        name="code"
      />
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
      />

      {!isCreate && (
        <TextField
          {...register("updatedAt", {})}
          error={!!(errors as any)?.updatedAt}
          helperText={(errors as any)?.updatedAt?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          label={t("updatedAt")}
          name="updatedAt"
          disabled
        />
      )}
    </Box>
  );
}
