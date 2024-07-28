import MainSection from "./components/MainSection";
import Navbar from "./components/Navbar";
import Feature from "./components/Feature";
import SlidingRectangles from "./animations/MovingRectangles";
import Hero from "./components/Hero";
import ServiceItem from "./components/ServiceItem";
import Marquee from "./components/Marquee";
import Footer from "./components/Footer";
const brandLogo = "/logo.svg";
const navbarContent = {
  brand: brandLogo,
  navItems: [
    {
      text: "Home",
      href: "/", // Matches the route path for Home
    },
    {
      text: "Portfolio",
      href: "/portfolio", // Matches the route path for Pricing
    },
    {
      text: "About",
      href: "/about", // Matches the route path for About
    },
    {
      text: "Contact",
      href: "/contact", // Matches the route path for Contact
    },
  ],
};

const services = [
  {
    image: "logo.svg",
    title: "Organize Your Code",
    description:
      "Organize your code into one repository or multiple. Structure your repository using a default layout or your own.",
  },
  {
    image: "logo.svg",
    title: "Transform Multiple Files",
    description:
      "Upload up to 4 files at once. Pro users can transform up to 10-20 files at the same time.",
  },
  {
    image: "logo.svg",
    title: "Customize Instructions",
    description:
      "Personalize the instructions that appear in the markdown file. Add or delete as needed.",
  },
  {
    image: "logo.svg",
    title: "Multilingual",
    description:
      "Write instructions in your preferred language (English, Spanish, Chinese, and more).",
  },

  {
    image: "logo.svg",
    title: "Play with Your Code",
    description:
      "Try our new playground where you can convert code into different programming languages, optimize it, and more.",
  },
  {
    image: "logo.svg",
    title: "Download Your Files",
    description:
      "Download your code, the complete directory, or your markdown file with all the documentation you need.",
  },
];

function Home() {
  return (
    <>
      <Navbar {...navbarContent} />
      <div>
        <MainSection description="Store your code, create helpful guides, build a component library, or document your code. Our AI tools make it easy.">
          <h1>
            Welcome to <br /> Code Library
          </h1>
        </MainSection>

        <Marquee />
        <Feature
          title="How Does It Work?"
          description="Just drag your code, and with AI help, you'll get a markdown file with your code documentation."
          backgroundColor="bg-orange-50"
        >
          <SlidingRectangles />

          <Hero
            title="Where Is My Code Stored?"
            description="All your code will be stored securely in your GitHub repository. You can easily access and manage your code anytime."
            image="github.svg"
          />
          <Hero
            title="Access to All Your Code?"
            description="No, we only request access to your public repositories. Code Library will only create public repositories, ensuring your private code remains private."
            image="access.png"
            reverse
          />
          <Hero
            title="Multi-Document Select"
            description="You can upload up to 4 code files at once, and our system will generate 4 markdown files with documentation. Pro users can upload up to 10 files at the same time for even more convenience."
            image="doc.png"
          />
          <Hero
            title="Powered by OpenAI"
            description="With the help of OpenAI, you can upload up to 4 code files at once, and our system will generate 4 markdown files with detailed documentation. Pro users can upload up to 10 files at once."
            image="gpt.png"
            reverse
          />

          <div className="flex flex-wrap w-full gap-10 justify-center pt-36">
            {services.map((item, index) => (
              <ServiceItem
                {...item}
                key={item.id} // Use a unique identifier instead of index
                className={
                  index % 2 === 0
                    ? "rotate-[-5deg] bg-white" // Ensure correct spacing and class names
                    : "rotate-[5deg] bg-base-200"
                }
              />
            ))}
          </div>

          <div className="flex flex-col items-center justify-center max-w-2xl mx-auto mt-24 gap-4">
            <h2 className="text-6xl font-black tracking-tighter">
              Why use Code Library if I can use GitHub directly?
            </h2>
            <p className="sm:text-2xl sm:leading-8">
              With Code Library, you can easily drop your code, create
              documentation, and build your guide or component library. Find all
              your components in one place and never lose your code.
            </p>
            <a href={'/auth/github'}
          className="btn btn-primary px-12"
        >
         Start Now
        </a>
          </div>
        </Feature>
      </div>
      <Footer
        brand={brandLogo}
        footerData={[
          {
            title: "Company",
            footerNav: [
              { link: "About us", href: "#" },
              { link: "Careers", href: "#" },
              { link: "Press", href: "#" },
              { link: "News", href: "#" },
              { link: "Media kit", href: "#" },
              { link: "Contact", href: "#" },
            ],
          },

          {
            title: "Support",
            footerNav: [
              { link: "Help Center", href: "#" },
              { link: "FAQs", href: "#" },
              { link: "Contact Support", href: "#" },
              { link: "Status", href: "#" },
            ],
          },

          {
            title: "Social Media",
            footerNav: [
              { link: "Facebook", href: "https://facebook.com" },
              { link: "Twitter", href: "https://twitter.com" },
              { link: "LinkedIn", href: "https://linkedin.com" },
              { link: "Instagram", href: "https://instagram.com" },
            ],
          },
        ]}
      />
    </>
  );
}

export default Home;
