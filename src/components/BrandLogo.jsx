import logo from "../assets/logo.svg";

function BrandLogo({
  label = "Lapor Aman",
  className = "flex items-center gap-2",
  imgClassName = "",
  imgStyle,
  textClassName = "",
}) {
  return (
    <span className={className}>
      <img src={logo} alt={label} className={imgClassName} style={imgStyle} />
      <span className={textClassName}>{label}</span>
    </span>
  );
}

export default BrandLogo;
