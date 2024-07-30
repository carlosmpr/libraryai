

const FloatingElements = ({ image, position = "top-10 right-5", width = "w-44" }) => {
    return (
      <div className={`absolute ${position} ${width}`}>
        <img src={image} alt="icon" className="w-full" />
      </div>
    );
  };
  
  const MainSection = ({ children, description }) => {
    return (
      <section
        className="flex bg-orange-50 relative flex-col items-center justify-center w-[100vw] h-[100vh] text-center gap-6"
      >
        {/* Floating Elements */}
        <FloatingElements image="/icon1.svg" />
        <FloatingElements image="/icon2.svg" position="right-5 bottom-0" />
        <FloatingElements image="/icon3.svg" position="left-0 bottom-0" />
        <FloatingElements image="/icon4.svg" position="left-0 top-[20%]" width="w-24" />
        <FloatingElements image="/icon5.svg" position="left-0 top-[10%]" width="w-24" />
  
        {/* Main Content */}
        <h1
          className="self-stretch text-4xl md:text-6xl lg:text-8xl font-black text-gray-900"
        >
          {children}
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
  