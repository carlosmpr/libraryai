import MarkDownPreview from '../../ui/MarkDownPreview';
import PromptForm from './components/PromptForm';
import LoadingModal from './components/LoadingModal';
import usePromptForm from './hooks/usePromptForm';

export default function CustomizePrompt() {
  const {
    formState,
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
  } = usePromptForm();

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
        {markdownContent && <MarkDownPreview selectedFileContent={markdownContent} />}
      </div>
    </div>
  );
}
