import MarkDownPreview from "../../ui/MarkDownPreview";
import PromptForm from "./PromptForm";
import Popup from "../../ui/PopUp";
import usePromptForm from "./hooks/usePromptForm";

const CustomizePrompt = () => {
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
  } = usePromptForm();

  const handleClose = () => {
    setIsModalOpen(false);
    if (currentAction === "saveInstructions" && !isError) {
      navigate(-1);
    }
  };

  return (
    <>
    <div className=" bg-orange-100 h-screen hidden lg:flex">
      <Popup
        popupId="loading_modal"
        isOpen={isModalOpen}
        onClose={handleClose}
        title="Processing"
        description="Please wait while we process your request."
        isLoading={isLoading}
        isSuccess={isSuccess}
        isError={isError}
        successMessage="Operation completed successfully!"
        errorMessage="An error occurred."
        customStyle="w-[500px] p-5 rounded-2xl"
        onSuccess={handleClose}
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

      <div className="flex flex-1 h-screen overflow-y-scroll px-20">
        {markdownContent && <MarkDownPreview selectedFileContent={markdownContent} />}
      </div>
    </div>
    <div className="text-center flex items-center justify-center lg:hidden h-screen p-8 bg-orange-100">
          <p className="text-xl">
            Oh no this feature was intended to be use on your Laptop{" "}
          </p>
        </div>
    </>
  );
};

export default CustomizePrompt;
