import { PlusCircleIcon } from "@heroicons/react/24/outline";
import Heading from "../ui/Heading";
import BentoCard from "../ui/BentoCard";
import Skeleton from "../ui/Skeleton";
import FadeInTransition from "../animations/FadeTransition";
import Popup from "../ui/PopUp";
import { useMainLibrary } from "../context/MainLibraryContext";
import SideBar from "../ui/SideBar";
import { useNavigate } from "react-router-dom";
import { useLocalization } from "../context/LocalizationContext";
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
    newRepoDescription,
    setNewRepoDescription,
    onSubmit,
  } = useMainLibrary();
  const { mainLibraryPageData } = useLocalization();

  const navigate = useNavigate();

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    navigate(`/library/library-${newRepoName}`);
  };

  const { sidebar, heading, popup, form } = mainLibraryPageData;
  return (
    <div className="flex bg-orange-100 h-screen">
      <SideBar>
        <div className="w-full space-y-8">
          <div>
            <span className="font-semibold">
              {sidebar.creatingRepositoryTitle}
            </span>
            <p className="text-sm">{sidebar.creatingRepositoryDescription}</p>
          </div>
          <div>
            <span className="font-semibold">{sidebar.deleteModifyTitle}</span>
            <p className="text-sm">{sidebar.deleteModifyDescription}</p>
          </div>
        </div>
      </SideBar>
      <div className="p-10 w-full h-full overflow-y-scroll">
        <Heading title={heading.title} decoration={heading.decoration} />

        <div className="flex flex-wrap justify-evenly gap-10 mt-10">
          <button
            className="btn hidden lg:flex flex-col justify-center w-[250px] h-[290px] rounded-2xl btn-outline btn-primary "
            onClick={() => setIsModalOpen(true)}
          >
            <PlusCircleIcon className="w-10" />
            <span>{popup.createLibrary}</span>
          </button>

          <Popup
            popupId="create_library_modal"
            isOpen={isModalOpen}
            onClose={handleClose}
            title={popup.title}
            description={popup.description}
            isLoading={isLoading}
            isSuccess={isSuccess}
            isError={isError}
            successMessage={popup.successMessage}
            errorMessage={popup.errorMessage}
            customStyle="w-[500px] p-5 rounded-2xl"
            onSuccess={handleSuccess} // Use the handleSuccess function
          >
            <form onSubmit={onSubmit} className="space-y-4">
              <input
                type="text"
                value={newRepoName}
                onChange={(e) => setNewRepoName(e.target.value)}
                placeholder={form.libraryNamePlaceholder}
                required
                className="input w-full border-b-4 border-black shadow-2xl focus:ring-0 focus:border-black focus:border-b-4"
              />
              <textarea
                value={newRepoDescription}
                onChange={(e) => setNewRepoDescription(e.target.value)}
                placeholder={form.libraryDescriptionPlaceholder}
                required
                className="textarea w-full border-b-4 border-black shadow-2xl focus:ring-0 focus:border-black focus:border-b-4"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary"
              >
                 {form.createLibraryButton}
              </button>
            </form>
          </Popup>

          {loading ? (
            <Skeleton />
          ) : (
            repositories.map((repo) => (
              <FadeInTransition key={repo.id} delay={0.2}>
                <BentoCard
                  title={repo.name}
                  description={repo.description || "No description provided"}
                />
              </FadeInTransition>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MainLibrary;
