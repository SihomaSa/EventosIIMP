import { LanguageType } from "./languageTypes";

export interface ExpositorType {//GET
	idAutor: number;
	idEvento: number;
	nombres: string;
	apellidos: string;
	hojaVida: string;
	especialidad: string;
	prefijoIdioma: string;
	descripcionIdioma: string;
	foto: string;
}
export interface NewExpositorType {//POST
	idEvento: number;
	nombres: string;
	apellidos: string;
	hojaVida: string;
	especialidad: string;
	idIdioma: string;
	descripcionIdioma: LanguageType;
	foto: string;
}
export interface UpdateExpositorRequestType {//PUT
	idAuthor: string;
	evento: string;
	nombres: string;
	apellidos: string;
	especialidad: string;
	hojaVida: string;
	idIdioma: number;
	descripcionIdioma: LanguageType;
	foto: string ;
}
