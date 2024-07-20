import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useLoadingIndicator from "../../../hooks/useLoadingIndicator";

const usePromptForm = () => {
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

  return {
    formState,
    setFormState,
    markdownContent,
    promptExamples,
    isLoading,
    isSuccess,
    isError,
    isModalOpen,
    setIsModalOpen,
    handleInputChange,
    handleFileChange,
    handleExampleClick,
    handleRunTest,
    handleSaveInstructions,
    currentAction,
    navigate,
    repoName,
  };
};

export default usePromptForm;
