import { EventType } from "../types/eventTypes";
import mockActivities from "./activities";
import mockAds from "./ads";
import mockBulletins from "./bulletins";
import mockPressNotes from "./pressNotes";
import mockSponsors from "./sponsors";

export const mockEvents: EventType[] = [
  {
    idEvent: "1",
    des_event: "Perumin",
    foto: "/img/LOGOS_perumin 1.png",
    color: "#c39254",
    subcolor: "#ebdbc6",
    sponsors: mockSponsors,
    pressNotes: mockPressNotes,
    bulletins: mockBulletins,
    ads: mockAds,
    activities: mockActivities,
  },
  {
    idEvent: "2",
    des_event: "ProExplo",
    foto: "/img/proexplo.png",
    color: "#c39254",
    subcolor: "#ebdbc6",
    sponsors: mockSponsors,
    pressNotes: mockPressNotes,
    bulletins: mockBulletins,
    ads: mockAds,
    activities: mockActivities,
  },
  {
    idEvent: "3",
    des_event: "Jueves Minero",
    foto: "/img/jjueves.png",
    color: "#c39254",
    subcolor: "#ebdbc6",
    sponsors: mockSponsors,
    pressNotes: mockPressNotes,
    bulletins: mockBulletins,
    ads: mockAds,
    activities: mockActivities,
  },
  {
    idEvent: "4",
    des_event: "Insituto de Ingenieros",
    foto: "/img/LOGOS_iimp 1.png",
    color: "#c39254",
    subcolor: "#ebdbc6",
    sponsors: mockSponsors,
    pressNotes: mockPressNotes,
    bulletins: mockBulletins,
    ads: mockAds,
    activities: mockActivities,
  },
];
export default mockEvents;