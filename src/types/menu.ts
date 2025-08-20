export type MenuItemJSON = {
  url?: string;
  icon?: string;
  image?: string;
  submenu?: Record<string, MenuItemJSON>;
};

export type MenuJSON = Record<string, MenuItemJSON>;
