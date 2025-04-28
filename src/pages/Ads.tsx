import { useEffect, useState, useCallback, useMemo } from "react";
import { AdType } from "../types/adTypes";
import { Plus, RefreshCw, Newspaper, Globe } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

import AdCard from "@/components/ads/AdCard";
import UpdateAdsModal from "@/components/ads/UpdateAdsModal";
import EditAdsForm from "@/components/ads/EditAdsForm";
import { getAds } from "@/components/services/adsService";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useEventStore } from "../stores/eventStore"; // Importa el store de eventos

type LanguageTab = "all" | "en" | "sp";

export default function Ads() {
  const {selectedEvent } = useEventStore(); // Obtiene el evento seleccionado
  const [ads, setAds] = useState<AdType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAd, setSelectedAd] = useState<AdType | null>(null);
  const [isadsModalOpen, setIsadsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [adsUpdated, setAdsUpdated] = useState(0);
  const [searchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState<LanguageTab>("all");
  const [lastUpdated, setLastUpdated] = useState(
    new Date().toLocaleTimeString()
  );

  const fetchAds = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const data = await getAds();
      
      // Filtrar ads por el evento seleccionado
      const filteredData = selectedEvent 
        ? (data || []).filter(ad => ad.idEvento === selectedEvent.idEvent)
        : data || [];
      
      setAds(filteredData);
      if (error) setError(null);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      setError("Error al obtener las publicidades");
      console.error(err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [error, selectedEvent]); // Añade selectedEvent como dependencia

  useEffect(() => {
    fetchAds();
  }, [adsUpdated, fetchAds]);

  const handleadsAd = () => {
    setAdsUpdated((prev) => prev + 1);
    setIsadsModalOpen(false);
  };

  const handleUpdateAd = () => {
    setLoading(true); 
    setAdsUpdated((prev) => prev + 1);
    setSelectedAd(null);
    setIsUpdateModalOpen(false);
  };

  const handleDeleteAd = () => {
    setAdsUpdated((prev) => prev + 1);
  };

  const openUpdateModal = (ad: AdType) => {
    setSelectedAd(ad);
    setIsUpdateModalOpen(true);
  };
  // const handleRefresh = useCallback(() => {
  //   fetchAds();
  // }, [fetchAds]);
  const handleRefresh = useCallback(() => {
    setLoading(true);         // Mostrar skeletons
    setIsRefreshing(true);    // Animar botón
    fetchAds().finally(() => {
      setIsRefreshing(false); // Detener animación del botón
    });
  }, [fetchAds]);
  
  

  // Helper function to get the count of notes by language
  const getLanguageCount = useCallback(
    (language: string) => {
      return ads.filter((note) => note.prefijoIdioma === language).length;
    },
    [ads]
  );
  // Filtered press notes based on search term and selected language tab
  const filteredAdds = useMemo(() => {
    if (!ads) return [];

    return ads.filter((note) => {
      // First filter by language
      if (
        activeLanguage !== "all" &&
        note.prefijoIdioma.toLowerCase() !== activeLanguage
      ) {
        return false;
      }

      // Then filter by search term
      if (!searchTerm) return true;
      const lowerSearchTerm = searchTerm.toLowerCase();

      return (
        note.prefijoIdioma &&
        note.prefijoIdioma.toLowerCase().includes(lowerSearchTerm)
      );
    });
  }, [ads, searchTerm, activeLanguage]);

  const emptyState = useMemo(
    () => (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Newspaper size={48} className="text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          {selectedEvent 
            ? `No hay publicidad para ${selectedEvent.des_event}`
            : "No hay publicidad"}
        </h3>
        <p className="text-gray-500 max-w-md mb-6">
          {searchTerm
            ? "No se encontraron notas de prensa con ese término de búsqueda"
            : activeLanguage !== "all"
            ? `No hay notas de prensa en ${
                activeLanguage === "en" ? "inglés" : "español"
              }`
            : selectedEvent
            ? `Aún no hay publicidades disponibles para este evento.`
            : "Seleccione un evento para ver sus publicidades o agregue nuevas."}
        </p>
        <Button
          onClick={() => setIsadsModalOpen(true)}
          className="cursor-pointer bg-primary hover:bg-primary/90"
        >
          <Plus size={16} className="mr-1" />
          Agregar nueva publicidad
        </Button>
      </div>
    ),
    [searchTerm, activeLanguage, selectedEvent]
  );
  // Updated loadingSkeletons to match PressCard design
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
              <div className="absolute bottom-0 left-0 p-3 w-full">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-20 rounded-md bg-white/30" />
                </div>
                <Skeleton className="h-6 w-48 mt-1 rounded-md bg-white/30" />
              </div>
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
          Gestión de Publicidades
        </h1>
        <p className="text-gray-500 mt-1">
          {selectedEvent 
            ? `Administrando publicidades para: ${selectedEvent.des_event}`
            : "Seleccione un evento para administrar sus publicidades"}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-6 justify-between items-start md:items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        {/* <div className="relative w-full md:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          			<Input
						placeholder="Buscar publicidad..."
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
            onClick={() => setIsadsModalOpen(true)}
            className="cursor-pointer bg-primary hover:bg-primary/90 text-white ml-auto flex items-center gap-1"
          >
            <Plus size={16} />
            <span>Agregar nueva publicidad</span>
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
                    Todos ({ads.length})
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
                className="mt-0 pt-4 pb-1 flex flex-col"
              >
                {" "}
                {filteredAdds.length === 0 && emptyState}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredAdds.map((ad) => (
                    <AdCard
                      key={ad.idPublicidad}
                      id={ad.idPublicidad}
                      foto={ad.foto}
                      url={ad.url}
                      idioma={ad.descripcionIdioma}
                      openUpdateModal={() => openUpdateModal(ad)}
                      onDelete={handleDeleteAd}
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
          {!loading && filteredAdds.length > 0
            ? `Mostrando ${filteredAdds.length} ${
                filteredAdds.length === 1 ? "Publicidad" : "Publicidades"
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

      {isadsModalOpen && (
        <Dialog open={isadsModalOpen} onOpenChange={setIsadsModalOpen}>
          <DialogContent className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <EditAdsForm
              onClose={() => setIsadsModalOpen(false)}
              onAdd={handleadsAd}
            />
          </DialogContent>
        </Dialog>
      )}

      {isUpdateModalOpen && selectedAd && (
        <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
          <DialogContent className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <UpdateAdsModal
              ad={selectedAd}
              onUpdate={handleUpdateAd}
              onAdd={handleadsAd}
              open={isUpdateModalOpen}
              onClose={() => setIsUpdateModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}