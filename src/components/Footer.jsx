import BrandLogo from "./BrandLogo.jsx";

function Footer() {
  return (
      <footer className="header1">
        <div className="header-title w-full  px-8 flex justify-between">
          <BrandLogo
              className="flex items-center gap-[6.438px]"
              imgStyle={{ width: "32px", height: "38.5px" }}
          />
          <span className="text-[12px] md:text-sm text-text3/90 font-medium font-sans">
          © 2026 Orang Desa yang Pake Dolar GarudaHacks 7.0
        </span>
        </div>
      </footer>
  );
}

export default Footer;