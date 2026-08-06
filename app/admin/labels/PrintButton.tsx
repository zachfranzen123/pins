"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="rounded-full bg-[#1f2430] text-white text-sm px-4 py-2"
    >
      Print
    </button>
  );
}
