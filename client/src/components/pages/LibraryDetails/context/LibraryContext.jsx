/* eslint-disable react/prop-types */
import  { createContext, useContext, useState, useEffect } from 'react';
const welcomeMessage = `
# 🎉 Hello Developer! Welcome to Code Library Beta 🎉

## What is Code Library?
Code Library is your go-to solution for building and documenting your code projects effortlessly. Our platform is designed to simplify your workflow with features like:

- **Simple Drag & Drop**: Upload up to 4 documents at a time with a quick drag and drop.
- **Future Features**: Soon, you'll be able to pass your entire project for thorough documentation.

## How to Get Started

### Step 1: Create Your First Structure
To begin, you need to create a structure for your project:

- **Default Structure**: Start with a default structure that organizes your code in a standard format.
- **Custom Structure During Upload**: You can also create a custom structure when you upload your files. This helps you decide exactly where and how your code will be stored.

### Step 2: Upload Your Files
Once your structure is set up, follow these steps:

- **Upload Files**: Drag and drop the files you want to document into the designated area.
- **Automatic Documentation**: After the files are uploaded, select them to initiate the documentation process. Our powerful AI will generate comprehensive documentation for your code.

## Other Functionalities

### Download Options
- **Single File Download**: Easily download any single file from your project.
- **Complete Directory Download**: With just a click, download an entire directory containing your project files and documentation.
- **Custom Code Download**: Get the generated code along with the documentation.

### Customizing Your Experience
To make the most out of Code Library, you can tailor the process to suit your needs:

- **Create Custom Prompts**: Customize or create your own prompts to guide the AI documentation process. Follow the instructions provided to set up and modify your prompts both before and after converting your documents.

## Additional Features Coming Soon
We're constantly working to enhance Code Library. Here’s what you can look forward to:

- **Batch Project Documentation**: Soon, you'll be able to pass your entire project at once for batch processing and documentation.
- **Advanced AI Features**: Improved AI capabilities for even more detailed and accurate documentation.
- **Enhanced Customization Options**: More ways to customize the look, feel, and structure of your documentation.

## Tips for Using Code Library
- **Organize Your Files**: Before uploading, ensure your files are well-organized to make the documentation process smoother.
- **Review Generated Documentation**: Always review the AI-generated documentation for accuracy and completeness.
- **Provide Feedback**: Help us improve by providing feedback on your experience and any issues you encounter.

Welcome aboard, and happy coding! 🚀
`

const LibraryContext = createContext();

export const useLibrary = () => useContext(LibraryContext);

export const LibraryProvider = ({ children, repoName }) => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFileContent, setSelectedFileContent] = useState(welcomeMessage);
  const [uploadPath, setUploadPath] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  const fetchContents = async (path = "") => {
    try {
      const response = await fetch(
        `/api/repository-contents?repo=${repoName}&path=${path}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data.contents;
      } else {
        console.error("Failed to fetch repository contents");
        return [];
      }
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  };

  const loadContents = async () => {
    setLoading(true);
    const rootContents = await fetchContents();
    setContents(rootContents);
    setLoading(false);
  };

  useEffect(() => {
    loadContents();
  }, [repoName]);

  const handleFileClick = async (file) => {
    if (file.path.endsWith(".md")) {
      try {
        const response = await fetch(file.download_url);
        const text = await response.text();
        setSelectedFileContent(text);
        setDownloadUrl(file.download_url);
      } catch (error) {
        console.error("Failed to fetch file content", error);
      }
    }
  };

  return (
    <LibraryContext.Provider
      value={{
        contents,
        loading,
        selectedFileContent,
        uploadPath,
        downloadUrl,
        setUploadPath,
        handleFileClick,
        fetchContents,
        loadContents,
        setSelectedFileContent,
        repoName
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};
