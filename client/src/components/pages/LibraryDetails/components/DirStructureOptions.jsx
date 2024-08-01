import { FolderIcon } from "@heroicons/react/24/outline";
import { useLocalization } from "../../../context/LocalizationContext";

const englishText = {
  defaultStructure: "Default Structure",
  extendedStructure: "Extended Structure",
  reactRecommended: "React Recommended",
  vue: "Vue",
  angular: "Angular",
};

const spanishText = {
  defaultStructure: "Estructura Predeterminada",
  extendedStructure: "Estructura Extendida",
  reactRecommended: "Recomendado por React",
  vue: "Vue",
  angular: "Angular",
};

const DirStructureOptions = ({ onSelect, selectedStructure }) => {
  const { isSpanish } = useLocalization();
  const text = isSpanish ? spanishText : englishText;

  const folderStructures = [
    {
      name: text.defaultStructure,
      structure: ["introduction", "ui", "sections", "pages", "animations", "helperFunctions"],
    },
    {
      name: text.extendedStructure,
      structure: ["docs", "src", "tests", "config", "scripts", "assets"],
    },
    {
      name: text.reactRecommended,
      structure: ["src", "public", "components", "hooks", "contexts", "utils"],
    },
    {
      name: text.vue,
      structure: ["src", "components", "views", "router", "store", "assets"],
    },
    {
      name: text.angular,
      structure: ["src", "app", "assets", "environments", "styles", "modules"],
    },
  ];

  return (
    <div className="flex overflow-x-scroll gap-4">
      {folderStructures.map((structure, index) => (
        <div
          key={index}
          onClick={() => onSelect(structure)}
          className={`border p-4 rounded-lg cursor-pointer shrink-0 min-w-[250px] ${
            selectedStructure && selectedStructure.name === structure.name ? "border-primary" : "border-transparent"
          }`}
        >
          <h3 className="font-bold mb-2">{structure.name}</h3>
          <ul className="ml-5">
            {structure.structure.map((folder) => (
              <li key={folder} className="flex gap-2">
                <FolderIcon className="w-4 h-4 mr-1" />
                {folder}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default DirStructureOptions;
