import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImagePlus } from "lucide-react";
import { useRef, useState } from "react";

interface ImageInputProps {
  onChange: (file: File) => void;
  preview: string | null;
  fileName: string | null;
  setPreview: (preview: string | null) => void;
  setFileName: (name: string | null) => void;
}

export function ImageInput({ onChange, preview, fileName, setPreview, setFileName }: ImageInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // ✅ Estado para errores
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validación del tamaño: 1MB = 1024 * 1024 bytes
      if (file.size > 1024 * 1024) {
        setErrorMessage("La imagen excede el tamaño máximo permitido de 1MB.");
        e.target.value = ""; // Limpia el input
        return;
      }
      setErrorMessage(null);
      setPreview(URL.createObjectURL(file));
      setFileName(file.name);
      onChange(file);
    }
  };

  return (
    <div>
      <Label htmlFor="foto" className="mb-2">
        Imagen
      </Label>
      <Input
        ref={fileInputRef}
        id="foto"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
      />
      <Label htmlFor="foto" className="cursor-pointer max-w-55 w-full">
        <Button variant="outline" size="icon" className="w-full flex border-gray border-1" onClick={() => fileInputRef.current?.click()}>
          <span className="bg-primary-foreground rounded-l-lg w-full h-full flex items-center justify-center">
            <ImagePlus />
          </span>
          <span className={`w-full h-full text-stone-500 flex items-center justify-center pr-2 ${fileName && "truncate"}`}>
            {fileName ? fileName : "Seleccione un archivo"}
          </span>
        </Button>
      </Label>
      {errorMessage && (<p className="text-red-500 text-sm mt-2">{errorMessage}</p>)}
      {preview && <img src={preview} alt="Vista previa" className="mt-2 w-full h-auto rounded" />}
    </div>
  );
}
