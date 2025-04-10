import React from "react";
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

// Generate hour options (00-23)
const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));

// Generate minute options (00-59)
const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));

interface TimePickerProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  id?: string;
  className?: string;
}

export function TimePicker({
  label,
  value,
  onChange,
  error,
  id,
  className,
  ...props
}: TimePickerProps & React.HTMLAttributes<HTMLDivElement>) {
  // Parse the time string (HH:MM) into hours and minutes
  const [hour, minute] = value ? value.split(":") : ["", ""];

  // Update the time when either hours or minutes change
  const handleTimeChange = (type: "hour" | "minute", newValue: string) => {
    let newHour = hour;
    let newMinute = minute;

    if (type === "hour") {
      newHour = newValue;
    } else {
      newMinute = newValue;
    }

    // Only trigger onChange if we have both values
    if (newHour && newMinute) {
      onChange(`${newHour}:${newMinute}`);
    } else if (newHour) {
      onChange(`${newHour}:00`);
    } else if (newMinute) {
      onChange(`00:${newMinute}`);
    }
  };

  return (
    <div className={cn("space-y-2", className)} {...props}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="flex items-center space-x-2">
        <div className="relative w-full flex items-center">
          <Clock className="absolute left-2 h-4 w-4 text-gray-400 pointer-events-none" />
          <div className="flex w-full">
            {/* Hours select */}
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
                {hours.map((h) => (
                  <SelectItem key={h} value={h}>
                    {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Minutes select */}
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
                {minutes.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
}