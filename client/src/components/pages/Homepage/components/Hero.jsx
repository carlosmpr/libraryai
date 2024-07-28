/* eslint-disable react/prop-types */
import FadeInSpring from "../../../animations/FadeInSpring";
export default function Hero({ reverse = false, title, description, image }) {
  return (
    <FadeInSpring>
    <div
      className={`flex w-full items-center justify-center gap-10 max-w-5xl mx-auto pt-36 ${
        reverse && "flex-row-reverse"
      }`}
    >
      <div className="w-[350px] h-[350px]  relative  overflow-hidden border border-white/10 rounded-2xl box-shadow relative">
        <img src={image} alt={image} className="w-full" />
      </div>
      <div className="grid gap-4 w-[30%] text-start">
        <h2 className="text-4xl font-bold tracking-tighter">{title}</h2>
        <p className="text-base-content/70">{description}</p>
      </div>
    </div>
    </FadeInSpring>
  );
}