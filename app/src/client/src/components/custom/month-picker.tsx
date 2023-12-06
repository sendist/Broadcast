import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, ChevronDownIcon } from "@radix-ui/react-icons";

interface MonthPickerProps {
  onUpdate: (newDate: Date) => void;
  date: Date;
}

const MonthPicker: React.FC<MonthPickerProps> = ({ onUpdate , date}) => {
  const [selectedMonth, setSelectedMonth] = useState(date.getMonth());
  const [selectedYear, setSelectedYear] = useState(date.getFullYear());
  const [isOpen, setIsOpen] = useState(false);

  const monthName = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const MonthButton = ({
    month,
    label,
    isSelected,
  }: {
    month: number;
    label: string;
    isSelected: boolean;
  }): JSX.Element => (
    <Button
      className={cn(isSelected && "pointer-events-none")}
      variant={isSelected ? "default" : "ghost"}
      onClick={() => {
        setSelectedMonth(month);
      }}
    >
      <>
        {label}
      </>
    </Button>
  );

  return (
    <Popover open={isOpen} onOpenChange={(open: boolean) => {
        setIsOpen(open);
      }}>
      <PopoverTrigger asChild>
        <Button size={"lg"} variant="white">
          <div>
            {monthName[selectedMonth] + " - " + selectedYear}
          </div>
          <div className="pl-1 opacity-60 -mr-2 scale-125">
            {isOpen ? (
              <ChevronUpIcon width={24} />
            ) : (
              <ChevronDownIcon width={24} />
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto" align="start">
        <div className="flex flex-row items-center mb-2">
          <Button variant="outline" onClick={() => setSelectedYear(selectedYear - 1)}>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <span className="grow text-center">{new Date(selectedYear, selectedMonth, 1).getFullYear()}</span>
          <Button variant="outline" onClick={() => setSelectedYear(selectedYear + 1)}>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2 py-2">
          {monthName.map((month, index) => (
            <MonthButton month={index} label={month} isSelected={selectedMonth === index} />
          ))}
        </div>
        <div className="flex justify-end gap-2 py-2">
          <Button
            onClick={() => {
              setIsOpen(false);
            }}
            variant="ghost"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setIsOpen(false);
              onUpdate(new Date(selectedYear, selectedMonth, 1));
            }}
          >
            Update
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MonthPicker;
