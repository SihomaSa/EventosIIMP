export interface SponsorType {
	idSponsor: number;
	nombre: string;
	foto?: string;
	prefijoIdioma: string;
	descripcionIdioma: string;
	url: string;
	categoria: SponsorCategory;
}

export type SponsorCategory =
	| "socio estratégico"
	| "oro"
	| "plata"
	| "cobre"
	| "colaborador"
	| "agradecimiento";

export interface NewSponsorType {
	nombre: string;
	foto?: string;
	prefijoIdioma: string;
	descripcionIdioma: string;
	url: string;
	categoria: SponsorCategory;
}
