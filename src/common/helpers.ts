// export function extractMappings(components: any) {
//   let mappings: any[] = [];

//   components.forEach(
//     (component: { components: any; type: string; properties: { db_map_table: any; db_map_field: any }; key: any }) => {
//       if (component.components) {
//         mappings = mappings.concat(extractMappings(component.components));
//       } else if (
//         (component.type === "textfield" || component.type === "number") &&
//         component.properties.db_map_table &&
//         component.properties.db_map_fiel
//       ) {
//         mappings.push({
//           key: component.key,
//           db_map_table: component.properties.db_map_table,
//           db_map_field: component.properties.db_map_field,
//         });
//       }
//     }
//   );

//   return mappings;
// }

// helpers/navigation.ts

import { useGo, useNotification } from "@refinedev/core";
import { useTranslation } from "react-i18next";
import { d } from "./constants";

type ResourceClickParams = {
  resource: string;
  action: "create" | "edit" | "list" | "show" | "clone";
  id?: string | number;
  query?: any;
};

export const useResourceNavigation = () => {
  const go = useGo();

  const handleNavigation = ({ resource, action, id, query }: ResourceClickParams) => {
    go({
      // @ts-ignore,
      to: {
        resource,
        action,
        id,
      },
      query,
    });
  };

  return handleNavigation;
};

export const defaultMutationOptions = () => {
  const { open } = useNotification();
  const { t } = useTranslation();

  return {
    onError: (error: any, variables: any, context: any) => {
      if (error) {
        if (error?.message && Array.isArray(error.message)) {
          for (const e of error.message) {
            if (e.field === "centreId") {
              open?.({ message: "", type: "error", description: t("CENTRE_ID_ERROR") });
            } else {
              open?.({ message: e.field, type: "error", description: e.error });
            }
          }
        } else if (error?.message && typeof error.message === "string") {
          open?.({ message: t(error.message), type: "error" });
        }
      }
    },
  };
};

export const getChipProps = (status: string) => {
  if (status == d.BOOKINGS.STATUS.LIST.CONFIRMED) {
    return {
      color: "success" as "success",
      variant: "filled" as "filled",
    };
  }

  if (status == d.BOOKINGS.STATUS.LIST.PENDING) {
    return {
      color: "warning" as "warning",
      variant: "filled" as "filled",
    };
  }

  if (status == d.BOOKINGS.STATUS.LIST.ATTENDED) {
    return {
      color: "success" as "success",
      variant: "filled" as "filled",
    };
  }

  if (status == d.BOOKINGS.STATUS.LIST.CANCELLED) {
    return {
      color: "error" as "error",
      variant: "filled" as "filled",
    };
  }

  return {
    color: "default" as "default",
  };
};
