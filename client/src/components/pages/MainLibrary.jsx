import { useEffect, useState } from "react";
import Heading from "../ui/Heading";
import BentoCard from "../ui/BentoCard";
import Modal from "../ui/Modal"; // Adjust the import path according to your file structure
import Skeleton from "../ui/Skeleton";
import FadeInTransition from "../animations/FadeTransition";
import LoadingIndicator from "../ui/LoadingIndiicator";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import useLoadingIndicator from "../hooks/useLoadingIndicator";
import PromptNavigations from "../ui/NavigationButton";

const MainLibrary = () => {
  const {
    isModalOpen,
    setIsModalOpen,
    isLoading,
    isSuccess,
    isError,
    handleLoading,
  } = useLoadingIndicator();
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRepoName, setNewRepoName] = useState("");

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const response = await fetch("/api/repositories/library", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies in the request
        });

        if (response.ok) {
          const data = await response.json();
          setRepositories(data.repositories);
        } else {
          console.error("Failed to fetch repositories");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepositories();
  }, []);

  const handleCreateRepository = async () => {
    const response = await fetch("/api/create-repository", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ name: newRepoName }),
    });

    if (response.ok) {
      const data = await response.json();
      setRepositories([...repositories, data.repository]);
      setNewRepoName("");
    } else {
      console.error("Failed to create repository");
      throw new Error("Failed to create repository");
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleLoading(handleCreateRepository);
  };

  return (
    <div className="p-10 bg-base-200/70">
      <Heading title={"Select your library"} decoration={"Libraries"} />
      <div className="mb-4 -mt-10">
      <PromptNavigations />
      
      </div>
      <div className="flex gap-10 flex-wrap">
        <button
          className="btn flex flex-col justify-center w-[250px]  h-[250px]  rounded-2xl btn-outline btn-primary"
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
