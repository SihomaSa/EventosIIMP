import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BulletinType } from "@/types/bulletinTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";

// ✅ Definimos el esquema de validación con Zod
const bulletinSchema = z.object({
    titulo: z.string().min(3, "El título debe tener al menos 3 caracteres"),
    foto: z.string().url("Debe ser una URL válida"),
    url: z.string().url("Debe ser una URL válida"),
    descripcionIdioma: z.enum(["ES", "EN"], { message: "Selecciona un idioma válido" }),
});

// ✅ Tipo basado en Zod
type BulletinFormValues = z.infer<typeof bulletinSchema>;

export default function EditBulletinModal({ onAdd, open, onClose }: { 
    onAdd: (newBulletin: BulletinType) => void; 
    open: boolean;
    onClose: () => void;
}) {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<BulletinFormValues>({
        resolver: zodResolver(bulletinSchema),
        defaultValues: {
            titulo: "",
            foto: "",
            url: "",
            descripcionIdioma: "ES",
        },
    });

    const date = format(new Date(), "yyyy-MM-dd"); // Fecha actual

    const onSubmit = (data: BulletinFormValues) => {
        const newBulletin: BulletinType = {
            idTipPre: crypto.randomUUID(), // Genera un ID único
            titulo: data.titulo,
            foto: data.foto,
            url: data.url,
            descripcion_prensa: "", // Puedes ajustarlo
            descripcionIdioma: data.descripcionIdioma,
            prefijoIdioma: data.descripcionIdioma.toLowerCase(),
            descripcion: "",
            subtitulo: "",
        };
        onAdd(newBulletin);
        reset(); // Resetea el formulario
        onClose(); // Cierra el modal
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Agregar Boletín</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Label htmlFor="titulo">Título</Label>
                        <Input id="titulo" {...register("titulo")} />
                        {errors.titulo && <p className="text-red-500 text-sm">{errors.titulo.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="foto">Imagen (URL)</Label>
                        <Input id="foto" {...register("foto")} />
                        {errors.foto && <p className="text-red-500 text-sm">{errors.foto.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="url">Enlace</Label>
                        <Input id="url" {...register("url")} />
                        {errors.url && <p className="text-red-500 text-sm">{errors.url.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="descripcionIdioma">Idioma</Label>
                        <select id="descripcionIdioma" {...register("descripcionIdioma")} className="w-full border p-2 rounded-md">
                            <option value="ES">Español</option>
                            <option value="EN">Inglés</option>
                        </select>
                        {errors.descripcionIdioma && <p className="text-red-500 text-sm">{errors.descripcionIdioma.message}</p>}
                    </div>

                    <p className="text-sm text-gray-500">Fecha de creación: {date}</p>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                        <Button type="submit">Guardar</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
