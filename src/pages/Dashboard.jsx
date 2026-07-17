import { useState, useEffect } from "react";
import { Map, Marker } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  MapPin,
  AlertTriangle,
  Search,
  ChevronDown,
  ThumbsUp,
  MessageSquare,
  Clock,
  User,
  X,
  Send,
  Filter
} from "lucide-react";
import DashboardHeader from "../components/DashboardHeader.jsx";
import MapInteractive from "../components/MapInteractive.jsx";
import { fetchAllMarkers } from "../services/markerService.js";
import { useLocation } from "react-router-dom";

const initialLongitude = 106.828;
const initialLatitude = -6.222;

// TODO: Ganti DEFAULT_PREVIEW_PINS sama INITIAL_REPORTS pake data asli

const DEFAULT_PREVIEW_PINS = [
  { key: 'p1', longitude: 106.818, latitude: -6.215, color: '#FF8125', title: 'Kerusakan Jalan Karet', description: 'Jalan berlubang besar di sekitar Karet Tengsin.' },
  { key: 'p2', longitude: 106.824, latitude: -6.208, color: '#FF2525', title: 'Lampu Jalan Guntur', description: 'Lampu penerangan jalan utama padam total.' },
  { key: 'p3', longitude: 106.852, latitude: -6.222, color: '#23B58A', title: 'Kebersihan Sampah Cikoko', description: 'Tumpukan sampah liar di trotoar Cikoko.' },
  { key: 'p4', longitude: 106.804, latitude: -6.228, color: '#FF2525', title: 'Keamanan Begal Selong', description: 'Rawan tindakan kriminalitas pada malam hari.' },
  { key: 'p5', longitude: 106.838, latitude: -6.242, color: '#FF8125', title: 'Banjir Luapan Cawang', description: 'Bencana banjir genangan air pasca hujan.' }
];

