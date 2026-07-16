function SettingsCard({ icon: Icon, title, children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl border border-stroke shadow-sm p-6 sm:p-8 ${className}`}>
      {(Icon || title) && (
        <div className="flex items-center gap-2 pb-4 border-b border-stroke">
          {Icon && <Icon className="text-main" size={22} />}
          {title && <h2 className="text-xl font-bold text-text2">{title}</h2>}
        </div>
      )}
      {children}
    </div>
  );
}

export default SettingsCard;
