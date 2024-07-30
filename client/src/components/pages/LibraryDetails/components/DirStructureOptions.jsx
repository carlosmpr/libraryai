
import { FolderIcon } from "@heroicons/react/24/outline";

const DirStructureOptions = ({ onSelect, selectedStructure }) => {
  const folderStructures = [
    {
      name: "Default Structure",
      structure: ["introduction", "ui", "sections", "pages", "animations", "helperFunctions"],
    },
    {
      name: "Extended Structure",
      structure: ["docs", "src", "tests", "config", "scripts", "assets"],
    },
    // Add more structures as needed
  ];

  return (
    <div className="space-y-4">
      {folderStructures.map((structure, index) => (
        <div
          key={index}
          onClick={() => onSelect(structure)}
          className={`border p-4 rounded-lg cursor-pointer ${
            selectedStructure && selectedStructure.name === structure.name ? 'border-primary' : ''
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
