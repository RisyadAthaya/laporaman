import { Monitor, ShieldAlert, User, KeyRound } from "lucide-react";
import NavBar from "../components/NavBar.jsx";
import SettingsCard from "../components/SettingsCard.jsx";
import { useAuth } from "../contexts/useAuth.js";

function SettingsRow({
  icon,
  title,
  description,
  actionLabel,
  divider = true,
}) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 ${
        divider ? "border-b border-stroke" : ""
      }`}
    >
      <div className="flex items-center gap-4">
        {icon}
        <div>
          <h3 className="font-semibold text-text2">{title}</h3>
          <p className="text-sm text-text3">{description}</p>
        </div>
      </div>
      <button
        type="button"
        className="self-start sm:self-auto shrink-0 rounded-full border border-main px-5 py-2 text-sm font-semibold text-main hover:bg-main/5 transition-colors cursor-pointer bg-white"
      >
        {actionLabel}
      </button>
    </div>
  );
}

function SettingsPage() {
  const { currentUser } = useAuth();

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-b from-stroke/50 to-background">
        <div className="max-w-[1214px] mx-auto px-8 py-10">
          <h1 className="text-4xl font-bold text-text2">Settings</h1>
          <p className="text-text3 mt-1">
            Kelola informasi akun dan keamanan anda
          </p>

          <SettingsCard icon={Monitor} title="Display" className="mt-8">
            <SettingsRow
              icon={
                currentUser?.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt=""
                    className="w-16 h-16 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="flex items-center justify-center w-16 h-16 rounded-full bg-background text-text3">
                    <User size={28} />
                  </span>
                )
              }
              title="Profile Picture"
              description="Ubah foto profil yang akan ditampilkan."
              actionLabel="Ubah Foto"
            />
            <SettingsRow
              icon={
                <User
                  className="text-main shrink-0"
                  size={32}
                  strokeWidth={1.5}
                />
              }
              title="Username"
              description="Lihat dan ubah username kamu."
              actionLabel="Ubah Username"
              divider={false}
            />
          </SettingsCard>

          <SettingsCard icon={ShieldAlert} title="Security" className="mt-6">
            <SettingsRow
              icon={
                <KeyRound
                  className="text-main shrink-0"
                  size={32}
                  strokeWidth={1.5}
                />
              }
              title="Password"
              description="Ubah password akun Anda secara berkala untuk keamanan."
              actionLabel="Ubah Password"
              divider={false}
            />
          </SettingsCard>
        </div>
      </div>
    </>
  );
}

export default SettingsPage;
