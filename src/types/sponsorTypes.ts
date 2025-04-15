// import { LanguageType } from "./languageTypes";

export interface SponsorType { //GET
	idSponsor: number;
	idEvento: number;
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
	idEvento: string | number;
	categoria: string;
    idioma: string | number;
  }
  export interface UpdateSponsorRequestType {  //PUT
	descripcion: string;
	foto: string;
	url: string;
	idEvento: number;
	categoria: string;
	idioma: string | number;
	estado: string;
	idSponsor: number;
  }

  export interface NewSponsorType {
	idEvento: number;
	descripcion: string;
	foto: string;
	url: string;
	categoria: string;
	idioma: string | number;
}