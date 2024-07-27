/* eslint-disable react/prop-types */


export default function Feature({ title, description, children, backgroundColor="bg-orange-100"}) {
  return (
    <section className={`w-full flex flex-col  ${backgroundColor} items-center justify-center  text-center gap-4 py-32 px-10`}>
      <h2
        className="self-stretch  mx-auto text-4xl sm:text-7xl max-w-[600px]
       font-black text-gray-900"
      >
        {title}
      </h2>

      <p className="sm:text-xl sm:leading-8 r text-slate-600 max-w-[608px] ">
        {description}
      </p>

      <div className="w-full aspect-[2.56] mt-10 min-w-[350px]">
        {children}
      </div>
    </section>
  );
}
