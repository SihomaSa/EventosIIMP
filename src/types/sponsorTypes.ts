export interface SponsorType {
    id: string;
    title: string;
    image: string;
    url: string;
    date: string; // YYYY-MM-DD
    categories: SponsorCategory[];
  }

  export type SponsorCategory =
  | "socio estratégico"
  | "otro"
  | "plata"
  | "cobre"
  | "colaborador"
  | "agradecimiento";