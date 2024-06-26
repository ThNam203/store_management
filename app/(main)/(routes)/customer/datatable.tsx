/* eslint-disable @next/next/no-img-element */
"use client";
import scrollbar_style from "@/styles/scrollbar.module.css";
import { Table as ReactTable, flexRender, Row } from "@tanstack/react-table";
import { Product } from "@/entities/Product";
import {
  customerColumnTitles,
  customerDefaultVisibilityState,
  customerTableColumns,
} from "./table_columns";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, Lock, PenLine, Trash, Undo2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import LoadingCircle from "@/components/ui/loading_circle";
import { axiosUIErrorHandler } from "@/services/axiosUtils";
import { useToast } from "@/components/ui/use-toast";
import { CustomDatatable } from "@/components/component/custom_datatable";
import InvoiceService from "@/services/invoiceService";
import { deleteInvoice } from "@/reducers/invoicesReducer";
import { Customer } from "@/entities/Customer";
import CustomerService from "@/services/customerService";
import UpdateCustomerDialog from "@/components/component/update_customer_dialog";
import { deleteCustomer } from "@/reducers/customersReducer";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

export function CustomerDatatable({ data }: { data: Customer[] }) {
  const { toast } = useToast();
  const router = useRouter();

  async function deleteCustomers(dataToDelete: Customer[]): Promise<void> {
    const promises = dataToDelete.map((customer) => {
      return CustomerService.deleteCustomer(customer.id);
    });

    try {
      Promise.allSettled(promises).then((deletedData) => {
        const successfullyDeleted = deletedData.map(
          (data) => data.status === "fulfilled",
        );
        toast({
          description: `Deleted ${
            successfullyDeleted.length
          } customers, failed ${
            deletedData.length - successfullyDeleted.length
          }`,
        });
        return Promise.resolve();
      });
    } catch (e) {
      axiosUIErrorHandler(e, toast, router);
      return Promise.reject();
    }
  }

  return (
    <CustomDatatable
      data={data}
      columns={customerTableColumns()}
      columnTitles={customerColumnTitles}
      infoTabs={[
        {
          render(row, setShowTabs) {
            return <DetailCustomerTab row={row} setShowTabs={setShowTabs} />;
          },
          tabName: "Detail",
        },
      ]}
      config={{
        onDeleteRowsBtnClick: (dataToDelete) => deleteCustomers(dataToDelete), // if null, remove button
        defaultVisibilityState: customerDefaultVisibilityState,
      }}
    />
  );
}

const DetailCustomerTab = ({
  row,
  setShowTabs,
}: {
  row: Row<Customer>;
  setShowTabs: (value: boolean) => any;
}) => {
  const customer = row.original;
  const staffs = useAppSelector((state) => state.staffs.activeStaffs);
  const [disableDeleteButton, setDisableDeleteButton] = useState(false);
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const router = useRouter();
  const roles = useAppSelector((state) => state.role.value);
  const profile = useAppSelector((state) => state.profile.value)!;
  const userPermissions = roles?.find(
    (role) => role.positionName === profile?.position,
  )!.roleSetting;

  return (
    <div className="py-2">
      <div className="flex flex-row gap-2">
        <div className="w-[300px] bg-contain bg-center">
          <img src={customer.image?.url ?? "/default-user-avatar.png"} />
        </div>
        <div className="flex flex-1 flex-row text-[0.8rem]">
          <div className="flex flex-1 flex-col gap-1 pr-4">
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[120px] font-normal">Customer id:</p>
              <p>{customer.id}</p>
            </div>
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[120px] font-normal">Customer name:</p>
              <p>{customer.name}</p>
            </div>
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[120px] font-normal">Date of birth:</p>
              {format(new Date(customer.birthday), "MM/dd/yyyy")}
            </div>
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[120px] font-normal">Email:</p>
              {customer.email}
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-1 pr-4">
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[120px] font-normal">Customer group:</p>
              <p>{customer.customerGroup}</p>
            </div>
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[120px] font-normal">Phone number</p>
              <p>{customer.phoneNumber}</p>
            </div>
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[120px] font-normal">Address</p>
              <p>{customer.address}</p>
            </div>
            {/* TODO: CHANGE CREATORID -> NAME */}
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[120px] font-normal">Creator</p>
              <p>
                {staffs.find((s) => s.id === customer.creatorId)?.name ??
                  "NOT FOUND"}
              </p>
            </div>
            <div>
              <p className="mb-2">Note</p>
              <textarea
                readOnly
                className={cn(
                  "h-[80px] w-full resize-none rounded-sm border-2 p-1",
                  scrollbar_style.scrollbar,
                )}
                defaultValue={customer.description}
              ></textarea>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center gap-2">
        <div className="flex-1" />
        {userPermissions.customer.update && <UpdateCustomerDialog
          DialogTrigger={
            <Button variant={"green"} disabled={disableDeleteButton}>
              <PenLine size={16} className="mr-2" />
              Update
              {disableDeleteButton ? <LoadingCircle /> : null}
            </Button>
          }
          customer={customer}
        />}
        {userPermissions.customer.delete && <Button
          variant={"red"}
          onClick={(e) => {
            setDisableDeleteButton(true);
            CustomerService.deleteCustomer(customer.id)
              .then((result) => {
                dispatch(deleteCustomer(customer.id));
                setShowTabs(false);
              })
              .catch((error) => axiosUIErrorHandler(error, toast, router))
              .finally(() => setDisableDeleteButton(false));
          }}
          disabled={disableDeleteButton}
        >
          <Trash size={16} className="mr-2" />
          Delete
          {disableDeleteButton ? <LoadingCircle /> : null}
        </Button>}
      </div>
    </div>
  );
};