const INITIAL_REPORTS = [
  {
    id: "REP-001",
    title: "Jalan Berlubang Besar & Membahayakan",
    description: "Ada lubang diameter sekitar 1 meter dengan kedalaman 15cm di tengah jalan utama. Sudah memakan korban beberapa pengendara motor terjatuh di malam hari karena minim penerangan jalan.",
    locationName: "Jl. Jenderal Sudirman Kav 21, Karet Kuningan",
    latitude: -6.215,
    longitude: 106.818,
    category: "Kerusakan Infrastruktur",
    dangerLevel: "Tinggi",
    status: "Diproses",
    likes: 42,
    comments: [
      {
        author: "Sistem Lapor",
        text: "Laporan telah diverifikasi dan diteruskan ke Dinas Pekerjaan Umum DKI Jakarta.",
        time: "2026-07-15 10:15"
      },
      {
        author: "Dinas PU DKI",
        text: "Petugas survei lapangan sedang meluncur ke lokasi untuk penambalan sementara malam ini.",
        time: "2026-07-15 14:00"
      }
    ],
    time: "2026-07-15 08:30"
  },
  {
    id: "REP-002",
    title: "Lampu Penerangan Jalan Mati Total",
    description: "Sepanjang jalur flyover lampu PJU mati total sejak 3 hari lalu. Kondisi gelap gulita ini sangat rawan aksi begal dan kecelakaan lalu lintas.",
    locationName: "Flyover Kuningan Timur, Mampang Prapatan",
    latitude: -6.208,
    longitude: 106.824,
    category: "Lampu Jalan Mati",
    dangerLevel: "Sedang",
    status: "Menunggu",
    likes: 18,
    comments: [
      {
        author: "Sistem Lapor",
        text: "Laporan diterima dan sedang mengantre untuk proses verifikasi oleh tim teknis terkait.",
        time: "2026-07-16 09:12"
      }
    ],
    time: "2026-07-16 08:00"
  },
  {
    id: "REP-003",
    title: "Penumpukan Sampah Liar Menyumbat Selokan",
    description: "Tumpukan sampah plastik dan limbah rumah tangga dibuang sembarangan di pinggir selokan. Saat hujan deras kemarin air meluap hingga menggenangi jalan raya setinggi 20cm.",
    locationName: "Jl. Tebet Barat Raya No. 45, Tebet",
    latitude: -6.222,
    longitude: 106.852,
    category: "Kebersihan & Sampah",
    dangerLevel: "Sedang",
    status: "Selesai",
    likes: 29,
    comments: [
      {
        author: "Sistem Lapor",
        text: "Laporan diteruskan ke Dinas Kebersihan dan Lingkungan Hidup kecamatan setempat.",
        time: "2026-07-14 11:30"
      },
      {
        author: "Dinas LH DKI",
        text: "Petugas kebersihan telah dikerahkan ke lokasi dan saluran air kini telah dibersihkan sepenuhnya.",
        time: "2026-07-15 16:45"
      }
    ],
    time: "2026-07-14 10:00"
  },
  {
    id: "REP-004",
    title: "Aksi Pemalakan Liar di JPO",
    description: "Sering ada kelompok pemuda mencurigakan meminta uang paksa kepada pejalan kaki yang melintasi Jembatan Penyeberangan Orang (JPO) halte TransJakarta di sore/malam hari.",
    locationName: "JPO Halte Gatot Subroto LIPI",
    latitude: -6.228,
    longitude: 106.804,
    category: "Keamanan & Kriminalitas",
    dangerLevel: "Tinggi",
    status: "Diproses",
    likes: 56,
    comments: [
      {
        author: "Sistem Lapor",
        text: "Laporan diteruskan ke Satpol PP dan Polsek setempat untuk patroli pengamanan.",
        time: "2026-07-15 19:30"
      },
      {
        author: "Polsek Setempat",
        text: "Patroli berkala mulai dijadwalkan di area JPO tersebut terutama pada jam rawan sore hari.",
        time: "2026-07-16 10:00"
      }
    ],
    time: "2026-07-15 18:00"
  },
  {
    id: "REP-005",
    title: "Pohon Rimbun Nyaris Tumbang Mengenai Kabel",
    description: "Pohon peneduh jalan condong ke arah jalan raya sekitar 45 derajat dan rantingnya menindih kabel listrik PLN bertegangan tinggi. Khawatir roboh saat hujan badai.",
    locationName: "Jl. K.H. Mas Mansyur, Tanah Abang",
    latitude: -6.242,
    longitude: 106.838,
    category: "Bencana Alam & Banjir",
    dangerLevel: "Sedang",
    status: "Selesai",
    likes: 12,
    comments: [
      {
        author: "Sistem Lapor",
        text: "Laporan diteruskan ke Dinas Kehutanan dan Pemadam Kebakaran.",
        time: "2026-07-13 15:00"
      },
      {
        author: "Dinas Pertamanan DKI",
        text: "Pemangkasan ranting pohon bermasalah telah diselesaikan oleh tim hijau di lapangan.",
        time: "2026-07-14 13:15"
      }
    ],
    time: "2026-07-13 14:00"
  }
];

const mapColorToTheme = (color) => {
  const c = color ? color.toLowerCase() : '';
  if (c.includes('red') || c === '#ff2525' || c === '#e53935' || c === '#ff0000') {
    return '#FF2525'; // Red: Tinggi
  }
  if (c.includes('green') || c === '#23b58a' || c === '#00ff00' || c === '#028f65' || c === 'green') {
    return '#23B58A'; // Green: Rendah
  }
  return '#FF8125'; // Orange: Sedang
};

