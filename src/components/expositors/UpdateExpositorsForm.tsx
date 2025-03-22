import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExpositorType } from "@/types/expositorTypes";

const expositorSchema = z.object({
	nombres: z.string().min(1, "Ingrese un nombre válido"),
	apellidos: z.string().min(1, "Ingrese un apellido válido"),
	especialidad: z.string().min(1, "Ingrese una especialidad válida"),
	hojavida: z.string().min(1, "Ingrese una hoja de vida válida"),
	image: z.string().url("Debe ser una URL válida").optional(),
});

type expositorFormValues = z.infer<typeof expositorSchema>;

export default function UpdateExpositorsForm({
	expositor,
	onUpdate,
}: {
	expositor: ExpositorType;
	onUpdate: (updated: ExpositorType) => void;
}) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<expositorFormValues>({
		resolver: zodResolver(expositorSchema),
		defaultValues: {
			image: expositor.image,
			nombres: expositor.nombres,
			apellidos: expositor.apellidos,
			especialidad: expositor.especialidad,
			hojavida: expositor.hojavida,
		},
	});

	const onSubmit = (data: expositorFormValues) => {
		const updatedExpositor = { ...expositor, ...data };
		onUpdate(updatedExpositor);
	};

	return (
		<div className="w-full max-w-md bg-white p-4 rounded-lg shadow-md">
			<h2 className="text-lg font-bold mb-4">Actualizar Publicidad</h2>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				<div>
					<Label htmlFor="nombres">Nombres</Label>
					<Input id="nombres" {...register("nombres")} />
					{errors.image && (
						<p className="text-red-500 text-sm">{errors.image.message}</p>
					)}
				</div>
				<div>
					<Label htmlFor="apellidos">Apellidos</Label>
					<Input id="apellidos" {...register("apellidos")} />
					{errors.image && (
						<p className="text-red-500 text-sm">{errors.image.message}</p>
					)}
				</div>

				<div>
					<Label htmlFor="especialidad">Frase</Label>
					<Input id="especialidad" {...register("especialidad")} />
					{errors.image && (
						<p className="text-red-500 text-sm">{errors.image.message}</p>
					)}
				</div>
				<div>
					<Label htmlFor="hojavida">Hoja de Vida</Label>
					<textarea id="hojavida" {...register("hojavida")} className="w-full border" />
					{errors.hojavida && (
						<p className="text-red-500 text-sm">{errors.hojavida.message}</p>
					)}
				</div>
				<div>
					<Label htmlFor="image">Foto</Label>
					<Input id="image" {...register("image")} />
					{errors.image && (
						<p className="text-red-500 text-sm">{errors.image.message}</p>
					)}
				</div>
				<Button type="submit" className="w-full">
					Actualizar
				</Button>
			</form>
		</div>
	);
}
