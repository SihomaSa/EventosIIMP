import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdType } from "@/types/adTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";

// ✅ Esquema de validación con Zod
const adSchema = z.object({
    foto: z.string().url("Debe ser una URL válida"),
    url: z.string().url("Debe ser una URL válida"),
    descripcionIdioma: z.enum(["ES", "EN"], { message: "Selecciona un idioma válido" }),
    estado: z.number().int().min(0).max(1, "El estado debe ser 0 (inactivo) o 1 (activo)"),
});

// ✅ Tipo basado en Zod
type AdFormValues = z.infer<typeof adSchema>;

export default function EditAdsModal({ onAdd, open, onClose }: { 
    onAdd: (newAd: AdType) => void; 
    open: boolean;
    onClose: () => void;
}) {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<AdFormValues>({
        resolver: zodResolver(adSchema),
        defaultValues: {
            foto: "",
            url: "",
            descripcionIdioma: "ES",
            estado: 1, // Activo por defecto
        },
    });

    const date = format(new Date(), "yyyy-MM-dd"); // Fecha actual

    const onSubmit = (data: AdFormValues) => {
        const newAd: AdType = {
            idPublicidad: Date.now(), // Se genera internamente
            idEvento: 1, // Valor interno, no modificable por el usuario
            foto: data.foto,
            url: data.url,
            descripcionIdioma: data.descripcionIdioma,
            prefijoIdioma: data.descripcionIdioma.toLowerCase(),
            estado: data.estado,
        };
        onAdd(newAd);
        reset(); // Resetea el formulario
        onClose(); // Cierra el modal
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Agregar Publicidad</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                            <option value="SP">Español</option>
                            <option value="EN">Inglés</option>
                        </select>
                        {errors.descripcionIdioma && <p className="text-red-500 text-sm">{errors.descripcionIdioma.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="estado">Estado</Label>
                        <select id="estado" {...register("estado", { valueAsNumber: true })} className="w-full border p-2 rounded-md">
                            <option value={1}>Activo</option>
                            <option value={0}>Inactivo</option>
                        </select>
                        {errors.estado && <p className="text-red-500 text-sm">{errors.estado.message}</p>}
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
