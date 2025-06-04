import { CloneButton, DeleteButton, Edit, EditButton, useAutocomplete, useDataGrid } from "@refinedev/mui";
import { Box, TextField, Autocomplete, createFilterOptions, Grid, Typography, Button, Paper } from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useGetIdentity, useGo, useList, useNavigation, useResource } from "@refinedev/core";
import { d, k } from "../../common/constants";
import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

type IUser = {
  id: number;
  username: string;
  centreId: number;
};

export default function EditCreateResources({ register, errors, control, action, setValue, handleSubmit, onFinish, query }: any) {
  const resourcesData = query?.data?.data;
  const { t } = useTranslation();
  const p = useParams();

  const isCreate = action === "create";
  const isChildPage = p.parentId !== undefined && p.parentId !== null ? true : !!(resourcesData && resourcesData.parentId);

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
    stringify: (option: any) => `${option?.resourceName}`,
  });

  useEffect(() => {
    if (resourcesData?.resourceAddons) {
      const addonIds = resourcesData.resourceAddons.map((x: any) => x.resourceAddonId);
      setValue("resourceAddonRelations", addonIds);
    }
  }, [resourcesData, resourceAddonsIsLoading]);

  const navigate = useNavigate();

  if ((!isCreate && (query.isLoading || !resourcesData)) || resourceAddonsIsLoading) {
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
            size="small"
          />
        )}

        {isChildPage && (
          <TextField
            {...register("parentId", {
              valueAsNumber: true,
            })}
            defaultValue={p.parentId}
            error={!!(errors as any)?.parentId}
            helperText={(errors as any)?.parentId?.message}
            margin="normal"
            fullWidth
            InputLabelProps={{ shrink: true }}
            type="number"
            label={t("Parent ID")}
            name="parentId"
            disabled
            size="small"
          />
        )}

        <TextField
          {...register("resourceName", {
            required: "This field is required",
          })}
          autoFocus={isCreate}
          error={!!(errors as any)?.resourceName}
          helperText={(errors as any)?.resourceName?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          label={t("resourceName")}
          name="resourceName"
          required
          size="small"
        />

        <Controller
          control={control}
          name="resourceType"
          rules={{ required: "This field is required" }}
          defaultValue={isChildPage ? d.RESOURCES.TYPES.SUB_RESOURCE_DEFAULT : d.RESOURCES.TYPES.DEFAULT}
          render={({ field }) => (
            <Autocomplete
              {...field}
              options={d.RESOURCES.TYPES.OPTIONS}
              getOptionLabel={(option) => t(option.label)}
              value={d.RESOURCES.TYPES.OPTIONS.find((option) => option.value === field.value) || null}
              onChange={(_, newValue) => {
                field.onChange(newValue?.value);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label={t("resourceType")}
                  margin="normal"
                  variant="outlined"
                  error={!!(errors as any)?.status}
                  helperText={(errors as any)?.status?.message}
                  required
                />
              )}
            />
          )}
        />

        {!isChildPage && (
          <>
            <TextField
              {...register("seatingCapacity", {
                valueAsNumber: true,
              })}
              size="small"
              error={!!(errors as any)?.seatingCapacity}
              helperText={(errors as any)?.seatingCapacity?.message}
              margin="normal"
              fullWidth
              type="number"
              InputLabelProps={{ shrink: true }}
              label={t("seatingCapacity.full")}
              name="seatingCapacity"
              // required={parentFieldsRequired}
            />

            <TextField
              {...register("location", {})}
              error={!!(errors as any)?.location}
              helperText={(errors as any)?.location?.message}
              margin="normal"
              fullWidth
              InputLabelProps={{ shrink: true }}
              label={t("location")}
              name="location"
              size="small"
              // required={parentFieldsRequired}
            />

            <TextField
              {...register("floor", {})}
              error={!!(errors as any)?.floor}
              helperText={(errors as any)?.floor?.message}
              margin="normal"
              fullWidth
              InputLabelProps={{ shrink: true }}
              label={t("floor")}
              name="floor"
              size="small"
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
                    return `${option?.resourceName}`;
                  }}
                  isOptionEqualToValue={(option, value) =>
                    value === undefined || option?.id?.toString() === (value?.id ?? value)?.toString()
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
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

            {/* Replace the three TextField components with this multi-photo upload component */}
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                {t("Resource Photos")}
              </Typography>

              <Grid container spacing={2}>
                {(["photo1", "photo2", "photo3"] as const).map((photoKey) => {
                  // Get the initial value from the form if it exists
                  const initialValue = resourcesData?.[photoKey] || null;

                  return (
                    <Grid item xs={12} sm={4} key={photoKey}>
                      <Controller
                        control={control}
                        name={photoKey}
                        defaultValue={initialValue}
                        render={({ field }) => (
                          <Paper
                            elevation={1}
                            sx={{
                              p: 2,
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              minHeight: 180,
                              position: "relative",
                            }}
                          >
                            <Typography variant="subtitle2" align="center" gutterBottom>
                              {t(photoKey.charAt(0).toUpperCase() + photoKey.slice(1))}
                            </Typography>

                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: "none" }}
                              id={`file-input-${photoKey}`}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;

                                // Check if file is an image
                                if (!file.type.match("image.*")) {
                                  alert("Please select an image file");
                                  return;
                                }

                                // Check file size (limit to 2MB)
                                if (file.size > 2 * 1024 * 1024) {
                                  alert("File size should be less than 2MB");
                                  return;
                                }

                                const reader = new FileReader();
                                reader.onload = () => {
                                  field.onChange(reader.result);
                                };
                                reader.readAsDataURL(file);
                              }}
                            />

                            {!field.value ? (
                              <Button
                                variant="outlined"
                                onClick={() => document.getElementById(`file-input-${photoKey}`)?.click()}
                                sx={{ mt: 2 }}
                                fullWidth
                                size="small"
                              >
                                {t("Upload Image")}
                              </Button>
                            ) : (
                              <Box sx={{ width: "100%", position: "relative" }}>
                                <Box
                                  component="img"
                                  src={field.value}
                                  alt={`${photoKey} preview`}
                                  sx={{
                                    width: "100%",
                                    height: 120,
                                    objectFit: "contain",
                                  }}
                                />
                                <Button
                                  variant="outlined"
                                  color="error"
                                  size="small"
                                  onClick={() => {
                                    field.onChange(null);
                                    // Reset file input
                                    const fileInput = document.getElementById(`file-input-${photoKey}`) as HTMLInputElement;
                                    if (fileInput) fileInput.value = "";
                                  }}
                                  sx={{ mt: 1, width: "100%" }}
                                >
                                  {t("Clear")}
                                </Button>
                              </Box>
                            )}
                          </Paper>
                        )}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          </>
        )}

        {isChildPage && (
          <>
            <TextField
              {...register("coordX", {
                valueAsNumber: true,
              })}
              defaultValue={p.coordX}
              error={!!(errors as any)?.coordX}
              helperText={(errors as any)?.coordX?.message}
              margin="normal"
              fullWidth
              InputLabelProps={{ shrink: true }}
              type="number"
              label={t("X-Coordinate")}
              name="coordX"
              size="small"
            />
            <TextField
              {...register("coordY", {
                valueAsNumber: true,
              })}
              defaultValue={p.coordY}
              error={!!(errors as any)?.coordY}
              helperText={(errors as any)?.coordY?.message}
              margin="normal"
              fullWidth
              InputLabelProps={{ shrink: true }}
              type="number"
              label={t("Y-Coordinate")}
              name="coordY"
              size="small"
            />
          </>
        )}

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
                    size: "small",
                    label: t("updatedAt"),
                    InputLabelProps: { shrink: true },
                  },
                }}
              />
            )}
          />
        )}

        {resourcesData && !resourcesData.parentId && (
          <Box
            sx={{
              display: "flex",
              marginTop: 2,
              flexDirection: "column",
              height: "100%",
              border: "2px dotted grey",
              p: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, mt: 2 }}>
              <Typography sx={{ fontWeight: "bold", fontSize: 20 }}>{t("Sub Resources")}</Typography>
              <Button variant="contained" size="small" onClick={() => navigate(`/resources/create/${p.id}/child`)}>
                Add
              </Button>
            </Box>{" "}
            {/* Add Floor Plan Photo Upload for SubResource */}
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                {t("Floor Plan")}
              </Typography>

              <Controller
                control={control}
                name="photoFloorPlan"
                defaultValue={resourcesData?.photoFloorPlan || null}
                render={({ field }) => (
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: 180,
                      position: "relative",
                      width: "100%",
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      id="file-input-floor-plan"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        // Check if file is an image
                        if (!file.type.match("image.*")) {
                          alert("Please select an image file");
                          return;
                        }

                        // Check file size (limit to 5MB)
                        if (file.size > 5 * 1024 * 1024) {
                          alert("File size should be less than 5MB");
                          return;
                        }

                        const reader = new FileReader();
                        reader.onload = () => {
                          field.onChange(reader.result);
                        };
                        reader.readAsDataURL(file);
                      }}
                    />

                    {!field.value ? (
                      <Button
                        variant="outlined"
                        onClick={() => document.getElementById("file-input-floor-plan")?.click()}
                        sx={{ mt: 2 }}
                        fullWidth
                        size="small"
                      >
                        {t("Upload Floor Plan")}
                      </Button>
                    ) : (
                      <Box sx={{ width: "100%", position: "relative" }}>
                        <Box
                          component="img"
                          src={field.value}
                          alt="Floor plan preview"
                          sx={{
                            width: "100%",
                            height: 200,
                            objectFit: "contain",
                          }}
                        />
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => {
                            field.onChange(null);
                            // Reset file input
                            const fileInput = document.getElementById("file-input-floor-plan") as HTMLInputElement;
                            if (fileInput) fileInput.value = "";
                          }}
                          sx={{ mt: 1, width: "100%" }}
                        >
                          {t("Clear")}
                        </Button>
                      </Box>
                    )}
                  </Paper>
                )}
              />
            </Box>
            <SubResources />
          </Box>
        )}
      </Box>
    );
  }
}

