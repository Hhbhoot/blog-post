import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import AdminNav from '../Components/AdminNav';
import {
  Trash2,
  Eye,
  Compass,
  Tag,
  PlusCircle,
  FileText,
  Edit,
} from 'lucide-react';
import http from '../api';
import LoadingSpinner from '../Components/LoadingSpinner';
import { useToast } from '../hooks/useToast';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await http.get('/post');
        if (res.data && res.data.data) {
          setPosts(res.data.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [refetchTrigger]);

  const handleDeletePost = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      const res = await http.delete(`/post/${id}`);
      if (res.data && res.data.status === 'success') {
        showToast(res.data.message || 'Post deleted successfully!', 'success');
        setRefetchTrigger((prev) => prev + 1);
      } else {
        showToast(res.data.message || 'Failed to delete post.', 'error');
      }
    } catch (err) {
      showToast(
        err.message || 'Server error occurred during deletion.',
        'error'
      );
    }
  };

  const publishedCount = posts.filter((p) => p.status === 'published').length;
  const draftCount = posts.filter((p) => p.status === 'draft').length;

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 pb-16">
      <AdminNav />
      <main className="max-w-7xl mx-auto px-6 mt-8">
        {/* Header Title Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-indigo-650 font-semibold text-sm mb-1.5 uppercase tracking-wider">
              <FileText className="w-4 h-4" />
              <span>Content Manager</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Blog Posts
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Review, edit, and manage all published entries and drafts.
            </p>
          </div>
          <Link
            to="/admin/posts/create"
            className="inline-flex items-center gap-2 self-start sm:self-center px-5 py-3 text-sm font-bold text-white bg-indigo-600 rounded-2xl hover:bg-indigo-700 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <PlusCircle className="w-4.5 h-4.5" />
            <span>Create New Post</span>
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Retrieving blog posts..." />
        ) : error ? (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl font-medium max-w-lg">
            ⚠️ {error}
          </div>
        ) : (
          <section className="space-y-8">
            {/* Detailed widgets */}
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-3xs">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Total Posts
                </p>
                <p className="mt-2 text-3xl font-extrabold text-slate-900">
                  {posts.length}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-3xs">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Published
                </p>
                <p className="mt-2 text-3xl font-extrabold text-emerald-600">
                  {publishedCount}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-3xs">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Drafts
                </p>
                <p className="mt-2 text-3xl font-extrabold text-amber-600">
                  {draftCount}
                </p>
              </div>
            </div>

            {posts.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-3xs">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium mb-4">
                  No posts found. Get started by creating your first post!
                </p>
                <Link
                  to="/admin/posts/create"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-indigo-650 bg-indigo-50 border border-indigo-100 rounded-xl hover:bg-indigo-100/60 transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create post</span>
                </Link>
              </div>
            ) : (
              <div className="grid gap-6">
                {posts.map((post) => {
                  const excerpt = post.content
                    ? post.content.length > 220
                      ? `${post.content.slice(0, 220)}…`
                      : post.content
                    : 'No description available.';

                  return (
                    <article
                      key={post._id}
                      className="overflow-hidden rounded-3xl border border-slate-200/60 bg-white p-6 shadow-xs group hover:border-slate-300 transition-all duration-200"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-1">
                          <Link
                            to={`/post/${post._id}`}
                            className="text-xl font-bold text-slate-900 hover:text-indigo-650 transition-colors"
                          >
                            {post.title}
                          </Link>
                          <p className="text-xs text-slate-400 font-semibold">
                            by {post.author?.name || 'Unknown'} •{' '}
                            {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        <span
                          className={`self-start inline-flex items-center rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider border ${
                            post.status === 'published'
                              ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                              : 'bg-amber-50 border-amber-100 text-amber-700'
                          }`}
                        >
                          {post.status || 'draft'}
                        </span>
                      </div>

                      <p className="mt-4 text-sm leading-relaxed text-slate-600">
                        {excerpt}
                      </p>

                      {/* Categorization display lists */}
                      {(post.categories?.length > 0 ||
                        post.tags?.length > 0) && (
                        <div className="mt-6 flex flex-wrap gap-4 border-t border-slate-100 pt-4">
                          {post.categories?.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5">
                              <Compass className="w-3.5 h-3.5 text-slate-400" />
                              {post.categories.map((category) => (
                                <span
                                  key={category}
                                  className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600"
                                >
                                  {category}
                                </span>
                              ))}
                            </div>
                          )}

                          {post.tags?.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5">
                              <Tag className="w-3.5 h-3.5 text-slate-400" />
                              {post.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full border border-indigo-50 bg-indigo-50/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-650"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                        <div className="flex items-center gap-4">
                          <Link
                            to={`/post/${post._id}`}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-850 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View</span>
                          </Link>

                          <Link
                            to={`/admin/posts/edit/${post._id}`}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-800 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                            <span>Edit</span>
                          </Link>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeletePost(post._id)}
                          className="inline-flex items-center justify-center p-2 text-rose-500 hover:bg-rose-50 rounded-2xl transition-all cursor-pointer"
                          title="Delete post"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default Posts;
