import { DocumentTextIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { useLocalization } from "../../../../context/LocalizationContext";

const englishText = {
  invalidFileType: "Invalid file type. Only the allowed file types are permitted.",
  maxFiles: (max) => `You can only upload a maximum of ${max} files.`,
  dragDrop: "Drag & drop files or folders here, or click to select files",
};

const spanishText = {
  invalidFileType: "Tipo de archivo no válido. Solo se permiten los tipos de archivos permitidos.",
  maxFiles: (max) => `Solo puede subir un máximo de ${max} archivos.`,
  dragDrop: "Arrastre y suelte archivos o carpetas aquí, o haga clic para seleccionar archivos",
};

const FileDropZone = ({ selectedFiles, setSelectedFiles, setError }) => {
  const { isSpanish } = useLocalization();
  const text = isSpanish ? spanishText : englishText;

  const allowedExtensions = [
    ".js", ".jsx", ".ts", ".tsx", ".py", ".java", ".rb", ".php",
    ".html", ".css", ".cpp", ".c", ".go", ".rs", ".swift", ".kt", 
    ".m", ".h", ".cs", ".json", ".xml", ".sh", ".yml", ".yaml", 
    ".vue", ".svelte", ".qwik", ".astro"
  ];
  const maxFiles = 4;

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = async (e) => {
    e.preventDefault();
    const items = e.dataTransfer.items;
    const filesArray = await extractFiles(items);
    validateAndSetFiles(filesArray);
  };

  const extractFiles = async (items) => {
    const filesArray = [];
    for (const item of items) {
      const entry = item.webkitGetAsEntry();
      if (entry.isFile) {
        const file = await new Promise((resolve) => entry.file(resolve));
        if (isValidFile(file)) {
          filesArray.push(file);
        } else {
          setError(text.invalidFileType);
        }
      } else if (entry.isDirectory) {
        await traverseFileTree(entry, filesArray);
      }
    }
    return filesArray;
  };

  const traverseFileTree = (item, filesArray) => {
    return new Promise((resolve) => {
      if (item.isFile) {
        item.file((file) => {
          if (isValidFile(file)) {
            filesArray.push(file);
          }
          resolve();
        });
      } else if (item.isDirectory) {
        const dirReader = item.createReader();
        dirReader.readEntries(async (entries) => {
          for (const entry of entries) {
            await traverseFileTree(entry, filesArray);
          }
          resolve();
        });
      }
    });
  };

  const isValidFile = (file) => allowedExtensions.some((ext) => file.name.endsWith(ext));

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    validateAndSetFiles(files);
  };

  const validateAndSetFiles = (files) => {
    const filteredFiles = files.filter(isValidFile);
    if (filteredFiles.length + selectedFiles.length > maxFiles) {
      setError(text.maxFiles(maxFiles));
    } else {
      setSelectedFiles((prev) => [...prev, ...filteredFiles].slice(0, maxFiles));
      setError("");
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="p-4 border-2 border-dashed border-gray-300 rounded-md text-center cursor-pointer mb-4 h-[400px] w-[400px] flex overflow-y-scroll items-center justify-center"
    >
      <input
        type="file"
        onChange={handleFileSelect}
        style={{ display: "none" }}
        accept={allowedExtensions.join(",")}
        id="fileUpload"
        multiple
      />
      <label htmlFor="fileUpload" className="cursor-pointer">
        {selectedFiles.length > 0 ? (
          <div className="flex flex-wrap gap-10">
            {selectedFiles.map((file) => (
              <div key={file.name}>
                <DocumentTextIcon className="mx-auto w-8" />
                <p>{file.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <ArrowUpTrayIcon className="mx-auto w-8" />
            <p>{text.dragDrop}</p>
          </div>
        )}
      </label>
    </div>
  );
};

export default FileDropZone;
