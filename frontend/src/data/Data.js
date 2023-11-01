export const sidebarItems = [
  { id: 1, name: "home", icon: "HomeIcon", path: "/", adminAccessOnly: false },
  {
    id: 2,
    name: "insights",
    icon: "InsightsIcon",
    path: "/insights",
    adminAccessOnly: true,
  },
  {
    id: 3,
    name: "reports",
    icon: "ReportIcon",
    path: "/reports",
    adminAccessOnly: true,
  },
  {
    id: 4,
    name: "add customer",
    icon: "PersonAddIcon",
    path: "/add-customer",
    adminAccessOnly: true,
  },
  {
    id: 5,
    name: "existing customer",
    icon: "AddIcon",
    path: "/add-existing-customer",
    adminAccessOnly: true,
  },
  {
    id: 6,
    name: "manage users",
    icon: "ManageAccountsIcon",
    path: "/manage-users",
    adminAccessOnly: true,
  },
  {
    id: 7,
    name: "SMS gateway",
    icon: "SMSIcon",
    path: "/sms-gateway",
    adminAccessOnly: true,
  },
  {
    id: 8,
    name: "account settings",
    icon: "SettingsIcon",
    path: "/account-settings",
    adminAccessOnly: false,
  },

  {
    id: 9,
    name: "settled loans",
    icon: "SetteledLoanIcon",
    path: "/settled-loans",
    adminAccessOnly: true,
  },
];
