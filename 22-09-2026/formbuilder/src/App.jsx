import { useState } from "react";
import { useFormBuilderState } from "./hooks/useFormBuilderState";
import { FieldPalette } from "./sections/Fieldpalette ";
import { LiveFormPreview } from "./sections/Liveformpreview ";
import { FieldSettingsPanel } from "./sections/Fieldsettingspanel ";
import { SubmittedDataView } from "./sections/Submitteddataview ";

function App() {
  const {
    fields,
    selectedFieldId,
    selectedField,
    selectField,
    addAndSelectField,
    editField,
    removeField,
    copyField,
  } = useFormBuilderState();

  const [submittedData, setSubmittedData] = useState(null);

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-xl font-semibold text-gray-900">Dynamic form builder</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[200px_1fr_320px]">
        <FieldPalette onAddField={addAndSelectField} />

        <LiveFormPreview
          fields={fields}
          selectedFieldId={selectedFieldId}
          onSelectField={selectField}
          onSubmit={setSubmittedData}
        />

        <FieldSettingsPanel
          field={selectedField}
          onUpdateField={(changes) => editField(selectedFieldId, changes)}
          onDeleteField={() => removeField(selectedFieldId)}
          onDuplicateField={() => copyField(selectedFieldId)}
          onClose={() => selectField(null)}
        />
      </div>

      <div className="mt-6">
        <SubmittedDataView data={submittedData} />
      </div>
    </div>
  );
}

export default App;