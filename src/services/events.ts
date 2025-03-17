import { EventType } from "../types/eventTypes";
import mockActivities from "./activities";
import mockAds from "./ads";
import mockBulletins from "./bulletins";
import mockPressNotes from "./pressNotes";
import mockSponsors from "./sponsors";

export const mockEvents: EventType[] = [
  {
    idEvent: "1",
    des_event: "Tech Conference 2025",
    foto: "/img/Banner (1).png",
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