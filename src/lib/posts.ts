import fs from "fs";
import path from "path";
import matter from "gray-matter";

// 블로그 글 하나의 타입 정의
export interface Post {
  slug: string; // 파일 이름 (URL에 사용)
  title: string;
  date: string; // YYYY-MM-DD 형식
  summary: string;
  category: string;
  tags: string[];
  content: string; // 마크다운 본문
}

// 블로그 글이 저장되는 폴더 경로
const postsDirectory = path.join(process.cwd(), "src/content/posts");

/**
 * 모든 블로그 글 목록을 가져옵니다 (날짜 내림차순 = 최신순)
 */
export function getAllPosts(): Post[] {
  // 폴더가 없으면 빈 배열 반환
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);

  const posts = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      const { data, content } = matter(fileContents);

      // date가 Date 객체인 경우 YYYY-MM-DD 문자열로 변환
      let dateStr: string;
      if (data.date instanceof Date) {
        const y = data.date.getFullYear();
        const m = String(data.date.getMonth() + 1).padStart(2, "0");
        const d = String(data.date.getDate()).padStart(2, "0");
        dateStr = `${y}-${m}-${d}`;
      } else {
        dateStr = String(data.date ?? "");
      }

      return {
        slug,
        title: data.title ?? "제목 없음",
        date: dateStr,
        summary: data.summary ?? "",
        category: data.category ?? "",
        tags: data.tags ?? [],
        content,
      };
    });

  // 날짜 내림차순 정렬 (최신 글이 위로)
  return posts.sort((a, b) => (a.date > b.date ? -1 : 1));
}

/**
 * slug(파일 이름)로 특정 블로그 글 하나를 가져옵니다
 */
export function getPostBySlug(slug: string): Post | null {
  const fullPath = path.join(postsDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  let dateStr: string;
  if (data.date instanceof Date) {
    const y = data.date.getFullYear();
    const m = String(data.date.getMonth() + 1).padStart(2, "0");
    const d = String(data.date.getDate()).padStart(2, "0");
    dateStr = `${y}-${m}-${d}`;
  } else {
    dateStr = String(data.date ?? "");
  }

  return {
    slug,
    title: data.title ?? "제목 없음",
    date: dateStr,
    summary: data.summary ?? "",
    category: data.category ?? "",
    tags: data.tags ?? [],
    content,
  };
}
