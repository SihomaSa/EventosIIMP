import { FormEvent, useEffect, useState } from "react";
import { CalendarDays, Plus, RefreshCw, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { getActivities } from "@/components/services/activitiesServicec";
import { ActivityDay, ActivityDetail } from "../types/activityTypes";
import ActivityDayCard from "@/components/activities/ActivityDayCard";
import { Input } from "@/components/ui/input";

export default function Expositors() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [expositorsUpdated, setExpositorsUpdated] = useState(0);
  const [activities, setActivities] = useState<ActivityDay[] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchActivities = async () => {
    try {
      setIsRefreshing(true);
      const data = await getActivities();
      setActivities(data);
      console.log(data, "<=");
      if (error) setError(null);
    } catch (err) {
      setError("Error al obtener las actividades");
      console.log(err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [expositorsUpdated]);

  const handleChange = (field: keyof ActivityDetail, value: string) => {
    setActivities(
      (prev) =>
        prev &&
        prev.map((activity, index) =>
          index === 0 ? { ...activity, [field]: value } : activity
        )
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Actividades guardadas:", activities);
  };

  const handleRefresh = () => {
    fetchActivities();
  };

  const filteredActivities = activities
    ? activities.filter((activity) => {
        const dateMatch = activity.fechaActividad
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

        const detailsMatch =
          Array.isArray(activity.detalles) &&
          activity.detalles.some((detail: ActivityDetail) => {
            return Object.entries(detail)
              .filter(([, value]) => value !== null && value !== undefined)
              .some(([, value]) =>
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
              );
          });

        return dateMatch || detailsMatch;
      })
    : [];

  const handleActivityDeleted = () => {
    setExpositorsUpdated((prev) => prev + 1); // This will trigger a refresh
  };

  return (
    <div className="p-4 md:p-6 flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Actividades del Evento
        </h1>
        <p className="text-gray-500 mt-1">
          Gestione todas las actividades y horarios del evento
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-6 justify-between items-start md:items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar actividades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 bg-gray-50 border-gray-200 w-full"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="cursor-pointer border-gray-200 text-gray-700 flex items-center gap-1"
          >
            <RefreshCw
              size={16}
              className={`${isRefreshing ? "animate-spin" : ""}`}
            />
            <span className="hidden md:inline">Actualizar</span>
          </Button>
          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="cursor-pointer bg-primary hover:bg-primary/90 text-white ml-auto flex items-center gap-1"
          >
            <CalendarDays size={16} />
            <span>Agregar nueva fecha</span>
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 mb-6 rounded-lg border border-red-200 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </div>
      )}

      <div className="bg-gray-50 rounded-xl p-4 md:p-6 border border-gray-200 min-h-[70vh]">
        {!loading && filteredActivities.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CalendarDays size={48} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              No hay actividades
            </h3>
            <p className="text-gray-500 max-w-md mb-6">
              {searchTerm
                ? "No se encontraron actividades con ese término de búsqueda"
                : "Aún no hay actividades programadas para este evento. Haga clic en el botón 'Agregar nueva fecha' para comenzar."}
            </p>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="cursor-pointer bg-primary hover:bg-primary/90"
            >
              <Plus size={16} className="mr-1" />
              Agregar nueva fecha
            </Button>
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-[125px] w-full rounded-xl bg-primary/30" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full bg-primary/30" />
                  <Skeleton className="h-4 w-3/4 bg-primary/30" />
                  <Skeleton className="h-4 w-2/3 bg-primary/30" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-7 w-full bg-primary/30" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredActivities.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredActivities.map((activity, index) => (
              <ActivityDayCard
                key={index}
                activity={activity}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                onActivityDeleted={handleActivityDeleted}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-500 flex justify-between items-center">
        <span>
          {!loading && filteredActivities.length > 0
            ? `Mostrando ${filteredActivities.length} ${
                filteredActivities.length === 1 ? "actividad" : "actividades"
              }`
            : ""}
        </span>
        <span className="text-xs">
          Última actualización: {new Date().toLocaleTimeString()}
        </span>
      </div>

      {/* Modal would go here */}
      {/*
      {isAddModalOpen && (
        <AddActivityModal
          onAdd={() => {
            setExpositorsUpdated(prev => prev + 1);
            setIsAddModalOpen(false);
          }}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}
      */}
    </div>
  );
}
