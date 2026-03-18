import Link from "next/link";
import data from "../../public/data/local-info.json";

export default function Home() {
  const { events, subsidies } = data;
  const lastUpdated = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-[#333] font-sans selection:bg-sky-100">
      {/* 1. 상단 대형 배너 (하늘색) */}
      <div className="bg-sky-400 bg-gradient-to-r from-sky-400 to-sky-500 text-white py-20 px-6 text-center shadow-inner">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="text-sm font-bold bg-white/20 px-4 py-1 rounded-full backdrop-blur-sm">성남시 공식 소식통</span>
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight drop-shadow-sm">
            우리 동네 소식통
          </h1>
          <p className="text-lg sm:text-xl font-medium opacity-90">
            성남시의 알찬 행사와 혜택 정보를 한눈에 확인하세요!
          </p>
        </div>
      </div>

      {/* 헤더/네비게이션 (심플형) */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-black text-xl text-sky-600 flex items-center gap-2">
            <span className="text-2xl">🏘️</span> 성남시 생활 정보
          </Link>
          <div className="hidden sm:flex gap-8 text-sm font-bold text-slate-500">
            {["행사/축제", "지원금/혜택", "블로그"].map((item) => (
              <a key={item} href="#" className="hover:text-sky-500 transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-16 space-y-24">
        {/* 2. 이번 달 행사/축제 (블로그 스타일 리스트) */}
        <section>
          <div className="border-b-2 border-slate-900 pb-4 mb-10 flex justify-between items-end">
            <h2 className="text-2xl font-black flex items-center gap-2">
              <span className="w-2 h-6 bg-sky-500 rounded-sm" />
              지역 뉴스 & 축제
            </h2>
            <span className="text-xs font-bold text-slate-400 cursor-pointer hover:text-sky-500">More News +</span>
          </div>

          <div className="space-y-6">
            {events.map((event) => {
              // 날짜에서 월/일 추출 (샘플 데이터 형식: 2026-04-05)
              const [,, day] = event.startDate.split("-");
              const month = event.startDate.split("-")[1];
              
              return (
                <div key={event.id} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row gap-8 hover:shadow-lg transition-all group">
                  {/* 날짜 영역 (왼쪽) */}
                  <div className="flex flex-col items-center justify-center min-w-[100px] border-r border-slate-100 pr-8">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-tighter">{month}월</span>
                    <span className="text-5xl font-black text-sky-500 group-hover:scale-110 transition-transform">{day}</span>
                  </div>
                  
                  {/* 내용 영역 (오른쪽) */}
                  <div className="flex-1 space-y-3">
                    <span className="text-[10px] font-black text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md mb-2 inline-block border border-sky-100">
                      {event.category}
                    </span>
                    <h3 className="text-2xl font-bold group-hover:text-sky-600 transition-colors leading-tight">
                      {event.name}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                      {event.summary}
                    </p>
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-400 pt-2">
                      <span className="flex items-center gap-1.5">📍 {event.location}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-200" />
                      <span className="flex items-center gap-1.5">📅 {event.startDate} ~ {event.endDate}</span>
                    </div>
                  </div>
                  
                  {/* 상세보기 버튼 */}
                  <div className="flex sm:flex-col justify-center gap-2 border-t sm:border-t-0 sm:border-l border-slate-50 pt-6 sm:pt-0 sm:pl-8">
                    <Link href={`/events/${event.id}`} className="px-6 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-sky-500 transition-all shadow-md text-center">
                      내용 보기
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* 3. 지원금/혜택 (초록 테두리 스타일) */}
        <section>
          <div className="border-b-2 border-green-600 pb-4 mb-10">
            <h2 className="text-2xl font-black flex items-center gap-2">
              <span className="w-2 h-6 bg-green-500 rounded-sm" />
              정부 & 지자체 지원금
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subsidies.map((subsidy) => (
              <div key={subsidy.id} className="bg-white border-2 border-green-100 rounded-2xl p-8 hover:border-green-500 hover:shadow-xl transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full -z-10 group-hover:bg-green-100 transition-colors" />
                
                <h3 className="text-xl font-bold mb-4">{subsidy.name}</h3>
                <p className="text-sm text-slate-600 mb-8 leading-relaxed font-medium">
                  {subsidy.summary}
                </p>
                
                <div className="bg-green-50/50 rounded-xl p-4 border border-green-100 mb-8">
                   <div className="flex items-center gap-2 text-xs font-black text-green-700">
                      <span className="bg-green-200 px-2 py-0.5 rounded uppercase">Target</span>
                      <span className="text-sm">{subsidy.target}</span>
                   </div>
                </div>

                <Link href={`/subsidies/${subsidy.id}`} className="w-full flex items-center justify-center h-14 bg-green-600 text-white font-black rounded-xl hover:bg-green-700 transition-all shadow-md shadow-green-100 uppercase">
                  혜택 신청하기
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* 4. 하단 푸터 (깔끔형) */}
      <footer className="bg-white border-t border-slate-200 mt-32 py-20 text-center">
        <div className="max-w-5xl mx-auto px-6 space-y-6">
          <div className="text-slate-900 font-black text-xl opacity-20 filter grayscale">
            성남시 생활 정보
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <span>데이터 추출: 공공데이터포털</span>
            <span className="hidden md:inline w-1 h-1 rounded-full bg-slate-200" />
            <span>최종 업데이트: {lastUpdated}</span>
            <span className="hidden md:inline w-1 h-1 rounded-full bg-slate-200" />
            <span>© 2026 My Local Info</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
