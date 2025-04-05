import { LanguageType } from "./languageTypes";

export type ActivityTypeMap = {
  1: NewFieldTripRequest;
  2: NewCourseRequest;
  3: NewCoffeeBreakRequest;
  4: NewLunchRequest;
  5: NewExhibitionRibbonCuttingRequest;
  6: NewClosingRequest;
  7: NewOthersRequest;
  8: NewCongressInaugurationRequest;
  9: NewGratitudDinnerRequest;
};
export interface ActivityDetail {
  idActividad: number;
  idDetalleAct: number;
  desTipoActividad: string;
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
export interface ActivityType {
  des_actividad: string;
  idTipoActividad: number;
}
export const ActivityTypes: ActivityType[] = [
  { des_actividad: "VIAJE DE CAMPO", idTipoActividad: 1 },
  { des_actividad: "CURSO CORTO", idTipoActividad: 2 },
  { des_actividad: "PAUSA CAFE", idTipoActividad: 3 },
  { des_actividad: "ALMUERZO", idTipoActividad: 4 },
  { des_actividad: "CORTE DE CINTA DE EXHIBICION", idTipoActividad: 5 },
  { des_actividad: "CLAUSURA", idTipoActividad: 6 },
  { des_actividad: "OTROS", idTipoActividad: 7 },
  { des_actividad: "INAUGURACIÓN DEL CONGRESO", idTipoActividad: 8 },
  { des_actividad: "CENA DE AGRADECIMIENTO", idTipoActividad: 9 },
];
export interface BaseActivityRequestType {
  fechaActividad: string; // yyyy-mm-dd
  idEvento: number;
  idTipoActividad: number;
}

export interface NewFieldTripRequest extends BaseActivityRequestType {
  // idTipoActividad: 1;

    responsable: string;
    titulo: string;
    fechaFin: string;
    fechaIni: string;
    horaFin: string;
    horaIni: string;
    idIdioma: LanguageType;

}
export interface NewCourseRequest extends BaseActivityRequestType {
  // idTipoActividad: 2;

    titulo: string;
    responsable: string;
    traduccion: string;
    horaFin: string;
    horaIni: string;
    idIdioma: LanguageType;
    lugar: string;

}
export interface NewCoffeeBreakRequest extends BaseActivityRequestType {
  // idTipoActividad: 3;

    idIdioma: LanguageType;
    titulo: string;
    horaFin: string;
    horaIni: string;
}
export interface NewLunchRequest extends BaseActivityRequestType {
  // idTipoActividad: 4;

    idIdioma: LanguageType;
    titulo: string;
    horaFin: string;
    horaIni: string;

}
export interface NewExhibitionRibbonCuttingRequest extends BaseActivityRequestType {
  // idTipoActividad: 5;

    idIdioma: LanguageType;
    titulo: string;
    horaFin: string;
    horaIni: string;
    lugar: string;

}
export interface NewClosingRequest extends BaseActivityRequestType {
  // idTipoActividad: 6;

    idIdioma: LanguageType;
    titulo: string;
    horaFin: string;
    horaIni: string;
    lugar: string;

}
export interface NewOthersRequest extends BaseActivityRequestType {
  // idTipoActividad: 7;

    idIdioma: LanguageType;
    responsable: string;
    titulo: string;
    horaFin: string;
    horaIni: string;

}
export interface NewCongressInaugurationRequest extends BaseActivityRequestType {
  // idTipoActividad: 8;

    idIdioma: LanguageType;
    titulo: string;
    horaFin: string;
    horaIni: string;
    lugar: string;

}
export interface NewGratitudDinnerRequest extends BaseActivityRequestType {
  // idTipoActividad: 9;

    idIdioma: LanguageType;
    titulo: string;
    horaFin: string;
    horaIni: string;

}
export interface NewActivityDet {
  fechaActividad: string; // formato "YYYY-MM-DD"
  idEvento: number;
  idTipoActividad: 2 | 1 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | undefined;
  detalles: NewActivityRequest[];
}
export interface GenericActivityDet {
  fechaActividad: string; // formato "YYYY-MM-DD"
  idEvento: number;
  idTipoActividad: 2 | 1 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | undefined;
  detalles: [{
    responsable?: string,
    fechaIni?: string,
    lugar?: string,
    titulo?: string,
    horaIni?: string,
    fechaFin?: string,
    horaFin?: string,
    traduccion?: string,
    duracion?: string,
    idIdioma: LanguageType
  }];
}

export interface GenericActivityOnlyDet {
    responsable?: string,
    fechaIni?: string,
    lugar?: string,
    titulo?: string,
    horaIni?: string,
    fechaFin?: string,
    horaFin?: string,
    traduccion?: string,
    duracion?: string,
    idIdioma: LanguageType
}
export type NewActivityRequest =
  | NewFieldTripRequest
  | NewCourseRequest
  | NewCoffeeBreakRequest
  | NewLunchRequest
  | NewExhibitionRibbonCuttingRequest
  | NewClosingRequest
  | NewOthersRequest
  | NewCongressInaugurationRequest
  | NewGratitudDinnerRequest;