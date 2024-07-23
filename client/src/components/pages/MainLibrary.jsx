
import Heading from "../ui/Heading";
import BentoCard from "../ui/BentoCard";
import Modal from "../ui/Modal";
import Skeleton from "../ui/Skeleton";
import FadeInTransition from "../animations/FadeTransition";
import LoadingIndicator from "../ui/LoadingIndiicator";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import PromptNavigations from "../ui/NavigationButton";
import { useMainLibrary } from "../context/MainLibraryContext";

const MainLibrary = () => {
  const {
    repositories,
    loading,
    isLoading,
    isSuccess,
    isError,
    isModalOpen,
    setIsModalOpen,
    newRepoName,
    setNewRepoName,
    onSubmit,
  } = useMainLibrary();

  return (
    <div className="p-10 bg-base-200/70">
      <Heading title={"Select your library"} decoration={"Libraries"} />
      <div className="mb-4 -mt-10">
        <PromptNavigations />
      </div>
      <div className="flex gap-10 flex-wrap">
        <button
          className="btn flex flex-col justify-center w-[250px] h-[250px] rounded-2xl btn-outline btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircleIcon className="w-10" />
          <span>Create New Library</span>
        </button>

        <Modal
          modalId="create_library_modal"
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create A New Library"
          description="Enter the name of the new library."
        >
          <LoadingIndicator
            isLoading={isLoading}
            isSuccess={isSuccess}
            isError={isError}
            successMessage="Library created successfully!"
            errorMessage="Failed to create library."
          >
            <form onSubmit={onSubmit} className="space-y-4">
              <input
                type="text"
                value={newRepoName}
                onChange={(e) => setNewRepoName(e.target.value)}
                placeholder="Library Name"
                required
                className="input w-full border-b-4 border-black shadow-2xl focus:ring-0 focus:border-black focus:border-b-4"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary"
              >
                {isLoading ? "Creating..." : "Create Library"}
              </button>
            </form>
          </LoadingIndicator>
        </Modal>
        {loading ? (
          <Skeleton />
        ) : (
          repositories.map((repo, index) => (
            <FadeInTransition key={repo.id} delay={0.2 * index}>
              <BentoCard
                title={repo.name}
                description={
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                }
              />
            </FadeInTransition>
          ))
        )}
      </div>
    </div>
  );
};

export default MainLibrary;
