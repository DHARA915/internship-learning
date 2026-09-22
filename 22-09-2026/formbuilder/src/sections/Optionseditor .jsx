// props:
//   options       — array of option strings
//   onChange(newOptions) — called with the full updated array on any change
export function OptionsEditor({ options, onChange }) {
  function updateOption(index, text) {
    const next = [...options];
    next[index] = text;
    onChange(next);
  }

  function removeOption(index) {
    onChange(options.filter((_, i) => i !== index));
  }

  function addOption() {
    onChange([...options, `Option ${options.length + 1}`]);
  }

  return (
    <div>
      <p className="mb-1.5 text-xs font-medium text-gray-500">Options</p>
      <div className="flex flex-col gap-1.5">
        {options.map((option, index) => (
          <div key={index} className="flex items-center gap-1.5">
            <input
              type="text"
              value={option}
              onChange={(e) => updateOption(index, e.target.value)}
              className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={() => removeOption(index)}
              disabled={options.length <= 1}
              aria-label={`Remove option ${index + 1}`}
              className="rounded-md px-2 py-1 text-sm text-gray-400 hover:bg-red-50 hover:text-red-600
                         disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addOption}
        className="mt-2 rounded-md border border-dashed border-gray-300 px-2.5 py-1 text-xs font-medium
                   text-gray-500 hover:border-gray-400 hover:text-gray-700"
      >
        + Add option
      </button>
    </div>
  );
}