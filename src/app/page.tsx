import type { Metadata } from "next";
import Link from "next/link";
import localInfoData from "../../public/data/local-info.json";

export const metadata: Metadata = {
  title: "우리 동네 소식통",
  description: "성남시 우리 동네 행사, 축제 및 유용한 혜택 정보",
};

function formatMonthDay(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}.${d.getDate()}`;
}

export default function Home() {
  const events = localInfoData.filter((i) => i.category === "행사/축제");
  const benefits = localInfoData.filter((i) => i.category === "지원금/혜택");

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans pb-20">
      
      {/* 상단 배너 */}
      <header className="w-full bg-sky-100 py-16 px-4 md:py-20 text-center border-b border-sky-200">
        <p className="text-sky-700 font-bold tracking-widest text-sm mb-2">성남시 생활 정보</p>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
          우리 동네 소식통 📢
        </h1>
      </header>

      <main className="max-w-4xl mx-auto px-5 mt-12 space-y-16">
        
        {/* 행사 · 축제 (리스트형) */}
        <section>
          <div className="flex items-center gap-2 mb-6 border-b-2 border-gray-900 pb-3">
            <span className="text-2xl">🎉</span>
            <h2 className="text-2xl font-bold text-gray-900">이번 달 행사 · 축제</h2>
          </div>
          
          <div className="flex flex-col gap-4">
            {events.map((item) => (
              <div key={item.id} className="group flex flex-col md:flex-row gap-6 p-5 border border-gray-200 rounded-xl hover:border-sky-300 hover:shadow-md transition-all bg-white">
                
                {/* 좌측 날짜 영역 */}
                <div className="md:w-32 shrink-0 flex flex-col items-center justify-center bg-gray-50 rounded-lg p-3 border border-gray-100 group-hover:bg-sky-50 transition-colors">
                  <span className="text-gray-500 text-sm font-semibold mb-1">시작일</span>
                  <span className="text-3xl font-black text-sky-600">{formatMonthDay(item.startDate)}</span>
                  {item.startDate !== item.endDate && (
                    <span className="text-xs text-gray-400 mt-1">~ {formatMonthDay(item.endDate)}</span>
                  )}
                </div>

                {/* 우측 정보 영역 */}
                <div className="flex-grow flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-sky-700 transition-colors">
                    {item.name}
                  </h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mb-3">
                    <p className="flex items-center gap-1">📍 <span>{item.location}</span></p>
                    <p className="flex items-center gap-1">👥 <span>{item.target}</span></p>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                {/* 버튼 영역 */}
                <div className="md:w-28 shrink-0 flex items-center justify-end md:justify-center mt-4 md:mt-0">
                  <Link 
                    href={`/detail/${item.id}`}
                    className="px-4 py-2 bg-gray-100 hover:bg-sky-500 hover:text-white text-gray-700 font-semibold rounded-lg text-sm transition-colors text-center w-full"
                  >
                    자세히 보기
                  </Link>
                </div>

              </div>
            ))}
          </div>
        </section>

        {/* 지원금 · 혜택 (초록 테두리 카드형) */}
        <section>
          <div className="flex items-center gap-2 mb-6 border-b-2 border-gray-900 pb-3">
            <span className="text-2xl">🎁</span>
            <h2 className="text-2xl font-bold text-gray-900">지원금 · 혜택 정보</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((item) => (
              <div key={item.id} className="relative bg-white rounded-2xl p-6 border-2 border-[#03c75a] shadow-[0_4px_12px_rgba(3,199,90,0.1)] hover:-translate-y-1 transition-transform flex flex-col h-full overflow-hidden">
                
                {/* 상단 장식 바 */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-[#03c75a]"></div>

                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight pt-2">
                    {item.name}
                  </h3>
                  {/* 대상자 눈에 띄게 강조 */}
                  <div className="inline-flex items-center gap-2 bg-[#eafbf0] text-[#03c75a] border border-[#b4eed1] px-3 py-2 rounded-lg text-sm font-bold w-full">
                    <span className="text-base shrink-0">🎯</span>
                    <span className="break-all">{item.target}</span>
                  </div>
                </div>

                <div className="text-sm text-gray-600 space-y-1.5 mb-5 pb-5 border-b border-gray-100">
                  <p><span className="font-semibold text-gray-500 mr-2 inline-block w-8">기간</span> {formatMonthDay(item.startDate)} - {formatMonthDay(item.endDate)}</p>
                  <p><span className="font-semibold text-gray-500 mr-2 inline-block w-8">신청</span> {item.location}</p>
                </div>

                <p className="text-sm text-gray-700 leading-relaxed mb-6 flex-grow">
                  {item.summary}
                </p>

                <div className="mt-auto">
                  <Link 
                    href={`/detail/${item.id}`}
                    className="block text-center w-full bg-[#03c75a] hover:bg-[#02a048] text-white font-bold py-3 rounded-xl shadow-md cursor-pointer transition-colors"
                  >
                    내게 맞는지 확인하기
                  </Link>
                </div>

              </div>
            ))}
          </div>
        </section>

      </main>

      <footer className="mt-20 pt-10 border-t border-gray-200 text-center text-sm text-gray-500">
        <p className="font-semibold text-gray-700 mb-2">우리 동네 소식통</p>
        <p>데이터 출처: 공공데이터포털 (샘플 데이터)</p>
        <p>마지막 업데이트: 2024년 4월</p>
      </footer>

    </div>
  );
}
