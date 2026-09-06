import type { Sectionkey } from "../types/section";
export interface NavItem {
  label: string;
  path?: string;
  children?: NavItem[];
}

export interface NavSection {
  key: string;
  section: string;
  items: NavItem[];
}

const sideBarConfig: {key: Sectionkey, section: string, items:{label: string, path?: string}[]}[] = [
  {
    section: "Primary",
    key: "dashboard",
    items: [
      {
        label: "Dashboard",
        path: "/dashboard",
      },
    ],
  },
  {
    section: "Clinical",
    key: "clinical",
    items: [
      { label: "Patients", path: "/dashboard/patients" },
      { label: "Images", path: "/dashboard/images" },
      { label: "Appointments", path: "/dashboard/appointments" },
      { label: "Surgeries", path: "/dashboard/surgeries" },
    ],
  },
  {
    section: "Administration",
    key: "administration",
    items: [
      { label: "Staffs", path: "/dashboard/staffs" },
      { label: "Reports", path: "/dashboard/reports" },
      { label: "Settings", path: "/dashboard/settings" },
    ],
  },
];

export default sideBarConfig;
