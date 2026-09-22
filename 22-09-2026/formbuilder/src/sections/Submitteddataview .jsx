    // props:
//   data — the submitted formValues object, or null if nothing submitted yet / after reset
export function SubmittedDataView({ data }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
        Submitted data
      </p>
      {data ? (
        <pre className="overflow-x-auto text-xs text-gray-700">
          {JSON.stringify(data, null, 2)}
        </pre>
      ) : (
        <p className="text-sm text-gray-400">Nothing submitted yet.</p>
      )}
    </div>
  );
}