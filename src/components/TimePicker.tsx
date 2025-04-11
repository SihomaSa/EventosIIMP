import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

// Move these outside the component
const HOURS = Array.from({ length: 24 }, (_, i) =>
  i.toString().padStart(2, "0")
);
const MINUTES = Array.from({ length: 60 }, (_, i) =>
  i.toString().padStart(2, "0")
);

interface TimePickerProps {
  fechaActividad?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  id?: string;
  className?: string;
}

export function TimePicker({
  fechaActividad,
  label,
  value,
  onChange,
  error,
  id,
  className,
  ...props
}: TimePickerProps & React.HTMLAttributes<HTMLDivElement>) {
  // Use state to track hour and minute values
  const [hour, setHour] = useState<string>("");
  const [minute, setMinute] = useState<string>("");

  // Parse time whenever value changes
  useEffect(() => {
    if (!value) {
      setHour("");
      setMinute("");
      return;
    }

    // Check if the value is in the expected format (HH:mm)
    const [h, m] = value.split(":");

    if (h && !isNaN(Number(h))) {
      setHour(h.padStart(2, "0"));
    }

    if (m && !isNaN(Number(m))) {
      setMinute(m.padStart(2, "0"));
    }
  }, [value]);

  const handleTimeChange = (type: "hour" | "minute", newValue: string) => {
    if (type === "hour") {
      setHour(newValue);
      if (newValue && minute) {
        emitChange(newValue, minute);
      } else if (newValue) {
        emitChange(newValue, "00");
      }
    } else {
      setMinute(newValue);
      if (hour && newValue) {
        emitChange(hour, newValue);
      } else if (newValue) {
        emitChange("00", newValue);
      }
    }
  };

  const emitChange = (h: string, m: string) => {
    if (fechaActividad) {
      onChange(`${fechaActividad}T${h}:${m}`);
    } else {
      onChange(`${h}:${m}`);
    }
  };

  return (
    <div className={cn("space-y-2", className)} {...props}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="flex items-center space-x-2">
        <div className="relative w-full flex items-center">
          <Clock className="absolute left-2 h-4 w-4 text-gray-400 pointer-events-none" />
          <div className="flex w-full">
            <Select
              value={hour}
              onValueChange={(value) => handleTimeChange("hour", value)}
            >
              <SelectTrigger
                className={cn(
                  "pl-8 rounded-r-none border-r-0",
                  error && "border-red-500 focus-visible:ring-red-500"
                )}
              >
                <SelectValue placeholder="HH" />
              </SelectTrigger>
              <SelectContent>
                {HOURS.map((h) => (
                  <SelectItem key={h} value={h}>
                    {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={minute}
              onValueChange={(value) => handleTimeChange("minute", value)}
            >
              <SelectTrigger
                className={cn(
                  "rounded-l-none pl-2",
                  error && "border-red-500 focus-visible:ring-red-500"
                )}
              >
                <SelectValue placeholder="MM" />
              </SelectTrigger>
              <SelectContent>
                {MINUTES.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
