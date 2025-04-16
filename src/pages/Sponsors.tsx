import { useEffect, useState, useCallback, useMemo } from "react";
import { SponsorType } from "@/types/sponsorTypes";
import { Plus, RefreshCw, Search, Newspaper } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SponsorCard from "@/components/sponsors/SponsorCard";
import UpdateSponsorModal from "@/components/sponsors/UpdateSponsorModal";
import EditSponsorForm from "@/components/sponsors/EditSponsorForm";
import { getSponsors } from "@/components/services/sponsorsService";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
export default function Sponsors() {
  const [sponsors, setSponsors] = useState<SponsorType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSponsor, setSelectedSponsor] = useState<SponsorType | null>(null);
  const [isSponsorModalOpen, setIsSponsorModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [sponsorsUpdated, setSponsorsUpdated] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());

  const fetchSponsors = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const data = await getSponsors();
      setSponsors(data || []);
      setLastUpdated(new Date().toLocaleTimeString());
      if (error) setError(null);
    } catch (err) {
      setError("Error al obtener los auspiciadores");
      console.error(err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [error]);

  useEffect(() => {
    fetchSponsors();
  }, [fetchSponsors, sponsorsUpdated]);

  const handleAddSponsor = () => {
    setSponsorsUpdated((prev) => prev + 1);
    setIsSponsorModalOpen(false);
    toast.success("Auspiciador agregado correctamente");
  };

  const handleUpdateSponsor = () => {
    setSponsorsUpdated((prev) => prev + 1);
    setSelectedSponsor(null);
    setIsUpdateModalOpen(false);
    toast.success("Auspiciador actualizado correctamente");
  };

  const handleDeleteSponsor = useCallback(() => {
    setSponsorsUpdated((prev) => prev + 1);
    toast.success("Auspiciador eliminado correctamente");
  }, []);

  const openUpdateModal = (sponsor: SponsorType) => {
    setSelectedSponsor(sponsor);
    setIsUpdateModalOpen(true);
  };

  const handleRefresh = useCallback(() => {
    fetchSponsors();
  }, [fetchSponsors]);

  const filteredSponsors = useMemo(() => {
    if (!searchTerm) return sponsors;

    const term = searchTerm.toLowerCase();
    return sponsors.filter((sponsor) =>
      `${sponsor.nombre} ${sponsor.descripcionIdioma} ${sponsor.categoria}`
        .toLowerCase()
        .includes(term)
    );
  }, [sponsors, searchTerm]);

  const emptyState = useMemo(() => (
    <div className="flex flex-col items-center justify-center py-12 text-center text-gray-600">
      <Newspaper size={48} className="text-gray-300 mb-4" />
      <h3 className="text-lg font-semibold mb-2">
        {searchTerm.trim() ? "No se encontraron auspiciadores" : "Aún no hay auspiciadores registrados"}
      </h3>
      <p className="text-sm mb-4">
        {searchTerm.trim() ? "Intenta con otro término de búsqueda" : "Agrega un nuevo auspiciador para comenzar."}
      </p>
      <Button
        onClick={() => setIsSponsorModalOpen(true)}
        className="cursor-pointer bg-primary hover:bg-primary/90"
      >
        <Plus size={16} className="mr-1" /> Agregar auspiciador
      </Button>
    </div>
  ), [searchTerm]);

  const loadingSkeletons = useMemo(() => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="border shadow-sm rounded-lg overflow-hidden h-full flex flex-col">
          <div className="relative w-full h-44">
            <Skeleton className="absolute inset-0 rounded-t-lg bg-primary/30" />
            <div className="absolute bottom-0 left-0 p-3 w-full">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-20 rounded-md bg-white/30" />
              </div>
              <Skeleton className="h-6 w-48 mt-1 rounded-md bg-white/30" />
            </div>
          </div>
          <div className="p-3 bg-white flex-grow flex flex-col gap-2">
            <div className="w-full bg-gray-50 p-2 rounded-md border border-gray-200">
              <Skeleton className="h-3 w-16 mb-1 rounded bg-primary/30" />
              <Skeleton className="h-5 w-full rounded bg-primary/30" />
            </div>
            <div className="w-full bg-gray-50 p-2 rounded-md border border-gray-200">
              <Skeleton className="h-3 w-24 mb-1 rounded bg-primary/30" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-full rounded bg-primary/30" />
                <Skeleton className="h-4 w-3/4 rounded bg-primary/30" />
                <Skeleton className="h-4 w-5/6 rounded bg-primary/30" />
              </div>
            </div>
            <div className="w-full bg-gray-50 p-2 rounded-md border border-gray-200">
              <Skeleton className="h-3 w-12 mb-1 rounded bg-primary/30" />
              <div className="flex items-center">
                <Skeleton className="h-5 w-full rounded bg-primary/30" />
                <div className="ml-2 h-4 w-4 rounded-full bg-primary/30"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  ), []);

  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 xl:p-6 flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Gestión de Auspiciadores</h1>
        <p className="text-gray-500 mt-1">Administre todos los auspiciadores del evento</p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-6 justify-between items-start md:items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por nombre, descripción o categoría..."
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
            <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
            <span className="hidden md:inline">Actualizar</span>
          </Button>
          <Button
            size="sm"
            onClick={() => setIsSponsorModalOpen(true)}
            className="cursor-pointer bg-primary hover:bg-primary/90 text-white ml-auto flex items-center gap-1"
          >
            <Plus size={16} />
            <span>Agregar nuevo auspiciador</span>
          </Button>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 md:p-6 border border-gray-200 min-h-[70vh]">
        {loading && loadingSkeletons}
        {!loading && filteredSponsors.length === 0 && emptyState}
        {!loading && filteredSponsors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredSponsors.map((sponsor) => (
              <SponsorCard
                key={sponsor.idSponsor}
                sponsor={sponsor}
                onEdit={() => openUpdateModal(sponsor)}
                onDelete={handleDeleteSponsor}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-500 flex justify-between items-center">
        <span className="text-xs">Última actualización: {lastUpdated}</span>
      </div>

      {isSponsorModalOpen && (
        <Dialog open={isSponsorModalOpen} onOpenChange={setIsSponsorModalOpen}>
        <DialogContent className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <EditSponsorForm
              open={isSponsorModalOpen}
              onClose={() => setIsSponsorModalOpen(false)}
              onAdd={handleAddSponsor}
            />
           </DialogContent>
      </Dialog>

      )}

      <Dialog
              
              open={isUpdateModalOpen && !!selectedSponsor}
              onOpenChange={(open) => {
                if (!open) {
                  setIsUpdateModalOpen(false);
                  setTimeout(() => {
                  setSelectedSponsor(null);
                  }, 100);
                }
              }}
            >

      
       
       <DialogContent className="w-full max-w-md max-h-[90vh] overflow-y-auto">
       {selectedSponsor && (
            <UpdateSponsorModal
              sponsor={selectedSponsor}
              onUpdate={handleUpdateSponsor}
              open={isUpdateModalOpen}
              onClose={() => setIsUpdateModalOpen(false)}
              
            />
            )}
          </DialogContent> 
      </Dialog>
    </div>
  );
}