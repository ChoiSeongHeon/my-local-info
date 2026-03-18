import Link from "next/link";
import data from "../../../../public/data/local-info.json";

export async function generateStaticParams() {
  return data.subsidies.map((subsidy) => ({
    id: subsidy.id.toString(),
  }));
}

export default async function SubsidyDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const subsidy = data.subsidies.find((s) => s.id.toString() === resolvedParams.id);

  if (!subsidy) return <div>정보를 찾을 수 없습니다.</div>;

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-[#333] font-sans">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center">
          <Link href="/" className="font-black text-xl text-green-600">
            🏘️ 성남시 생활 정보
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white border-2 border-green-100 rounded-3xl p-8 sm:p-16 shadow-sm space-y-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-green-50 rounded-bl-full -z-10" />

          {/* 헤더 */}
          <div className="space-y-6">
            <span className="px-4 py-1.5 bg-green-50 text-green-600 text-xs font-black uppercase rounded-full border border-green-100">
              {subsidy.category}
            </span>
            <h1 className="text-4xl sm:text-5xl font-black leading-tight text-slate-900">
              {subsidy.name}
            </h1>
          </div>

          {/* 주요 정보 박스 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-y border-slate-100 py-10">
            <div className="space-y-2">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">지원 대상</p>
              <p className="font-bold text-lg text-green-700">{subsidy.target}</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">신청 장소</p>
              <p className="font-bold text-lg">{subsidy.location}</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">일정</p>
              <p className="font-bold text-lg">{subsidy.startDate} ~ {subsidy.endDate}</p>
            </div>
          </div>

          {/* 상세 내용 */}
          <div className="space-y-6">
            <h2 className="text-xl font-black text-slate-900">지원 안내</h2>
            <p className="text-lg leading-relaxed text-slate-600 font-medium">
              {subsidy.summary}
              <br /><br />
              본 지원 사업은 성남시 시민들의 안정적인 생활을 돕기 위해 시행됩니다. 자격 요건을 꼼꼼히 확인하신 후 기한 내에 신청해 주시기 바랍니다. 구비 서류 및 세부 절차는 공식 안내 페이지를 참조하십시오.
            </p>
          </div>

          {/* 하단 버튼 */}
          <div className="pt-12 flex flex-col sm:flex-row gap-4">
            <a 
              href={subsidy.link} 
              className="flex-1 flex items-center justify-center h-16 bg-green-600 text-white text-lg font-black rounded-2xl hover:bg-green-700 transition-all shadow-lg shadow-green-100"
            >
              지금 신청하기 →
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
