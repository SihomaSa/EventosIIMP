import { useEffect, useState, useCallback, useMemo } from "react";
import { ExpositorType } from "@/types/expositorTypes";
import { Plus, RefreshCw, Search, Newspaper, Globe } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ExpositorCard from "@/components/expositors/ExpositorCard";
import UpdateExpositorModal from "@/components/expositors/UpdateExpositorModal";
import EditExpositorForm from "@/components/expositors/EditExpositorForm";
import { getExpositors } from "@/components/services/expositorsService";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useEventStore } from "../stores/eventStore"; // Importa el store de eventos

type LanguageTab = "all" | "en" | "sp";

export default function Expositors() {
  const {selectedEvent } = useEventStore(); // Obtiene el evento seleccionado
  const [expositors, setExpositors] = useState<ExpositorType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedExpositor, setSelectedExpositor] = useState<ExpositorType | null>(null);
  const [isExpositorModalOpen, setIsExpositorModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [expositorsUpdated, setExpositorsUpdated] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());
  const [activeLanguage, setActiveLanguage] = useState<LanguageTab>("all");

  const fetchExpositors = useCallback(async () => {
  try {
    setIsRefreshing(true);
    setLoading(true);
    setError(null);

    
    const data = await getExpositors();

    if (!Array.isArray(data)) {
      console.error("getExpositors no devolvió un arreglo:", data);
      setError("Los datos recibidos no son válidos.");
      setExpositors([]);
      return;
    }

    setExpositors(data);
    setLastUpdated(new Date().toLocaleTimeString());
  } catch (err) {
    let errorMessage = "Error al obtener los conferencistas";
    if (err instanceof Error) {
      errorMessage = err.message.includes("Failed to fetch")
        ? "Error de conexión con el servidor. Verifique su conexión a internet."
        : err.message;
    }

    setError(errorMessage);
    toast.error(errorMessage);
    console.error("Error fetching expositors:", err);

    const retryTimer = setTimeout(() => {
      fetchExpositors();
      clearTimeout(retryTimer);
    }, 5000);
  } finally {
    setLoading(false);
    setIsRefreshing(false);
  }
}, []);

  useEffect(() => {
    fetchExpositors();
  }, [expositorsUpdated, fetchExpositors]);

  const handleAddExpositor = () => {
    if (!selectedEvent) {
      toast.error("Por favor seleccione un evento primero");
      return;
    }
    setExpositorsUpdated((prev) => prev + 1);
    setIsExpositorModalOpen(false);
  };

  const handleUpdateExpositor = () => {
    setLoading(true); 
    setExpositorsUpdated((prev) => prev + 1);
    setSelectedExpositor(null);
    setIsUpdateModalOpen(false);
  };

  const handleDeleteExpositor = () => {
    setExpositorsUpdated((prev) => prev + 1);
  };

  const openUpdateModal = (expositor: ExpositorType) => {
    setSelectedExpositor(expositor);
    setIsUpdateModalOpen(true);
  };

  // const handleRefresh = useCallback(() => {
  //   fetchExpositors();
  // }, [fetchExpositors]);

  const handleRefresh = useCallback(() => {
    setLoading(true);         // Mostrar skeletons
    setIsRefreshing(true);    // Animar botón
    fetchExpositors().finally(() => {
      setIsRefreshing(false); // Detener animación del botón
    });
  }, [fetchExpositors]);
  const getLanguageCount = useCallback(
    (language: string) => {
      return expositors.filter((note) => note.prefijoIdioma === language).length;
    },
    [expositors]
  );

  const filteredExpositors = useMemo(() => {
    if (!Array.isArray(expositors)) return [];
    return expositors.filter((expositor) => {
      // Filtrar por idioma primero
      if (
        activeLanguage !== "all" &&
        expositor.prefijoIdioma.toLowerCase() !== activeLanguage
      ) {
        return false;
      }
  
      // Luego filtrar por término de búsqueda
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
  
      return `${expositor.nombres} ${expositor.apellidos} ${expositor.especialidad}`
        .toLowerCase()
        .includes(term);
        return true;
    });
  }, [expositors, searchTerm, activeLanguage]);
  

  const emptyState = useMemo(() => (
      <div className="flex flex-col items-center justify-center py-12 text-center text-gray-600">
        <Newspaper size={48} className="text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          {selectedEvent 
            ? `No hay conferencista para ${selectedEvent.des_event}`
            : "No hay conferencista"}
        </h3>
        <p className="text-gray-500 max-w-md mb-6">
          {searchTerm
            ? "No se encontraron conferencistas con ese término de búsqueda"
            : activeLanguage !== "all"
            ? `No hay conferencistas en ${
                activeLanguage === "en" ? "inglés" : "español"
              }`
            : selectedEvent
            ? `Aún no hay conferencistas disponibles. Haga clic en el botón 'Agregar nueva nota' para comenzar.`
            : "Seleccione un evento para ver sus conferencistas o agregue nuevas."}
        
        </p>
       
        <Button 
          onClick={() => setIsExpositorModalOpen(true)} 
          className="cursor-pointer bg-primary hover:bg-primary/90">
          <Plus size={16} className="mr-1" /> Agregar conferencista
        </Button>
      </div>
    
  ), [searchTerm, activeLanguage, selectedEvent]);

  const loadingSkeletons = useMemo(
    () => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="border shadow-sm rounded-lg overflow-hidden h-full flex flex-col"
          >
            {/* Image header with gradient overlay */}
            <div className="relative w-full h-44">
              <Skeleton className="absolute inset-0 rounded-t-lg bg-primary/30" />
            </div>
            {/* Card content area */}
            <div className="p-3 bg-white flex-grow flex flex-col gap-2">
              {/* Title field */}
              <div className="w-full bg-gray-50 p-2 rounded-md border border-gray-200">
                <Skeleton className="h-3 w-16 mb-1 rounded bg-primary/30" />
                <Skeleton className="h-5 w-full rounded bg-primary/30" />
              </div>
              {/* Description field */}
              <div className="w-full bg-gray-50 p-2 rounded-md border border-gray-200">
                <Skeleton className="h-3 w-24 mb-1 rounded bg-primary/30" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-full rounded bg-primary/30" />
                  <Skeleton className="h-4 w-3/4 rounded bg-primary/30" />
                  <Skeleton className="h-4 w-5/6 rounded bg-primary/30" />
                </div>
              </div>
              {/* URL field */}
              <div className="w-full bg-gray-50 p-2 rounded-md border border-gray-200">
                <Skeleton className="h-3 w-12 mb-1 rounded bg-primary/30" />
                <div className="flex items-center">
                  <Skeleton className="h-5 w-full rounded bg-primary/30" />
                  <div className="ml-2 h-4 w-4 rounded-full bg-primary/30"></div>
                </div>
              </div>
              {/* Language field */}
              <div className="w-full bg-gray-50 p-2 rounded-md border border-gray-200">
                <Skeleton className="h-3 w-14 mb-1 rounded bg-primary/30" />
                <Skeleton className="h-5 w-20 rounded bg-primary/30" />
              </div>
            </div>
            {/* Card footer with buttons */}
            <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 flex justify-between">
              <Skeleton className="h-8 w-24 rounded bg-red-100" />
              <Skeleton className="h-8 w-24 rounded bg-primary/30" />
            </div>
          </div>
        ))}
      </div>
    ),
    []
  );
  if (error) return <p className="text-red-500">{error}</p>;
  return (
    <div className="p-0 xl:p-6 flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Gestión de Conferencistas</h1>
          <p className="text-gray-500 mt-1">
          {selectedEvent 
            ? `Administrando todas los conferencistas para: ${selectedEvent.des_event}`
            : "Seleccione un evento para administrar sus conferencistas"}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-6 justify-between items-start md:items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar conferencista por nombre/apellido/especialidad..."
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
              className={isRefreshing ? "animate-spin" : ""}
            />
            <span className="hidden md:inline">Actualizar</span>
          </Button>
          <Button
            size="sm"
            onClick={() => setIsExpositorModalOpen(true)}
            className="cursor-pointer bg-primary hover:bg-primary/90 text-white ml-auto flex items-center gap-1"
          >
            <Plus size={16} />
            <span>Agregar nuevo conferencista</span>
          </Button>
        </div>
      </div>
       {/* Mensaje error */}
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
        {!loading && (
          <div className="mb-6">
            <Tabs 
                defaultValue="all" 
                value={activeLanguage}
                onValueChange={(value) => setActiveLanguage(value as LanguageTab)}
                className="w-full"
            >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div className="flex items-center text-gray-800">
                  <Globe
                    size={18}
                    className="text-primary mr-2 flex-shrink-0"
                  />
                  <h2 className="text-lg font-medium">Filtrar por idioma</h2>
                </div>
                <TabsList className="bg-gray-100 p-0.5 w-full sm:w-auto grid grid-cols-3">
                  <TabsTrigger
                    value="all"
                    className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm px-4 py-1.5 rounded-sm"
                  >
                    Todos ({expositors.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="en"
                    className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm px-4 py-1.5 rounded-sm"
                  >
                    Inglés ({getLanguageCount("EN")})
                  </TabsTrigger>
                  <TabsTrigger
                    value="sp"
                    className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm px-4 py-1.5 rounded-sm"
                  >
                    Español ({getLanguageCount("SP")})
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent 
                value={activeLanguage}
                className="mt-0 pt-4 pb-1 flex flex-col">
                  {" "}
                {filteredExpositors.length === 0 && emptyState}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredExpositors.map((expositor) => (
                    <ExpositorCard
                      key={expositor.idAutor}
                      idAutor={expositor.idAutor}
                      nombres={expositor.nombres}
                      apellidos={expositor.apellidos}
                      especialidad={expositor.especialidad}
                      hojaVida={expositor.hojaVida}
                      descripcionIdioma={expositor.descripcionIdioma}
                      foto={expositor.foto}
                      openUpdateModal={() => openUpdateModal(expositor)}
                      onDelete={handleDeleteExpositor}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
        {loading && loadingSkeletons}
      </div>

      <div className="mt-4 text-sm text-gray-500 flex justify-between items-center">
        <span>
          {!loading && filteredExpositors.length > 0
            ? `Mostrando ${filteredExpositors.length} ${
                filteredExpositors.length === 1
                  ? "Conferencista": "Conferencistas"
              }${
                activeLanguage !== "all"
                  ? ` en ${activeLanguage === "en" ? "inglés" : "español"}`
                  : selectedEvent
                  ? ` para ${selectedEvent.des_event}`
                  : ""
              }`
            : ""}
        </span>
        <span className="text-xs">Última actualización: {lastUpdated}</span>
      </div>

      {isExpositorModalOpen && (
      <Dialog open={isExpositorModalOpen} onOpenChange={setIsExpositorModalOpen}>
        <DialogContent className="w-full max-w-md max-h-[90vh] overflow-y-auto">
          <EditExpositorForm
            onClose={() => setIsExpositorModalOpen(false)}
            onAdd={handleAddExpositor}
            selectedEvent={selectedEvent ? { 
              idEvent: selectedEvent.idEvent.toString(),
              des_event: selectedEvent.des_event
            } : undefined}
          />
        </DialogContent>
      </Dialog> 
      )}
      
      {isUpdateModalOpen && selectedExpositor && (
      <Dialog
        open={isUpdateModalOpen}
        onOpenChange={setIsUpdateModalOpen}>
        <DialogContent className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <UpdateExpositorModal
              expositor={selectedExpositor}
              onUpdate={handleUpdateExpositor}
              open={isUpdateModalOpen}
              onClose={() => setIsUpdateModalOpen(false)}
            />
        </DialogContent>
      </Dialog>
    )}
    </div>
  );
}