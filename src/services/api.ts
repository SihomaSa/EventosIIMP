const simulateFetch = <T>(data: T, delay = 500): Promise<T> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(data), delay);
    });
  };
  
  export const fetchEvents = () => simulateFetch(import("./events").then(m => m.default));
  export const fetchSponsors = () => simulateFetch(import("./sponsors").then(m => m.default));
  export const fetchPressReleases = () => simulateFetch(import("./pressNotes").then(m => m.default));
  export const fetchActivities = () => simulateFetch(import("./activities").then(m => m.default));
  export const fetchNewsletters = () => simulateFetch(import("./bulletins").then(m => m.default));
  export const fetchAds = () => simulateFetch(import("./ads").then(m => m.default));
  