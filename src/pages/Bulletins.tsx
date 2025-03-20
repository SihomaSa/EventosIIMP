import { useEffect, useState } from "react";
import { BulletinType } from "../types/bulletinTypes";
import { fetchBullentins } from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import EditBulletinForm from "@/components/bulletins/EditBulletinForm";
import UpdateBulletinForm from "@/components/bulletins/UpdateBulletinForm";

export default function Bulletins() {
  const [bulletins, setBulletins] = useState<BulletinType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formMode, setFormMode] = useState<"add" | "update" | null>(null);
  const [selectedBulletin, setSelectedBulletin] = useState<BulletinType | null>(null);

  useEffect(() => {
    const loadBulletins = async () => {
      try {
        const data = await fetchBullentins();
        setBulletins(data);
      } catch (err) {
        setError("Error al cargar los boletines");
      } finally {
        setLoading(false);
      }
    };

    loadBulletins();
  }, []);

  const handleAddBulletin = (newBulletin: BulletinType) => {
    setBulletins((prev) => [...prev, newBulletin]);
    setFormMode(null);
  };

  const handleUpdateBulletin = (updatedBulletin: BulletinType) => {
    setBulletins((prev) =>
      prev.map((b) => (b.id === updatedBulletin.id ? updatedBulletin : b))
    );
    setFormMode(null);
    setSelectedBulletin(null);
  };

  const toggleForm = (mode: "add" | "update") => {
    if (formMode === mode) {
      setFormMode(null);
      setSelectedBulletin(null);
    } else {
      setFormMode(mode);
      setSelectedBulletin(null);
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Gestión de Boletines</h1>

      {/* Menú de navegación */}
      <NavigationMenu className="py-3 self-end">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger onClick={() => toggleForm("add")}>
              Agregar
            </NavigationMenuTrigger>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger onClick={() => toggleForm("update")}>
              Actualizar
            </NavigationMenuTrigger>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Vista en dos columnas cuando se está actualizando */}
      <div className={`flex w-full ${formMode === "update" ? "flex-row gap-6" : "flex-col items-center"}`}>
        {/* Lista de boletines */}
        <div className={`${formMode === "update" ? "w-1/3" : "w-full flex flex-wrap justify-center"} gap-4`}>
          {loading && <Loader2 className="animate-spin" />}
          {bulletins.map((bulletin) => (
            <Card key={bulletin.id} className="shadow-md overflow-hidden cursor-pointer p-2">
              <CardContent>
                <img src={bulletin.image} alt={bulletin.title} className="object-cover w-full h-auto rounded" />
                <div className="p-2 text-center">
                  <h2 className="text-xl font-bold">{bulletin.title}</h2>
                  <p className="text-gray-500">{bulletin.date}</p>
                  <div className="mt-2 flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedBulletin(bulletin);
                        setFormMode("update");
                      }}
                    >
                      Editar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Formulario de actualización en la derecha */}
        {formMode === "update" && selectedBulletin && (
          <div className="w-2/3">
            <UpdateBulletinForm
              bulletin={selectedBulletin}
              onUpdate={handleUpdateBulletin}
            />
          </div>
        )}
      </div>

      {/* Formulario de agregar (centrado cuando se usa) */}
      {formMode === "add" && <EditBulletinForm onAdd={handleAddBulletin} />}
    </div>
  );
}
