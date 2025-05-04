import { Edit, useAutocomplete } from "@refinedev/mui";
import { Box, TextField, Autocomplete, createFilterOptions } from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useState } from "react";
import { useGetIdentity } from "@refinedev/core";
import { d } from "../common/constants";

type IUser = {
  id: number;
  username: string;
  centreId: number;
};

// FOR REFERENCE ONLY (DO NOT USE!)
export default function EditShowCheckin({ register, errors, control, action }: any) {
  const { t } = useTranslation();

  const [centreFilters, setCentreFilters] = useState<any[]>([]);

  const { data: user } = useGetIdentity<IUser>();

  useEffect(() => {
    if (user?.centreId) {
      setCentreFilters([{ field: "id", operator: "eq", value: user?.centreId }]);
    }
  }, [user]);

  const { autocompleteProps: memberAutocompleteProps } = useAutocomplete({
    resource: "members",
    // defaultValue: checkInLogData?.memberId,
  });

  const { autocompleteProps: centreAutocompleteProps } = useAutocomplete({
    resource: "centres",
    // defaultValue: checkInLogData?.centreId,
    filters: centreFilters,
  });

  const filterOptions = createFilterOptions({
    matchFrom: "any",
    stringify: (option: any) => `${option?.nameEn} ${option?.nameTc}`,
  });

  const filterOptionsMember = createFilterOptions({
    matchFrom: "any",
    stringify: (option: any) => `${option?.chineseName} ${option?.englishName}`,
  });

  return (
    <Box component="form" sx={{ display: "flex", flexDirection: "column" }} autoComplete="off">
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
        hidden={action === "create"}
      />
      <Controller
        control={control}
        name="memberId"
        rules={{ required: "This field is required" }}
        defaultValue={null as any}
        render={({ field }) => (
          <Autocomplete
            {...memberAutocompleteProps}
            {...field}
            onChange={(_, value) => field.onChange(value?.id ?? value)}
            filterOptions={filterOptionsMember}
            onInputChange={(event, value) => {}}
            value={memberAutocompleteProps?.options?.find((option) => option.id === field.value) || null}
            getOptionLabel={(option) => `${option?.chineseName} - ${option?.englishName}`}
            renderInput={(params) => <TextField {...params} label={t("Member")} margin="normal" variant="outlined" required />}
          />
        )}
      />
      <Controller
        control={control}
        name="centreId"
        rules={{ required: "This field is required" }}
        defaultValue={null as any}
        render={({ field }) => (
          <Autocomplete
            {...centreAutocompleteProps}
            {...field}
            onChange={(_, value) => field.onChange(value?.id ?? value)}
            filterOptions={filterOptions}
            onInputChange={(event, value) => {}}
            value={centreAutocompleteProps?.options?.find((option) => option.id === field.value) || null}
            // getOptionLabel={(option) => option?.nameEn ?? ""}
            getOptionLabel={(option) => `${option.nameTc} - ${option.nameEn}`}
            renderInput={(params) => <TextField {...params} label={t("centre")} margin="normal" variant="outlined" required />}
          />
        )}
      />
      <Controller
        control={control}
        name="checkInMethod"
        rules={{ required: "This field is required" }}
        defaultValue={d.CHECKIN.CHECKIN_METHOD.DEFAULT}
        render={({ field }) => (
          <Autocomplete
            {...field}
            options={d.CHECKIN.CHECKIN_METHOD.OPTIONS}
            getOptionLabel={(option) => t(option.label)}
            value={d.CHECKIN.CHECKIN_METHOD.OPTIONS.find((option) => option.value === field.value) || null}
            onChange={(_, newValue) => {
              field.onChange(newValue?.value);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t("Check In Method")}
                margin="normal"
                variant="outlined"
                error={!!(errors as any)?.checkInMethod}
                helperText={(errors as any)?.checkInMethod?.message}
                required
              />
            )}
          />
        )}
      />
      <Controller
        control={control}
        name="checkInType"
        rules={{ required: "This field is required" }}
        defaultValue={d.CHECKIN.CHECKIN_TYPE.DEFAULT}
        render={({ field }) => (
          <Autocomplete
            {...field}
            options={d.CHECKIN.CHECKIN_TYPE.OPTIONS}
            getOptionLabel={(option) => t(option.label)}
            value={d.CHECKIN.CHECKIN_TYPE.OPTIONS.find((option) => option.value === field.value) || null}
            onChange={(_, newValue) => {
              field.onChange(newValue?.value);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t("Check In Type")}
                margin="normal"
                variant="outlined"
                error={!!(errors as any)?.checkInType}
                helperText={(errors as any)?.checkInType?.message}
                required
              />
            )}
          />
        )}
      />
      <TextField
        {...register("checkInTime", {
          required: "This field is required",
          disabled: true,
        })}
        error={!!(errors as any)?.checkInTime}
        helperText={(errors as any)?.checkInTime?.message}
        margin="normal"
        fullWidth
        InputLabelProps={{ shrink: true }}
        label={t("Check In Time")}
        name="checkInTime"
        hidden={action === "create"}
      />
      <TextField
        {...register("updatedAt", {
          required: "This field is required",
          disabled: true,
        })}
        error={!!(errors as any)?.updatedAt}
        helperText={(errors as any)?.updatedAt?.message}
        margin="normal"
        fullWidth
        InputLabelProps={{ shrink: true }}
        label={t("updatedAt")}
        name="updatedAt"
        hidden={action === "create"}
      />
    </Box>
  );
}
