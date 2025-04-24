import { useState } from "react";

export default function TextbookForm({ initialData = null, onSubmit, onCancel }) {
  const [isbn, setIsbn] = useState(initialData?.isbn || "");
  const [title, setTitle] = useState(initialData?.title || "");
  const [edition, setEdition] = useState(initialData?.edition_no || "");
  const [price, setPrice] = useState(initialData?.price || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isbn || !title || !edition || !price) {
      alert("Please fill out all fields.");
      return;
    }

    const formData = {
      isbn,
      title,
      edition_no: edition,
      price: parseFloat(price),
    };

    onSubmit?.(formData);

    // Optional reset (if no editing)
    if (!initialData) {
      setIsbn("");
      setTitle("");
      setEdition("");
      setPrice("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <div>
        <label className="block text-black font-semibold">ISBN *</label>
        <input
          type="text"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
          className="w-full p-2 border rounded text-black"
          required
        />
      </div>

      <div>
        <label className="block text-black font-semibold">Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded text-black"
          required
        />
      </div>

      <div>
        <label className="block text-black font-semibold">Edition No. *</label>
        <input
          type="number"
          value={edition}
          onChange={(e) => setEdition(e.target.value)}
          className="w-full p-2 border rounded text-black"
          required
        />
      </div>

      <div>
        <label className="block text-black font-semibold">Price ($) *</label>
        <input
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-2 border rounded text-black"
          required
        />
      </div>

      <div className="flex space-x-2">
        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          {initialData ? "Update Textbook" : "Register Textbook"}
        </button>

        {initialData && (
          <button
            type="button"
            onClick={onCancel}
            className="border border-gray-500 px-4 py-2 rounded text-black"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
