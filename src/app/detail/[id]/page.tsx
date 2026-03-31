import type { Metadata } from "next";
import Link from "next/link";
import localInfoData from "../../../../public/data/local-info.json";

export async function generateStaticParams() {
  return localInfoData.map((item: any) => ({
    id: item.id.toString(),
  }));
}

export const metadata: Metadata = {
  title: "상세 정보 | 우리 동네 소식통",
};

export default async function DetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = localInfoData.find((info: any) => info.id.toString() === id);

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
        <h1 className="text-2xl font-bold mb-4 italic text-gray-500">정보를 찾을 수 없습니다.</h1>
        <Link href="/" className="px-6 py-2 bg-sky-500 text-white rounded-lg font-bold">홈으로 돌아가기</Link>
      </div>
    );
  }

  const isBenefit = item.category === "지원금/혜택";
  const themeColor = isBenefit ? "text-emerald-600" : "text-sky-600";
  const bgColor = isBenefit ? "bg-emerald-50" : "bg-sky-50";
  const borderColor = isBenefit ? "border-emerald-200" : "border-sky-200";

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans pb-24">
      {/* 상세 페이지 헤더 (배너 느낌 유지) */}
      <header className={`w-full ${isBenefit ? 'bg-emerald-100 border-emerald-200' : 'bg-sky-100 border-sky-200'} py-12 px-4 text-center border-b`}>
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <Link href="/" className="mb-6 px-4 py-1.5 bg-white/70 hover:bg-white text-gray-600 text-sm font-bold rounded-full transition-colors flex items-center gap-2 border border-gray-100 shadow-sm">
            <span>← 목록으로 돌아가기</span>
          </Link>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${isBenefit ? 'bg-emerald-200 text-emerald-800' : 'bg-sky-200 text-sky-800'}`}>
            {item.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">
            {item.name}
          </h1>
        </div>
      </header>

      {/* 본문 영역 */}
      <main className="max-w-3xl mx-auto px-6 mt-12">
        {/* 핵심 정보 요약 박스 */}
        <div className={`p-6 rounded-2xl border-2 ${isBenefit ? 'border-[#03c75a] bg-[#f8fffb]' : 'border-sky-500 bg-sky-50'} mb-12 shadow-sm`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">📅 기간</span>
              <span className="text-lg font-bold text-gray-800">{item.startDate} ~ {item.endDate}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">📍 장소/방법</span>
              <span className="text-lg font-bold text-gray-800">{item.location}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">👥 대상</span>
              <span className="text-lg font-bold text-gray-800">{item.target}</span>
            </div>
          </div>
        </div>

        {/* 상세 설명 */}
        <section className="mb-16">
          <h2 className="text-xl font-bold mb-6 border-b-2 border-gray-900 pb-2 flex items-center gap-2">
            <span>📝</span> 상세 안내 및 설명
          </h2>
          <div className="text-lg text-gray-800 leading-relaxed space-y-4">
            <p>{item.summary}</p>
            <p className="text-gray-500 text-base">
              이 정보는 성남시 우리 동네 소식통에서 제공하는 공공데이터 요약본입니다. 
              더 자세한 내용이나 정확한 신청 안내는 아래 원본 사이트 링크를 통해 확인해 주시기 바랍니다.
            </p>
          </div>
        </section>

        {/* 하단 버튼 영역 */}
        <div className="flex flex-col gap-4">
          <Link 
            href={item.link} 
            target="_blank"
            className={`block text-center w-full ${isBenefit ? 'bg-[#03c75a] hover:bg-[#02a048]' : 'bg-sky-500 hover:bg-sky-600'} text-white font-black py-4 rounded-2xl text-xl shadow-lg transition-all active:scale-95`}
          >
            원본 사이트에서 자세히 보기 →
          </Link>
          <Link 
            href="/" 
            className="block text-center w-full py-4 text-gray-500 font-bold hover:bg-gray-50 rounded-2xl transition-colors"
          >
            내 목록으로 돌아가기
          </Link>
        </div>
      </main>

      <footer className="mt-24 pt-10 border-t border-gray-100 text-center text-sm text-gray-400 max-w-3xl mx-auto">
        <p>우리 동네 소식통 상세 정보</p>
        <p className="mt-1">데이터 출처: 공공데이터포털 (샘플 데이터)</p>
      </footer>
    </div>
  );
}
