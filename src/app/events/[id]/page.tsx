import Link from "next/link";
import data from "../../../../public/data/local-info.json";

export async function generateStaticParams() {
  return data.events.map((event) => ({
    id: event.id.toString(),
  }));
}

export default async function EventDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const event = data.events.find((e) => e.id.toString() === resolvedParams.id);

  if (!event) return <div>정보를 찾을 수 없습니다.</div>;

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-[#333] font-sans">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center">
          <Link href="/" className="font-black text-xl text-sky-600">
            🏘️ 성남시 생활 정보
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-16 shadow-sm space-y-12">
          {/* 헤더 */}
          <div className="space-y-6">
            <span className="px-4 py-1.5 bg-sky-50 text-sky-600 text-xs font-black uppercase rounded-full border border-sky-100">
              {event.category}
            </span>
            <h1 className="text-4xl sm:text-5xl font-black leading-tight text-slate-900">
              {event.name}
            </h1>
          </div>

          {/* 주요 정보 박스 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-y border-slate-100 py-10">
            <div className="space-y-2">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">일정</p>
              <p className="font-bold text-lg">{event.startDate} ~ {event.endDate}</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">장소</p>
              <p className="font-bold text-lg">{event.location}</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">대상</p>
              <p className="font-bold text-lg">{event.target}</p>
            </div>
          </div>

          {/* 상세 내용 */}
          <div className="space-y-6">
            <h2 className="text-xl font-black text-slate-900">상세 설명</h2>
            <p className="text-lg leading-relaxed text-slate-600 font-medium">
              {event.summary}
              <br /><br />
              본 행사는 성남시에서 주관하는 공식 행사로, 지역 주민들의 문화 생활 향유를 위해 마련되었습니다. 자세한 일정과 참여 방법은 공식 웹사이트를 통해 확인해 주시기 바랍니다.
            </p>
          </div>

          {/* 하단 버튼 */}
          <div className="pt-12 flex flex-col sm:flex-row gap-4">
            <a 
              href={event.link} 
              className="flex-1 flex items-center justify-center h-16 bg-sky-500 text-white text-lg font-black rounded-2xl hover:bg-sky-600 transition-all shadow-lg shadow-sky-100"
            >
              자세히 보기 →
            </a>
            <Link 
              href="/" 
              className="px-10 flex items-center justify-center h-16 bg-slate-100 text-slate-600 text-lg font-bold rounded-2xl hover:bg-slate-200 transition-all"
            >
              목록으로 돌아가기
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-20 text-center opacity-30 text-xs font-bold uppercase tracking-widest">
        © 2026 My Local Info
      </footer>
    </div>
  );
}
