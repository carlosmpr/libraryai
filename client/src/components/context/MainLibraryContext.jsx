/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from 'react';
import useLoadingIndicator from '../hooks/useLoadingIndicator';

const MainLibraryContext = createContext();

export const useMainLibrary = () => useContext(MainLibraryContext);

export const MainLibraryProvider = ({ children }) => {
  const { isLoading, isSuccess, isError, handleLoading, isModalOpen, setIsModalOpen } = useLoadingIndicator();
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRepoName, setNewRepoName] = useState("");
  const [newRepoDescription, setNewRepoDescription] = useState("");
  const [userProfile, setUserProfile] = useState(null); // New state for user profile

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("/api/user/profile", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUserProfile(data.profile);
        } else {
          console.error("Failed to fetch user profile");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const fetchRepositories = async () => {
      try {
        const response = await fetch("/api/repositories/library", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
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

    fetchUserProfile();
    fetchRepositories();
  }, []);

  const handleCreateRepository = async () => {
    const response = await fetch("/api/create-repository", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name: newRepoName, description: newRepoDescription }),
    });

    if (response.ok) {
      const data = await response.json();
      setRepositories((prevRepos) => [...prevRepos, data.repository]);
      
     
    
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
    <MainLibraryContext.Provider
      value={{
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
        userProfile, // Provide user profile in the context
      }}
    >
      {children}
    </MainLibraryContext.Provider>
  );
};
