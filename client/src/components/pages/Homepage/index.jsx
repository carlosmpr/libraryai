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
    image: "message.svg",
    title: "Component Libraries",
    description:
      "Access a rich library of pre-built components that ensure consistency and speed up your development workflow.",
  },
  {
    image: "tunder.svg",
    title: "Dynamic APIs",
    description:
      "Integrate dynamic APIs easily with our scalable architecture, enhancing your application's functionality with minimal effort.",
  },
  {
    image: "logo.svg",
    title: "Modular Design",
    description:
      "Utilize modular design principles to create flexible, reusable code that adapts to any project's needs.",
  },
  {
    image: "chat.svg",
    title: "Live Previews",
    description:
      "Leverage live previews during development to see real-time changes and speed up your iteration cycles.",
  },
  {
    image: "connect.svg",
    title: "Seamless Connectivity",
    description:
      "Ensure seamless connectivity with essential tools and services, facilitating an integrated development environment.",
  },
  {
    image: "heart.svg",
    title: "Developer Support",
    description:
      "Benefit from comprehensive developer support, offering detailed documentation and community forums to aid your project development.",
  },
];

function Home() {
  return (
    <>
      <Navbar {...navbarContent} />
      <div>
        <MainSection
          description={
            "Document your code, create insightful guides, build a living component library, or simply store all your code.  Our AI tools make it easy to document your code "
          }
        >
          <h1>
            Welcome to <br /> Code Library
          </h1>
        </MainSection>
        <Marquee />
        <Feature
          title="How does it Works?"
          description="Simple drag your code and with the help of Ai you will have a md file with your documentation."
          backgroundColor="bg-orange-50"
        >
          <SlidingRectangles />

          <Hero
            title={"Where is my code store?"}
            description={
              "All your code will be store on your github repository"
            }
            image={"github.svg"}
          />
          <Hero
            title={"Access to all your code?"}
            description={
              "No we only request access to publick repositories and Code Library will only create public repositores"
            }
            image={"access.png"}
            reverse
          />
          <Hero
            title={"MultiDocument Select"}
            description={
              "You can pass up to 4 code at the same time, and the system will be able to generate 4md files , pro user will generate up to 10"
            }
            image={"doc.png"}
          />
          <Hero
            title={"Power by OpenAi Ai"}
            description={
              "You can pass up to 4 code at the same time, and the system will be able to generate 4md files , pro user will generate up to 10"
            }
            image={"gpt.png"}
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

          <div className="flex flex-col items-center justify-center max-w-2xl mx-auto  mt-24 gap-4">
            <h2 className="text-6xl font-black tracking-tighter ">
              Why use code library? if i can use github directly
            </h2>
            <p className="sm:text-2xl sm:leading-8">Because i can just simple drop my code , create the documentation and make my guide or component library and i could search for all the components in one place and not lost code </p>
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
