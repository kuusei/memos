import { Tooltip } from "@mui/joy";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { memoServiceClient } from "@/grpcweb";
import { DAILY_TIMESTAMP } from "@/helpers/consts";
import { getNormalizedDateString } from "@/helpers/datetime";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useFilterStore } from "@/store/module";
import { useMemoList } from "@/store/v1";
import { Translations, useTranslate } from "@/utils/i18n";

const tableConfig = {
  width: 9,
  height: 7,
};

const getInitialUsageStat = (usedDaysAmount: number, beginDayTimestamp: number) => {
  const initialUsageStat: number[] = [];
  for (let i = 1; i <= usedDaysAmount; i++) {
    initialUsageStat.push(beginDayTimestamp + DAILY_TIMESTAMP * i);
  }
  return initialUsageStat;
};

const getCellAdditionalStyles = (count: number, maxCount: number) => {
  if (count === 0) {
    return "bg-gray-200 dark:bg-gray-700";
  }

  const ratio = count / maxCount;
  if (ratio > 0.7) {
    return "bg-green-700 dark:opacity-80";
  } else if (ratio > 0.4) {
    return "bg-green-500 dark:opacity-80";
  } else {
    return "bg-green-400 dark:opacity-80";
  }
};

const ActivityCalendar = () => {
  const t = useTranslate();
  const filterStore = useFilterStore();
  // data
  const user = useCurrentUser();
  const memoList = useMemoList();
  const [activityStats, setActivityStats] = useState<Record<string, number>>({});
  useEffect(() => {
    (async () => {
      const filters = [`row_status == "NORMAL"`];
      const { stats } = await memoServiceClient.getUserMemosStats({
        name: user.name,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        filter: filters.join(" && "),
      });
      setActivityStats(stats);
    })();
  }, [memoList.value.length]);
  const maxCount = Math.max(...Object.values(activityStats));
  // time
  const [selectedDateString, setSelectedDateString] = useState<string | undefined>(filterStore.state.selectedDateString);
  const todayTimeStamp = new Date().getTime();
  const weekDay = new Date(todayTimeStamp).getDay();
  const dayTips = ["mon", "", "wed", "", "fri", "", "sun"];
  const todayDay = weekDay == 0 ? 7 : weekDay;
  const usedDaysAmount = (tableConfig.width - 1) * tableConfig.height + todayDay;
  const beginDayTimestamp = todayTimeStamp - usedDaysAmount * DAILY_TIMESTAMP;
  const [days] = useState<number[]>(getInitialUsageStat(usedDaysAmount, beginDayTimestamp));
  const nullCell = new Array(7 - todayDay).fill(0);

  return (
    <div className={clsx("w-fit h-auto mt-2 p-0.5 shrink-0 grid grid-flow-col grid-rows-7 grid-cols-10 gap-[3px]")}>
      {[...days, ...nullCell].map((day, index) => {
        const date = getNormalizedDateString(day);
        const count = activityStats[date] || 0;
        const isToday = new Date().toDateString() === new Date(date).toDateString();
        const tooltipText = count ? t("memo.count-memos-in-date", { count: count, date: date }) : date;
        const isSelected = selectedDateString ? new Date(selectedDateString).toDateString() === new Date(date).toDateString() : false;
        return day && day !== 0 ? (
          <Tooltip className="shrink-0" key={`${date}-${index}`} title={tooltipText} placement="top" arrow>
            <div
              className={clsx(
                "w-4 h-4 rounded-sm flex justify-center items-center border",
                getCellAdditionalStyles(count, maxCount),
                isToday && "border-gray-400 dark:border-zinc-300",
                isSelected && "!border-gray-900 dark:border-zinc-300",
                !isToday && !isSelected && "border-transparent",
                count > 0 ? "cursor-pointer" : "cursor-default",
              )}
              onClick={() => {
                if (count > 0) {
                  if (!selectedDateString || !isSelected) {
                    setSelectedDateString(date);
                    filterStore.setSelectedDateString(date);
                  } else {
                    setSelectedDateString(undefined);
                    filterStore.setSelectedDateString(undefined);
                  }
                }
              }}
            ></div>
          </Tooltip>
        ) : (
          <div
            key={`${date}-${index}`}
            className={clsx(
              "w-4 h-4 rounded-sm shrink-0 opacity-30 flex justify-center items-center border border-transparent",
              getCellAdditionalStyles(0, maxCount),
            )}
          ></div>
        );
      })}
      {dayTips.map((v, i) => (
        <span className="ml-1 w-4 h-4 text-xs flex flex-center text-zinc-500 font-mono" key={i}>
          {v && t(("days." + v) as Translations)}
        </span>
      ))}
    </div>
  );
};

export default ActivityCalendar;
