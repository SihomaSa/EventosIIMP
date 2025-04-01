export interface ActivityDetail {
  idActividad: number;
  idDetalleAct: number;
  desTipoActividad: string;
  idTipoActividad: number;
  responsable?: string | null;
  lugar?: string | null;
  horaIni?: string;
  horaFin?: string;
  idioma?: string | null;
}

export interface ActivityDay {
  fechaActividad: string; // formato "YYYY-MM-DD"
  detalles: ActivityDetail;
}

export type Activities = ActivityDay[];
