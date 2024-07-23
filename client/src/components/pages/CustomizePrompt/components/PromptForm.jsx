/* eslint-disable react/prop-types */

import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Bot from '/bot.svg';

const PromptForm = ({
  formState,
  handleInputChange,
  handleFileChange,
  handleExampleClick,
  promptExamples,
  handleRunTest,
  handleSaveInstructions,
  navigate
}) => {
  const { selectedModel, instructionName, selectedExample } = formState;

  return (
    <div className="p-4 w-[30%] bg-base-100 border-r-2 border-black shadow-2xl overflow-y-scroll">
      <div className="flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="btn bg-base-100 border-0 shadow-none"
        >
          <ArrowLeftIcon className="w-10" />
        </button>
        <h1 className="text-xl font-bold">Customize Prompt</h1>
      </div>

      <form className="flex flex-col gap-4 mt-4">
        <div className="items-center">
          <img src={Bot} className="w-10 mb-2" alt="Bot" />
          <select
            name="selectedModel"
            className="select w-full border-b-4 border-black shadow-2xl focus:ring-0 focus:border-black focus:border-b-4 max-w-xs"
            onChange={handleInputChange}
            value={selectedModel}
          >
            <option disabled value="">
              Select Model
            </option>
            <option value="gpt-4o">gpt-4o</option>
            <option value="gpt-4-turbo">gpt-4-turbo</option>
            <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
          </select>
        </div>

        <label className="flex flex-col font-bold">
          File Upload for Preview
          <input
            type="file"
            className="file-input w-full border-b-4 border-black shadow-2xl focus:ring-0 focus:border-black focus:border-b-4 max-w-xs"
            onChange={handleFileChange}
          />
        </label>

        <label className="flex flex-col font-bold">
          Prompt Examples
          <div className="flex max-w-md gap-2 overflow-x-scroll p-2">
            {promptExamples.map((example, index) => (
              <button
                key={index}
                type="button"
                className="btn btn-outline btn-secondary"
                onClick={() => handleExampleClick(example)}
              >
                {example}
              </button>
            ))}
          </div>
        </label>

        <label className="flex flex-col font-bold">
          Instruction Name
          <input
            type="text"
            name="instructionName"
            className="input w-full border-b-4 border-black shadow-2xl focus:ring-0 focus:border-black focus:border-b-4 max-w-xs"
            value={instructionName}
            onChange={handleInputChange}
          />
        </label>

        <label className="flex flex-col font-bold">
          Instructions
          <textarea
            name="selectedExample"
            className="textarea w-full border-b-4 border-black shadow-2xl focus:ring-0 focus:border-black focus:border-b-4 max-w-md h-[150px]"
            placeholder="Instructions"
            value={selectedExample}
            onChange={handleInputChange}
          />
        </label>
        <div className="flex w-full justify-between">
          <button
            type="button"
            className="btn btn-accent"
            onClick={handleSaveInstructions}
          >
            Save Instructions
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            onClick={handleRunTest}
          >
            Run Test
          </button>
        </div>
      </form>
    </div>
  );
};

export default PromptForm;
