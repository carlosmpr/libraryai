import CenterHeading from "../ui/CenterHeading";
import Feature from "../ui/Feature";
import Hero from "../ui/Hero";
import { generalData, aboutPageData } from "../../data/PageData";
const AboutPage = () => {
  const { featureTitle, featureDescription, heroSections } = aboutPageData;
  return (
    <Feature title={featureTitle} description={featureDescription}>
      {heroSections.map((item) => (
        <Hero key={item.title} {...item} />
      ))}
      <CenterHeading {...generalData.additionalSection} />
    </Feature>
  );
};

export default AboutPage;