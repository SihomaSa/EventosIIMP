import { FC, useMemo, useState } from "react";
import { Program, ProgramCategory } from "../../pages/Programs/types/Program";
import ProgramCard from "../../pages/Programs/components/ProgramCard/ProgramCard";
import { Button } from "@/components/ui/button";
import { TabsList, TabsTrigger, Tabs, TabsContent } from "@/components/ui/tabs";
import { Languages, Globe } from "lucide-react";

type Props = {
  programs: Program[];
  programCategories: ProgramCategory[];
  showNewProgramButton?: boolean;
};

type LanguageTab = "all" | "en" | "sp";

const ProgramContainer: FC<Props> = ({
  programs,
  programCategories,
  showNewProgramButton = true
}) => {
  const [activeLanguage, setActiveLanguage] = useState<LanguageTab>("all");

  // Group programs by language
  const programsByLanguage = useMemo(() => {
    const english = programs.filter(program =>
      program.detalles?.some(detail => detail.prefijoIdioma === "EN" || detail.idIdioma === "1")
    );

    const spanish = programs.filter(program =>
      program.detalles?.some(detail => detail.prefijoIdioma === "SP" || detail.idIdioma === "2")
    );

    return {
      all: programs,
      en: english,
      sp: spanish
    };
  }, [programs]);

  // Helper function to get the count of programs by language
  const getLanguageCount = (language: LanguageTab) => {
    return programsByLanguage[language].length;
  };

  return (
    <div className="flex flex-col gap-4 mt-4 w-full">
      <Tabs
        defaultValue="all"
        value={activeLanguage}
        onValueChange={(value) => setActiveLanguage(value as LanguageTab)}
        className="w-full"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-0 w-full">
          <div className="flex items-center text-gray-800">
            <Globe size={18} className="text-primary mr-2 flex-shrink-0" />
            <h2 className="text-lg font-medium">Filtrar por idioma</h2>
          </div>

          <div className="w-full sm:w-auto max-w-full overflow-x-auto pb-1">
            <TabsList className="bg-gray-100 p-0.5 w-full sm:w-auto grid grid-cols-3 min-w-[300px]">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm px-4 py-1.5 rounded-sm text-sm whitespace-nowrap"
              >
                Todos ({getLanguageCount("all")})
              </TabsTrigger>
              <TabsTrigger
                value="en"
                className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm px-4 py-1.5 rounded-sm text-sm whitespace-nowrap"
              >
                English ({getLanguageCount("en")})
              </TabsTrigger>
              <TabsTrigger
                value="sp"
                className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm px-4 py-1.5 rounded-sm text-sm whitespace-nowrap"
              >
                Español ({getLanguageCount("sp")})
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="all" className="mt-0 pt-2 flex flex-col space-y-4 w-full">
          {programsByLanguage.all.length === 0 ? (
            <div className="p-8 text-center bg-white border border-gray-200 rounded-lg shadow-sm">
              <Languages className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No hay programas disponibles
              </h3>
              <p className="text-gray-500 max-w-md mx-auto mb-4">
                Aún no hay programas disponibles.
              </p>
            </div>
          ) : (
            programsByLanguage.all.map((program, index) => (
              <ProgramCard
                date={program.fechaPrograma}
                program={program}
                programCategories={programCategories}
                key={`program-all-${program.fechaPrograma}-${index}`}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="en" className="mt-0 pt-2 flex flex-col space-y-4 w-full">
          {programsByLanguage.en.length === 0 ? (
            <div className="p-8 text-center bg-white border border-gray-200 rounded-lg shadow-sm">
              <Languages className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No hay programas en inglés
              </h3>
              <p className="text-gray-500 max-w-md mx-auto mb-4">
                Aún no hay programas disponibles para el idioma seleccionado.
              </p>
              <Button onClick={() => setActiveLanguage("all")}>
                Ver todos los programas
              </Button>
            </div>
          ) : (
            programsByLanguage.en.map((program, index) => (
              <ProgramCard
                date={program.fechaPrograma}
                program={program}
                programCategories={programCategories}
                key={`program-en-${program.fechaPrograma}-${index}`}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="sp" className="mt-0 pt-2 flex flex-col space-y-4 w-full">
          {programsByLanguage.sp.length === 0 ? (
            <div className="p-8 text-center bg-white border border-gray-200 rounded-lg shadow-sm">
              <Languages className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No hay programas en español
              </h3>
              <p className="text-gray-500 max-w-md mx-auto mb-4">
                Aún no hay programas disponibles para el idioma seleccionado.
              </p>
              <Button onClick={() => setActiveLanguage("all")}>
                Ver todos los programas
              </Button>
            </div>
          ) : (
            programsByLanguage.sp.map((program, index) => (
              <ProgramCard
                date={program.fechaPrograma}
                program={program}
                programCategories={programCategories}
                key={`program-sp-${program.fechaPrograma}-${index}`}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProgramContainer;