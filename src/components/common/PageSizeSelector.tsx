interface PageSizeSelectorProps {
  value: number;
  onChange: (size: number) => void;
  options?: number[];
}

export const PageSizeSelector = ({
  value,
  onChange,
  options = [5, 10, 20, 50],
}: PageSizeSelectorProps) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">Mostrar:</span>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="border rounded px-2 py-1 text-sm"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <span className="text-sm text-gray-600">por página</span>
    </div>
  );
};
