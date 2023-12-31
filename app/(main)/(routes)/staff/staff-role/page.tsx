"use client";

import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { disablePreloader, showPreloader } from "@/reducers/preloaderReducer";
import { setStaffs } from "@/reducers/staffReducer";
import { axiosUIErrorHandler } from "@/services/axiosUtils";
import StaffService from "@/services/staff_service";
import { convertStaffReceived } from "@/utils/staffApiUtils";
import { useEffect, useState } from "react";

import CustomCombobox from "@/components/component/CustomCombobox";
import { Button } from "@/components/ui/button";
import LoadingCircle from "@/components/ui/loading_circle";
import {
  ConfirmDialogType,
  MyConfirmDialog,
} from "@/components/ui/my_confirm_dialog";
import { RoleSettingDialog } from "@/components/ui/staff/role_setting_dialog";
import { RoleList } from "@/components/ui/staff/role_setting_item";
import {
  Role,
  RoleSetting,
  defaultRole,
  defaultRoleSetting,
} from "@/entities/RoleSetting";
import { cn } from "@/lib/utils";
import { addRole, deleteRole, updateRole } from "@/reducers/roleReducer";
import RoleService from "@/services/role_service";
import {
  convertRoleReceived,
  convertRoleSettingToSent,
  convertRoleToSent,
} from "@/utils/roleSettingApiUtils";
import { Check, PenLine, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
const OptionView = (option: string): React.ReactNode => {
  return <p className="whitespace-nowrap text-xs">{option}</p>;
};

const OptionSearchView = (
  option: string,
  selectedOption: string | null,
): React.ReactNode => {
  const chosen = selectedOption && selectedOption === option;
  return (
    <div
      className={cn(
        "flex cursor-pointer items-center justify-between px-1",
        chosen ? "bg-green-100" : "",
      )}
    >
      <div>
        <p className="px-1 py-2 text-sm">{option}</p>
      </div>
      {chosen ? <Check size={16} color="green" /> : null}
    </div>
  );
};

export default function StaffRolePage() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      dispatch(showPreloader());
      try {
        const resStaff = await StaffService.getAllStaffs();
        dispatch(
          setStaffs(
            resStaff.data.filter((staff) => staff.position !== "Owner"),
          ),
        );
      } catch (e) {
        axiosUIErrorHandler(e, toast, router);
      } finally {
        dispatch(disablePreloader());
      }
    };
    fetchData();
  }, []);

  const roleList = useAppSelector((state) => state.role.value).filter(
    (role) => role.positionName !== "Owner",
  );
  const roleNames = roleList.map((role) => role.positionName);

  const [isUpdating, setIsUpdating] = useState(false);
  const [openRoleSettingDialog, setOpenRoleSettingDialog] = useState(false);
  const [selectedData, setSelectedData] = useState<Role>(
    roleList.length > 0 ? roleList[0] : defaultRole,
  );
  const [titleRoleSettingDialog, setTitleRoleSettingDialog] = useState("");
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [contentConfirmDialog, setContentConfirmDialog] = useState({
    title: "",
    content: "",
    type: "warning" as ConfirmDialogType,
  });

  const handleOpenAddRoleDialog = () => {
    setTitleRoleSettingDialog("Add new role");
    setOpenRoleSettingDialog(true);
  };

  const handleRoleSettingChange = (value: RoleSetting) => {
    setSelectedData((prev) => ({ ...prev!, roleSetting: value }));
  };

  const handleRoleChange = (value: string) => {
    const selectedRole = roleList.find((role) => role.positionName === value);
    if (selectedRole && selectedData.positionName !== value)
      setSelectedData(selectedRole);
    else setSelectedData(defaultRole);
  };

  const updateRoleSetting = async (positionId: number, value: RoleSetting) => {
    try {
      setIsUpdating(true);
      const convertedRoleToSent = convertRoleSettingToSent(value);
      const res = await RoleService.saveRoleSetting(
        positionId,
        convertedRoleToSent,
      );
      dispatch(updateRole(res.data));
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast, router);
      return Promise.reject(e);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateRole = (positionId: number, value: RoleSetting) => {
    return updateRoleSetting(positionId, value).then(() => {
      toast({
        variant: "default",
        title: "Update role successfully",
      });
    });
  };

  const addNewRole = async (value: Role) => {
    try {
      const convertedRoleToSent = convertRoleToSent(value);
      const res = await RoleService.addNewRole(convertedRoleToSent);
      dispatch(addRole(res.data));

      const convertedRoleReceived = convertRoleReceived(res.data);
      setSelectedData(convertedRoleReceived);
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast, router);
      return Promise.reject(e);
    } finally {
    }
  };
  const handleRoleSubmit = (values: Role) => {
    return addNewRole(values);
  };

  const removeRole = async (positionId: number) => {
    try {
      setIsRemoving(true);
      await RoleService.deleteRole(positionId);
      dispatch(deleteRole(positionId));
      setSelectedData(defaultRole);
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast, router);
      return Promise.reject(e);
    } finally {
      setIsRemoving(false);
    }
  };

  const handleRemoveRole = (positionId: number) => {
    return removeRole(positionId).then(() => {
      toast({
        variant: "default",
        title: "Remove role successfully",
      });
    });
  };

  const handleCancelClick = () => {
    const resetCurrentRole = roleList.find(
      (role) => role.positionId === selectedData.positionId,
    );
    if (resetCurrentRole) setSelectedData(resetCurrentRole);
    else setSelectedData(defaultRole);
  };

  return (
    <div className={cn("w-full flex-1 flex-col rounded-sm bg-white px-4 py-2")}>
      <h2 className="my-4 flex-1 text-start text-2xl font-bold">
        Role setting
      </h2>
      <div className="w-full">
        <div className="flex w-full flex-col gap-4">
          <div className="flex flex-row items-center justify-between gap-2">
            <div className="flex w-[350px] flex-row items-center gap-2">
              <div className="w-[100px]">
                <p className="text-sm">Role</p>
              </div>
              <div className="flex-1">
                <CustomCombobox<string>
                  placeholder="Select role"
                  searchPlaceholder={"Find role..."}
                  value={selectedData.positionName}
                  choices={roleNames}
                  valueView={OptionView}
                  itemSearchView={(choice) =>
                    OptionSearchView(choice, selectedData.positionName)
                  }
                  onItemClick={(val) => handleRoleChange(val)}
                />
              </div>
            </div>
            <Button
              variant={"green"}
              type="button"
              onClick={() => handleOpenAddRoleDialog()}
            >
              <span className="whitespace-nowrap max-sm:hidden">
                Add new role
              </span>
              <span className="whitespace-nowrap sm:hidden">+ Role</span>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {
              <RoleList
                roleSetting={selectedData?.roleSetting || defaultRoleSetting}
                onChange={handleRoleSettingChange}
              />
            }
          </div>
        </div>
      </div>
      <div
        className={cn(
          "flex flex-row items-center justify-end gap-2",
          selectedData.positionId !== -1 ? "" : "hidden",
        )}
      >
        <Button
          variant={"red"}
          type="button"
          className={cn(selectedData.positionId !== -1 ? "" : "hidden")}
          onClick={() => {
            setContentConfirmDialog({
              title: "Remove staff",
              content: `Are you sure you want to remove this role ?`,
              type: "warning",
            });
            setOpenConfirmDialog(true);
          }}
        >
          <Trash size={16} className="mr-2" />
          Remove
          {isRemoving && <LoadingCircle></LoadingCircle>}
        </Button>
        <Button
          type="button"
          variant={"green"}
          disabled={isUpdating}
          onClick={() =>
            handleUpdateRole(selectedData.positionId, selectedData.roleSetting)
          }
        >
          <PenLine size={16} fill="white" className="mr-2" />
          Update
          {isUpdating && <LoadingCircle />}
        </Button>
        <Button
          variant={"outline"}
          type="button"
          onClick={() => handleCancelClick()}
        >
          Cancel
        </Button>
      </div>
      <MyConfirmDialog
        open={openConfirmDialog}
        setOpen={setOpenConfirmDialog}
        title={contentConfirmDialog.title}
        content={contentConfirmDialog.content}
        type={contentConfirmDialog.type}
        onAccept={async () => {
          setOpenConfirmDialog(false);

          try {
            await handleRemoveRole(selectedData.positionId);
          } catch (e) {
            axiosUIErrorHandler(e, toast, router);
          }
        }}
        onCancel={() => setOpenConfirmDialog(false)}
      />
      <RoleSettingDialog
        open={openRoleSettingDialog}
        setOpen={setOpenRoleSettingDialog}
        role={defaultRole}
        title={titleRoleSettingDialog}
        submit={handleRoleSubmit}
      />
    </div>
  );
}
