"use client";
import { useState } from "react";
import Head from "next/head";

export default function CategoryComponent() {
  const [categories, setCategories] = useState([
    { id: 1, name: "Electronics" },
    { id: 2, name: "Clothing" },
    { id: 3, name: "Books" },
  ]);

  return (
    <>
      <Head>
        <title>Categories</title>
        <link rel="icon" href="/assets/images/favicon.png" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />

        {/* External CSS files */}
        <link rel="stylesheet" href="/assets/css/remixicon.css" />
        <link rel="stylesheet" href="/assets/css/lib/apexcharts.css" />
        <link rel="stylesheet" href="/assets/css/lib/dataTables.min.css" />
        <link rel="stylesheet" href="/assets/css/lib/editor-katex.min.css" />
        <link rel="stylesheet" href="/assets/css/lib/editor.atom-one-dark.min.css" />
        <link rel="stylesheet" href="/assets/css/lib/editor.quill.snow.css" />
        <link rel="stylesheet" href="/assets/css/lib/flatpickr.min.css" />
        <link rel="stylesheet" href="/assets/css/lib/full-calendar.css" />
        <link rel="stylesheet" href="/assets/css/lib/jquery-jvectormap-2.0.5.css" />
        <link rel="stylesheet" href="/assets/css/lib/magnific-popup.css" />
        <link rel="stylesheet" href="/assets/css/lib/slick.css" />
        <link rel="stylesheet" href="/assets/css/lib/prism.css" />
        <link rel="stylesheet" href="/assets/css/lib/file-upload.css" />
        <link rel="stylesheet" href="/assets/css/lib/audioplayer.css" />
        <link rel="stylesheet" href="/assets/css/style.css" />
      </Head>

      <div className="container mx-auto mt-10 p-5 dark:bg-neutral-800 bg-neutral-100 dark:text-white">
        <h1 className="text-2xl font-semibold mb-4">Categories</h1>
        <ul>
          {categories.map((cat) => (
            <li key={cat.id} className="mb-2">
              {cat.name}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
