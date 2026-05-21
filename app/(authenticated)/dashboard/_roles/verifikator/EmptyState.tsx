export default function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex min-h-[220px] items-center justify-center rounded-[20px] border border-dashed border-[#D5D5D5] bg-white text-sm text-[#202224]/50">
      {label}
    </div>
  )
}
