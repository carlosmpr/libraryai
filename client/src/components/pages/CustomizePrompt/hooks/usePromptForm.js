import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import useLoadingIndicator from "../../../hooks/useLoadingIndicator";
import { useInstructions } from "../../../context/UserInstructions";

const initialModel = `
# 🛠️ How to Create Your Custom Prompts and Instructions 🛠️

## Introduction
Creating custom prompts and instructions allows you to tailor the documentation process to your specific needs. Follow the steps below to structure your file and ensure that all necessary information is included.

## File Structure
When creating your custom prompts and instructions, consider the following components:

### 1. Summary
Provide a brief overview of what the code does. This should include the main purpose and key functionalities.

### 2. Dependencies
List all the dependencies required for the code to run. Include version numbers and installation instructions.

### 3. Examples
Include example code snippets that demonstrate how to use the code. This helps users understand the practical application.

### 4. How the Code Works
Explain the logic and flow of the code. Detail important functions, classes, and methods to give a clear understanding of the inner workings.

### 5. Custom Instructions
You can customize the instructions in various languages such as Chinese, French, or Spanish. Specify your desired language and provide translated content if needed.

### 6. Model Selection
For generating documentation, you can use the GPT-3.5-Turbo model. Ensure to provide detailed instructions for the model, including:

- **Desired Output Format**: Specify that the output should be in markdown format.
- **Content Focus**: Instruct the AI to ignore any non-code-related content.
- **Instruction Testing**: Test different combinations of instructions and models to find what suits your needs best.

## Creating Custom Prompts
Follow these steps to create and test your custom prompts:

1. **Define Your Requirements**: Clearly outline what you need from the AI. Be specific about the structure and content.
2. **Set Up Instructions**: Write detailed instructions for the AI to follow. Ensure clarity and precision in your instructions.
3. **Test and Iterate**: Run tests with different instructions and model settings. Adjust based on the output quality and relevance.
4. **Finalize Prompts**: Once satisfied with the results, finalize your prompts and save them for future use.

## Example of Custom Prompts
Here is an example of how to structure your custom prompts file:

\`\`\`markdown
# Summary
This code is designed to scrape data from websites and store it in a database.

# Dependencies
- Python 3.8+
- Requests library (v2.25.1)
- BeautifulSoup (v4.9.3)

# Examples
\`\`\`python
import requests
from bs4 import BeautifulSoup

def scrape_website(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    return soup.title.text

print(scrape_website('https://example.com'))
\`\`\`

# How the Code Works
The code uses the Requests library to fetch the website content and BeautifulSoup to parse the HTML. It extracts and prints the title of the webpage.

# Custom Instructions
Please provide documentation in French.

# Model Selection
Use GPT-3.5-Turbo for generating markdown documentation. Ensure the content is code-focused.
\`\`\`

## Tips for Effective Custom Prompts
- **Be Specific**: The more detailed and specific your instructions, the better the AI can generate accurate documentation.
- **Use Clear Language**: Avoid ambiguity in your prompts to prevent misinterpretation by the AI.
- **Review and Revise**: Continuously review the output and refine your prompts for improved results.

By following these guidelines, you can create effective custom prompts and instructions to enhance your documentation process with Code Library.

Happy Documenting! 📄✨
`;

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
  const [markdownContent, setMarkdownContent] = useState(initialModel);
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
