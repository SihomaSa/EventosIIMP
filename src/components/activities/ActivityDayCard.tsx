import React, { FormEvent } from "react";
import { ActivityDay, ActivityDetail } from "@/types/activityTypes";
import { Card, CardContent, CardHeader } from "../ui/card";
import ActivityDetailForm from "./ActivityDetailForm";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

interface ActivityDayCardProps {
  activity: ActivityDay;
  onActivityDeleted: () => void;
  onEditActivity: (activity: ActivityDetail) => void;
  onAddActivity: () => void;
  handleChange: (field: keyof ActivityDetail, value: string) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const ActivityDayCard: React.FC<ActivityDayCardProps> = ({
  activity,
  onActivityDeleted,
  onEditActivity,
  onAddActivity,
  handleChange,
  handleSubmit,
}) => {
  const getMonth = (date: string) => {
    const meses = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    return meses[+date.split("-")[1] - 1];
  };

  const detalles: ActivityDetail[] = Array.isArray(activity.detalles) ? activity.detalles : [];

  const englishActivities: ActivityDetail[] = detalles.filter(
    (detail: ActivityDetail) => detail.idIdioma === "1" || detail.prefijoIdioma === "EN"
  );

  const spanishActivities: ActivityDetail[] = detalles.filter(
    (detail: ActivityDetail) => detail.idIdioma === "2" || detail.prefijoIdioma === "SP"
  );

  const otherActivities: ActivityDetail[] = detalles.filter(
    (detail: ActivityDetail) =>
      (detail.idIdioma !== "1" && detail.idIdioma !== "2") &&
      (detail.prefijoIdioma !== "EN" && detail.prefijoIdioma !== "SP")
  );

  return (
    <div>
      <Card className="bg-secondary text-primary text-4xl font-bold shadow-xl w-full">
        <CardHeader className="flex gap-2 justify-center text-2xl font-bold leading-4">
          <span>{activity.fechaActividad.split("-")[2]}</span>
          <span>{getMonth(activity.fechaActividad)}</span>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-3">
          {englishActivities.length > 0 && spanishActivities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-y-3">
                <h3 className="text-sm font-semibold text-gray-500 border-b pb-1">English</h3>
                {englishActivities.map((det: ActivityDetail, index: number) => (
                  <ActivityDetailForm
                    key={`en-${index}`}
                    onDelete={onActivityDeleted}
                    onEdit={() => onEditActivity(det)}
                    details={det}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                  />
                ))}
              </div>

              <div className="flex flex-col gap-y-3">
                <h3 className="text-sm font-semibold text-gray-500 border-b pb-1">Español</h3>
                {spanishActivities.map((det: ActivityDetail, index: number) => (
                  <ActivityDetailForm
                    key={`es-${index}`}
                    onDelete={onActivityDeleted}
                    onEdit={() => onEditActivity(det)}
                    details={det}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                  />
                ))}
              </div>
            </div>
          ) : (
            <>
              {englishActivities.length > 0 && (
                <div className="flex flex-col gap-y-3">
                  <h3 className="text-sm font-semibold text-gray-500 border-b pb-1">English</h3>
                  {englishActivities.map((det: ActivityDetail, index: number) => (
                    <ActivityDetailForm
                      key={`en-${index}`}
                      onDelete={onActivityDeleted}
                      onEdit={() => onEditActivity(det)}
                      details={det}
                      handleChange={handleChange}
                      handleSubmit={handleSubmit}
                    />
                  ))}
                </div>
              )}

              {spanishActivities.length > 0 && (
                <div className="flex flex-col gap-y-3">
                  <h3 className="text-sm font-semibold text-gray-500 border-b pb-1">Español</h3>
                  {spanishActivities.map((det: ActivityDetail, index: number) => (
                    <ActivityDetailForm
                      key={`es-${index}`}
                      onDelete={onActivityDeleted}
                      onEdit={() => onEditActivity(det)}
                      details={det}
                      handleChange={handleChange}
                      handleSubmit={handleSubmit}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {otherActivities.length > 0 && (
            <div className="flex flex-col gap-y-3 mt-4">
              <h3 className="text-sm font-semibold text-gray-500 border-b pb-1">Other Activities</h3>
              {otherActivities.map((det: ActivityDetail, index: number) => (
                <ActivityDetailForm
                  key={`other-${index}`}
                  onDelete={onActivityDeleted}
                  onEdit={() => onEditActivity(det)}
                  details={det}
                  handleChange={handleChange}
                  handleSubmit={handleSubmit}
                />
              ))}
            </div>
          )}

          {/* Add Activity Button */}
          <div
            className="text-primary rounded-lg p-3 border border-dashed border-primary flex flex-col items-center justify-center cursor-pointer hover:shadow transition-all duration-200 hover:bg-primary/5 h-full"
            onClick={onAddActivity}
          >
            <Plus size={24} className="mb-1" />
            <h3 className="text-sm font-medium">Agregar Actividad</h3>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityDayCard;