const fs = require('fs');
const path = require('path');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const DATA_PATH = path.join(__dirname, '../public/data/local-info.json');
const POSTS_DIR = path.join(__dirname, '../src/content/posts');

/**
 * Gemini AI를 사용하여 블로그 포스트를 생성합니다.
 */
async function generatePost(item) {
  // 사용자가 지정한 엔드포인트 그대로 사용
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  const today = new Date().toISOString().split('T')[0];
  const prompt = `아래 공공서비스 정보를 바탕으로 블로그 글을 작성해줘.

정보: ${JSON.stringify(item)}

아래 형식으로 출력해줘. 반드시 이 형식만 출력하고 다른 텍스트는 없이:
---
title: (친근하고 흥미로운 제목)
date: ${today}
summary: (한 줄 요약)
category: 정보
tags: [태그1, 태그2, 태그3]
---

(본문: 800자 이상, 친근한 블로그 톤, 추천 이유 3가지 포함, 신청 방법 안내)

마지막 줄에 FILENAME: ${today}-keyword 형식으로 파일명도 출력해줘. 키워드는 영문으로.`;

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
    
    const fullText = result.candidates[0].content.parts[0].text;
    
    // FILENAME 추출
    const filenameMatch = fullText.match(/FILENAME:\s*([^\s\n]+)/);
    if (!filenameMatch) throw new Error("FILENAME 정보를 찾을 수 없습니다.");
    
    const fileName = filenameMatch[1].trim() + ".md";
    const content = fullText.replace(/FILENAME:.*$/, "").replace(/```markdown|```/g, "").trim();
    
    return { fileName, content };
  } catch (error) {
    console.error("Gemini 생성 오류:", error);
    return null;
  }
}

/**
 * 메인 실행 함수
 */
async function main() {
  if (!GEMINI_API_KEY) {
    console.error("환경변수 GEMINI_API_KEY가 설정되지 않았습니다.");
    return;
  }

  // 1. 최신 데이터 로드
  if (!fs.existsSync(DATA_PATH)) {
    console.error("데이터 파일이 없습니다.");
    return;
  }

  const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  if (!data || data.length === 0) {
    console.log("처리할 데이터가 없습니다.");
    return;
  }

  const latestItem = data[data.length - 1]; // 마지막 항목
  const targetName = latestItem.name;

  // 2. 중복 확인 (기존 포스트 제목 중 targetName 포함 여부)
  if (fs.existsSync(POSTS_DIR)) {
    const files = fs.readdirSync(POSTS_DIR);
    for (const file of files) {
      if (file.endsWith(".md")) {
        const content = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
        // frontmatter의 title 부분이나 본문 내 제목 확인
        if (content.includes(targetName)) {
          console.log("이미 작성된 글입니다");
          return;
        }
      }
    }
  } else {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
  }

  // 3. 블로그 글 생성
  console.log(`포스트 생성 중: ${targetName}`);
  const result = await generatePost(latestItem);
  
  if (!result) {
    console.error("블로그 글 생성 실패");
    return;
  }

  // 4. 파일 저장
  const filePath = path.join(POSTS_DIR, result.fileName);
  try {
    fs.writeFileSync(filePath, result.content, 'utf8');
    console.log(`생성 완료: ${result.fileName}`);
  } catch (error) {
    console.error("파일 저장 오류:", error);
  }
}

main();
