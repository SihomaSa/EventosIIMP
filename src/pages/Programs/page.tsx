import { useEffect, useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import ProgramsService from "./services/ProgramsService";
import { Program, ProgramCategory } from "./types/Program";
import ProgramDateNavigator from "./components/ProgramDateNavigator/ProgramDateNavigator";
import ProgramContainer from "./components/ProgramContainer/ProgramContainer";

export default function Expositors() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [programCategories, setProgramCategories] = useState<ProgramCategory[]>(
    []
  );
  const [dates, setDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const programs = await ProgramsService.getPrograms();
        setPrograms(programs);
        const dates = programs.map((program) => program.fechaPrograma);
        setDates(dates);
        if (dates.length > 0) setSelectedDate(dates[0]);
      } catch {
        setError("Error al cargar programas");
      } finally {
        setLoading(false);
      }
    };
    const loadProgramCategories = async () => {
      try {
        const categories = await ProgramsService.getProgramCategories();
        setProgramCategories(categories);
      } catch {
        setError("Error al cargar categorias");
      }
    };
    loadProgramCategories();
    loadPrograms();
  }, []);

  const programsByDate = useMemo(() => {
    if (!selectedDate) return [];
    return programs.filter((program) => program.fechaPrograma === selectedDate);
  }, [programs, selectedDate]);

  if (error) return <p className="text-red-500">{error}</p>;

  if (loading)
    return (
      <div className="grid grid-cols-1 gap-4">
        <Skeleton className="h-6 w-full bg-primary/60" />
        <Skeleton className="h-6 w-full bg-primary/60" />
        <Skeleton className="h-6 w-full bg-primary/60" />
      </div>
    );

  return (
    <div>
      <ProgramDateNavigator
        dates={dates}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <ProgramContainer
        programs={programsByDate}
        programCategories={programCategories}
      />
    </div>
  );
}
