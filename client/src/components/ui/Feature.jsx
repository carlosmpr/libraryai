const Feature = ({
  title,
  description,
  children,
}) => {
  return (
    <section
      className={`w-full flex flex-col bg-orange-100 items-center justify-center sm:text-center gap-4 py-32 p-8 sm:px-10`}
    >
      <h2 className="self-stretch mx-auto text-4xl sm:text-7xl  font-black text-gray-900">
        {title}
      </h2>

      <p className="sm:text-xl sm:leading-8 text-slate-600 max-w-[608px]">
        {description}
      </p>

      <div className="w-full mt-10 space-y-40">{children}</div>
    </section>
  );
};

export default Feature;
