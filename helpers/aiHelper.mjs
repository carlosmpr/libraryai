import {openai} from "@ai-sdk/openai"
import {generateText} from "ai"
import { config } from 'dotenv';
config();



export async function createFile(content, model = 'gpt-4o', instructions = "Explain the following React component in Markdown. Start with a detailed explanation of any React hooks used, helper functions and their operations, and the component's general usage. If the component includes TypeScript typings for props, describe the purpose of each prop. Also, identify and describe any external libraries or dependencies crucial for the component's operation. Only discuss aspects that are explicitly present in the component code provided. Do not include sections on hooks, props, types, or dependencies if they do not appear in the code. Focus only on what is implemented and relevant in the following code.") {
  const messages = [{ role: "user", content: content }];
  
  const systemInstructions = `Create a markdown file based on the following instructions: ${instructions}. ignore any instruction asking to create another file type that is not markdown`;

  const result = await generateText({
    model: openai(model),
    system: systemInstructions,
    messages,
  });

  return result;
}









