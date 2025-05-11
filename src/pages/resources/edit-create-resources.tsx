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

type IUser = {
  id: number;
  username: string;
  centreId: number;
};

export default function EditCreateResources({ register, errors, control, action, setValue, handleSubmit, onFinish, query }: any) {
  const { t } = useTranslation();

  const isCreate = action === "create";

  const {
    autocompleteProps: resourceAddonAutocompleteProps,
    query: { data: resourceAddonsData, isLoading: resourceAddonsIsLoading },
  } = useAutocomplete({
    resource: "resource-addons",
    pagination: {
      pageSize: k.GET_MANY_DEFAULT,
    },
    onSearch: (value) => [], // disable server side filtering
  });

  const filterOptions = createFilterOptions({
    matchFrom: "any",
    stringify: (option: any) => `${option?.resourceName} ${option?.resourceType}`,
  });

  const resourcesData = query?.data?.data;

  useEffect(() => {
    if (resourcesData?.resourceAddons) {
      const addonIds = resourcesData.resourceAddons.map((x: any) => x.resourceAddonId);
      setValue("resourceAddonRelations", addonIds);
    }
  }, [resourcesData, resourceAddonsIsLoading]);

  if ((!resourcesData && !isCreate) || resourceAddonsIsLoading) {
    return t("loading");
  } else {
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
          label={t("resourceType")}
          name="resourceType"
        />

        <TextField
          {...register("seatingCapacity", {
            required: "This field is required",
          })}
          error={!!(errors as any)?.seatingCapacity}
          helperText={(errors as any)?.seatingCapacity?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          label={t("seatingCapacity")}
          name="seatingCapacity"
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
          label={t("location")}
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
          label={t("floor")}
          name="floor"
        />

        <Controller
          control={control}
          name="resourceAddonRelations"
          defaultValue={resourcesData?.resourceAddonIds?.map((x: any) => x.id) || []}
          render={({ field }) => (
            <Autocomplete
              multiple
              {...resourceAddonAutocompleteProps}
              {...field}
              filterOptions={filterOptions}
              onChange={(_, value) => {
                const addonIds = value.map((item) => item?.id ?? item);
                field.onChange(addonIds);
              }}
              getOptionLabel={(item) => {
                const option = resourceAddonAutocompleteProps.options.find((p) => p.id == (item?.id ?? item));
                return `${option?.resourceName} (${option?.resourceType})`;
              }}
              isOptionEqualToValue={(option, value) =>
                value === undefined || option?.id?.toString() === (value?.id ?? value)?.toString()
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("resourceAddons")}
                  margin="normal"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  error={!!(errors as any)?.resourceAddons}
                  helperText={(errors as any)?.resourceAddons?.message}
                />
              )}
            />
          )}
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
}
