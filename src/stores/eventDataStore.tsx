import mockEvents from "../services/events";

export function getSponsors(eventId: string) {
  return mockEvents.find((event) => event.idEvent === eventId)?.sponsors || [];
}

export function getPressNotes(eventId: string) {
  return mockEvents.find((event) => event.idEvent === eventId)?.pressNotes || [];
}

export function getBulletins(eventId: string) {
  return mockEvents.find((event) => event.idEvent === eventId)?.bulletins || [];
}

export function getAds(eventId: string) {
  return mockEvents.find((event) => event.idEvent === eventId)?.ads || [];
}

export function getActivities(eventId: string) {
  return mockEvents.find((event) => event.idEvent === eventId)?.activities || [];
}