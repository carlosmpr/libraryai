/* eslint-disable react/prop-types */
import FadeInTransition from '../animations/FadeTransition'


export default function Heading({
  decoration,
  title,
  description,
}) {
  return (
    <FadeInTransition className="flex flex-col    gap-2 sm:gap-4 py-16 sm:py-18">
      {decoration && <span className="badge badge-primary p-4">{decoration}</span>}

      <h2 className="text-3xl sm:text-5xl lg:text-7xl font-bold">{title}</h2>
      <p className="text-base-content/70 max-w-[500px]">{description}</p>
    </FadeInTransition>
  );
}
