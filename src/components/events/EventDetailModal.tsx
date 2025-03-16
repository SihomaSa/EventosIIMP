import { useState } from "react";
import EventEditModal from "./EventEditModal";

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
}

interface EventDetailModalProps {
  event: Event;
  onClose: () => void;
  onUpdate: (updatedEvent: Event) => void;
}

export default function EventDetailModal({ event, onClose, onUpdate }: EventDetailModalProps) {

  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold">{event.title}</h2>
        <p className="text-gray-600">{event.date} - {event.location}</p>
        <p className="mt-4">{event.description}</p>
        
        <div className="mt-4 flex justify-between">
            <button
              className="px-4 py-2 bg-amber-800 text-white rounded-md hover:bg-amber-900 transition"
              onClick={onClose}
              >
              Cerrar
            </button>

            <button
              className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
              onClick={() => setIsEditing(true)}
              >
              Editar
            </button>
          </div>
      </div>
    </div>
    {isEditing && (
        <EventEditModal
          event={event}
          onClose={() => setIsEditing(false)}
          onSave={(updatedEvent) => {
            onUpdate(updatedEvent);
            setIsEditing(false);
          }}
        />
      )}
    </>
  );
}
