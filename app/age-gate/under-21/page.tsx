export const metadata = {
  title: 'Come back when you are 21',
  robots: { index: false, follow: false },
};

export default function Under21Page() {
  return (
    <main
      id="main"
      className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 px-6 py-12"
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 sm:mb-4">
          Come back when you are 21
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mb-2">
          The ECS specialization is restricted to adults 21 and older.
        </p>
        <p className="text-slate-500 text-xs sm:text-sm">
          You can close this tab.
        </p>
      </div>
    </main>
  );
}
