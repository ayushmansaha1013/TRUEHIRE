export default function SectionTitle({ eyebrow, title, text }) {
  return (
    <div className="mb-8 max-w-2xl">
      <div className="eyebrow mb-3">{eyebrow}</div>
      <h2 className="text-3xl font-black tracking-tight sm:text-4xl">{title}</h2>
      {text && <p className="mt-3 leading-7 text-slate-400">{text}</p>}
    </div>
  );
}