const SubResources = () => {
  const p = useParams();

  const { t } = useTranslation();
  const {
    dataGridProps,
    tableQuery: { refetch },
  } = useDataGrid({
    resource: "resources",
    filters: {
      permanent: [
        {
          field: "parentId",
          operator: "eq",
          value: p.id ?? 0,
        },
      ],
    },
    sorters: {
      initial: [
        {
          field: "updatedAt",
          order: "desc",
        },
      ],
    },
  });

  const {
    data: resourcesData,
    isLoading: resourcesDataLoading,
    isError: resourcesDataError,
  } = useList({
    resource: "resources",
    pagination: {
      pageSize: k.GET_MANY_DEFAULT,
    },
  });
  const navigate = useNavigation();
  const go = useGo();

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: "id",
        headerName: "Id",
        type: "number",
        minWidth: 50,
        filterable: false,
      },
      {
        field: "resourceName",
        minWidth: 150,
        headerName: t("resourceName"),
      },
      {
        field: "coordX",
        minWidth: 50,
        headerName: t("X-Coordinate"),
      },
      {
        field: "coordY",
        minWidth: 50,
        headerName: t("Y-Coordinate"),
      },
      {
        field: "actions",
        headerName: t("Actions"),
        sortable: false,
        type: "actions",
        minWidth: 200,
        renderCell: function render({ row }) {
          return (
            <>
              <EditButton recordItemId={row.id} />
              <CloneButton recordItemId={row.id} />
              <DeleteButton recordItemId={row.id} />
            </>
          );
        },
        align: "left",
        headerAlign: "left",
      },
    ],
    [resourcesData, t]
  );

  return (
    <>
      <DataGrid
        {...dataGridProps}
        columns={columns}
        autoHeight
        onRowClick={({ id }) =>
          go({
            to: `/resources/edit/${id}`,
          })
        }
        sx={{
          "& .MuiDataGrid-row": {
            cursor: "pointer",
          },
        }}
      />
    </>
  );
};
