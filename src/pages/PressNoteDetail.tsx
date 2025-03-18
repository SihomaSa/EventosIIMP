import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPressNotes } from "@/services/api";
import { PressNoteType } from "@/types/pressNoteTypes";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";

export default function PressNoteDetail() {
	const { id } = useParams<{ id: string }>();
	const [pressNote, setPressNote] = useState<PressNoteType | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadPressNote = async () => {
			try {
				const data = await fetchPressNotes();
				const foundNote = data.find((note) => note.id === id);

				if (!foundNote) {
					setError("Nota de prensa no encontrada");
					return;
				}

				setPressNote(foundNote);
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (err) {
				setError("Error al cargar la nota de prensa");
			} finally {
				setLoading(false);
			}
		};

		if (id) loadPressNote();
	}, [id]);

	if (loading) return <p>Cargando nota de prensa...</p>;
	if (error) return <p className="text-red-500">{error}</p>;

	return (
		<div className="h-screen bg-orange-50 overflow-hidden">
			<Header />
			<div className="px-3 sm:px-20 py-10 flex flex-col items-center justify-center relative max-h-full h-[90vh]">
				<p className="text-white bg-amber-600 p-2">{pressNote?.date}</p>
				<Card className="text-center mt-6 max-w-2/3 py-6 px-10 flex flex-col items-center relative overflow-y-scroll">
					<h1 className="text-2xl sm:text-3xl font-bold max-w-3xl py-2">
						{pressNote?.title}
					</h1>
					<img
						src={pressNote?.image}
						alt={pressNote?.title}
						className="mt-4 w-full max-w-lg"
					/>
					<p className="text-justify">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
						eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
						ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
						aliquip ex ea commodo consequat. Duis aute irure dolor in
						reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
						pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
						culpa qui officia deserunt mollit anim id est laborum.
						<br />
						Sed ut perspiciatis unde omnis iste natus error sit voluptatem
						accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
						quae ab illo inventore veritatis et quasi architecto beatae vitae
						dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
						aspernatur aut odit aut fugit, sed quia consequuntur magni dolores
						eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est,
						qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit,
						sed quia non numquam eius modi tempora incidunt ut labore et dolore
						magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis
						nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut
						aliquid ex ea commodi consequatur? Quis autem vel eum iure
						reprehenderit qui in ea voluptate velit esse quam nihil molestiae
						consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla
						pariatur?
					</p>
				</Card>
			</div>
		</div>
	);
}
