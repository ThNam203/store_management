"use client";

import { Button } from "@/components/ui/button";
import { FilterDay, FilterMonth, FilterWeek } from "@/components/ui/filter";
import LoadingCircle from "@/components/ui/loading_circle";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { DailyShift, Shift } from "@/entities/Attendance";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { cn } from "@/lib/utils";
import { disablePreloader, showPreloader } from "@/reducers/preloaderReducer";
import {
  addDailyShifts,
  addShift,
  deleteDailyShifts,
  deleteShift,
  setShifts,
  updateDailyShifts,
  updateShift,
} from "@/reducers/shiftReducer";
import { setRewards } from "@/reducers/shiftRewardReducer";
import { setViolations } from "@/reducers/shiftViolationReducer";
import { setStaffs } from "@/reducers/staffReducer";
import { axiosUIErrorHandler } from "@/services/axiosUtils";
import ShiftService from "@/services/shift_service";
import StaffService from "@/services/staff_service";
import { getStaticRangeFilterTime } from "@/utils";
import {
  convertDailyShiftToSent,
  convertShiftToSent,
} from "@/utils/shiftApiUtils";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ButtonGroup } from "../../../../../components/ui/attendance/button_group";
import { MyDateRangePicker } from "../../../../../components/ui/attendance/my_date_range_picker";
import { SetTimeDialog } from "../../../../../components/ui/attendance/set_time_dialog";
import { DisplayType, Table } from "./attendance_table";

