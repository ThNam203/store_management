"use client";
import { Button } from "@/components/ui/button";
import {
  FilterTime,
  FilterYear,
  PageWithFilters,
  SearchFilterObject,
  TimeFilter
} from "@/components/ui/filter";
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { disablePreloader, showPreloader } from "@/reducers/preloaderReducer";
import { axiosUIErrorHandler } from "@/services/axios_utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DamagedItemsDatatable } from "./datatable";
import DamagedItemService from "@/services/damagedItemService";
import { setDamagedItemDocuments } from "@/reducers/damagedItemsReducer";
import StaffService from "@/services/staff_service";
import { setStaffs } from "@/reducers/staffReducer";
import { TimeFilterType } from "@/utils";

export default function DamagedItemsPage() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const router = useRouter();
  const damagedItemDocuments = useAppSelector((state) => state.damagedItemDocuments.value);
  const staffs = useAppSelector((state) => state.staffs.value);

  useEffect(() => {
    dispatch(showPreloader());
    const fetchData = async () => {
      const damagedItemDocuments = await DamagedItemService.getAllDamagedItemDocuments();
      dispatch(setDamagedItemDocuments(damagedItemDocuments.data));

      const staffs = await StaffService.getAllStaffs();
      dispatch(setStaffs(staffs.data));
    };

    fetchData()
      .then()
      .catch((e) => axiosUIErrorHandler(e, toast))
      .finally(() => dispatch(disablePreloader()));
  }, []);

  const [filteredDamagedItemDocuments, setFilteredDamagedItemDocuments] = useState(damagedItemDocuments);

  const [timeConditionControls, setTimeConditionControls] = useState({
    createdAt: TimeFilterType.StaticRange as TimeFilterType,
    birthday: TimeFilterType.StaticRange as TimeFilterType,
  });
  const [timeConditions, setTimeConditions] = useState({
    createdAt: FilterYear.AllTime as FilterTime,
    birthday: FilterYear.AllTime as FilterTime,
  });
  const [timeRangeConditions, setTimeRangeConditions] = useState({
    createdAt: { startDate: new Date(), endDate: new Date() },
    birthday: { startDate: new Date(), endDate: new Date() },
  });
  const [creatorCondition, setCreatorCondition] = useState<
    { id: number; name: string }[]
  >([]);

  const updateCreatedAtCondition = (value: FilterTime) => {
    setTimeConditions({ ...timeConditions, createdAt: value });
  };

  const updateCreatedAtConditionRange = (value: {
    startDate: Date;
    endDate: Date;
  }) => {
    setTimeRangeConditions({ ...timeRangeConditions, createdAt: value });
  };

  const updateCreatedAtConditionControl = (value: TimeFilterType) => {
    setTimeConditionControls({ ...timeConditionControls, createdAt: value });
  }

  useEffect(() => {
    // let filteredCustomers = handleChoiceFilters(filterConditions, customers);
    let filteredDamagedItemDocuments = damagedItemDocuments;
    filteredDamagedItemDocuments = filteredDamagedItemDocuments.filter((document) => {
      if (creatorCondition.length > 0) {
        if (
          !creatorCondition.some(
            (creator) => creator.id === document.creatorId,
          )
        ) {
          return false;
        }
      }
      
      return true;
    });
    setFilteredDamagedItemDocuments(filteredDamagedItemDocuments);
  }, [timeConditions, timeRangeConditions, creatorCondition, damagedItemDocuments]);

  const filters = [
    <TimeFilter
      key={2}
      title="Created date"
      className="mb-2"
      timeFilterControl={timeConditionControls.createdAt}
      singleTimeValue={timeConditions.createdAt}
      rangeTimeValue={timeRangeConditions.createdAt}
      onTimeFilterControlChanged={updateCreatedAtConditionControl}
      onSingleTimeFilterChanged={updateCreatedAtCondition}
      onRangeTimeFilterChanged={updateCreatedAtConditionRange}
    />,
    <SearchFilterObject
      key={3}
      placeholder="Find creator..."
      title="Creator"
      values={creatorCondition.map((creator) => ({
        id: creator.id,
        name: creator.name,
        displayString: creator.name,
      }))}
      choices={staffs.map((group) => ({
        id: group.id,
        name: group.name,
        displayString: group.name,
      }))}
      filter={(value: any, queryString: string) =>
        value.id.toString().includes(queryString) ||
        value.name.includes(queryString)
      }
      onValuesChanged={(values) =>
        setCreatorCondition([
          ...values.map((v: any) => {
            return { id: v.id, name: v.name };
          }),
        ])
      }
      className="mb-2"
    />
  ]

  return (
    <PageWithFilters
      title="Damaged Items"
      filters={filters}
      headerButtons={[
        <Button
          key={1}
          variant={"green"}
          onClick={() => router.push("/damaged-item/new")}
        >
          New document
        </Button>,
      ]}
    >
      <DamagedItemsDatatable data={filteredDamagedItemDocuments} />
    </PageWithFilters>
  );
}