"use client";
import {
  CustomDatatable,
  DefaultInformationCellDataTable,
} from "@/components/component/custom_datatable";
import { Button } from "@/components/ui/button";
import LoadingCircle from "@/components/ui/loading_circle";
import { useToast } from "@/components/ui/use-toast";
import {
  PurchaseReturn
} from "@/entities/PurchaseReturn";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { cn } from "@/lib/utils";
import { deletePurchaseReturn } from "@/reducers/purchaseReturnsReducer";
import { axiosUIErrorHandler } from "@/services/axiosUtils";
import PurchaseReturnService from "@/services/purchaseReturnService";
import scrollbar_style from "@/styles/scrollbar.module.css";
import { Row } from "@tanstack/react-table";
import { format } from "date-fns";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  purchaseReturnColumnTitles,
  purchaseReturnColumns,
  purchaseReturnDetailColumnTitles,
  purchaseReturnDetailTableColumns,
} from "./table_columns";

const visibilityState = {
  creatorId: false,
  createdDate: false,
};

export function PurchaseReturnDatatable({ data }: { data: PurchaseReturn[] }) {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const router = useRouter();
  async function deletePurchaseOrders(
    dataToDelete: PurchaseReturn[],
  ): Promise<void> {
    const promises = dataToDelete.map((purchaseReturn) => {
      return PurchaseReturnService.deletePurchaseReturn(purchaseReturn.id).then(
        (_) => dispatch(deletePurchaseReturn(purchaseReturn.id)),
      );
    });

    try {
      Promise.allSettled(promises).then((deletedData) => {
        const successfullyDeleted = deletedData.map(
          (data) => data.status === "fulfilled",
        );
        toast({
          description: `Deleted ${
            successfullyDeleted.length
          } purchase returns, failed ${
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
      columns={purchaseReturnColumns()}
      columnTitles={purchaseReturnColumnTitles}
      infoTabs={[
        {
          render: (row, setShowTabs) => {
            return (
              <DetailTab
                row={row}
                onUpdateButtonClick={() => {}}
                setShowInfoRow={setShowTabs}
              />
            );
          },
          tabName: "Detail",
        },
      ]}
      config={{
        defaultVisibilityState: visibilityState,
        onDeleteRowsBtnClick: deletePurchaseOrders,
      }}
    />
  );
}

const DetailTab = ({
  row,
  onUpdateButtonClick,
  setShowInfoRow,
}: {
  row: Row<PurchaseReturn>;
  onUpdateButtonClick: (discountPosition: number) => any;
  setShowInfoRow: (value: boolean) => any;
}) => {
  const purchaseReturn: PurchaseReturn = row.original;
  const [disableDisableButton, setDisableDisableButton] = useState(false);
  const [disableDeleteButton, setDisableDeleteButton] = useState(false);
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const router = useRouter();
  const staffs = useAppSelector((state) => state.staffs.value);
  const suppliers = useAppSelector((state) => state.suppliers.value);
  const roles = useAppSelector((state) => state.role.value);
  const profile = useAppSelector((state) => state.profile.value)!;
  const userPermissions = roles?.find(
    (role) => role.positionName === profile?.position,
  )!.roleSetting;

  return (
    <div className="p-2">
      <div className="flex flex-row gap-4">
        <div className="flex flex-1 flex-row gap-4 text-[0.8rem]">
          <div className="flex flex-1 flex-col gap-2">
            <DefaultInformationCellDataTable
              title="Purchase Return Id:"
              value={purchaseReturn.id}
            />
            <DefaultInformationCellDataTable
              title="Created Date:"
              value={format(new Date(purchaseReturn.createdDate), "MM/dd/yyyy")}
            />
            <DefaultInformationCellDataTable
              title="Creator:"
              value={staffs.find((v) => v.id === purchaseReturn.staffId)?.name ?? "Not found"}
            />
            <DefaultInformationCellDataTable
              title="Supplier:"
              value={suppliers.find((v) => v.id === purchaseReturn.supplierId)?.name ?? "Not found"}
            />
          </div>
          <div className="flex flex-1 flex-col">
            <p className="mb-2">Note</p>
            <textarea
              readOnly
              className={cn(
                "h-[80px] w-full resize-none rounded-sm border-2 p-1",
                scrollbar_style.scrollbar,
              )}
              defaultValue={purchaseReturn.note}
            ></textarea>
          </div>
        </div>
      </div>
      <CustomDatatable
        data={purchaseReturn.purchaseReturnDetails}
        columnTitles={purchaseReturnDetailColumnTitles}
        columns={purchaseReturnDetailTableColumns()}
        config={{
          showDataTableViewOptions: false,
          showDefaultSearchInput: false,
          className: "py-0",
          showRowSelectedCounter: false,
        }}
      />
      <div className="flex flex-row justify-between">
        <div className="flex-1"></div>
        <div className="mb-2 flex flex-col gap-1 text-xs">
          <div className="flex flex-row">
            <p className="w-48 text-end">Total qty:</p>
            <p className="w-32 text-end font-semibold">
              {purchaseReturn.purchaseReturnDetails
                .map((v) => v.quantity)
                .reduce((a, b) => a + b, 0)}
            </p>
          </div>
          <div className="flex flex-row">
            <p className="w-48 text-end">Total product:</p>
            <p className="w-32 text-end font-semibold">
              {purchaseReturn.purchaseReturnDetails.length}
            </p>
          </div>
          <div className="flex flex-row">
            <p className="w-48 text-end">Sub-total:</p>
            <p className="w-32 text-end font-semibold">
              {purchaseReturn.subtotal}
            </p>
          </div>
          <div className="flex flex-row">
            <p className="w-48 text-end">Discount:</p>
            <p className="w-32 text-end font-semibold">
              {purchaseReturn.discount}
            </p>
          </div>
          <div className="flex flex-row">
            <p className="w-48 text-end">Total:</p>
            <p className="w-32 text-end font-semibold">{purchaseReturn.total}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center gap-2">
        <div className="flex-1" />
        {/* <Button
          variant={"green"}
          disabled={disableDeleteButton || disableDisableButton}
          onClick={() => onUpdateButtonClick(row.index)}
        >
          <PenLine size={16} fill="white" className="mr-2" />
          Update
        </Button> */}
        {userPermissions.purchaseReturn.delete && <Button
          variant={"red"}
          onClick={(e) => {
            setDisableDeleteButton(true);
            PurchaseReturnService.deletePurchaseReturn(purchaseReturn.id)
              .then((result) => {
                dispatch(deletePurchaseReturn(purchaseReturn.id));
                setShowInfoRow(false);
              })
              .catch((error) => axiosUIErrorHandler(error, toast, router))
              .finally(() => setDisableDeleteButton(false));
          }}
          disabled={disableDeleteButton || disableDisableButton}
        >
          <Trash size={16} className="mr-2" />
          Delete
          {disableDeleteButton ? <LoadingCircle /> : null}
        </Button>}
      </div>
    </div>
  );
};
