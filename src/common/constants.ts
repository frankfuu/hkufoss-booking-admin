const constants = {
  API_TOKEN_KEY: "api-access-token",
  API_REFRESH_KEY: "api-refresh-token",
  PERMISSIONS_KEY: "permissions",
  PROJECT_NAME: import.meta.env.VITE_PROJECT_NAME,
  DATE_FM_DEFAULT: "YYYY-MM-DD HH:mm",
  DATE_ONLY_FM_DEFAULT: "YYYY-MM-DD",
  TIME_ONLY_FM_DEFAULT: "HH:mm",
  TIME_ONLY_RETAIN_SECS_FM_DEFAULT: "HH:mm:00",
  DUMMY_DATE_ONLY_PREFIX: "2000-01-01",
  DROPDOWN_PAGE_SIZE_DEFAULT: 200,
  GET_MANY_DEFAULT: 250,
  MEMBER_LIST_MAX_SIZE: 10000,
  ROLES: {
    ADMIN: 1,
    STAFF: 2,
    STUDENT: 3,
  },
  TABS: {
    MEMBERS: {
      PROFILE: 0,
      SUBMISSIONS: 1,
      CENTRE_SERVICES: 2,
      CARE_PLAN: 3,
      SCREENING_TOOL: 4,
      MESSAGE_CENTRE: 5,
    },
    CR_MEMBER: {
      PROFILE: 0,
      SUBMISSIONS: 1,
      CENTRE_SERVICES: 2,
    },
  },
  COLORS: {
    // https://www.hku.hk/reserved4/f/page/8008/HKU_Brand_Guidelines.pdf
    HKU_GREEN: "#024638",
    HKU_PANTONE_346U_SEAGREEN: "#4ebd88",
    HKU_PANTONE_292U_LIGHTBLUE: "#4097db",
    HKU_PANTONE_YELLOW_U_YELLOW: "#ffe800",
    HKU_WARM_RED_U_2X: "#ff665e",
    HKU_WARM_RED_U_2X_ALT: "#dd3123",
  },
};

const dropdownOptions = {
  MEMBER: {
    CARD_STATUS: {
      DEFAULT: "ACTIVE",
      OPTIONS: [
        { label: "ACTIVE", value: "ACTIVE" },
        { label: "SUSPENDED", value: "SUSPENDED" },
        { label: "CANCELLED", value: "CANCELLED" },
      ],
    },
    CARD_TYPE: {
      DEFAULT: "STANDARD",
      OPTIONS: [
        { label: "STANDARD", value: "STANDARD" },
        { label: "LEGACY", value: "LEGACY" },
      ],
    },
  },
  RESERVATIONS: {
    STATUS: {
      DEFAULT: "PENDING",
      OPTIONS: [
        { label: "ATTENDED", value: "ATTENDED", apiAction: "complate" },
        { label: "CONFIRMED", value: "CONFIRMED", apiAction: "confirm" },
        { label: "PENDING", value: "PENDING", apiAction: null, notSelectable: true },
        { label: "CANCELLED", value: "CANCELLED", apiAction: "cancel" },
      ],
      LIST: {
        ATTENDED: "ATTENDED",
        CONFIRMED: "CONFIRMED",
        PENDING: "PENDING",
        CANCELLED: "CANCELLED",
      },
    },
  },
  BOOKINGS: {
    DURATION: {
      DEFAULT: 2,
      SEAT_DEFAULT: 1,
      OPTIONS: [
        { label: "1 hour", value: 1 },
        { label: "2 hours", value: 2 },
        { label: "3 hours", value: 3 },
        { label: "4 hours", value: 4 },
        { label: "5 hours", value: 5 },
      ],
    },
    STATUS: {
      DEFAULT: "PENDING",
      OPTIONS: [
        // { label: "ATTENDED", value: "ATTENDED", apiAction: "complate" },
        { label: "CONFIRMED", value: "CONFIRMED", apiAction: "confirm" },
        { label: "PENDING", value: "PENDING", apiAction: null, notSelectable: true },
        { label: "CANCELLED", value: "CANCELLED", apiAction: "cancel" },
      ],
      LIST: {
        ATTENDED: "ATTENDED",
        CONFIRMED: "CONFIRMED",
        PENDING: "PENDING",
        CANCELLED: "CANCELLED",
      },
    },
  },
  RESOURCES: {
    DEFAULTS: {
      ROOM_IMG: "/admin/fosslogo_1_mini.png",
    },
    TYPES: {
      DEFAULT: "Meeting Room",
      SUB_RESOURCE_DEFAULT: "Seat",
      OPTIONS: [
        { label: "Seat", value: "Seat" },
        { label: "Meeting Room", value: "Meeting Room" },
        { label: "Conference Room", value: "Conference Room" },
        { label: "Function Room", value: "Function Room" },
        { label: "Chamber", value: "Chamber" },
        { label: "Seminar Room", value: "Seminar Room" },
        { label: "Meeting Room", value: "Meeting Room" },
        { label: "Computer Lab", value: "Computer Lab" },
      ],
    },
  },
};

const styles = {
  hoverUnderlinePointer: {
    textDecoration: "none",
    cursor: "pointer",
    "&:hover": {
      textDecoration: "underline",
      textUnderlineOffset: "3px",
    },
  },
  underlinedLinkStyle: {
    color: "inherit",
    textDecoration: "underline",
    textUnderlineOffset: 4,
  },
};

const stylesheets = {
  formio: [
    "https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css",
    "https://cdn.form.io/formiojs/formio.full.min.css",
  ],
};

export const k = constants;
export const d = dropdownOptions;
export const s = styles;
export const ss = stylesheets;
