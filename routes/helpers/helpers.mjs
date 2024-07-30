import { wss } from "../../index.mjs";


function getCurrentDateFormatted() {
  const date = new Date();
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

// Function to create comprehensive Markdown content
export function createMarkdown(filename, explanation, code, author) {
  const currentDate = getCurrentDateFormatted();
  // Frontmatter added to the markdown content
  const frontmatter = `---
  title: '${filename.replace(".jsx", "")}'
  description: 'component description'
  pubDate: '${currentDate}'
  author: '${author}'
  ---
  
  `;
  return `${frontmatter}
  
  # ${filename}
  ${explanation}
  
  ## Component Code
  \`\`\`jsx
  ${code.trim()}
  \`\`\`
  `;
}

export async function createOrUpdateFile(
  octokit,
  owner,
  repo,
  path,
  message,
  content
) {
  try {
    const { data } = await octokit.rest.repos.getContent({ owner, repo, path });
    // Update the existing file with the correct sha
    return octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message,
      content: Buffer.from(content).toString("base64"),
      sha: data.sha,
    });
  } catch (error) {
    if (error.status === 404) {
      // Create the file if it does not exist
      return octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message,
        content: Buffer.from(content).toString("base64"),
      });
    } else {
      throw error;
    }
  }
}

export async function fileExists(octokit, owner, repo, path) {
  try {
    await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
    });
    return true;
  } catch (error) {
    if (error.status === 404) {
      return false;
    }
    throw error;
  }
}

export function initialReadme(
  repoName,
  sanitizedDescription,
  currentYear,
  fullName
) {
  return `
# ${repoName}

${sanitizedDescription}

## About

This repository is created with the Code-Library-App, an auto-documentation software powered by AI. It allows you to store your code in markdown files, creating documentation and storing them in GitHub. This tool is useful for creating UI, tutorials, guides, or simply storing and ensuring you don't lose your code or component code.

With Code Library, you can easily drop your code, create documentation, and build your guide or component library. Find all your components in one place and never lose your code.

MIT License

Copyright (c) ${currentYear} ${fullName}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;
}


export  function sendProgressUpdate  (processedFiles, totalFiles)  {
  const progress = (processedFiles / totalFiles) * 100;
  console.log(`Processed Files: ${processedFiles}, Progress: ${progress}%`);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      console.log(`Sending progress to client ${client.userId}: ${progress}%`);
      client.send(JSON.stringify({ progress }));
    }
  });
};


export function handleError  (res, message, error)  {
  console.error(message, error);
  res.status(500).send(message);
};