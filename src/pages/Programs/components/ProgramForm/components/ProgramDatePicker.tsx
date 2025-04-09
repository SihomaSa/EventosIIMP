import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FC } from "react";

type Props = {
  id?: string;
  className?: string;
  disabled?: boolean;
  date?: Date;
  setDate: (newDate?: Date) => void;
};

const ProgramDatePicker: FC<Props> = ({
  id,
  className,
  disabled,
  date,
  setDate,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            className,
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {date ? format(date, "PPP") : <span>Seleccionar fecha</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          id={id}
          mode="single"
          selected={date}
          onSelect={(newDate) => setDate(newDate)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default ProgramDatePicker;
