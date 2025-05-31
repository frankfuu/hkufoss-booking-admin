import { useLogout, type DataProvider, type HttpError } from "@refinedev/core";
import { k } from "../common/constants";
import { fetchWithRefresh } from "../common/fetch-with-refresh";
import { authProvider } from "../authProvider";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const handleError = async (response: Response) => {
  console.log(`handling error......`);

  // refine's dataprovider requires you to return it this format
  const errorBody = await response.json();
  const error: HttpError = {
    message: errorBody?.message ?? response.statusText,
    statusCode: response.status,
  };
  throw error;
};

export const myDataProvider: DataProvider = {
  getList: async ({ resource, pagination, filters, sorters, meta }) => {
    const params = new URLSearchParams();

    // handle pagination
    if (pagination) {
      params.append("page", pagination.current?.toString() || "1");
      params.append("limit", (pagination.pageSize || 100).toString());
    }

    // handle sorters
    if (sorters && sorters.length > 0) {
      sorters.forEach((sorter, index) => {
        params.append(`sorters[${index}][field]`, sorter.field);
        params.append(`sorters[${index}][order]`, sorter.order);
      });
    }

    // handle filters
    if (filters && filters.length > 0) {
      filters.forEach((filter, index) => {
        if ("field" in filter) {
          params.append(`filters[${index}][field]`, filter.field);
          params.append(`filters[${index}][value]`, filter.value);
          if (filter.operator === "eq") {
            params.append(`filters[${index}][operator]`, "equals");
          } else if (filter.operator === "ne") {
            params.append(`filters[${index}][operator]`, "not");
          } else if (filter.operator === "startswith") {
            params.append(`filters[${index}][operator]`, "startsWith");
          } else if (filter.operator === "endswith") {
            params.append(`filters[${index}][operator]`, "endsWith");
          } else if (filter.operator === "contains") {
            const isJson = filter.field == "payload" || filter.field == "jsonData";
            params.append(`filters[${index}][operator]`, isJson ? "string_contains" : "contains");
          } else {
            params.append(`filters[${index}][operator]`, filter.operator || "equals");
          }
        }
      });
    }

    let resourceName = resource;
    if (meta?.resourceOverride) {
      resourceName = meta.resourceOverride;
    }

    const url = `${API_URL}/${resourceName}?${params.toString()}`;

    try {
      const response = await fetchWithRefresh(url);
      if (response.status < 200 || response.status > 299) return handleError(response);
      const data = await response.json();
      return {
        data: data.entities || data,
        total: data?.meta?.totalCount,
      };
    } catch (error) {
      throw error;
    }
  },
  getMany: async ({ resource, ids, meta }) => {
    const params = new URLSearchParams();
    params.append("page", "1");
    params.append("limit", k.GET_MANY_DEFAULT.toString());
    params.append(`filters[0][field]`, "id");
    params.append(`filters[0][value]`, `[${ids.toString()}]`);
    params.append(`filters[0][operator]`, "in");

    const url = `${API_URL}/${resource}?${params.toString()}`;

    try {
      const response = await fetchWithRefresh(url);
      if (response.status < 200 || response.status > 299) return handleError(response);
      const data = await response.json();
      return {
        data: data.entities || data,
        total: data?.meta?.totalCount,
      };
    } catch (error) {
      throw error;
    }
  },
  getOne: async ({ resource, id, meta }) => {
    const response = await fetchWithRefresh(`${API_URL}/${resource}/${id}`);
    if (response.status < 200 || response.status > 299) return handleError(response);
    const data = await response.json();
    return { data };
  },
  update: async ({ resource, id, variables }) => {
    const response = await fetchWithRefresh(`${API_URL}/${resource}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(variables),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status < 200 || response.status > 299) return handleError(response);
    const data = await response.json();
    return { data };
  },
  create: async ({ resource, variables }) => {
    const response = await fetchWithRefresh(`${API_URL}/${resource}`, {
      method: "POST",
      body: JSON.stringify(variables),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status < 200 || response.status > 299) return handleError(response);

    const data = await response.json();

    return { data };
  },
  getApiUrl: () => API_URL,
  deleteOne: async ({ resource, id, variables }) => {
    const response = await fetchWithRefresh(`${API_URL}/${resource}/${id}`, { method: "DELETE" });

    if (response.status < 200 || response.status > 299) return handleError(response);

    const data = response.status === 204 ? {} : await response.json();

    return { data };
  },
  custom: async ({ url, method, filters, sorters, payload, query, headers, meta }) => {
    const params = new URLSearchParams();

    // const urlFirst = `${API_URL}/${url}?${params.toString()}`;
    const urlFinal = `${API_URL}/${url}`;

    try {
      const response = await fetchWithRefresh(urlFinal, { method: method, body: JSON.stringify(payload) });
      if (response.status < 200 || response.status > 299) return handleError(response);
      const data = await response.json();
      return {
        data: data.entities || data,
        total: data?.meta?.totalCount,
      };
    } catch (error) {
      throw error;
    }
  },
};
