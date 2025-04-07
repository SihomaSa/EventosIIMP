import { FC } from "react";
import { Program, ProgramCategory } from "../../types/Program";
import ProgramCard from "../ProgramCard/ProgramCard";

type Props = {
  programs: Program[];
  programCategories: ProgramCategory[];
};

const ProgramContainer: FC<Props> = ({ programs, programCategories }) => {
  return (
    <div className="flex flex-col gap-4">
      {programs.map((program, index) => (
        <ProgramCard
          program={program}
          programCategories={programCategories}
          key={`program-${program.fechaPrograma}-${index}`}
        />
      ))}
    </div>
  );
};

export default ProgramContainer;
