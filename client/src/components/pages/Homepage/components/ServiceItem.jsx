/* eslint-disable react/prop-types */


export default function ServiceItem({
  image,
  title,
  description,
  className, // Add this line
}) {
  return (
    <div className={`flex flex-col w-[300px]  h-[350px] justify-center items-center shrink-0 gap-2 border-2 border-black p-4  ${className}`}>
      <img
        src={image}
        className="w-6 shadow-sm aspect-square bg-primary"
        alt={title}
       
      />
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="text-sm text-base-content/70">{description}</p>
    </div>
  );
}
