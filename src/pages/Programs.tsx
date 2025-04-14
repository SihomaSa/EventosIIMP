import { useEffect, useMemo, useState, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, RefreshCw, Search, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProgramsService from "./Programs/services/ProgramsService";
import { Program, ProgramCategory } from "./Programs/types/Program";
import ProgramDateNavigator from "./Programs/components/ProgramDateNavigator/ProgramDateNavigator";
import ProgramContainer from "../components/programs/ProgramContainer";
import NewProgramDialog from "../components/programs/NewProgramDialog";

export default function Expositors() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [programCategories, setProgramCategories] = useState<ProgramCategory[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(
    new Date().toLocaleTimeString()
  );

  // Load all data (programs and categories)
  const loadData = useCallback(async () => {
    try {
      setIsRefreshing(true);

      // Load program categories
      const categories = await ProgramsService.getProgramCategories();
      setProgramCategories(categories);

      // Load programs
      const programs = await ProgramsService.getPrograms();
      setPrograms(programs);

      // Extract unique dates
      const uniqueDates = [
        ...new Set(programs.map((program) => program.fechaPrograma)),
      ].sort();
      setDates(uniqueDates);

      // Select first date if available and none selected
      if (uniqueDates.length > 0 && !selectedDate) {
        setSelectedDate(uniqueDates[0]);
      }

      // Clear any previous errors
      if (error) setError(null);

      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Error loading program data:", err);
      setError("Error al cargar los datos del programa");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [error, selectedDate]);

  // Initial data load
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Function to refresh programs - used after adding a new program
  const handleRefreshPrograms = useCallback(async () => {
    try {
      // Load programs
      const programs = await ProgramsService.getPrograms();
      setPrograms(programs);

      // Extract and update dates
      const uniqueDates = [
        ...new Set(programs.map((program) => program.fechaPrograma)),
      ].sort();
      setDates(uniqueDates);

      // If there was no selected date but now we have dates, select the first one
      if (!selectedDate && uniqueDates.length > 0) {
        setSelectedDate(uniqueDates[0]);
      }

      // Update last updated time
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Error refreshing programs:", err);
    }
  }, [selectedDate]);

  // Filter programs by selected date and search term
  const filteredPrograms = useMemo(() => {
    if (!selectedDate) return [];

    let filtered = programs.filter(
      (program) => program.fechaPrograma === selectedDate
    );

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((program) => {
        // Search in program title
        if (program.titulo && program.titulo.toLowerCase().includes(term))
          return true;
        // Search in program description
        if (
          program.descripcion &&
          program.descripcion.toLowerCase().includes(term)
        )
          return true;
        // Search in program details
        if (program.detalles && Array.isArray(program.detalles)) {
          return program.detalles.some(
            (detail) =>
              (detail.titulo && detail.titulo.toLowerCase().includes(term)) ||
              (detail.descripcion &&
                detail.descripcion.toLowerCase().includes(term)) ||
              (detail.responsable &&
                detail.responsable.toLowerCase().includes(term))
          );
        }
        return false;
      });
    }

    return filtered;
  }, [programs, selectedDate, searchTerm]);

  // Handle refresh button click
  const handleRefresh = () => {
    loadData();
  };

  // Loading state UI
  if (loading) {
    return (
      <div className="p-0 xl:p-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-3 mb-6 justify-between items-start md:items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <Skeleton className="h-10 w-72 bg-primary/30" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24 bg-primary/30" />
            <Skeleton className="h-10 w-32 bg-primary/30" />
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 md:p-6 border border-gray-200">
          <div className="mb-6">
            <Skeleton className="h-12 w-full bg-primary/30 mb-4" />
          </div>
          <div className="grid grid-cols-1 gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton
                key={i}
                className="h-48 w-full bg-primary/30 rounded-lg"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-0 xl:p-6 flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Programación del Evento
        </h1>
        <p className="text-gray-500 mt-1">
          Gestione toda la programación y horarios del evento
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-6 justify-between items-start md:items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar en el programa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 bg-gray-50 border-gray-200 w-full"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button
            variant="outline"
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
          <NewProgramDialog
            programCategories={programCategories}
            existingDates={dates}
            onProgramAdded={handleRefreshPrograms}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 mb-6 rounded-lg border border-red-200 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      <div className="bg-gray-50 rounded-xl p-4 md:p-6 border border-gray-200 min-h-[70vh]">
        {dates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CalendarDays size={48} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              No hay programación disponible
            </h3>
            <p className="text-gray-500 max-w-md mb-6">
              Aún no hay fechas programadas para este evento. Haga clic en el
              botón 'Crear programa' para comenzar.
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <ProgramDateNavigator
              dates={dates}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
            {selectedDate && (
              <ProgramContainer
                programs={filteredPrograms}
                programCategories={programCategories}
                showNewProgramButton={false}
                selectedDate={selectedDate}
                onRefreshPrograms={handleRefreshPrograms}
              />
            )}
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-500 flex justify-between items-center">
        <span>
          {selectedDate && filteredPrograms.length > 0
            ? `Mostrando ${filteredPrograms.length} ${
                filteredPrograms.length === 1 ? "programa" : "programas"
              }`
            : ""}
        </span>
        <span className="text-xs">Última actualización: {lastUpdated}</span>
      </div>
    </div>
  );
}