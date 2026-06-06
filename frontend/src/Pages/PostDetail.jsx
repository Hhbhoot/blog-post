import { Link, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import http from '../api';
import LoadingSpinner from '../Components/LoadingSpinner';
import { ArrowLeft, User, Calendar, Tag, FolderOpen } from 'lucide-react';

const getImageUrl = (img) => {
  if (!img) return '';
  return img.startsWith('http://') || img.startsWith('https://')
    ? img
    : `${import.meta.env.VITE_API_URL_IMAGE}/${img}`;
};

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

  if (loading) return <LoadingSpinner message="Loading article content..." />;
  if (error)
    return (
      <div className="p-8 text-rose-600 max-w-lg mx-auto text-center font-medium border border-rose-100 bg-rose-50/50 rounded-2xl mt-12">
        {error}
      </div>
    );
  if (!post)
    return (
      <div className="p-8 text-slate-500 max-w-lg mx-auto text-center font-medium mt-12">
        Post not found.
      </div>
    );

  return (
    <main className="min-h-screen bg-slate-50/50 text-slate-900 pb-20">
      {/* Top Header/Action Bar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-4 shadow-sm select-none">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to home</span>
          </Link>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
              post.status === 'published'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                : 'bg-amber-50 border border-amber-200 text-amber-700'
            }`}
          >
            {post.status || 'draft'}
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-6 mt-8">
        <article className="overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-sm">
          {/* Featured Image */}
          {post.featuredImage ? (
            <div className="relative h-[22rem] md:h-[30rem] w-full overflow-hidden">
              <img
                src={getImageUrl(post.featuredImage)}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          ) : (
            <div className="flex h-56 items-center justify-center bg-gradient-to-tr from-indigo-50 to-purple-50 text-indigo-400/80 font-medium">
              BlogSpace • Reader View
            </div>
          )}

          <div className="p-8 md:p-12 space-y-8">
            {/* Meta Details */}
            <div className="space-y-4">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 border-b border-slate-100 pb-6">
                <span className="inline-flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-400" />
                  by {post.author?.name || 'Unknown'}
                </span>
                <span className="text-slate-200 hidden sm:inline">|</span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="prose prose-slate max-w-none">
              {post.content.split('\n').map((paragraph, index) => (
                <p
                  key={index}
                  className="text-base md:text-lg text-slate-700 leading-relaxed md:leading-loose mb-6"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Categorization & Tags Section */}
            {(post.categories?.length > 0 || post.tags?.length > 0) && (
              <div className="border-t border-slate-100 pt-8 space-y-4">
                {post.categories?.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider inline-flex items-center gap-1 mr-2">
                      <FolderOpen className="w-3.5 h-3.5" /> Categories:
                    </span>
                    {post.categories.map((category) => (
                      <span
                        key={category}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-slate-600"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                )}

                {post.tags?.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider inline-flex items-center gap-1 mr-2">
                      <Tag className="w-3.5 h-3.5" /> Tags:
                    </span>
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-indigo-100 bg-indigo-50/50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </article>
      </div>
    </main>
  );
};

export default PostDetail;
