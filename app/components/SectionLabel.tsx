export default function SectionLabel({ number, label }: { number: string; label: string }) {
  return (
    <div className="mb-10 flex items-baseline gap-3 text-xs uppercase tracking-[0.22em] text-muted">
      <span className="tabular font-mono text-accent">{number}</span>
      <span className="h-px flex-1 max-w-12 bg-ink/20" />
      <span>{label}</span>
    </div>
  );
}
