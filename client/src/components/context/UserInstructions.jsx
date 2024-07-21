/* eslint-disable react/prop-types */
import  { createContext, useContext, useState, useEffect } from 'react';

const InstructionsContext = createContext();

export const useInstructions = () => useContext(InstructionsContext);

export const InstructionsProvider = ({ children }) => {
  const [instructions, setInstructions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructions = async () => {
      try {
        const response = await fetch(`/api/get-instructions`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setInstructions(data.instructions);
        } else {
          console.error('Failed to fetch instructions');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructions();
  }, []);
  console.log(instructions)
  return (
    <InstructionsContext.Provider value={{ instructions, loading }}>
      {children}
    </InstructionsContext.Provider>
  );
};
