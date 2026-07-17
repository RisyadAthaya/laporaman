import { useState } from "react";
import DashboardHeader from "../components/DashboardHeader.jsx";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("beranda");

  return (
      <div className="min-h-screen bg-[#F5FDF9] flex flex-col font-sans">
        <DashboardHeader activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="flex-grow w-full max-w-[1214px] mx-auto px-8 py-10">
          {activeTab === "beranda" ? (
              <div className="animate-fade-in">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                  <div>
                    <h1 className="text-4xl font-bold text-text2 mb-2">Hello, Residents!</h1>
                    <p className="text-text3 text-sm">Here is the map situation around you today.</p>
                  </div>
                  <button
                      type="button"
                      className="mt-4 md:mt-0 px-6 py-2.5 bg-main text-white font-bold rounded-full hover:bg-opacity-90 transition-all shadow-sm cursor-pointer"
                  >
                    + Tambah laporan
                  </button>
                </div>

                <div className="border border-dashed border-stroke rounded-2xl p-12 flex flex-col items-center justify-center text-center bg-white shadow-sm min-h-[300px]">
                  <p className="text-text3 font-medium mb-1">Konten Beranda</p>
                  <p className="text-text3/60 text-xs">Isi konten beranda akan ditambahkan di sini.</p>
                </div>
              </div>
          ) : (
              <div className="animate-fade-in">
                <div className="mb-8">
                  <h1 className="text-4xl font-bold text-text2 mb-2">Peta Laporan</h1>
                  <p className="text-text3 text-sm font-medium">Lihat seluruh peta interaktif laporan warga.</p>
                </div>

                <div className="border border-dashed border-stroke rounded-2xl p-12 flex flex-col items-center justify-center text-center bg-white shadow-sm min-h-[400px]">
                  <p className="text-text3 font-medium mb-1">Konten Peta</p>
                  <p className="text-text3/60 text-xs">Peta interaktif akan ditampilkan di sini.</p>
                </div>
              </div>
          )}
        </main>
      </div>
  );
}

export default Dashboard;