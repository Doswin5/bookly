export default function LoadingState({ text = "Loading..." }) {
  return (
    <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
      {text}
    </div>
  );
}