import { FormEvent, useEffect, useState, useCallback, useMemo } from "react";
import { CalendarDays, Plus, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { getActivities } from "@/components/services/activitiesServicec";
import { ActivityDay, ActivityDetail } from "../types/activityTypes";
import ActivityDayCard from "@/components/activities/ActivityDayCard";
import CombinedModal from "@/components/activities/CombinedModal";
import { useEventStore } from "../stores/eventStore"; // Importa el store de eventos
import { toast } from "sonner";


export default function Expositors() {
  const {selectedEvent } = useEventStore(); // Obtiene el evento seleccionado
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivityToEdit, setSelectedActivityToEdit] =
    useState<ActivityDetail | null>(null);
  const [initialDate, setInitialDate] = useState<string | null>(null);
  const [expositorsUpdated, setExpositorsUpdated] = useState(0);
  const [activities, setActivities] = useState<ActivityDay[] | null>(null);
  const [searchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(
    new Date().toLocaleTimeString()
  );

  // Memoize the fetchActivities function to prevent unnecessary re-renders
  const fetchActivities = useCallback(async () => {
    try {
      setIsRefreshing(true);
      setLoading(true);
      setError(null);

      const eventId = selectedEvent?.idEvent.toString();
      const data = await getActivities(eventId);

      setActivities(data || []);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      let errorMessage = "Error al obtener las actividades";
    
      if (err instanceof Error) {
        errorMessage = err.message.includes('Failed to fetch')
          ? "Error de conexión con el servidor. Verifique su conexión a internet."
          : err.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error fetching ads:', err);
      
      // Opcional: Reintentar después de 5 segundos
      const retryTimer = setTimeout(() => {
        fetchActivities();
        clearTimeout(retryTimer);
      }, 5000);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [selectedEvent]);

  // Only run effect when expositorsUpdated changes, not on every render
  useEffect(() => {
    fetchActivities();
  }, [expositorsUpdated, fetchActivities]);

  // Optimize the handleChange function with useCallback
  const handleChange = useCallback(
    (field: keyof ActivityDetail, value: string) => {
      setActivities(
        (prev) =>
          prev &&
          prev.map((activity, index) =>
            index === 0 ? { ...activity, [field]: value } : activity
          )
      );
    },
    []
  );

  const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }, []);

  // const handleRefresh = useCallback(() => {
  //   fetchActivities();
  // }, [fetchActivities]);

  const handleRefresh = useCallback(() => {
    setLoading(true);         // Mostrar skeletons
    setIsRefreshing(true);    // Animar botón
    fetchActivities().finally(() => {
      setIsRefreshing(false); // Detener animación del botón
    });
  }, [fetchActivities]);

  // Extract existing dates from activities for calendar disabling
  const existingDates = useMemo(() => {
    if (!activities) return [];
    return activities.map((activity) => activity.fechaActividad);
  }, [activities]);

  // Optimize filtering with useMemo to avoid recomputing on every render
  const filteredActivities = useMemo(() => {
    if (!activities) return [];
    return activities.filter((activity) => {
      if (!searchTerm) return true;
      const lowerSearchTerm = searchTerm.toLowerCase();
      // Check date match
      if (
        activity.fechaActividad &&
        activity.fechaActividad.toLowerCase().includes(lowerSearchTerm)
      ) {
        return true;
      }
      // Check details match
      if (Array.isArray(activity.detalles)) {
        return activity.detalles.some(
          (detail) =>
            detail.titulo &&
            detail.titulo.toLowerCase().includes(lowerSearchTerm)
        );
      }
      return false;
    });
  }, [activities, searchTerm]);

  // Called when an activity is deleted, edited, or added
  const handleActivityDeleted = useCallback(() => {
    setExpositorsUpdated((prev) => prev + 1);
  }, []);

  // Open modal for adding a new date
  const handleAddDate = useCallback(() => {
    
    setSelectedActivityToEdit(null);
    setInitialDate(null);
    setIsModalOpen(true);
  }, []);

  // Open modal for adding an activity to an existing date
  const handleAddActivity = useCallback((date: string) => {
    if (!selectedEvent) {
      toast.error("Por favor seleccione un evento primero");
      return;
    }
    setSelectedActivityToEdit(null);
    setInitialDate(date);
    setIsModalOpen(true);
  }, [selectedEvent]);

  // Open modal for editing an activity
  const handleEditActivity = useCallback(
    (activity: ActivityDetail, activityDate: string) => {
      setSelectedActivityToEdit(activity);
      setInitialDate(activityDate);
      setIsModalOpen(true);
    },
    []
  );

  // Close the modal
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedActivityToEdit(null);
    setInitialDate(null);
  }, []);

  // Memoize empty state to avoid re-renders
  const emptyState = useMemo(
    () => (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CalendarDays size={48} className="text-gray-300 mb-4" />
        
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          {selectedEvent 
            ? `No hay actividades para ${selectedEvent.des_event}`
            : "No hay actividades"}
        </h3>
        <p className="text-gray-500 max-w-md mb-6">
          {searchTerm
            ? "No se encontraron actividades con ese término de búsqueda"
            : selectedEvent
            ? `Aún no hay actividades programadas para este evento. Haga clic en el botón 'Agregar nueva fecha' para comenzar.`
            : "Seleccione un evento para ver sus actividades o agregue nuevas."}
        </p>
        <Button
          onClick={handleAddDate}
          className="cursor-pointer bg-primary hover:bg-primary/90"
        >
          <Plus size={16} className="mr-1" />
          Agregar nueva fecha
        </Button>
      </div>
    ),
    [searchTerm, handleAddDate, selectedEvent]
  );

  // Memoize loading skeletons
  const loadingSkeletons = useMemo(
    () => (
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
    ),
    []
  );

  return (
    <div className="p-0 xl:p-6 flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Actividades del Evento
        </h1>
       
        <p className="text-gray-500 mt-1">
          {selectedEvent 
            ? `Gestione todas las actividades y horarios del evento para: ${selectedEvent.des_event}`
            : "Seleccione un evento para administrar sus actividades"}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-6 justify-between items-start md:items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        {/* <div className="relative w-full md:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar actividades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 bg-gray-50 border-gray-200 w-full"
          />
        </div> */}
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
              className={isRefreshing ? "animate-spin" : ""}
            />
            <span className="hidden md:inline">Actualizar</span>
          </Button>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
          <Button
            size="sm"
            onClick={handleAddDate}
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
        {!loading && filteredActivities.length === 0 && emptyState}
        {loading && loadingSkeletons}
        {!loading && filteredActivities.length > 0 && (
          <div className="grid grid-cols-1 gap-4 grid-auto-fit">
            {filteredActivities.map((activity, index) => (
              <ActivityDayCard
                key={`activity-${index}-${activity.fechaActividad}`}
                activity={activity}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                onActivityDeleted={handleActivityDeleted}
                onEditActivity={handleEditActivity}
                onAddActivity={() => handleAddActivity(activity.fechaActividad)}
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
        <span className="text-xs">Última actualización: {lastUpdated}</span>
      </div>

      {/* Combined Modal for Adding Date, Adding Activity, and Editing Activity */}
      <CombinedModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAdd={() => {
          setExpositorsUpdated((prev) => prev + 1);
          handleCloseModal();
        }}
        selectedEvent={selectedEvent ? { 
                idEvent: selectedEvent.idEvent.toString(),
                des_event: selectedEvent.des_event
              } : undefined}
        existingDates={existingDates}
        editActivity={selectedActivityToEdit || undefined}
        initialDate={initialDate || undefined}
      />
    </div>
  );
}
