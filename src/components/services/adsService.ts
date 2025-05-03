 import { AdType, NewAdRequestType, UpdateAdRequestType } from '@/types/adTypes';

 const {
   VITE_ADS_GET,
   VITE_ADS_POST,
   VITE_ADS_PUT,
   VITE_ADS_DELETE
 } = import.meta.env;

 const getApiUrl = (endpoint: string, id?: string): string => {
  const baseUrl = {
     GET: VITE_ADS_GET,
     POST: VITE_ADS_POST,
     PUT: VITE_ADS_PUT,
     DELETE: VITE_ADS_DELETE
   }[endpoint];

   if (!baseUrl) throw new Error(`URL no configurada para ADS_${endpoint}`);
   return id ? `${baseUrl}/${id}` : baseUrl;
 };

 export const getAds = async (eventId: string = "1"): Promise<AdType[]> => {
   const url = getApiUrl("GET", eventId);
   const response = await fetch(url);
  if (!response.ok) throw new Error(`Error al obtener anuncios (${response.status})`);
   return response.json();
 };

 export const createAd = async (newAd: NewAdRequestType): Promise<AdType> => {
   const response = await fetch(getApiUrl("POST"), {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify(newAd),
   });
  if (!response.ok) throw new Error(`Error al crear anuncio (${response.status})`);
   return response.json();
 };

 export const updateAd = async (editAd: UpdateAdRequestType): Promise<AdType> => {
   const response = await fetch(getApiUrl("PUT"), {
     method: "PUT",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify(editAd),
   });
   if (!response.ok) throw new Error(`Error al actualizar anuncio (${response.status})`);
   return response.json();
 };

 export const deleteAd = async (adId: string): Promise<void> => {
   const response = await fetch(getApiUrl("DELETE", adId), {
     method: "DELETE",
   });
   if (!response.ok) throw new Error(`Error al eliminar anuncio (${response.status})`);
 };
