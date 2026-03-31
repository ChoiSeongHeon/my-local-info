import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default function BlogListPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans pb-20">
      {/* 상단 배너 */}
      <header className="w-full bg-sky-100 py-16 px-4 md:py-20 text-center border-b border-sky-200">
        <p className="text-sky-700 font-bold tracking-widest text-sm mb-2">동네 소식 블로그</p>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
          최신 소식 & 유용한 정보 ✍️
        </h1>
      </header>

      <main className="max-w-4xl mx-auto px-5 mt-12">
        <div className="flex items-center gap-2 mb-8 border-b-2 border-gray-900 pb-3">
          <span className="text-2xl">📝</span>
          <h2 className="text-2xl font-bold text-gray-900">전체 글 목록</h2>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500 font-medium">아직 등록된 게시글이 없습니다. 📭</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group p-6 border border-gray-200 rounded-2xl hover:border-sky-300 hover:shadow-lg transition-all bg-white"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="inline-block px-2 py-1 bg-sky-50 text-sky-600 text-xs font-bold rounded-md border border-sky-100">
                      {post.category}
                    </span>
                    <span className="text-sm text-gray-400 font-medium">{post.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-sky-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                    {post.summary}
                  </p>
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {post.tags.map((tag) => (
                        <span key={tag} className="text-xs text-gray-400 border border-gray-100 px-2 py-0.5 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-sky-600 font-medium text-sm border-b border-transparent hover:border-sky-600 transition-all"
          >
            ← 메인 화면으로 돌아가기
          </Link>
        </div>
      </main>
    </div>
  );
}
