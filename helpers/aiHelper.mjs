import {openai} from "@ai-sdk/openai"
import {generateText} from "ai"
import { config } from 'dotenv';
config();


export async function createFile(content) {
  const messages = [{ role: "user", content: content }];

  const result = await generateText({
    model: openai("gpt-4o"),
    system:
      "Explain the following React component in Markdown. Start with a detailed explanation of any React hooks used, helper functions and their operations, and the component's general usage. If the component includes TypeScript typings for props, describe the purpose of each prop. Also, identify and describe any external libraries or dependencies crucial for the component's operation. Only discuss aspects that are explicitly present in the component code provided. Do not include sections on hooks, props, types, or dependencies if they do not appear in the code. Focus only on what is implemented and relevant in the following code.",
    messages,
  });

  return result;
}


