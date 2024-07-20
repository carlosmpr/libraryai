import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MarkDownPreview from '../../ui/MarkDownPreview';
import useLoadingIndicator from "../../hooks/useLoadingIndicator";
import PromptForm from './PromptForm';
import LoadingModal from './LoadingModal';

export default function CustomizePrompt() {
  const { repoName } = useParams();
  const navigate = useNavigate();
  const { isLoading, isSuccess, isError, handleLoading, isModalOpen, setIsModalOpen } = useLoadingIndicator();
  const [formState, setFormState] = useState({
    selectedFile: null,
    selectedExample: "",
    selectedModel: "",
    instructionName: "",
  });
  const [markdownContent, setMarkdownContent] = useState("");
  const [currentAction, setCurrentAction] = useState("");

  const promptExamples = [
    "Example 1: Generate a list of potential business names.",
    "Example 2: Write a short story about a space adventure.",
    "Example 3: Explain the significance of the Turing test.",
    "Example 4: Provide a summary of the latest trends in artificial intelligence.",
    "Example 5: Generate a list of questions for a product user interview.",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormState((prev) => ({ ...prev, selectedFile: file }));
    }
  };

  const handleExampleClick = (example) => {
    setFormState((prev) => ({ ...prev, selectedExample: example }));
  };

  const handleRunTest = async (e) => {
    e.preventDefault();
    setCurrentAction("runTest");
    setIsModalOpen(true);

    const { selectedFile, selectedModel, selectedExample } = formState;

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

    const { instructionName, selectedModel, selectedExample } = formState;

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
      <LoadingModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
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
      />

      <PromptForm
        formState={formState}
        handleInputChange={handleInputChange}
        handleFileChange={handleFileChange}
        handleExampleClick={handleExampleClick}
        promptExamples={promptExamples}
        handleRunTest={handleRunTest}
        handleSaveInstructions={handleSaveInstructions}
        navigate={navigate}
      />

      <div className="flex bg-base-200 flex-1 h-screen overflow-y-scroll px-20">
        {markdownContent && (
          <MarkDownPreview selectedFileContent={markdownContent} />
        )}
      </div>
    </div>
  );
}
