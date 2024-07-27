/* eslint-disable react/prop-types */



export default function FloatingElements({
  image,
  position = "top-10 right-5",
  width = "w-44",
}) {
  return (
    <div className={`absolute  ${position} ${width}`}>
      <img src={image} alt="icon" className="w-full" />
    </div>
  );
}
