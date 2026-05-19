export default function Badge({ children, type = "default" }) {
  const styles = {
    default: "bg-slate-100 text-slate-700",
    ALLOW: "bg-emerald-100 text-emerald-700",
    FLAG: "bg-orange-100 text-orange-700",
    REWRITE: "bg-purple-100 text-purple-700",
    BLOCK: "bg-red-100 text-red-700",
    ERROR: "bg-red-100 text-red-700",
    PROCESSING: "bg-blue-100 text-blue-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        styles[type] || styles.default
      }`}
    >
      {children}
    </span>
  );
}