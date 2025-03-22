// const simulateFetch = <T>(data: T, delay = 1000): Promise<T> => {
  const simulateFetch = <T>(data: T, delay = 0): Promise<T> => {
	return new Promise((resolve) => {
		setTimeout(() => resolve(data), delay);
	});
};

export const fetchEvents = () =>
	simulateFetch(import("./events").then((m) => m.default));
export const fetchSponsors = () =>
	simulateFetch(import("./sponsors").then((m) => m.default));
export const fetchPressNotes = () =>
	simulateFetch(import("./pressNotes").then((m) => m.default));
export const fetchActivities = () =>
	simulateFetch(import("./activities").then((m) => m.default));
export const fetchBullentins = () =>
	simulateFetch(import("./bulletins").then((m) => m.default));
export const fetchAds = () =>
	simulateFetch(import("./ads").then((m) => m.default));
export const fetchExpositors = () =>
	simulateFetch(import("./expositors").then((m) => m.default));
export const fetchExpositorById = async (id: string) => {
	const expositors = await fetchExpositors();
	return expositors.find((expo) => expo.idautor === id) || null;
};
