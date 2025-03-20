import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { BulletinType } from "@/types/bulletinTypes";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function EditBulletinModal({ onAdd, open, onClose }: { 
    onAdd: (newBulletin: BulletinType) => void; 
    open: boolean;
    onClose: () => void;
}) {
    const [title, setTitle] = useState("");
    const [image, setImage] = useState("");
    const [url, setUrl] = useState("");
    const date = format(new Date(), "yyyy-MM-dd"); // Fecha actual

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newBulletin: BulletinType = {
            id: crypto.randomUUID(), // Genera un ID único
            title,
            image,
            date,
            url,
        };
        onAdd(newBulletin);
        setTitle("");
        setImage("");
        setUrl("");
        onClose(); // Cerrar el modal después de agregar
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Agregar Boletín</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="title">Título</Label>
                        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    <div>
                        <Label htmlFor="image">Imagen (URL)</Label>
                        <Input id="image" value={image} onChange={(e) => setImage(e.target.value)} required />
                    </div>
                    <div>
                        <Label htmlFor="url">Enlace</Label>
                        <Input id="url" value={url} onChange={(e) => setUrl(e.target.value)} required />
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
