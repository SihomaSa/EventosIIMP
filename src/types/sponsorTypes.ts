export interface SponsorType {
	idSponsor: string;
	nombre: string;
	image?: string;
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
	image?: string;
	prefijoIdioma: string;
	descripcionIdioma: string;
	url: string;
	categoria: SponsorCategory;
}
