import { useState, useEffect } from "react";
import Bot from "/bot.svg";
import MarkDownPreview from "../../components/Ui/MarkDownPreview";

export default function CustomizePrompt() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [promptExamples, setPromptExamples] = useState([
    "Example 1: Generate a list of potential business names.",
    "Example 2: Write a short story about a space adventure.",
    "Example 3: Explain the significance of the Turing test.",
    "Example 4: Provide a summary of the latest trends in artificial intelligence.",
    "Example 5: Generate a list of questions for a product user interview.",
  ]);
  const [selectedExample, setSelectedExample] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [markdownContent, setMarkdownContent] = useState("");

  useEffect(() => {
    // Set a default file (base64 string of an image or placeholder)
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile || !selectedModel || !selectedExample) {
      alert("Please fill in all fields");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("model", selectedModel);
    formData.append("instructions", selectedExample);

    try {
      const response = await fetch("/ai/test-prompt", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const result = await response.json();
      console.log("Prompt Result:", result.data.prompt);
      setMarkdownContent(result.data.prompt);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex bg-base-200/40 h-screen">
      <div className="menu p-4 w-[40%] bg-base-100 border-r-2 border-black shadow-2xl ">
        <h1 className="text-xl font-bold">Customize Prompt</h1>

        <form className="flex flex-col gap-10" onSubmit={handleSubmit}>
          <div>
            <img src={Bot} className="w-16" alt="Bot" />
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
            Instructions
            <textarea
              className="textarea w-full border-b-4 border-black shadow-2xl focus:ring-0 focus:border-black focus:border-b-4 max-w-md h-[150px]"
              placeholder="Instructions"
              value={selectedExample}
              onChange={(e) => setSelectedExample(e.target.value)}
            />
          </label>
          <button type="submit" className="btn btn-primary ">
            Submit
          </button>
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
