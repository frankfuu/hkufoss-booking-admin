import { Authenticated, I18nProvider, Refine, useNotification, usePermissions } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  ErrorComponent,
  RefineSnackbarProvider,
  SnackbarProvider,
  ThemedLayoutV2,
  useNotificationProvider,
} from "@refinedev/mui";

import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import dataProvider from "@refinedev/simple-rest";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { authProvider } from "./authProvider";
import { Header } from "./components/header";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { ForgotPassword } from "./pages/forgotPassword";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import FrankPage from "./pages/other/FooPage";
import FrankPageInner from "./pages/other/FooPageInner";
import { myDataProvider } from "./products/data-provider";
import { RolesList } from "./pages/roles/list";
import { UsersList } from "./pages/users/list";
import { UserShow } from "./pages/users/show";
import { UserEdit } from "./pages/users/edit";
import { UserCreate } from "./pages/users/create";
import { RoleShow } from "./pages/roles/show";
import { RoleEdit } from "./pages/roles/edit";
import { RoleCreate } from "./pages/roles/create";
import { MuiEditInferencer, MuiInferencer, MuiListInferencer, MuiShowInferencer } from "@refinedev/inferencer/mui";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { AirlineSeatReclineNormal, Cancel, CancelOutlined, Category, Error } from "@mui/icons-material";

import { DebugShow } from "./pages/other/debug-show";
import { UserOptionsProvider } from "./components/user-options-context";
import { Title } from "./components/title";
import { useTranslation } from "react-i18next";
import { Button, IconButton } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Provider, useSelector } from "react-redux";
import { store } from "./store/store";
import { startCase } from "lodash";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import { BookingCreate } from "./pages/bookings/create";
import { BookingsList } from "./pages/bookings/list";
import { ResourceListings } from "./pages/resources/list";
import { ResourceScheduleListings } from "./pages/resource-schedules/list";
import { ResourceExceptionListings } from "./pages/resource-exceptions/list";
import { ResourceAddonListings } from "./pages/resource-addons/list";
import { CourseListings } from "./pages/courses/list";
import { FunderListings } from "./pages/funders/list";
import { ActivityNatureListings } from "./pages/activity-natures/list";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BlockIcon from "@mui/icons-material/Block";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import StadiumIcon from "@mui/icons-material/Stadium";
import ElectricalServicesIcon from "@mui/icons-material/ElectricalServices";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import { FundersCreate } from "./pages/funders/create";
import { FundersEdit } from "./pages/funders/edit";

const customTitleHandler = ({ resource, action, params }: any) => {
  let title = "HKU FOSS Booking System";

  if (resource && action) {
    const resourceName = startCase(resource.name.toLowerCase());
    const actionName = startCase(action.toLowerCase());

    title = `${resourceName} ${actionName} ${params?.id ?? ""} - ` + title;
  }

  return title;
};

