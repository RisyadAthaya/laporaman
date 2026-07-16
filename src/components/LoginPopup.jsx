import { Link } from "react-router-dom";
import img from "../assets/lock.svg";

function LoginPopup({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="flex flex-col items-center bg-white rounded-2xl shadow-xl max-w-sm w-full p-8 text-center animate-scale-in"
        onClick={(e) => e.stopPropagation()}
    >
        <div className="flex-center w-16 h-16 rounded-full bg-brand/10 mb-4">
          <img src={img} alt="Lock" className="w-10 h-10 text-brand" />
        </div>

        <h2 className="text-size-300 font-bold text-dark m-0 mb-2">
          Masuk Diperlukan
        </h2>
        <p className="text-[#555e72] m-0 mb-6">
          Kamu harus masuk terlebih dahulu untuk mengakses peta lengkap.
        </p>

        <Link
          to="/login"
          className="w-full bg-main text-background no-underline font-bold rounded-lg py-2.5 mb-2.5 transition-scale"
        >
          Masuk Sekarang
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="w-full bg-transparent border-none text-[#555e72] font-medium py-2 cursor-pointer"
        >
          Batal
        </button>
      </div>
    </div>
  );
}

export default LoginPopup;
