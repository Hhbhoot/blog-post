import { Link, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import http from '../api';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await http.get(`/post/${id}`);
        if (res.data && res.data.data) setPost(res.data.data);
      } catch (err) {
        setError(err.message || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <div className="p-8">Loading post...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!post) return <div className="p-8">Post not found.</div>;

  return (
    <main className="p-8">
      <div className="mx-auto max-w-4xl rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-slate-200">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-semibold text-indigo-600 transition hover:text-indigo-800"
          >
            ← Back to home
          </Link>
          <span
            className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ${
              post.status === 'published'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {post.status || 'draft'}
          </span>
        </div>

        {post.featuredImage ? (
          <img
            src={`${import.meta.env.VITE_API_URL_IMAGE}/${post.featuredImage}`}
            alt={post.title}
            className="h-[28rem] w-full rounded-[1.5rem] object-cover shadow-inner"
          />
        ) : (
          <div className="flex h-[28rem] items-center justify-center rounded-[1.5rem] bg-gradient-to-r from-slate-100 via-white to-slate-100 text-slate-400 shadow-inner">
            No featured image available
          </div>
        )}

        <div className="mt-10 space-y-6">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              {post.title}
            </h1>
            <p className="mt-4 text-sm text-slate-500">
              by {post.author?.name || 'Unknown'} •{' '}
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {post.categories?.map((category) => (
              <span
                key={category}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600"
              >
                {category}
              </span>
            ))}
            {post.tags?.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700"
              >
                {tag}
              </span>
            ))}
          </div>

          <article className="space-y-6 text-slate-700">
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index} className="leading-8">
                {paragraph}
              </p>
            ))}
          </article>
        </div>
      </div>
    </main>
  );
};

export default PostDetail;
