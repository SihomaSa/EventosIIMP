import { FC } from "react";
import { Program } from "../../types/Program";
import ProgramCard from "../ProgramCard/ProgramCard";

type Props = {
  programs: Program[];
};

const ProgramContainer: FC<Props> = ({ programs }) => {
  return (
    <div className="flex flex-col gap-4">
      {programs.map((program, index) => (
        <ProgramCard
          program={program}
          key={`program-${program.fechaPrograma}-${index}`}
        />
      ))}
    </div>
  );
};

export default ProgramContainer;
