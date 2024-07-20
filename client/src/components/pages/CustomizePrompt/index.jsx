import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Bot from "/bot.svg";
import MarkDownPreview from '../../ui/MarkDownPreview';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import LoadingIndicator from "../../ui/LoadingIndiicator";
import useLoadingIndicator from "../../hooks/useLoadingIndicator";
import Modal from "../../ui/Modal";

export default function CustomizePrompt() {
  const { repoName } = useParams();
  const navigate = useNavigate();
  const { isLoading, isSuccess, isError, handleLoading, isModalOpen, setIsModalOpen } = useLoadingIndicator();
  const [selectedFile, setSelectedFile] = useState(null);
  const [promptExamples] = useState([
    "Example 1: Generate a list of potential business names.",
    "Example 2: Write a short story about a space adventure.",
    "Example 3: Explain the significance of the Turing test.",
    "Example 4: Provide a summary of the latest trends in artificial intelligence.",
    "Example 5: Generate a list of questions for a product user interview.",
  ]);
  const [selectedExample, setSelectedExample] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [instructionName, setInstructionName] = useState("");
  const [markdownContent, setMarkdownContent] = useState("");
  const [currentAction, setCurrentAction] = useState("");

  useEffect(() => {
    setSelectedFile("data:image/png;base64, ...");
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleExampleClick = (example) => {
    setSelectedExample(example);
  };

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  const handleRunTest = async (e) => {
    e.preventDefault();
    setCurrentAction("runTest");
    setIsModalOpen(true);

    if (!selectedFile || !selectedModel || !selectedExample) {
      alert("Please fill in all fields");
      setIsModalOpen(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("model", selectedModel);
    formData.append("instructions", selectedExample);

    try {
      await handleLoading(async () => {
        const response = await fetch("/ai/test-prompt", {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to run test");
        }

        const result = await response.json();
        console.log("Prompt Result:", result.data.prompt);
        setMarkdownContent(result.data.prompt);
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSaveInstructions = async () => {
    setCurrentAction("saveInstructions");
    setIsModalOpen(true);

    if (!instructionName || !selectedModel || !selectedExample) {
      alert("Please fill in all fields");
      setIsModalOpen(false);
      return;
    }

    const promptData = {
      instructionName,
      model: selectedModel,
      instructions: selectedExample,
      repoName,
    };

    try {
      await handleLoading(async () => {
        const response = await fetch("/api/save-instructions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(promptData),
        });

        if (!response.ok) {
          throw new Error("Failed to save instructions");
        }
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex bg-base-200/40 h-screen">
      <Modal
        modalId="loading_modal"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Processing"
        description="Please wait while we process your request."
      >
        <LoadingIndicator
          isLoading={isLoading}
          isSuccess={isSuccess}
          isError={isError}
          successMessage="Operation completed successfully!"
          errorMessage="An error occurred."
          onSuccess={() => {
            setIsModalOpen(false);
            if (currentAction === "saveInstructions") {
              navigate(`/library/${repoName}`);
            }
          }}
        >
          <div></div> {/* Empty div to keep the loading state functionality */}
        </LoadingIndicator>
      </Modal>

      <div className="p-4 w-[30%] bg-base-100 border-r-2 border-black shadow-2xl overflow-y-scroll">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="btn bg-base-100 border-0 shadow-none"
          >
            <ArrowLeftIcon className="w-10" />
          </button>
          <h1 className="text-xl font-bold">Customize Prompt</h1>
        </div>

        <form className="flex flex-col gap-4 mt-4">
          <div className="items-center">
            <img src={Bot} className="w-10 mb-2" alt="Bot" />
            <select
              className="select w-full border-b-4 border-black shadow-2xl focus:ring-0 focus:border-black focus:border-b-4 max-w-xs"
              onChange={handleModelChange}
            >
              <option disabled selected>
                Select Model
              </option>
              <option value="gpt-4o">gpt-4o</option>
              <option value="gpt-4-turbo">gpt-4-turbo</option>
              <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
            </select>
          </div>

          <label className="flex flex-col font-bold">
            File Upload for Preview
            <input
              type="file"
              className="file-input w-full border-b-4 border-black shadow-2xl focus:ring-0 focus:border-black focus:border-b-4 max-w-xs"
              onChange={handleFileChange}
            />
          </label>

          <label className="flex flex-col font-bold">
            Prompt Examples
            <div className="flex max-w-md gap-2 overflow-x-scroll p-2">
              {promptExamples.map((example, index) => (
                <button
                  key={index}
                  type="button"
                  className="btn btn-outline btn-secondary"
                  onClick={() => handleExampleClick(example)}
                >
                  {example}
                </button>
              ))}
            </div>
          </label>

          <label className="flex flex-col font-bold">
            Instruction Name
            <input
              type="text"
              className="input w-full border-b-4 border-black shadow-2xl focus:ring-0 focus:border-black focus:border-b-4 max-w-xs"
              value={instructionName}
              onChange={(e) => setInstructionName(e.target.value)}
            />
          </label>

          <label className="flex flex-col font-bold">
            Instructions
            <textarea
              className="textarea w-full border-b-4 border-black shadow-2xl focus:ring-0 focus:border-black focus:border-b-4 max-w-md h-[150px]"
              placeholder="Instructions"
              value={selectedExample}
              onChange={(e) => setSelectedExample(e.target.value)}
            />
          </label>
          <div className="flex w-full justify-between">
            <button
              type="button"
              className="btn btn-accent"
              onClick={handleSaveInstructions}
            >
              Save Instructions
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              onClick={handleRunTest}
            >
              Run Test
            </button>
          </div>
        </form>
      </div>
      <div className="flex bg-base-200 flex-1 h-screen overflow-y-scroll px-20">
        {markdownContent && (
          <MarkDownPreview selectedFileContent={markdownContent} />
        )}
      </div>
    </div>
  );
}
