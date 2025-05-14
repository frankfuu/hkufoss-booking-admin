const constants = {
  API_TOKEN_KEY: "api-access-token",
  API_REFRESH_KEY: "api-refresh-token",
  PERMISSIONS_KEY: "permissions",
  PROJECT_NAME: import.meta.env.VITE_PROJECT_NAME,
  DATE_FM_DEFAULT: "YYYY-MM-DD HH:mm",
  DROPDOWN_PAGE_SIZE_DEFAULT: 200,
  GET_MANY_DEFAULT: 250,
  MEMBER_LIST_MAX_SIZE: 10000,
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
  CENTRE: {
    CENTRE_TYPE: {
      DEFAULT: "CARER_SPACE",
      OPTIONS: [
        { label: "CARER_SPACE", value: "CARER_SPACE" },
        { label: "SERVICE_POINT", value: "SERVICE_POINT" },
        { label: "SHARED_VENUE", value: "SHARED_VENUE" },
      ],
    },
  },
  CHECKIN: {
    CHECKIN_METHOD: {
      DEFAULT: "MEMBER_CARD",
      OPTIONS: [
        { label: "MEMBER_CARD", value: "MEMBER_CARD" },
        { label: "NAME_CHINESE", value: "NAME_CHINESE" },
        { label: "NAME_ENGLISH", value: "NAME_ENGLISH" },
        { label: "PHONE", value: "PHONE" },
        { label: "MANUAL", value: "MANUAL" },
      ],
    },
    CHECKIN_TYPE: {
      DEFAULT: "ENTRY",
      OPTIONS: [
        { label: "ENTRY", value: "ENTRY" },
        { label: "EXIT", value: "EXIT" },
      ],
    },
  },
  SERVICE: {
    MEMBER_TYPE: {
      DEFAULT: "ALL",
      OPTIONS: [
        { label: "ALL", value: "ALL" },
        { label: "CARE_RECEIVER", value: "CARE_RECEIVER" },
        { label: "CARE_GIVER", value: "CARE_GIVER" },
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
