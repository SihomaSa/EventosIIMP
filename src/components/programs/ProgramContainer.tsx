import { FC } from "react";
import { Program, ProgramCategory } from "../../pages/Programs/types/Program";
import ProgramCard from "../../pages/Programs/components/ProgramCard/ProgramCard";
import NewProgramDialog from "./NewProgramDialog";

type Props = {
  programs: Program[];
  programCategories: ProgramCategory[];
};

const ProgramContainer: FC<Props> = ({ programs, programCategories }) => {
  return (
    <div className="flex flex-col gap-4">
      <NewProgramDialog programCategories={programCategories} />
      {programs.map((program, index) => (
        <ProgramCard
          date={program.fechaPrograma}
          program={program}
          programCategories={programCategories}
          key={`program-${program.fechaPrograma}-${index}`}
        />
      ))}
    </div>
  );
};

export default ProgramContainer;
