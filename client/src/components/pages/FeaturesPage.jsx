import Feature from "../ui/Feature";
import SlidingRectangles from "../animations/MovingRectangles";
import Hero from "../ui/Hero";
import FadeInTransition from "../animations/FadeTransition";
import ServiceItem from "../ui/ServiceItem";
import CenterHeading from "../ui/CenterHeading";
const FeaturesPage = ({generalData}) => {
  const {  services, heroes, additionalSection, feature } = generalData;
  return (
    <Feature {...feature} >
      <SlidingRectangles />
      {heroes.map((hero) => (
        <Hero key={hero.title} {...hero} />
      ))}
      <div className="flex flex-wrap w-full gap-10 justify-center pt-36">
        {services.map((item, index) => (
          <FadeInTransition key={index} delay={0.2}>
            <ServiceItem
              {...item}
              className={
                index % 2 === 0
                  ? "rotate-[-5deg] bg-white"
                  : "rotate-[5deg] bg-base-200"
              }
            />
          </FadeInTransition>
        ))}
      </div>

      <CenterHeading {...additionalSection}/>
    </Feature>
  );
};

export default FeaturesPage;
