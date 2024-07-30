/* eslint-disable react/prop-types */
import { useState } from "react";
import MarkDownPreview from "../../../ui/MarkDownPreview";
import Modal from "../../../ui/Modal";

const TransformCode = ({ selectedFileContent }) => {
  const [transformedCode, setTransformedCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const extractCodeBlocks = (markdownContent) => {
    const titleMatch = markdownContent.match(/title:\s*'([^']+)'/);
    const title = titleMatch ? titleMatch[1] : "code";

    const componentCodeStart = markdownContent.indexOf("## Component Code");
    if (componentCodeStart === -1) return { title, code: "" };

    const codeSection = markdownContent.slice(componentCodeStart);
    const codeBlockRegex = /```[\s\S]*?```/g;
    const codeBlocks = codeSection.match(codeBlockRegex) || [];

    const cleanedCodeBlocks = codeBlocks
      .map((block) => {
        // Remove the ``` and language identifier
        const cleanedBlock = block.trim();
        // Replace any remaining ``` with ///
        return cleanedBlock;
      })
      .join("\n\n");

    return {
      title,
      code: cleanedCodeBlocks,
    };
  };

  const handleTransform = async (transformInstructions) => {
    const { code } = extractCodeBlocks(selectedFileContent);

    if (!code) {
      alert("No code found to transform");
      return;
    }

    setIsLoading(true);
    setIsError(false);

    try {
      const response = await fetch("/ai/transform-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: code, transformInstructions }),
      });

      if (!response.ok) {
        throw new Error("Failed to transform code");
      }

      const result = await response.json();
      console.log(result)
      setTransformedCode(result); // Adjust based on your API response structure
    } catch (error) {
      console.error("Error transforming code:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal buttonTitle={"Transform Code"} modalId={"transformCode"} customStyle="w-screen flex gap-4  bg-none h-screen overflow-y-scroll p-10">
        <div className="w-[40%]">
          <h2>Original Code</h2>
          <MarkDownPreview
            selectedFileContent={extractCodeBlocks(selectedFileContent).code}
            customStyle={'bg-red-200'}
          />
        </div>
        <div className="flex flex-col self-center gap-4">
          <button className="btn btn-primary" onClick={() => handleTransform("Optimize the code")} disabled={isLoading}>
            {isLoading ? "Optimizing..." : "Optimize Code"}
          </button>
          <button className="btn btn-secondary" onClick={() => handleTransform("Convert to React Native")} disabled={isLoading}>
            {isLoading ? "Converting..." : "React Native"}
          </button>
          <button className="btn btn-accent" onClick={() => handleTransform("Convert to TypeScript")} disabled={isLoading}>
            {isLoading ? "Converting..." : "TypeScript Version"}
          </button>
          <button className="btn btn-neutral" onClick={() => handleTransform("Convert to JavaScript")} disabled={isLoading}>
            {isLoading ? "Converting..." : "Non TypeScript Version"}
          </button>
          <button className="btn btn-error" onClick={() => handleTransform("Convert to Angular")} disabled={isLoading}>
            {isLoading ? "Converting..." : "Angular"}
          </button>
          <button className="btn btn-success" onClick={() => handleTransform("Convert to Vue")} disabled={isLoading}>
            {isLoading ? "Converting..." : "Vue"}
          </button>
        </div>
        <div className="w-[40%]">
          {isError && <p className="text-red-500">Failed to transform code</p>}
          {transformedCode && (
            <>
              <h2>Transformed Code</h2>
    
              <MarkDownPreview selectedFileContent={transformedCode} customStyle={'bg-green-200'} />
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default TransformCode;
