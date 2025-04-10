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
  let hour = "";
  let minute = "";

  if (value) {
    if (value.includes("T")) {
      const timePart = value.split("T")[1];
      [hour, minute] = timePart.split(":");
    } else {
      [hour, minute] = value.split(":");
    }
  }

  const handleTimeChange = (type: "hour" | "minute", newValue: string) => {
    let newHour = hour;
    let newMinute = minute;

    if (type === "hour") {
      newHour = newValue;
    } else {
      newMinute = newValue;
    }

    if (newHour && newMinute) {
      if (fechaActividad) {
        onChange(`${fechaActividad}T${newHour}:${newMinute}`);
      } else {
        onChange(`${newHour}:${newMinute}`);
      }
    } else if (newHour) {
      if (fechaActividad) {
        onChange(`${fechaActividad}T${newHour}:00`);
      } else {
        onChange(`${newHour}:00`);
      }
    } else if (newMinute) {
      if (fechaActividad) {
        onChange(`${fechaActividad}T00:${newMinute}`);
      } else {
        onChange(`00:${newMinute}`);
      }
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
                {hours.map((h) => (
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