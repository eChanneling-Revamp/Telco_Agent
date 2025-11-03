export default function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="mb-4">
      <label className="sr-only">Search appointments</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by patient or doctor"
        className="w-full rounded-lg px-4 py-2 border border-gray-200 text-gray-900 placeholder:text-gray-400"
      />
    </div>
  );
}
