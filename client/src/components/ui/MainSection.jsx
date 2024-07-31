

const FloatingElements = ({ image, position = "top-10 right-5", width = "w-44" }) => {
    return (
      <div className={`absolute ${position} ${width}`}>
        <img src={image} alt="icon" className="w-full" />
      </div>
    );
  };
  
  const MainSection = ({ title, description }) => {
    return (
      <section
        className="flex bg-orange-100 relative flex-col items-center justify-center w-[100vw] h-[100vh] sm:text-center gap-6 p-8"
      >
        {/* Floating Elements */}
        <FloatingElements image="/icon1.svg" />
        <FloatingElements image="/icon2.svg" position="right-5 bottom-0" />
        <FloatingElements image="/icon3.svg" position="left-0 bottom-0" />
        <FloatingElements image="/icon4.svg" position="left-0 top-[20%] hidden sm:absolute" width="w-24" />
        <FloatingElements image="/icon5.svg" position="left-0 top-[10%]" width="w-24" />
  
        {/* Main Content */}
        <h1
          className="self-stretch z-30 text-5xl lg:text-8xl mx-auto font-black text-gray-900 max-w-screen-md"
        >
          {title}
        </h1>
  
        <p className="sm:text-2xl sm:leading-8 max-w-2xl">{description}</p>
  
        {/* Call to Action */}
        <div
          className="w-full flex flex-col-reverse justify-center sm:flex-row gap-3 text-sm sm:text-base font-semibold whitespace-nowrap"
        >
          <a href="/auth/github" className="btn btn-secondary px-12">
            Start Now
          </a>
        </div>
      </section>
    );
  };
  
  export default MainSection;
  