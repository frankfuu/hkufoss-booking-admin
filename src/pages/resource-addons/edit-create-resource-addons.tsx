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
        label={t("Resource Name")}
        name="resourceName"
      />

      <TextField
        {...register("resourceType", {
          required: "This field is required",
        })}
        error={!!(errors as any)?.resourceType}
        helperText={(errors as any)?.resourceType?.message}
        margin="normal"
        fullWidth
        InputLabelProps={{ shrink: true }}
        label={t("Type")}
        name="resourceType"
      />

      <TextField
        {...register("location", {
          required: "This field is required",
        })}
        error={!!(errors as any)?.location}
        helperText={(errors as any)?.location?.message}
        margin="normal"
        fullWidth
        InputLabelProps={{ shrink: true }}
        label={t("Location")}
        name="location"
      />

      <TextField
        {...register("floor", {
          required: "This field is required",
        })}
        error={!!(errors as any)?.floor}
        helperText={(errors as any)?.floor?.message}
        margin="normal"
        fullWidth
        InputLabelProps={{ shrink: true }}
        label={t("Floor")}
        name="floor"
      />

      <TextField
        {...register("photo1", {})}
        error={!!(errors as any)?.photo1}
        helperText={(errors as any)?.photo1?.message}
        margin="normal"
        fullWidth
        InputLabelProps={{ shrink: true }}
        label={t("Photo 1")}
        name="photo1"
      />

      <TextField
        {...register("photo2", {})}
        error={!!(errors as any)?.photo2}
        helperText={(errors as any)?.photo2?.message}
        margin="normal"
        fullWidth
        InputLabelProps={{ shrink: true }}
        label={t("Photo 2")}
        name="photo2"
      />

      <TextField
        {...register("photo3", {})}
        error={!!(errors as any)?.photo3}
        helperText={(errors as any)?.photo3?.message}
        margin="normal"
        fullWidth
        InputLabelProps={{ shrink: true }}
        label={t("Photo 3")}
        name="photo3"
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
