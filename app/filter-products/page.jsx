'use client';
import { useState } from 'react';

export default function FilterProducts() {
  const [file, setFile] = useState(null);
  const [codes, setCodes] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('file', file);
    form.append('codes', codes);

    const res = await fetch('/api/filter-products', {
      method: 'POST',
      body: form,
    });

    const json = await res.json();
    if (json.success) {
      setDownloadUrl(json.downloadUrl);
    } else {
      alert('Error: ' + json.error);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📁 Filter Products by ItemCode</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="file" accept=".xlsx" onChange={e => setFile(e.target.files[0])} required />
        <textarea
          className="border w-full p-2"
          rows="5"
          placeholder="Enter itemcodes (comma separated)"
          value={codes}
          onChange={e => setCodes(e.target.value)}
          required
        ></textarea>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          type="submit"
        >
          Filter & Download
        </button>
      </form>

      {downloadUrl && (
        <div className="mt-6">
          <a
            href={downloadUrl}
            download
            className="text-green-600 underline text-lg"
          >
            📥 Download Filtered Excel
          </a>
        </div>
      )}
    </div>
  );
}
