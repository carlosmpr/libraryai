

const CenterHeading = ({ title, description, buttonText, buttonLink }) => {
  return (
    <div className="flex flex-col items-center justify-center max-w-2xl mx-auto mt-24 gap-4">
      <h2 className="text-4xl sm:text-6xl font-black tracking-tighter">
        {title}
      </h2>
      <p className="sm:text-2xl sm:leading-8">
        {description}
      </p>
      <a
        href={buttonLink}
        className="btn btn-primary px-12"
      >
        {buttonText}
      </a>
    </div>
  );
};

export default CenterHeading;
