import { useParams } from 'react-router';
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
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">{post.title}</h1>
      <p className="text-gray-600">{post.content}</p>
      {post.featuredImage && (
        <img
          src={import.meta.env.VITE_API_URL_IMAGE + '/' + post.featuredImage}
          alt="img"
          className="w-full h-40"
        />
      )}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {post.categories?.length > 0 && (
          <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Categories:
          </span>
        )}
        {post.categories?.map((category) => (
          <span
            key={category}
            className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700"
          >
            {category}
          </span>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {post.tags?.length > 0 && (
          <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Tags:
          </span>
        )}
        {post.tags?.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700"
          >
            {tag}
          </span>
        ))}
      </div>
      <p className="text-sm text-gray-500">
        by {post.author?.name || 'Unknown'} •{' '}
        {new Date(post.createdAt).toLocaleDateString()}
      </p>
    </main>
  );
};

export default PostDetail;
