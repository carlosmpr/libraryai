import CenterHeading from "../ui/CenterHeading";
import Feature from "../ui/Feature";
import Hero from "../ui/Hero";
import { useLocalization } from "../context/LocalizationContext";
const AboutPage = () => {
  const { generalData, aboutPageData } = useLocalization();
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
