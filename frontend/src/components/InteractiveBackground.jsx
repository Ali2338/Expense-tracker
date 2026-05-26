import React from 'react';

function InteractiveBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-linear-to-tr from-blue-400/20 to-indigo-400/5 dark:from-blue-600/15 dark:to-transparent blur-3xl animate-blob"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full bg-linear-to-br from-emerald-400/15 to-teal-400/5 dark:from-emerald-600/10 dark:to-transparent blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute top-[30%] left-[25%] w-[450px] h-[450px] rounded-full bg-linear-to-br from-purple-400/10 to-pink-400/5 dark:from-purple-600/5 dark:to-transparent blur-3xl animate-blob animation-delay-4000"></div>

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a06_1px,transparent_1px),linear-gradient(to_bottom,#0f172a06_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
    </div>
  );
}

export default InteractiveBackground;