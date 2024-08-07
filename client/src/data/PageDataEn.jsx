const  brandLogo = "/logo.svg"
export const generalData = {

  navbarContent: {
    brand:brandLogo,
    navItems: [
      { text: "Home", href: "/" },
      { text: "Features", href: "/features" },
      { text: "About", href: "/about" },
      { text: "Privacy", href: "/privacy" },
    ],
  },
  heroes: [
    {
      title: "Where Is My Code Stored?",
      description: "All your code will be stored securely in your GitHub repository. You can easily access and manage your code anytime.",
      image: "github.svg",
    },
    {
      title: "Access to All Your Code?",
      description: "No, we only request access to your public repositories. Code Library will only create public repositories, ensuring your private code remains private.",
      image: "access.png",
      reverse: true,
    },
    {
      title: "Multi-Document Select",
      description: "You can upload up to 4 code files at once, and our system will generate 4 markdown files with documentation. Pro users can upload up to 10 files at the same time for even more convenience.",
      image: "doc.png",
    },
    {
      title: "Powered by OpenAI",
      description: "With the help of OpenAI, you can upload up to 4 code files at once, and our system will generate 4 markdown files with detailed documentation. Pro users can upload up to 10 files at once.",
      image: "gpt.png",
      reverse: true,
    },
  ],
  services: [
    {
      image: "logo.svg",
      title: "Organize Your Code",
      description: "Organize your code into one repository or multiple. Structure your repository using a default layout or your own.",
    },
    {
      image: "logo.svg",
      title: "Transform Multiple Files",
      description: "Upload up to 4 files at once. Pro users can transform up to 10-20 files at the same time.",
    },
    {
      image: "logo.svg",
      title: "Customize Instructions",
      description: "Personalize the instructions that appear in the markdown file. Add or delete as needed.",
    },
    {
      image: "logo.svg",
      title: "Multilingual",
      description: "Write instructions in your preferred language (English, Spanish, Chinese, and more).",
    },
    {
      image: "logo.svg",
      title: "Play with Your Code",
      description: "Try our new playground where you can convert code into different programming languages, optimize it, and more.",
    },
    {
      image: "logo.svg",
      title: "Download Your Files",
      description: "Download your code, the complete directory, or your markdown file with all the documentation you need.",
    },
  ],

  feature: {
    title: "How Does It Work?",
    description: "Just drag your code, and with AI help, you'll get a markdown file with your code documentation.",
    backgroundColor: "bg-orange-50",
  },

  additionalSection: {
    title: "Why wait? Try it yourself",
    description: "With Code Library, you can easily drop your code, create documentation, and build your guide or component library. Find all your components in one place and never lose your code.",
    buttonText: "Start Now",
    buttonLink: "/auth/github",
  },

  footerData: {
    brand: brandLogo,
    sections: [
      {
        title: "Company",
        links: [
          { text: "About us", href: "#" },
          { text: "Careers", href: "#" },
          { text: "Press", href: "#" },
          { text: "News", href: "#" },
          { text: "Media kit", href: "#" },
          { text: "Contact", href: "#" },
        ],
      },
      {
        title: "Support",
        links: [
          { text: "Help Center", href: "#" },
          { text: "FAQs", href: "#" },
          { text: "Contact Support", href: "#" },
          { text: "Status", href: "#" },
        ],
      },
      {
        title: "Social Media",
        links: [
          { text: "Facebook", href: "https://facebook.com" },
          { text: "Twitter", href: "https://twitter.com" },
          { text: "LinkedIn", href: "https://linkedin.com" },
          { text: "Instagram", href: "https://instagram.com" },
        ],
      },
    ],
  },

  

}

