export default function EmptyState({ title, message }) {
  return (
    <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-slate-400">{message}</p>
    </div>
  );
}