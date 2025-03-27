import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import UpdatePressModal from "@/components/press/UpdatePressModal";
import EditPressForm from "@/components/press/EditPressForm";
import PressCard from "@/components/press/PressCard";
import { PressNoteType } from "@/types/pressNoteTypes";

import { getPressNotes } from "@/components/services/pressNotesService";

export default function PressNotes() {
  const [pressNotes, setPressNotes] = useState<PressNoteType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedPressNote, setSelectedPressNote] = useState<PressNoteType | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [pressnotesUpdated, setPressnotesUpdated] = useState(0);

  useEffect(() => {
    const fetchPressNotes = async () => {
			try {
				const data = await getPressNotes();
				setPressNotes(data?.filter((pressnote) => pressnote.idTipPre === 1) || []);

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (err) {
				setError("Error al obtener los boletines");
			} finally {
				setLoading(false);
			}
		};

    fetchPressNotes();
  }, [pressnotesUpdated]);

  const handleAddPressNote = () => {
    setPressnotesUpdated((prev) => prev + 1);
    setIsAddModalOpen(false);
  };
  
  const handleUpdatePressNote = () => {
    setPressnotesUpdated((prev) => prev + 1);
    setSelectedPressNote(null);
    setIsUpdateModalOpen(false);
  };

  const openUpdateModal = (pressNote: PressNoteType) => {
    setSelectedPressNote(pressNote);
    setIsUpdateModalOpen(true);
  };

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-7">Gestión de Notas de Prensa</h1>

      <div className="flex w-full h-full ">
        <div className="flex flex-wrap gap-4 justify-center w-2/3">
          {loading && (
            <div className="flex gap-4 space-y-3">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex flex-col space-y-3">
                  <Skeleton className="h-[125px] w-[200px] rounded-xl bg-primary/60" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px] bg-primary/60" />
                    <Skeleton className="h-4 w-[200px] bg-primary/60" />
                    <Skeleton className="h-4 w-[200px] bg-primary/60" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-7 w-[200px] bg-primary/60" />
                  </div>
                </div>
              ))}
            </div>
          )}
          {pressNotes.map((pressNote, index) => (
            <PressCard
              key={index}
              pressNote={pressNote}
              openUpdateModal={() => openUpdateModal(pressNote)}
            />
          ))}
        </div>

        <div className="w-1/3 flex flex-col gap-y-4 mx-4">
          <div
            className="text-primary rounded-lg p-4 border border-dashed border-primary flex flex-col items-center justify-center cursor-pointer hover:shadow-xl"
            onClick={() => setIsAddModalOpen(!isAddModalOpen)}
          >
            <h3 className="text-lg font-semibold">Agregar Nota de Prensa</h3>
            <Plus size={50} />
          </div>
          {isAddModalOpen && (
            <EditPressForm
              onClose={() => setIsAddModalOpen(false)}
              onAdd={handleAddPressNote}
            />
          )}
        </div>
      </div>
      {isUpdateModalOpen && selectedPressNote && (
        <UpdatePressModal
          pressNote={selectedPressNote}
          onUpdate={handleUpdatePressNote}
          open={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
        />
      )}
    </div>
  );
}
