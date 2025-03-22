import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewExpositorType } from "@/types/expositorTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// ✅ Esquema de validación con Zod
const expositorSchema = z.object({
    nombres: z.string().min(1, "Ingrese un nombre válido"),
    apellidos: z.string().min(1, "Ingrese un apellido válido"),
    especialidad: z.string().min(1, "Ingrese una especialidad válida"),
    hojavida: z.string().min(1, "Ingrese una hoja de vida válida"),
    image: z.string().url("Debe ser una URL válida").optional(), // Opcional
});


// ✅ Tipo basado en Zod
type expositorFormValues = z.infer<typeof expositorSchema>;

export default function EditExpositorsModal({ onAdd, open, onClose }: { 
    onAdd: (newExpositor: NewExpositorType) => void;
    open: boolean;
    onClose: () => void;
}) {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<expositorFormValues>({
        resolver: zodResolver(expositorSchema),
        defaultValues: {
            image: "",
            nombres: "",
            apellidos: "",
            especialidad: "",
            hojavida: "",
        },
    });

    const onSubmit = (data: expositorFormValues) => {

        const newExpositor: NewExpositorType = {
            image: data.image,
            nombres: data.nombres,
            apellidos: data.apellidos,
            especialidad: data.especialidad,
            hojavida: data.hojavida,
        };
        onAdd(newExpositor);
        reset(); // Resetea el formulario
        onClose(); // Cierra el modal
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Agregar Conferencista</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Label htmlFor="nombres">Nombres</Label>
                        <Input id="nombres" {...register("nombres")} />
                        {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="apellidos">Apellidos</Label>
                        <Input id="apellidos" {...register("apellidos")} />
                        {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="especialidad">Frase</Label>
                        <Input id="especialidad" {...register("especialidad")} />
                        {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="hojavida">Hoja de Vida</Label>
                        <Input id="hojavida" {...register("hojavida")} />
                        {errors.hojavida && <p className="text-red-500 text-sm">{errors.hojavida.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="image">Foto</Label>
                        <Input id="image" {...register("image")} />
                        {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                        <Button type="submit">Guardar</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
