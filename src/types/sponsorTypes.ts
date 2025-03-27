export interface SponsorType {
	idSponsor: number;
	url: string;
	descripcionIdioma: string;
	categoria: string;
	nombre: string;
	foto: string;
	prefijoIdioma: string;
}

export interface NewSponsorType {
	descripcion: string;
	foto: string;
	url: string;
	categoria: string;
	idioma: string;
}
export interface NewSponsorRequestType {
	descripcion: string;
	foto: string;
	url: string;
	idEvento: string;
	categoria: string;
	idioma: string;
}