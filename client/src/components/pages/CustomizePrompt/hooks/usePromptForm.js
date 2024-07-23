import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import useLoadingIndicator from "../../../hooks/useLoadingIndicator";
import { useInstructions } from "../../../context/UserInstructions";

const usePromptForm = () => {
  const { repoName } = useParams();
  const { userInstructions, setUserInstructions } = useInstructions();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, isSuccess, isError, handleLoading, isModalOpen, setIsModalOpen } = useLoadingIndicator();
  const [formState, setFormState] = useState({
    selectedFile: null,
    selectedExample: "",
    selectedModel: "",
    instructionName: "",
  });
  const [markdownContent, setMarkdownContent] = useState("");
  const [currentAction, setCurrentAction] = useState("");

  const queryParams = new URLSearchParams(location.search);
  const instructionId = queryParams.get("id");

  useEffect(() => {
    if (instructionId) {
      const instruction = userInstructions.find((instr) => instr.id === instructionId);
      if (instruction) {
        setFormState({
          selectedFile: null,
          selectedExample: instruction.instructions,
          selectedModel: instruction.model,
          instructionName: instruction.name,
        });
      }
    }
  }, [instructionId, userInstructions]);

  const promptExamples = [
    "Write a detailed step by step of the code",
    "Write the Md File in Spanish",
    "Write 5 examples of using this component",
    "Write the Code with Typescript and explain the new addition",
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
      id: instructionId,
      instructionName,
      model: selectedModel,
      instructions: selectedExample,
      repoName,
    };

    const endpoint = instructionId ? "/api/update-instruction" : "/api/save-instructions";

    try {
      await handleLoading(async () => {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(promptData),
        });

        if (!response.ok) {
          throw new Error(`Failed to ${instructionId ? "update" : "save"} instructions`);
        }

        const result = await response.json();
        if (instructionId) {
          setUserInstructions((prevInstructions) =>
            prevInstructions.map((instr) => (instr.id === instructionId ? result.instruction : instr))
          );
        } else {
          setUserInstructions((prevInstructions) => [...prevInstructions, result.instruction]);
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
