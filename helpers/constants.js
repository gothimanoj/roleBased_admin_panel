module.exports = {
  RESPONSE_OK: 200,
  RESPONSE_CREATED: 201,
  RESPONSE_UPDATED: 206,
  RESPONSE_DELETED: 204,
  RESPONSE_BAD_REQUEST: 400,
  RESPONSE_UNAUTHORIZED: 401,
  RESPONSE_FORBIDDEN: 403,
  RESPONSE_NOT_FOUND: 404,
  RESPONSE_SERVER_ERROR: 500,

  MEDIA_TYPES: ["image", "document", "sheet", "pdf"],
  ROLES: ["Admin", "Agency", "Client", "Developer"],

  PROJECT_STATUS: [
    "Posted",
    "Short Listed",
    "Quotation Requested",
    "Quotation Accepted",
    "In Progress",
    "Done",
    "Closed",
    "Cancelled",
  ],
  PROJECT_TYPE: ["Full Term", "Short Term"],
  PROJECT_PAYMENT_MODEL: ["Fixed Price", "By Hour"],

  NOTIFICATION_TYPE: ["email", "phone", "push"],

  DEVELOPER_BILLING_MODE: ["Weekly", "Monthly"],

  WEEKDAYS: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
};