const getCategoryOfReport = (report) => {
  const text = `${report.title || ''} ${report.description || ''}`.toLowerCase();
  if (text.includes('jalan') || text.includes('mati') || text.includes('lampu') || text.includes('penerangan')) {
    return 'Lampu Jalan Mati';
  }
  if (text.includes('sampah') || text.includes('bersih') || text.includes('kotor') || text.includes('limbah') || text.includes('kebersihan')) {
    return 'Kebersihan & Sampah';
  }
  if (text.includes('aman') || text.includes('kriminal') || text.includes('rampok') || text.includes('curi') || text.includes('maling') || text.includes('keamanan') || text.includes('begal')) {
    return 'Keamanan & Kriminalitas';
  }
  if (text.includes('banjir') || text.includes('bencana') || text.includes('gempa') || text.includes('longsor') || text.includes('hujan')) {
    return 'Bencana Alam & Banjir';
  }
  if (text.includes('jalan rusak') || text.includes('aspal') || text.includes('lubang') || text.includes('jembatan') || text.includes('gedung') || text.includes('infrastruktur') || text.includes('fasilitas') || text.includes('pipa')) {
    return 'Kerusakan Infrastruktur';
  }
  return 'Lainnya';
};

function Dashboard() {

  const location = useLocation();
  const getInitialTab = () => {
    if (location.state?.activeTab) return location.state.activeTab;
    const params = new URLSearchParams(location.search);
    if (params.get("tab")) return params.get("tab");
    return "beranda";
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [dbMarkers, setDbMarkers] = useState([]);

  const [likesState, setLikesState] = useState({});
  const [commentsState, setCommentsState] = useState({});
  const [likedReports, setLikedReports] = useState({});

  const [selectedStatus, setSelectedStatus] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua Kategori");
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    const loadMarkers = async () => {
      try {
        const data = await fetchAllMarkers();
        setDbMarkers(data || []);
      } catch (error) {
        console.error("Gagal mengambil data marker", error);
      }
    };
    loadMarkers();
  }, []);

  const reports = [
    ...INITIAL_REPORTS.map(r => ({
      ...r,
      likes: likesState[r.id] !== undefined ? likesState[r.id] : r.likes,
      comments: [
        ...r.comments,
        ...(commentsState[r.id] || [])
      ]
    })),
    ...dbMarkers.map((pin, idx) => {
      const isStatic = INITIAL_REPORTS.some(
          r => Math.abs(r.latitude - pin.latitude) < 0.0005 && Math.abs(r.longitude - pin.longitude) < 0.0005
      );
      if (isStatic) return null;

      const colorTheme = mapColorToTheme(pin.color);
      const danger = colorTheme === '#FF2525' ? 'Tinggi' : colorTheme === '#23B58A' ? 'Rendah' : 'Sedang';
      const category = getCategoryOfReport(pin);
      const id = pin.key ? `REP-${pin.key.substring(0, 5).toUpperCase()}` : `REP-DB${idx + 100}`;

      const baseLikes = pin.likes || 0;
      const baseComments = pin.comments || [];

      return {
        id,
        title: pin.title || 'Laporan Baru',
        description: pin.description || 'Tidak ada deskripsi tambahan.',
        locationName: pin.locationName || `Jakarta (Lat: ${Number(pin.latitude).toFixed(3)}, Lng: ${Number(pin.longitude).toFixed(3)})`,
        latitude: Number(pin.latitude),
        longitude: Number(pin.longitude),
        category: category,
        dangerLevel: danger,
        status: pin.status || 'Menunggu',
        likes: likesState[id] !== undefined ? likesState[id] : baseLikes,
        comments: [
          ...baseComments,
          ...(commentsState[id] || [])
        ],
        time: pin.time || '2026-07-16 12:00',
        dbKey: pin.key
      };
    }).filter(Boolean)
  ];

  const dbPinsMapped = dbMarkers.map((pin, idx) => ({
    key: pin.key || `db-${idx}`,
    longitude: Number(pin.longitude),
    latitude: Number(pin.latitude),
    color: mapColorToTheme(pin.color),
    title: pin.title || 'Reported Pin',
    description: pin.description || 'No description provided.'
  })).filter(pin => !isNaN(pin.longitude) && !isNaN(pin.latitude));

  const allPins = [...DEFAULT_PREVIEW_PINS, ...dbPinsMapped];

  const categoryCounts = {
    'Kerusakan Infrastruktur': 0,
    'Lampu Jalan Mati': 0,
    'Kebersihan & Sampah': 0,
    'Keamanan & Kriminalitas': 0,
    'Bencana Alam & Banjir': 0,
    'Lainnya': 0
  };

  allPins.forEach((pin) => {
    const cat = getCategoryOfReport(pin);
    if (categoryCounts[cat] !== undefined) {
      categoryCounts[cat] += 1;
    } else {
      categoryCounts['Lainnya'] += 1;
    }
  });

  const categoriesList = [
    { name: 'Kerusakan Infrastruktur', count: categoryCounts['Kerusakan Infrastruktur'] },
    { name: 'Lampu Jalan Mati', count: categoryCounts['Lampu Jalan Mati'] },
    { name: 'Kebersihan & Sampah', count: categoryCounts['Kebersihan & Sampah'] },
    { name: 'Keamanan & Kriminalitas', count: categoryCounts['Keamanan & Kriminalitas'] },
    { name: 'Bencana Alam & Banjir', count: categoryCounts['Bencana Alam & Banjir'] },
    { name: 'Lainnya', count: categoryCounts['Lainnya'] }
  ];

  const totalReports = allPins.length;
  const criticalCount = allPins.filter(pin => mapColorToTheme(pin.color) === '#FF2525').length;

  const filteredReports = reports.filter((report) => {
    if (selectedStatus !== "Semua" && report.status !== selectedStatus) {
      return false;
    }
    if (selectedCategory !== "Semua Kategori" && report.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchTitle = (report.title || "").toLowerCase().includes(q);
      const matchDesc = (report.description || "").toLowerCase().includes(q);
      const matchLoc = (report.locationName || "").toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchLoc) {
        return false;
      }
    }
    return true;
  });

  const getStatusCount = (status) => {
    return reports.filter((report) => {
      if (selectedCategory !== "Semua Kategori" && report.category !== selectedCategory) return false;
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchTitle = (report.title || "").toLowerCase().includes(q);
        const matchDesc = (report.description || "").toLowerCase().includes(q);
        const matchLoc = (report.locationName || "").toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchLoc) return false;
      }
      if (status !== "Semua" && report.status !== status) return false;
      return true;
    }).length;
  };

  const handleToggleLike = (reportId) => {
    const isLiked = likedReports[reportId];
    setLikedReports(prev => ({ ...prev, [reportId]: !isLiked }));

    const currentReport = reports.find(r => r.id === reportId);
    if (!currentReport) return;

    const nextCount = currentReport.likes + (isLiked ? -1 : 1);
    setLikesState(prev => ({ ...prev, [reportId]: nextCount }));
  };

  const handleAddComment = (reportId) => {
    if (!commentText.trim()) return;

    const newComment = {
      author: "Warga (Anonymous)",
      text: commentText.trim(),
      time: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setCommentsState(prev => ({
      ...prev,
      [reportId]: [
        ...(prev[reportId] || []),
        newComment
      ]
    }));

    setCommentText("");
  };

  const currentReportDetail = selectedReportId ? reports.find(r => r.id === selectedReportId) : null;

  return (
      <div className="min-h-screen bg-[#F5FDF9] flex flex-col font-sans overflow-hidden">
        <DashboardHeader activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "beranda" ? (
            <main className="flex-grow w-full max-w-[1214px] mx-auto px-8 py-10 overflow-y-auto animate-fade-in pb-24">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                  <h1 className="text-4xl font-bold text-text2 mb-2">Hello, Residents!</h1>
                  <p className="text-text3 text-sm">Here is the map situation around you today.</p>
                </div>
                <button
                    type="button"
                    onClick={() => setActiveTab("peta")}
                    className="mt-4 md:mt-0 px-6 py-2.5 bg-main text-white font-bold rounded-full hover:bg-opacity-90 transition-all shadow-sm cursor-pointer"
                >
                  + Tambah laporan
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="lg:col-span-2 bg-white rounded-3xl border border-stroke shadow-[0_8px_30px_rgba(5,40,73,0.03)] p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2">
                        <MapPin className="text-main w-5 h-5" />
                        <h2 className="text-lg font-bold text-text2 font-sans">Sebaran Laporan Warga Jakarta</h2>
                      </div>
                      <button
                          onClick={() => setActiveTab("peta")}
                          className="text-xs font-bold text-main hover:text-main/80 transition-colors flex items-center gap-1 cursor-pointer bg-transparent border-none"
                      >
                        Buka Peta Penuh <span className="text-[10px]">➔</span>
                      </button>
                    </div>

                    <div
                        onClick={() => setActiveTab("peta")}
                        className="relative h-[380px] w-full rounded-2xl overflow-hidden bg-gray-50 border border-stroke cursor-pointer group shadow-inner"
                    >
                      <Map
                          initialViewState={{
                            longitude: initialLongitude,
                            latitude: initialLatitude,
                            zoom: 12.2
                          }}
                          mapStyle="https://tiles.openfreemap.org/styles/bright"
                          interactive={false}
                      >
                        {allPins.map((pin) => (
                            <Marker
                                key={pin.key}
                                longitude={pin.longitude}
                                latitude={pin.latitude}
                            >
                              <div className="relative flex items-center justify-center">
                                <div
                                    className="absolute rounded-full animate-ping opacity-30"
                                    style={{
                                      width: '20px',
                                      height: '20px',
                                      backgroundColor: pin.color,
                                    }}
                                />
                                <div
                                    className="relative rounded-full border-2 border-white shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
                                    style={{
                                      width: '12px',
                                      height: '12px',
                                      backgroundColor: pin.color,
                                    }}
                                />
                              </div>
                            </Marker>
                        ))}
                      </Map>

                      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-stroke shadow-md z-10 min-w-[170px] pointer-events-none">
                        <p className="text-[11px] font-bold text-text2 mb-2 font-sans">Legenda Tingkat Bahaya:</p>
                        <div className="flex flex-col gap-1.5 text-[10.5px] text-text3 font-sans">
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-[#FF2525]" />
                            <span className="font-semibold text-text2">Tinggi (Bahaya)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-[#FF8125]" />
                            <span className="font-semibold text-text2">Sedang</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-[#23B58A]" />
                            <span className="font-semibold text-text2">Rendah (Aman)</span>
                          </div>
                        </div>
                      </div>

                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md text-xs font-bold text-text2 flex items-center gap-1">
                          <span>Klik untuk Membuka Peta Penuh</span>
                          <span>➔</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-stroke shadow-[0_8px_30px_rgba(5,40,73,0.03)] p-6 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-text2 font-sans mb-0.5">Distribusi Laporan</h2>
                    <p className="text-[11px] text-text3/80 font-sans mb-5">Jumlah keluhan berdasarkan klasifikasi kategori</p>

                    <div className="flex flex-col gap-4">
                      {categoriesList.map((cat) => {
                        const percentage = totalReports > 0 ? (cat.count / totalReports) * 100 : 0;
                        return (
                            <div key={cat.name} className="flex flex-col gap-1.5 font-sans">
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-text2 font-semibold text-xs">{cat.name}</span>
                                <span className="text-text3/70 text-[11px]">{cat.count} Laporan</span>
                              </div>
                              <div className="w-full bg-[#EAF5EF] h-2 rounded-full overflow-hidden">
                                <div
                                    className="bg-main h-full rounded-full transition-all duration-300"
                                    style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="border-t border-stroke pt-4 mt-6 flex items-center justify-between text-xs font-sans">
                    <span className="text-text3/70 font-semibold">Total Kategori: {categoriesList.filter(c => c.count > 0).length} Aktif</span>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full font-bold border border-red-100/40">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-500 animate-bounce" />
                      <span>{criticalCount} Kritis</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-stroke shadow-[0_8px_30px_rgba(5,40,73,0.02)] p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-8 border-b border-stroke pb-6">
                  <div className="flex flex-wrap gap-2.5">
                    {["Semua", "Menunggu", "Diproses", "Selesai"].map((status) => {
                      const isActive = selectedStatus === status;
                      const count = getStatusCount(status);
                      return (
                          <button
                              key={status}
                              onClick={() => setSelectedStatus(status)}
                              className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                                  isActive
                                      ? "bg-main text-white shadow-md shadow-main/10 scale-105"
                                      : "bg-[#F0F6F3] text-text3/80 hover:bg-[#E2EBE6] hover:text-text2"
                              }`}
                          >
                            {status} ({count})
                          </button>
                      );
                    })}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-stretch">
                    <div className="relative flex-grow sm:max-w-xs">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text3/50" />
                      <input
                          type="text"
                          placeholder="Cari kata kunci..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 rounded-xl border border-stroke bg-[#F8FDFB] text-xs text-text2 focus:outline-none focus:border-main focus:ring-1 focus:ring-main/20 font-sans transition-all"
                      />
                    </div>

                    <div className="relative sm:min-w-[190px]">
                      <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text3/50" />
                      <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-full pl-9 pr-8 py-2 rounded-xl border border-stroke bg-[#F8FDFB] text-xs text-text2 font-bold focus:outline-none focus:border-main focus:ring-1 focus:ring-main/20 appearance-none cursor-pointer"
                      >
                        <option value="Semua Kategori">Semua Kategori</option>
                        <option value="Kerusakan Infrastruktur">Kerusakan Infrastruktur</option>
                        <option value="Lampu Jalan Mati">Lampu Jalan Mati</option>
                        <option value="Kebersihan & Sampah">Kebersihan & Sampah</option>
                        <option value="Keamanan & Kriminalitas">Keamanan & Kriminalitas</option>
                        <option value="Bencana Alam & Banjir">Bencana Alam & Banjir</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text3/60 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {filteredReports.length === 0 ? (
                    <div className="text-center py-16 bg-[#F8FDFB] rounded-2xl border border-dashed border-stroke/80">
                      <AlertTriangle className="w-10 h-10 text-text3/40 mx-auto mb-3" />
                      <p className="text-text2 font-bold text-sm mb-1">Tidak ada laporan ditemukan</p>
                      <p className="text-text3/60 text-xs">Coba ubah filter atau kata kunci pencarian Anda.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredReports.map((report) => {
                        const isDangerHigh = report.dangerLevel === "Tinggi";
                        const isDangerMedium = report.dangerLevel === "Sedang";

                        const statusColorClass =
                            report.status === "Selesai"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                : report.status === "Diproses"
                                    ? "bg-sky-50 text-sky-700 border-sky-100"
                                    : "bg-amber-50 text-amber-700 border-amber-100";

                        const dangerColorClass =
                            isDangerHigh
                                ? "bg-red-50 text-red-600 border-red-100"
                                : isDangerMedium
                                    ? "bg-amber-50 text-amber-600 border-amber-100"
                                    : "bg-teal-50 text-teal-600 border-teal-100";

                        return (
                            <div
                                key={report.id}
                                onClick={() => setSelectedReportId(report.id)}
                                className="bg-white rounded-2xl border border-stroke/80 shadow-[0_4px_20px_rgba(5,40,73,0.015)] hover:shadow-[0_12px_30px_rgba(5,40,73,0.05)] hover:border-main/20 p-5 flex flex-col justify-between transition-all duration-300 cursor-pointer group hover:-translate-y-0.5"
                            >
                              <div>
                                <div className="flex justify-between items-center mb-3">
                              <span className="text-[11px] font-bold text-text3/40 tracking-wider font-mono">
                                {report.id}
                              </span>
                                  <div className="flex gap-1.5">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${dangerColorClass}`}>
                                  Darurat: {report.dangerLevel}
                                </span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${statusColorClass}`}>
                                  {report.status}
                                </span>
                                  </div>
                                </div>

                                <h3 className="text-[14.5px] font-bold text-text2 leading-snug mb-2 group-hover:text-main transition-colors font-sans line-clamp-2">
                                  {report.title}
                                </h3>

                                <p className="text-[12px] text-text3/85 leading-relaxed mb-4 font-sans line-clamp-3">
                                  {report.description}
                                </p>
                              </div>

                              <div>
                                <div className="flex items-center gap-1.5 mb-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-main" />
                                  <span className="text-[11px] font-bold text-main font-sans">
                                {report.category}
                              </span>
                                </div>

                                <div className="flex items-start gap-1.5 text-[11px] text-text3/70 mb-4 font-sans">
                                  <MapPin className="w-3.5 h-3.5 text-text3/40 shrink-0 mt-0.5" />
                                  <span className="line-clamp-1">{report.locationName}</span>
                                </div>

                                <div className="flex justify-between items-center pt-3.5 border-t border-stroke/40 text-[11px] font-sans">
                                  <div className="flex items-center gap-1.5 text-text3 font-semibold">
                                    <User className="w-3.5 h-3.5 text-text3/50" />
                                    <span>Oleh: Anonymous</span>
                                  </div>

                                  <div className="flex items-center gap-3 text-text3/60">
                                <span className="flex items-center gap-1">
                                  <ThumbsUp className="w-3.5 h-3.5" />
                                  <span>{report.likes}</span>
                                </span>
                                    <span className="flex items-center gap-1">
                                  <MessageSquare className="w-3.5 h-3.5" />
                                  <span>{report.comments.length}</span>
                                </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                        );
                      })}
                    </div>
                )}
              </div>

              {selectedReportId && currentReportDetail && (
                  <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 transition-all animate-fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden border border-stroke shadow-2xl flex flex-col max-h-[85vh] animate-scale-in">

                      <div className="px-6 py-4 bg-[#F8FDFB] border-b border-stroke flex items-center justify-between">
                        <div className="flex items-center gap-2">
                        <span className="bg-[#EAF5EF] text-main text-xs font-bold px-2.5 py-1 rounded-md font-mono">
                          {currentReportDetail.id}
                        </span>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                              currentReportDetail.status === "Selesai"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : currentReportDetail.status === "Diproses"
                                      ? "bg-sky-50 text-sky-700"
                                      : "bg-amber-50 text-amber-700"
                          }`}>
                          {currentReportDetail.status}
                        </span>
                        </div>

                        <button
                            onClick={() => setSelectedReportId(null)}
                            className="p-1.5 hover:bg-gray-200/60 rounded-full text-text3 transition-colors cursor-pointer"
                        >
                          <X className="w-5 h-5 text-text3/70" />
                        </button>
                      </div>

                      <div className="p-6 overflow-y-auto flex-grow flex flex-col gap-5">

                        <div className="flex flex-wrap gap-2">
                        <span className="text-[11px] font-bold px-3 py-1 bg-emerald-50 text-[#028F65] rounded-full border border-emerald-100">
                          {currentReportDetail.category}
                        </span>
                          <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
                              currentReportDetail.dangerLevel === "Tinggi"
                                  ? "bg-red-50 text-red-600 border-red-100"
                                  : currentReportDetail.dangerLevel === "Sedang"
                                      ? "bg-amber-50 text-amber-600 border-amber-100"
                                      : "bg-teal-50 text-teal-600 border-teal-100"
                          }`}>
                          Darurat: {currentReportDetail.dangerLevel}
                        </span>
                        </div>

                        <div>
                          <h2 className="text-xl font-bold text-text2 leading-tight font-sans">
                            {currentReportDetail.title}
                          </h2>
                          <p className="text-[11px] text-text3/50 mt-1.5 font-sans">
                            Dilaporkan oleh <span className="font-semibold text-text3/80">Anonymous</span> • <Clock className="w-3 h-3 inline ml-0.5 mr-0.5" /> {currentReportDetail.time}
                          </p>
                        </div>

                        <div className="bg-[#F3FAF6] border border-stroke/40 p-5 rounded-2xl text-[13px] text-text3 leading-relaxed font-sans shadow-inner">
                          {currentReportDetail.description}
                        </div>

                        <div className="border border-stroke/70 bg-white p-4 rounded-xl font-sans">
                        <span className="text-xs font-bold text-text2 flex items-center gap-1.5 mb-2 uppercase tracking-wide">
                          <MapPin className="w-4 h-4 text-red-500" /> Titik Penanganan Lokasi
                        </span>
                          <p className="text-xs font-semibold text-text2 mb-1 pl-5">
                            {currentReportDetail.locationName}
                          </p>
                          <p className="text-[10px] text-text3/50 font-mono pl-5">
                            Koordinat: Lat {Number(currentReportDetail.latitude).toFixed(4)}, Lng {Number(currentReportDetail.longitude).toFixed(4)}
                          </p>
                        </div>

                        <div className="mt-2 font-sans">
                        <span className="text-xs font-bold text-text2 flex items-center gap-1.5 mb-3.5 uppercase tracking-wide">
                          <MessageSquare className="w-4 h-4 text-main" /> Kolaborasi & Masukan Warga ({currentReportDetail.comments.length})
                        </span>

                          <div className="flex flex-col gap-3 mb-4">
                            {currentReportDetail.comments.length === 0 ? (
                                <p className="text-xs text-text3/50 italic py-3 text-center bg-gray-50 rounded-xl">
                                  Belum ada tanggapan. Jadilah yang pertama memberikan masukan!
                                </p>
                            ) : (
                                currentReportDetail.comments.map((comment, cIdx) => {
                                  const isOfficialSystem = comment.author === "Sistem Lapor";
                                  const isOfficialPU = comment.author === "Dinas PU DKI" || comment.author === "Dinas LH DKI" || comment.author === "Dinas Pertamanan DKI";

                                  let authorColorClass = "text-[#028F65] font-bold";
                                  if (isOfficialSystem) authorColorClass = "text-emerald-700 font-bold";
                                  if (isOfficialPU) authorColorClass = "text-emerald-600 font-bold";

                                  return (
                                      <div key={cIdx} className="bg-gray-50/70 border border-gray-100 rounded-xl p-3.5">
                                        <div className="flex justify-between items-center mb-1 text-[11px]">
                                    <span className={authorColorClass}>
                                      {comment.author}
                                    </span>
                                          <span className="text-text3/40 text-[10px]">
                                      {comment.time}
                                    </span>
                                        </div>
                                        <p className="text-[12px] text-text3/90 leading-relaxed pl-1">
                                          {comment.text}
                                        </p>
                                      </div>
                                  );
                                })
                            )}
                          </div>

                          <div className="flex gap-2 items-center mt-2 bg-white border border-stroke rounded-full p-1 pl-4 focus-within:border-main focus-within:ring-1 focus-within:ring-main/20 transition-all">
                            <input
                                type="text"
                                placeholder="Tulis tanggapan atau beri informasi tambahan..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleAddComment(currentReportDetail.id);
                                }}
                                className="flex-grow text-[12px] text-text2 focus:outline-none bg-transparent"
                            />
                            <button
                                onClick={() => handleAddComment(currentReportDetail.id)}
                                className="w-8 h-8 rounded-full bg-main hover:bg-main/90 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="px-6 py-4 border-t border-stroke bg-gray-50 flex justify-between items-center">
                        <button
                            onClick={() => handleToggleLike(currentReportDetail.id)}
                            className={`flex items-center gap-1.5 px-4 py-2 border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                likedReports[currentReportDetail.id]
                                    ? "bg-red-50 text-red-500 border-red-200 scale-105"
                                    : "bg-white border-stroke text-text3/80 hover:bg-gray-100"
                            }`}
                        >
                          <ThumbsUp className={`w-3.5 h-3.5 ${likedReports[currentReportDetail.id] ? "fill-red-500 text-red-500" : ""}`} />
                          <span>Beri Dukungan (+{currentReportDetail.likes})</span>
                        </button>

                        <button
                            onClick={() => setSelectedReportId(null)}
                            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-text2 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                        >
                          Tutup
                        </button>
                      </div>

                    </div>
                  </div>
              )}
            </main>
        ) : (
            <div className="flex-grow h-[calc(100vh-4.5rem)] w-full relative animate-fade-in">
              <MapInteractive />
            </div>
        )}
      </div>
  );
}

export default Dashboard;
