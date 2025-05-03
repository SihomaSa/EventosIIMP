import { LanguageType } from "./languageTypes";
export interface BulletinType {//GET
    idTipPre: number;
    idPrensa: number;
    titulo: string;
    foto: string;
    descripcion_prensa: string;
    descripcionIdioma: string;
    prefijoIdioma: string;
    descripcion: string;
    subtitulo: string;
    url: string;
    fecha: string;
    estado: number;
    evento: string;
  }  
 
  export interface NewBulletinType {//POST
    evento: string;
    titulo: string;
    subtitulo: string;
    fecha: string;
    descripcion: string;
    url: string;
    foto: string;
    idioma: LanguageType;
  }
  export interface UpdateBulletinRequestType {//PUT
    titulo: string;
    subtitulo: string;
    descripcion: string;
    url: string;//*
    evento: string;//*
    tipoprensa: "2";
    foto: string;//*
    idioma: LanguageType;//*
    idNews:string; //*
    estado: string;
  }
  export interface NewBulletinRequestType {
    titulo: string;
    subtitulo: string;
    fecha: string;
    descripcion: string;
    url: string;
    evento: string;
    tipoprensa: "2";
    foto: string;
    idioma: LanguageType;
  }