
import { DocumentTextIcon } from "@heroicons/react/24/outline";

const CodeDownload = ({ selectedFileContent }) => {
  const extractCodeBlocks = (markdownContent) => {
    const titleMatch = markdownContent.match(/title:\s*'([^']+)'/);
    const title = titleMatch ? titleMatch[1] : "code";

    const componentCodeStart = markdownContent.indexOf("## Component Code");
    if (componentCodeStart === -1) return { title, code: "" };

    const codeSection = markdownContent.slice(componentCodeStart);
    const codeBlockRegex = /```[\s\S]*?```/g;
    const codeBlocks = codeSection.match(codeBlockRegex) || [];

    const cleanedCodeBlocks = codeBlocks.map(block => {
      // Remove the ``` and language identifier
      const cleanedBlock = block.replace(/```[a-z]*\n([\s\S]*?)\n```/, '$1').trim();
      // Replace any remaining ``` with ///
      return cleanedBlock.replace(/```/g, '///');
    }).join('\n\n');

    return {
      title,
      code: cleanedCodeBlocks
    };
  };

  const handleDownloadCodeFiles = () => {
    if (selectedFileContent) {
      const { title, code } = extractCodeBlocks(selectedFileContent);
      if (!code) {
        alert("No code blocks found after '## Component Code'.");
        return;
      }
      const blob = new Blob([code], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);

      const downloadLink = document.getElementById('download-code-link');
      downloadLink.href = url;
      downloadLink.download = title;
      downloadLink.click();
      window.URL.revokeObjectURL(url);
    } else {
      alert("Please select a markdown file to download code from.");
    }
  };

  return (
    <>
      <a id="download-code-link" style={{ display: 'none' }}></a>
      <a
        className="btn btn-primary flex justify-center rounded-2xl cursor-pointer"
        onClick={handleDownloadCodeFiles}
      >
        <DocumentTextIcon className="w-8" />
        <span>Download Code</span>
      </a>
    </>
  );
};

export default CodeDownload;