export const homePageData = {
 
    mainSection: {
      description: "Store your code, create helpful guides, build a component library, or document your code. Our AI tools make it easy.",
      title: "Welcome to \n Code Library",
    },
   
   
  
    additionalSection: {
      title: "Why use Code Library if I can use GitHub directly?",
      description: "With Code Library, you can easily drop your code, create documentation, and build your guide or component library. Find all your components in one place and never lose your code.",
      buttonText: "Start Now",
      buttonLink: "/auth/github",
    },
  
  };


  export const aboutPageData = {
    featureTitle: "Why This Project?",
    featureDescription: "My motivation stems from creating many components across different templates and projects. When I tried to find them, it was challenging to search through all the repositories. I was losing code, and understanding what each piece of code was for required examining the code itself.",
    heroSections: [
      {
        title: "Why Not One Repository with All Components?",
        image: "/code.png",
        description: "I tried using Storybook, but I ended up writing more code than intended. Managing different versions of a single component became increasingly difficult."
      },
      {
        title: "The AI Opportunity",
        image: "/programing/11.svg",
        description: "AI presents the opportunity to easily document, change, optimize, or transform code. The AI handles the hard work, allowing me to simply provide the code.",
        reverse: true
      },
      {
        title: "Why GitHub?",
        image: "/github.svg",
        description: "GitHub not only offers free storage but also serves as an ideal place to store all your code."
      },
      {
        title: "Why Create Markdown Files?",
        image: "/astro.png",
        description: "Code documentation is often written in markdown files, allowing for a quick overview of what the code is about without needing to delve into the code itself. Additionally, Astro markdown features enable the creation of static pages.",
        reverse: true
      },
    ],
    additionalSection: {
      title: "Why Use Code Library Instead of GitHub Directly?",
      description: "With Code Library, you can easily drop your code, create documentation, and build a component library. Find all your components in one place and never lose your code.",
      buttonText: "Start Now",
      buttonLink: "/auth/github",
    },
  };
  
  
  export const privacyPolicyPageData = {
    title: "Privacy Policy",
    description: "At Code Library, we take your privacy seriously. This policy outlines what information we collect and how we use it.",
    sections: [
      {
        title: "No User Data Collection",
        content: "We do not collect any user data. This includes but is not limited to your personal information, login credentials, code, or any other data."
      },
      {
        title: "GitHub Login",
        content: "We request your GitHub login solely to manage and create public repositories on your behalf. We do not access any of your private repositories or organization repositories. Additionally, we do not perform any actions to delete repositories."
      },
      {
        title: "Public Repository Management",
        content: "Our application only interacts with public repositories. This ensures that your private code remains secure and inaccessible to our platform."
      },
      {
        title: "No Logging of Information",
        content: "We do not log any information related to your login or code. Our system is designed to operate without storing or tracking your data."
      },
      {
        title: "Security",
        content: "We are committed to ensuring that your information is secure. Although we do not collect or store your data, we use secure methods to interact with GitHub, ensuring that your login credentials and repositories are managed safely."
      },
      {
        title: "Changes to this Policy",
        content: "We may update this privacy policy from time to time. Any changes will be posted on this page, and we encourage you to review our policy periodically."
      },
      {
        content: "By using Code Library, you agree to this privacy policy. If you have any questions or concerns, please contact us."
      }
    ]
  };
  

  export const mainLibraryPageData = {
    sidebar: {
      creatingRepositoryTitle: "Creating a Repository",
      creatingRepositoryDescription:
        "All repositories created with this application will start with library- to make the search easier.",
      deleteModifyTitle: "Delete or Modify",
      deleteModifyDescription:
        "The library does not modify or update any of your GitHub repositories. To delete or modify a repository, you will need to go to GitHub and make changes directly.",
    },
    heading: {
      title: "Select your library",
      decoration: "Libraries",
    },
    popup: {
      createLibrary: "Create New Library",
      popupId: "create_library_modal",
      title: "Create A New Library",
      description: "Enter the name and description of the new library.",
      successMessage: "Library created successfully!",
      errorMessage: "Failed to create library.",
    },
    form: {
      libraryNamePlaceholder: "Library Name",
      libraryDescriptionPlaceholder: "Library Description",
      creatingText: "Creating...",
      createLibraryButton: "Create Library",
    },
    button: {
      createNewLibrary: "Create New Library",
    },
    noDescription: "No description provided",
  };
  
 