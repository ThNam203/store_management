export type Customer = {
  id: any;
  name: string;
  customerType: CustomerType;
  customerGroup: string;
  phoneNumber: string;
  address: string;
  sex: Sex;
  email: string;
  birthday: Date;
  creator: string;
  createdDate: Date;
  company: string;
  taxId: string;
  note: string;
  lastTransaction: Date;
  debt: number;
  sale: number;
  finalSale: number;
  status: Status;
};

export type CustomerGroup = {
  id: any;
  name: string;
  createdDate: string;
};

export enum CustomerType {
  SINGLE = "Single",
  COMPANY = "Company",
}
export enum Status {
  WORKING = "Working",
  NOT_WORKING = "Not Working",
}
export enum Sex {
  MALE = "Male",
  FEMALE = "Female",
}
