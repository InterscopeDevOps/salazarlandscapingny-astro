export interface MenuItem {
  subServices?: {
    label: string;
    url: string;
  }[] | undefined;
  label: string;
  url: string;
  subItem?: boolean;
}