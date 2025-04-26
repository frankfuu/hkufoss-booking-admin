import { useInfiniteList } from "@refinedev/core";
import { Autocomplete, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { filter } from "lodash";

const InfiniteScrollAutocompleteAlt = ({ resourceName, filterField, filterOperator, displayField1, displayField2 }: any) => {
  // const [searchTerm, setSearchTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useInfiniteList({
    resource: resourceName,
    pagination: { pageSize: 10 },
    filters: searchTerm
      ? [
          {
            field: filterField,
            operator: filterOperator ?? "contains",
            value: searchTerm,
          },
        ]
      : [],
  });

  useEffect(() => {
    refetch();
  }, [searchTerm, refetch]);

  const options = data?.pages.flatMap((page) => page.data) ?? [];
  return (
    <Autocomplete
      sx={{ my: 1 }}
      options={options}
      getOptionLabel={(option) => `${option[filterField]}`}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          {/* {option.subject} - {option.action} */}
          {/* {option.id} */}
          ID: {option.id}, {displayField1}: {option[displayField1]}, {displayField2}: {option[displayField2]}
        </li>
      )}
      renderInput={(params) => <TextField {...params} label={resourceName} onChange={(e) => setSearchTerm(e.target.value)} />}
      ListboxProps={{
        onScroll: (event) => {
          const listboxNode = event.currentTarget;
          if (listboxNode.scrollTop + listboxNode.clientHeight >= listboxNode.scrollHeight - 10) {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }
        },
      }}
    />
  );
};
export default InfiniteScrollAutocompleteAlt;
