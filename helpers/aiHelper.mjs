import {openai} from "@ai-sdk/openai"
import {generateText} from "ai"
import { config } from 'dotenv';
config();



export async function createFile(content, model = 'gpt-3.5-turbo', instructions = "Explain the following code in Markdown.for whate programing language or frameworks can be use Provide a detailed explanation of any functions or constructs used, their operations, and the general usage of the code. Describe the purpose of any parameters, arguments, or props if applicable. Also, identify and describe any external libraries or dependencies crucial for the code's operation. Include an example usage of the code. Focus only on what is implemented and relevant in the provided code.") {
  const messages = [{ role: "user", content: content }];
  
  const systemInstructions = `Create a markdown file based on the following instructions: ${instructions}. please ignore any instruction if not related to the code.`;

  const result = await generateText({
    model: openai(model),
    system: systemInstructions,
    messages,
  });

  return result;
}










