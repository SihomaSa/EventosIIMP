import { useEffect, useState } from "react";

interface Event {
	idEvent: number;
	des_event: string;
	foto: string;
	estado: string;
	subcolor: string;
	color: string;
}

export function useEvents() {
	const [events, setEvents] = useState<Event[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
        fetch("https://3damgcmqcg.execute-api.us-east-1.amazonaws.com/mob/event", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            redirect: "follow",
          })
            .then((response) => response.text()) // <-- Probamos con text() para ver la respuesta cruda
            .then((data) => {
              console.log("Respuesta cruda de la API:", data);
              try {
                const jsonData = JSON.parse(data); // Intentamos parsear como JSON
                console.log("Datos JSON:", jsonData);
              } catch (error) {
                console.error("No es un JSON válido:", error);
              }
            })
            .catch((err) => console.error("Error en la petición:", err));
          
	}, []);

	return { events, loading, error };
}
