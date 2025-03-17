import { SponsorType } from "./sponsorTypes";
import { PressNoteType } from "./pressNoteTypes";
import { BulletinType } from "./bulletinTypes";
import { AdType } from "./adTypes";
import { ActivityType } from "./activityTypes";

export interface EventType {
  idEvent: string;
  des_event: string;
  foto: string;
  color: string;
  subcolor: string;
  sponsors: SponsorType[];
  pressNotes: PressNoteType[];
  bulletins: BulletinType[];
  ads: AdType[];
  activities: ActivityType[];
}
