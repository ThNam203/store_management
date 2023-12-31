export type Role = {
  positionId: number;
  positionName: string;
  roleSetting: RoleSetting;
};

export type RoleSetting = {
  overview: R;
  catalog: CRUD & E;
  discount: CRUD;
  stockCheck: CR;
  invoice: CR;
  returnInvoice: CR;
  purchaseOrder: CRD;
  purchaseReturn: CRD;
  damageItems: CRD;
  fundLedger: CRUD & E;
  customer: CRUD;
  supplier: CRUD;
  report: R & E;
  staff: CRUD;
  attendance: CRUD;
};

export type CR = {
  create: boolean;
  read: boolean;
};

export type R = {
  read: boolean;
};

export type CRUD = {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
};

export type CRD = {
  create: boolean;
  read: boolean;
  delete: boolean;
};

export type E = {
  export: boolean;
};

export const RoleSettingName = {
  overview: "Overview",
  catalog: "Catalog",
  discount: "Discount",
  stockCheck: "Stock Check",
  invoice: "Invoice",
  returnInvoice: "Return Invoice",
  purchaseOrder: "Purchase Order",
  purchaseReturn: "Purchase Return",
  damageItems: "Damage Items",
  fundLedger: "Fund Ledger",
  customer: "Customer",
  supplier: "Supplier",
  report: "Report",
  staff: "Staff",
  attendance: "Attendance",
  create: "Create",
  read: "Read",
  update: "Update",
  delete: "Delete",
  export: "Export",
};

export const getRoleNameUI = (roleName: string) => {
  return RoleSettingName[roleName as keyof typeof RoleSettingName];
};
export const getRoleProp = (roleSetting: RoleSetting, roleKey: string) => {
  const value = roleSetting[roleKey as keyof typeof roleSetting];
  return value;
};

export const getRolePropValue = (
  roleSetting: RoleSetting,
  roleKey: string,
  prop: string,
) => {
  const role = getRoleProp(roleSetting, roleKey);
  const value = role[prop as keyof typeof role];
  return value;
};

export const isAllPropTrue = (roleSetting: RoleSetting, roleKey: string) => {
  const role = getRoleProp(roleSetting, roleKey);
  const keys = Object.keys(role);
  for (const key of keys) {
    const value = role[key as keyof typeof role];
    if (value === false) {
      return false;
    }
  }
  return true;
};

export const getRoleSettingKeys = (roleSetting: RoleSetting) => {
  return Object.keys(roleSetting);
};

export const defaultRoleSetting: RoleSetting = {
  overview: {
    read: false,
  },
  catalog: {
    create: false,
    read: false,
    update: false,
    delete: false,
    export: false,
  },
  discount: {
    create: false,
    read: false,
    update: false,
    delete: false,
  },
  stockCheck: {
    create: false,
    read: false,
  },
  invoice: {
    create: false,
    read: false,
  },
  returnInvoice: {
    create: false,
    read: false,
  },
  purchaseOrder: {
    create: false,
    read: false,
    delete: false,
  },
  purchaseReturn: {
    create: false,
    read: false,
    delete: false,
  },
  damageItems: {
    create: false,
    read: false,
    delete: false,
  },
  fundLedger: {
    create: false,
    read: false,
    update: false,
    delete: false,
    export: false,
  },
  customer: {
    create: false,
    read: false,
    update: false,
    delete: false,
  },
  supplier: {
    create: false,
    read: false,
    update: false,
    delete: false,
  },
  report: {
    read: false,
    export: false,
  },
  staff: {
    create: false,
    read: false,
    update: false,
    delete: false,
  },
  attendance: {
    create: false,
    read: false,
    update: false,
    delete: false,
  },
};
export const defaultRole: Role = {
  positionId: -1,
  positionName: "",
  roleSetting: defaultRoleSetting,
};
