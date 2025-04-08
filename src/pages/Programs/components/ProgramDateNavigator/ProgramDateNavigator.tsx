import { Button } from "@/components/ui/button";
import { FC } from "react";
import { parseProgramDate } from "./utils/parseProgramDate";

type Props = {
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
  dates: string[];
};

const ProgramDateNavigator: FC<Props> = ({
  dates,
  selectedDate,
  setSelectedDate,
}) => {
  return (
    <div className="w-full overflow-x-scroll flex gap-2 pt-4 pb-2 mb-2">
      {dates.map((date) => (
        <Button
          key={date}
          onClick={() => setSelectedDate(date)}
          className={`px-4 py-2 rounded-md ${selectedDate === date
            ? "bg-primary text-white"
            : "bg-gray-200 text-black"
            }`}
        >
          {parseProgramDate(date)}
        </Button>
      ))}
    </div>
  );
};

export default ProgramDateNavigator;
