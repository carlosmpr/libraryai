"use client";

import InfiniteScrollAnimation from "../animations/InfiniteScrollAnimation";

const companies = [
  "/programing/1.svg",
  "/programing/2.svg",
  "/programing/3.svg",
  "/programing/4.svg",
  "/programing/5.svg",
  "/programing/6.svg",
  "/programing/7.svg",
  "/programing/8.svg",
  "/programing/9.svg",
  "/programing/10.svg",
];

const Marquee = () => {
  return (
    <section className="w-full flex gap-5 justify-evenly bg-orange-100 max-md:flex-wrap p-10">
      <InfiniteScrollAnimation>
        {companies.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Company logo ${index + 1}`}  // Improved alt text for accessibility
            width={500}
            height={500}
            className="shrink-0 max-w-full aspect-[1.57] w-[160px]"
          />
        ))}
      </InfiniteScrollAnimation>
    </section>
  );
};

export default Marquee;
