import Link from "next/link";
import { getPostBySlug, getAllPosts } from "@/lib/posts";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";

// 빌드 시 미리 생성할 경로 리스트 정의 (정적 HTML 추출용)
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

interface BlogPostProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPostPage({ params }: BlogPostProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 상단 네비게이션 */}
      <nav className="max-w-4xl mx-auto px-5 py-8">
        <Link 
          href="/blog" 
          className="text-sky-600 hover:text-sky-700 font-bold text-sm tracking-tight inline-flex items-center gap-1 group transition-colors"
        >
          <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span>
          전체 목록으로 목록으로 돌아가기
        </Link>
      </nav>

      {/* 포스트 영역 */}
      <article className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 mx-5 sm:mx-auto">
        <header className="p-8 md:p-12 bg-white border-b border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-sky-100 text-sky-700 text-xs font-bold rounded-full uppercase tracking-wider">
              {post.category}
            </span>
            <time className="text-gray-400 text-sm font-medium">{post.date}</time>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-8">
            {post.title}
          </h1>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-50">
              {post.tags.map((tag) => (
                <span key={tag} className="text-sm font-semibold text-gray-400">#{tag}</span>
              ))}
            </div>
          )}
        </header>

        <div className="p-8 md:p-16 prose prose-lg prose-sky max-w-none prose-headings:font-black prose-headings:tracking-tight prose-p:leading-relaxed prose-img:rounded-3xl prose-img:shadow-2xl">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>
      </article>

      {/* 하단 푸터 */}
      <footer className="max-w-4xl mx-auto mt-16 text-center text-gray-400 text-sm font-medium">
        <p>© 2026 우리 동네 소식통. All rights reserved.</p>
      </footer>
    </div>
  );
}
