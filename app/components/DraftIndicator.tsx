import { draftMode } from "next/headers";

export default async function DraftIndicator() {
  const { isEnabled } = await draftMode();

  if (!isEnabled) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black text-white px-4 py-3 rounded-full shadow-xl flex items-center gap-4 border border-gray-700">
      <span className="font-bold text-sm tracking-wide">🔵 DRAFT MODE ON</span>
      <a
        href="/api/disable-draft"
        className="bg-white text-black text-xs font-bold px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors"
      >
        Exit
      </a>
    </div>
  );
}
