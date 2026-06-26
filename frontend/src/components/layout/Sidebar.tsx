import Link from "next/link";

type Log = {
  id: string;
  createdAt: string;
  title: string;
  tags?: string[] | null;
};

export function Sidebar({ logs }: { logs: Log[] }) {
  return (
    <aside className="w-full xl:w-[320px] shrink-0 space-y-8 sticky top-28">
      
      {/* Must Read Widget */}
      <div className="bg-white rounded-[1.5rem] border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-5">
          <h3 className="text-[17px] font-bold text-gray-900 tracking-tight">Must Read</h3>
          <a href="#" className="text-[11px] font-bold text-[#FF5722] hover:underline">See all ↗</a>
        </div>
        <div className="space-y-5">
          {logs.slice(0, 4).map((log) => (
            <Link key={`sidebar-${log.id}`} href={`/log/${log.id}`} className="group flex gap-4 items-start">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`https://picsum.photos/seed/${log.id}/200/150`} alt="" className="w-[84px] h-[68px] rounded-xl object-cover bg-gray-100 shrink-0 border border-gray-100" />
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-gray-200 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${log.id}`} alt="" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[9px] font-bold text-gray-600">Ye Aung</span>
                </div>
                <h4 className="font-bold text-[13px] text-gray-900 leading-[1.5] group-hover:text-[#FF5722] transition-colors py-0.5">
                  {log.title?.length > 40 ? log.title.substring(0, 40) + '...' : log.title}
                </h4>
                <div className="text-[9px] font-semibold text-gray-400 mt-1 uppercase tracking-wider">{log.tags?.[0] || 'Technologies'}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Subscribe Widget */}
      <div className="bg-[#1C1A27] rounded-[1.5rem] p-7 text-center text-white relative overflow-hidden shadow-lg">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl pointer-events-none"></div>
        <h3 className="text-xl font-bold mb-1 relative z-10">Subscribe to our</h3>
        <h3 className="text-xl font-bold mb-5 text-[#FF5722] relative z-10">newsletter</h3>
        <form className="flex flex-col gap-2.5 relative z-10">
          <input type="email" placeholder="Enter Your Email" className="w-full px-4 py-2.5 rounded-xl text-[13px] text-gray-900 bg-white/95 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF5722] shadow-inner" />
          <button type="button" className="w-full bg-[#FF5722] hover:bg-[#E64A19] text-white font-bold py-2.5 rounded-xl transition-all hover:-translate-y-0.5 shadow-md text-[13px]">
            Subscribe ↘
          </button>
        </form>
      </div>

    </aside>
  );
}