const AppContent = () => {
  const { t, i18n } = useTranslation();

  const i18nProvider: I18nProvider = {
    translate: (key: string, options?: any): string => String(t(key, options)),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  return (
    <Refine
      dataProvider={{
        default: myDataProvider,
        sampleRest: dataProvider("https://api.fake-rest.refine.dev"),
      }}
      notificationProvider={useNotificationProvider}
      routerProvider={routerBindings}
      authProvider={authProvider}
      i18nProvider={i18nProvider}
      resources={[
        {
          name: "bookingsParent",
          meta: {
            label: t("nav.bookings.title"),
            icon: <AccessTimeIcon />,
          },
        },
        {
          name: "system",
          meta: {
            label: t("nav.system.title"),
            icon: <SupervisorAccountIcon />,
          },
        },
        {
          name: "users",
          list: "/users",
          show: "/users/show/:id",
          edit: "/users/edit/:id",
          create: "/users/create",
          meta: {
            label: t("nav.system.users"),
            canDelete: false,
            icon: <SupervisorAccountIcon />,
            parent: "system",
          },
        },
        {
          name: "roles",
          list: "/roles",
          show: "/roles/show/:id",
          edit: "/roles/edit/:id",
          create: "/roles/create",
          meta: {
            label: t("nav.system.roles"),
            canDelete: false,
            icon: <AssignmentIndIcon />,
            parent: "system",
          },
        },
        {
          name: "bookings",
          list: "/bookings",
          show: "/bookings/show/:id",
          edit: "/bookings/edit/:id",
          create: "/bookings/create",
          meta: {
            label: t("nav.bookings.title"),
            canDelete: false,
            icon: <EventSeatIcon />,
            parent: "bookingsParent",
          },
        },
        {
          name: "resources",
          list: "/resources",
          meta: {
            label: t("nav.system.resources"),
            canDelete: false,
            icon: <MeetingRoomIcon />,
            parent: "system",
          },
        },
        {
          name: "resource-addons",
          list: "/resource-addons",
          meta: {
            label: t("nav.system.resource-addons"),
            canDelete: false,
            icon: <TableRestaurantIcon />,
            parent: "system",
          },
        },
        {
          name: "resource-schedules",
          list: "/resource-schedules",
          meta: {
            label: t("nav.bookings.resource-schedules"),
            canDelete: false,
            icon: <CalendarMonthIcon />,
            parent: "bookingsParent",
          },
        },
        {
          name: "resource-exceptions",
          list: "/resource-exceptions",
          meta: {
            label: t("nav.bookings.resource-exceptions"),
            canDelete: false,
            icon: <BlockIcon />,
            parent: "bookingsParent",
          },
        },
        {
          name: "funders",
          list: "/funders",
          create: "/funders/create",
          edit: "/funders/edit/:id",
          meta: {
            label: t("nav.system.funders"),
            canDelete: false,
            icon: <AccountBalanceIcon />,
            parent: "system",
          },
        },
        {
          name: "courses",
          list: "/courses",
          meta: {
            label: t("nav.system.courses"),
            canDelete: false,
            icon: <MenuBookIcon />,
            parent: "system",
          },
        },
        {
          name: "activity-natures",
          list: "/activity-natures",
          meta: {
            label: t("nav.system.activity-natures"),
            canDelete: false,
            icon: <StadiumIcon />,
            parent: "system",
          },
        },
        {
          name: "activity-types",
          list: "/activity-types",
          meta: {
            label: t("nav.system.activity-types"),
            canDelete: false,
            icon: <ElectricalServicesIcon />,
            parent: "system",
          },
        },
      ]}
      options={{
        // syncWithLocation: true,
        warnWhenUnsavedChanges: true,
        useNewQueryKeys: true,
        // projectId: "IimQSo-zDjSYp-IeQEwC",
        title: {
          icon: null,
          text: null,
        },
        reactQuery: {
          clientConfig: {
            defaultOptions: {
              queries: {
                retry: 3,
              },
            },
          },
        },
      }}
    >
      <Routes>
        <Route path="/foo">
          <Route index element={<FrankPage />} />
          <Route path="inner" element={<FrankPageInner />} />
        </Route>
        <Route
          element={
            <Authenticated key="xxx" fallback={<CatchAllNavigate to="/login" />}>
              {/* <CustomThemedLayout>
                <Outlet />
              </CustomThemedLayout> */}
              <ThemedLayoutV2 Header={Header} Title={Title}>
                <Outlet />
              </ThemedLayoutV2>
            </Authenticated>
          }
        >
          <Route index element={<NavigateToResource resource="bookings" />} />

          {/* <Route path="/forms/builder">
          <Route index element={<FormBuilderPage />} />
          <Route path="inner" element={<FrankPageInner />} />
        </Route> */}
          <Route path="/debug">
            <Route index element={<DebugShow />} />
            <Route path="inner" element={<FrankPageInner />} />
          </Route>

          <Route path="/roles">
            <Route index element={<RolesList />} />
            <Route path="show/:id" element={<RoleShow />} />
            <Route path="edit/:id" element={<RoleEdit />} />
            <Route path="create" element={<RoleCreate />} />
          </Route>
          <Route path="/users">
            <Route index element={<UsersList />} />
            <Route path="/users/show/:id" element={<UserShow />} />
            <Route path="/users/edit/:id" element={<UserEdit />} />
            <Route path="/users/create" element={<UserCreate />} />
          </Route>
          <Route path="/bookings">
            <Route index element={<BookingsList />} />
            <Route path="/bookings/create" element={<BookingCreate />} />
          </Route>
          <Route path="/resources">
            <Route index element={<ResourceListings />} />
          </Route>
          <Route path="/resource-schedules">
            <Route index element={<ResourceScheduleListings />} />
          </Route>
          <Route path="/resource-exceptions">
            <Route index element={<ResourceExceptionListings />} />
          </Route>
          <Route path="/resource-addons">
            <Route index element={<ResourceAddonListings />} />
          </Route>
          <Route path="/courses">
            <Route index element={<CourseListings />} />
          </Route>
          <Route path="/funders">
            <Route index element={<FunderListings />} />
            <Route path="/funders/create" element={<FundersCreate />} />
            <Route path="/funders/edit/:id" element={<FundersEdit />} />
          </Route>
          <Route path="/activity-natures">
            <Route index element={<ActivityNatureListings />} />
          </Route>
          <Route path="/activity-types">
            <Route index element={<ActivityNatureListings />} />
          </Route>
          <Route path="*" element={<ErrorComponent />} />
        </Route>
        <Route
          element={
            <Authenticated key="yyy" fallback={<Outlet />}>
              <NavigateToResource />
            </Authenticated>
          }
        >
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
        </Route>
      </Routes>

      <RefineKbar />
      <UnsavedChangesNotifier />
      <DocumentTitleHandler handler={customTitleHandler} />
    </Refine>
  );
};

function App() {
  const basePath = import.meta.env.VITE_BASE_PATH || "/";

  const snackbarRef = useRef<SnackbarProvider>(null);

  return (
    <Provider store={store}>
      <BrowserRouter basename={basePath}>
        <RefineKbarProvider>
          <ColorModeContextProvider>
            <UserOptionsProvider>
              <CssBaseline />
              <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
              <SnackbarProvider
                ref={snackbarRef}
                iconVariant={{
                  error: <Error sx={{ fontSize: "20px", marginRight: "8px" }} />,
                }}
                action={
                  <IconButton
                    onClick={() => {
                      snackbarRef.current?.closeSnackbar();
                    }}
                  >
                    <CancelOutlined sx={{ color: "white" }} fontSize="small" />
                  </IconButton>
                }
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <AppContent />
              </SnackbarProvider>
            </UserOptionsProvider>
          </ColorModeContextProvider>
        </RefineKbarProvider>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
