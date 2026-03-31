const fs = require('fs');
const path = require('path');

// 환경변수 확인 (process.env에서 가져옴)
const PUBLIC_DATA_API_KEY = process.env.PUBLIC_DATA_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const JSON_PATH = path.join(__dirname, '../public/data/local-info.json');

/**
 * [1단계] 공공데이터포털 API에서 데이터를 가져오고 필터링합니다.
 */
async function fetchPublicData() {
  // 사용자가 지정한 엔드포인트 및 파라미터 그대로 사용
  const url = `https://api.odcloud.kr/api/gov24/v3/serviceList?page=1&perPage=20&serviceKey=${PUBLIC_DATA_API_KEY}&returnType=JSON`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.data || !Array.isArray(data.data)) {
      return [];
    }
    
    const items = data.data;

    // 필터링 우선순위 1: "성남"
    let filtered = items.filter(item => 
      (item.서비스명 && item.서비스명.includes("성남")) ||
      (item.서비스목적요약 && item.서비스목적요약.includes("성남")) ||
      (item.지원대상 && item.지원대상.includes("성남")) ||
      (item.소관기관명 && item.소관기관명.includes("성남"))
    );
    
    // 필터링 우선순위 2: "경기" (성남이 없는 경우)
    if (filtered.length === 0) {
      filtered = items.filter(item => 
        (item.서비스명 && item.서비스명.includes("경기")) ||
        (item.서비스목적요약 && item.서비스목적요약.includes("경기")) ||
        (item.지원대상 && item.지원대상.includes("경기")) ||
        (item.소관기관명 && item.소관기관명.includes("경기"))
      );
    }
    
    // 필터링 우선순위 3: 전체 데이터 (경기까지 없는 경우)
    if (filtered.length === 0) {
      filtered = items;
    }
    
    return filtered;
  } catch (error) {
    console.error("공공데이터 API 호출 오류:", error);
    return [];
  }
}

/**
 * [3단계] Gemini AI를 사용하여 데이터를 가공합니다.
 */
async function processWithGemini(item) {
  // 사용자가 지정한 엔드포인트 그대로 사용
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  const prompt = `아래 공공데이터 1건을 분석해서 JSON 객체로 변환해줘. 형식:
{id: 숫자, name: 서비스명, category: '행사' 또는 '혜택', startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD', location: 장소 또는 기관명, target: 지원대상, summary: 한줄요약, link: 상세URL}
category는 내용을 보고 행사/축제면 '행사', 지원금/서비스면 '혜택'으로 판단해.
startDate가 없으면 오늘 날짜, endDate가 없으면 '상시'로 넣어.
반드시 JSON 객체만 출력해. 다른 텍스트 없이.

데이터: ${JSON.stringify(item)}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    
    const result = await response.json();
    if (!result.candidates || !result.candidates[0]) throw new Error("Gemini 응답 없음");
    
    let text = result.candidates[0].content.parts[0].text;
    
    // 마크다운 코드 블록(```json ... ```) 제거
    text = text.replace(/```json|```/g, "").trim();
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini 가공 오류:", error);
    return null;
  }
}

/**
 * 메인 실행 함수
 */
async function main() {
  if (!PUBLIC_DATA_API_KEY || !GEMINI_API_KEY) {
    console.error("환경변수 PUBLIC_DATA_API_KEY 또는 GEMINI_API_KEY가 설정되지 않았습니다.");
    return;
  }

  // 1. 공공데이터 가져오기
  const rawData = await fetchPublicData();
  if (rawData.length === 0) {
    console.log("새로운 데이터가 없습니다");
    return;
  }

  // 2. 기존 데이터 로드 (src/content/posts 폴더의 파일 정보가 아닌 public/data/local-info.json 기준)
  let existingData = [];
  try {
    if (fs.existsSync(JSON_PATH)) {
      const rawExisting = fs.readFileSync(JSON_PATH, 'utf8');
      existingData = JSON.parse(rawExisting);
    }
  } catch (e) {
    console.error("기존 데이터 읽기 실패:", e);
    // 에러 발생 시 기존 데이터가 있다면 유지해야 하므로 중단하는 것이 안전
    return;
  }

  const existingNames = new Set(existingData.map(d => d.name));
  
  // 3. 기존에 없는 새로운 항목만 필터링
  const newDataList = rawData.filter(item => !existingNames.has(item.서비스명));
  
  if (newDataList.length === 0) {
    console.log("새로운 데이터가 없습니다");
    return;
  }

  // 최상단 1건만 선정
  const targetItem = newDataList[0];

  // 4. Gemini로 데이터 가공
  const processedItem = await processWithGemini(targetItem);
  
  if (!processedItem) {
    console.error("데이터 가공 중 문제가 발생했습니다.");
    return;
  }

  // ID 중복 방지를 위해 새로운 ID 부여 (기존 최대 ID + 1)
  const nextId = existingData.length > 0 ? Math.max(...existingData.map(d => d.id || 0)) + 1 : 1;
  processedItem.id = nextId;

  // 5. 기존 데이터에 추가 및 저장
  existingData.push(processedItem);
  try {
    fs.writeFileSync(JSON_PATH, JSON.stringify(existingData, null, 2), 'utf8');
    console.log(`생성 완료: ${processedItem.name}`);
  } catch (error) {
    console.error("파일 저장 오류:", error);
  }
}

main();