export default function Attendance() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      dispatch(showPreloader());
      try {
        const resShift = await ShiftService.getShiftsThisMonth();
        dispatch(setShifts(resShift.data));

        const resStaff = await StaffService.getAllStaffs();
        dispatch(
          setStaffs(
            resStaff.data.filter((staff) => staff.position !== "Owner"),
          ),
        );

        const resViolationAndReward =
          await ShiftService.getViolationAndRewardList();
        const violations = resViolationAndReward.data.filter(
          (item) => item.type === "Punish",
        );
        const rewards = resViolationAndReward.data.filter(
          (item) => item.type === "Bonus",
        );
        dispatch(setViolations(violations));
        dispatch(setRewards(rewards));
      } catch (e) {
        axiosUIErrorHandler(e, toast, router);
      } finally {
        dispatch(disablePreloader());
      }
    };
    fetchData();
  }, []);

  const profile = useAppSelector((state) => state.profile.value);
  const attendanceRoleSetting = useAppSelector(
    (state) => state.role.value,
  ).find((role) => role.positionName === profile?.position)?.roleSetting
    .attendance;
  let canCreateAttendance = false;
  let canUpdateAttendance = false;
  let canDeleteAttendance = false;
  if (attendanceRoleSetting) {
    canCreateAttendance = attendanceRoleSetting.create;
    canUpdateAttendance = attendanceRoleSetting.update;
    canDeleteAttendance = attendanceRoleSetting.delete;
  }

  console.log("attendanceRoleSetting", attendanceRoleSetting);

  const [range, setRange] = useState<{ startDate: Date; endDate: Date }>(
    getStaticRangeFilterTime(FilterWeek.ThisWeek),
  );
  const [displayType, setDisplayType] = useState<DisplayType>("Week");
  const [openSetTimeDialog, setOpenSetTimeDialog] = useState(false);

  const table = useAppSelector((state) => state.shift.value);
  const staffList = useAppSelector((state) => state.staffs.activeStaffs);
  const [isLoading, setIsLoading] = useState(false);

  const getShiftsByRange = async (range: {
    startDate: Date;
    endDate: Date;
  }) => {
    setIsLoading(true);
    try {
      const resShiftList = await ShiftService.getShiftsByRange(range);
      dispatch(setShifts(resShiftList.data));
    } catch (e) {
      axiosUIErrorHandler(e, toast, router);
      return Promise.reject();
    } finally {
      setIsLoading(false);
    }
  };
  const getShiftsThisMonth = async () => {
    try {
      const resShiftList = await ShiftService.getShiftsThisMonth();
      dispatch(setShifts(resShiftList.data));
    } catch (e) {
      axiosUIErrorHandler(e, toast, router);
      return Promise.reject();
    } finally {
      setIsLoading(false);
    }
  };

  const handleRangeTimeFilterChange = (range: {
    startDate: Date;
    endDate: Date;
  }) => {
    setRange(range);
    setDisplayType("Custom");
    getShiftsByRange(range);
  };
  const handleStaticRangeFilterChange = (value: string) => {
    if (value === "Day") setRange(getStaticRangeFilterTime(FilterDay.Today));
    else if (value === "Week")
      setRange(getStaticRangeFilterTime(FilterWeek.ThisWeek));
    else setRange(getStaticRangeFilterTime(FilterMonth.ThisMonth));
    if (displayType === "Custom") getShiftsThisMonth();
    setDisplayType(value as DisplayType);
  };
  const AddShift = async (shift: Shift) => {
    try {
      const newShift = convertShiftToSent(shift);
      const res = await ShiftService.createShift(newShift);
      dispatch(addShift(res.data));
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast, router);
      return Promise.reject();
    }
  };
  const UpdateShift = async (id: any, shift: Shift) => {
    try {
      const newShift = convertShiftToSent(shift);
      console.log("to update shift", newShift);
      const res = await ShiftService.updateShift(id, newShift);
      dispatch(updateShift(res.data));
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast, router);
      return Promise.reject();
    }
  };

  const AddDailyShifts = async (dailyShiftList: DailyShift[]) => {
    try {
      const newDailyShiftList = dailyShiftList.map((dailyShift) =>
        convertDailyShiftToSent(dailyShift),
      );
      const res = await ShiftService.createDailyShifts(newDailyShiftList);
      dispatch(addDailyShifts(res.data));
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast, router);
      return Promise.reject();
    }
  };
  const UpdateDailyShifts = async (dailyShiftList: DailyShift[]) => {
    try {
      const newDailyShiftList = dailyShiftList.map((dailyShift) =>
        convertDailyShiftToSent(dailyShift),
      );
      const res = await ShiftService.updateDailyShifts(newDailyShiftList);
      if (res.data) {
        dispatch(updateDailyShifts(res.data));
      } else {
        dispatch(deleteDailyShifts(dailyShiftList));
      }
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast, router);
      return Promise.reject();
    }
  };
  const handleUpdateShift = (value: Shift) => {
    const index = table.findIndex((shift) => shift.id === value.id);
    if (index !== -1) {
      return UpdateShift(value.id, value);
    } else {
      return AddShift(value);
    }
  };
  const handleRemoveShift = async (id: any) => {
    try {
      await ShiftService.deleteShift(id);
      dispatch(deleteShift(id));
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast, router);
      return Promise.reject();
    }
  };

  const handleAddDailyShift = (value: DailyShift[]) => {
    return AddDailyShifts(value);
  };
  const handleUpdateDailyShifts = (value: DailyShift[]) => {
    return UpdateDailyShifts(value);
  };

  return (
    <div className="flex w-full flex-col gap-4 text-sm">
      <div className="flex flex-row items-center justify-between gap-2">
        <div className="flex flex-row items-center gap-2">
          <MyDateRangePicker
            rangeTimeValue={range}
            onRangeTimeFilterChanged={handleRangeTimeFilterChange}
          />
          <ButtonGroup
            choices={["Day", "Week", "Month"]}
            defaultValue="Week"
            onValueChange={handleStaticRangeFilterChange}
          />
        </div>
        <div className="flex flex-row items-center gap-4">
          <Button
            variant={"green"}
            className={cn("gap-2", canUpdateAttendance ? "" : "hidden")}
            onClick={() => setOpenSetTimeDialog(true)}
          >
            <Plus size={16} />
            <span className="whitespace-nowrap max-md:hidden">Set time</span>
          </Button>
          {/* <Button variant={"green"} className="gap-2">
            <FileDown className="h-4 w-4" />
            <span>Export</span>
          </Button> */}
        </div>
      </div>
      {isLoading ? (
        <Skeleton className="flex h-[500px] w-full items-center justify-center rounded-md bg-gray-200">
          Loading table<LoadingCircle></LoadingCircle>
        </Skeleton>
      ) : (
        <Table
          staffList={staffList}
          rangeDate={range}
          shiftList={table}
          displayType={displayType}
          onUpdateShift={handleUpdateShift}
          onSetTime={handleAddDailyShift}
          onRemoveShift={handleRemoveShift}
          onUpdateDailyShifts={handleUpdateDailyShifts}
          canCreateAttendance={canCreateAttendance}
          canUpdateAttendance={canUpdateAttendance}
          canDeleteAttendance={canDeleteAttendance}
        />
      )}

      <SetTimeDialog
        open={openSetTimeDialog}
        setOpen={setOpenSetTimeDialog}
        shiftList={table}
        staffList={staffList}
        specificShift={null}
        submit={handleAddDailyShift}
        onUpdateDailyShifts={handleUpdateDailyShifts}
      />
    </div>
  );
}
