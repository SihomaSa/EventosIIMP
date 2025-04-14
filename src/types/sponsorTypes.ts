import { LanguageType } from "./languageTypes";

export interface SponsorType { //GET
	idSponsor: number;
	prefijoIdioma: string;
	foto: string;
	categoria: string;
	nombre: string;
	url: string;
	descripcionIdioma: string;
}
export interface NewSponsorRequestType {//POST
    descripcion: string;
    foto: string;
	url: string;
	idEvento: 1;
	categoria: string;
    idioma: LanguageType;
  }
  export interface UpdateSponsorRequestType {  //PUT
	descripcion: string;
	foto: string;
	url: string;
	idEvento:1 ;
	categoria: string;
	idioma: LanguageType;
	estado: string;
	idSponsor: number;
  }
 
  export interface NewSponsorType {
	idEvento: number;
	descripcion: string;
	foto: string;
	url: string;
	categoria: string;
	idioma: LanguageType;
}