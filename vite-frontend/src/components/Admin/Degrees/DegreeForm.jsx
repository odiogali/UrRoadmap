import { useState } from "react";

export default function DegreeForm({ initialData = null, onSubmit, onCancel }) {
  const [prog_name, setProgName] = useState(initialData?.prog_name || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prog_name.trim()) {
      alert("Please enter a program name.");
      return;
    }

    onSubmit?.({ prog_name });

    if (!initialData) setProgName("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <div>
        <label className="block font-semibold text-black">
          Program Name <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          value={prog_name}
          onChange={(e) => setProgName(e.target.value)}
          className="w-full p-2 border rounded text-black"
          required
        />
      </div>

      <div className="flex space-x-2">
        <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded">
          {initialData ? "Update Degree" : "Register Degree"}
        </button>
        {initialData && (
          <button type="button" onClick={onCancel} className="border border-gray-500 px-4 py-2 rounded text-black">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
