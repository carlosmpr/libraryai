import { useEffect, useState } from "react";
import Heading from "../components/Ui/Heading";
import BentoCard from "../components/Ui/BentoCard";
import { PlusCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
const MainLibrary = () => {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRepoName, setNewRepoName] = useState("");
  const [creatingRepo, setCreatingRepo] = useState(false);

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

  const handleCreateRepository = async (e) => {
    e.preventDefault();
    setCreatingRepo(true);

    try {
      const response = await fetch("/api/create-repository", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies in the request
        body: JSON.stringify({ name: newRepoName }),
      });

      if (response.ok) {
        const data = await response.json();
        setRepositories([...repositories, data.repository]); // Add new repository to state
        setNewRepoName("");
      } else {
        console.error("Failed to create repository");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setCreatingRepo(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-10 bg-base-200/70">
      <Heading title={"Select your library"} decoration={"Libraries"} />

      <div className="flex gap-10 flex-wrap">
        {/* Open the modal using document.getElementById('ID').showModal() method */}
        <button
          className="btn border-2 btn-outline btn-primary flex flex-col justify-center  w-[200px] rounded-2xl  h-[200px]"
          onClick={() => document.getElementById("my_modal_1").showModal()}
        >
          <PlusCircleIcon className="w-20" />
          <span>Create New Library</span>
        </button>
        <dialog id="my_modal_1" className="modal ">
          <div className="modal-box bg-base-200 border border-2 border-black shadow-2xl shadow-white/40">
            <div className="text-center my-10 space-y-1">
              <h2 className="font-bold  text-3xl ">
                 Create A New Library
              </h2>
              <p className="text-base-content/70 text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididun
              </p>
            </div>
            <form onSubmit={handleCreateRepository} className="space-y-4">
              <input
                className="input w-full border-b-4 border-black shadow-2xl focus:ring-0 focus:border-black focus:border-b-4"
                type="text"
                value={newRepoName}
                onChange={(e) => setNewRepoName(e.target.value)}
                placeholder="Library Name"
                required
              />

              <div className="modal-action">
                <button
                  type="submit"
                  disabled={creatingRepo}
                  className="btn btn-primary"
                >
                  {creatingRepo ? "Creating..." : "Create Library"}
                </button>
                <form method="dialog" className="absolute top-5 left-0">
                  {/* if there is a button in form, it will close the modal */}
                  <button className=""><XMarkIcon  className="w-6 " /></button>
                </form>
              </div>
            </form>
          </div>
        </dialog>
        {repositories.map((repo) => (
          <BentoCard
            key={repo.id}
            title={repo.name}
            description={
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. "
            }
          />
        ))}
      </div>
    </div>
  );
};

export default MainLibrary;
