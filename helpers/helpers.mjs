function getCurrentDateFormatted() {
    const date = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }
  
  // Function to create comprehensive Markdown content
  export function createMarkdown(filename, explanation, code) {
  
    const currentDate = getCurrentDateFormatted();
    // Frontmatter added to the markdown content
    const frontmatter = `---
  title: '${filename.replace('.jsx', '')}'
  description: 'component description'
  pubDate: '${currentDate}'
  author: 'Carlos P'
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