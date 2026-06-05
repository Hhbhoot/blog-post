import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import AdminNav from '../Components/AdminNav';
import { Trash } from 'lucide-react';
import http from '../api';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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
  }, []);

  const handleDeletePost = async (id) => {
    try {
      const res = await http.delete(`/post/${id}`);

      const ok =
        res?.data?.success === true ||
        res?.data?.status === 'success' ||
        res?.status === 200;

      if (ok) {
        setPosts((prev) => prev.filter((post) => post._id !== id));
        alert('Post deleted successfully');
      } else {
        console.warn('Delete returned unexpected response', res?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const publishedCount = posts.filter(
    (post) => post.status === 'published'
  ).length;
  const draftCount = posts.length - publishedCount;

  return (
    <div>
      <AdminNav />
      <main className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Posts (Admin)</h1>
          <p className="mt-2 text-sm text-gray-600">
            Review and manage blog posts from the admin panel.
          </p>
        </div>

        {loading ? (
          <div className="text-gray-600">Loading posts...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <section className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border bg-white p-4 shadow-sm">
                <p className="text-sm text-gray-500">Total posts</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  {posts.length}
                </p>
              </div>
              <div className="rounded-lg border bg-white p-4 shadow-sm">
                <p className="text-sm text-gray-500">Published</p>
                <p className="mt-2 text-3xl font-semibold text-emerald-700">
                  {publishedCount}
                </p>
              </div>
              <div className="rounded-lg border bg-white p-4 shadow-sm">
                <p className="text-sm text-gray-500">Drafts</p>
                <p className="mt-2 text-3xl font-semibold text-amber-700">
                  {draftCount}
                </p>
              </div>
            </div>

            {posts.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-600">
                No posts were found. Create a new post to get started.
              </div>
            ) : (
              <div className="grid gap-4">
                {posts.map((post) => {
                  const excerpt = post.content
                    ? post.content.length > 220
                      ? `${post.content.slice(0, 220)}…`
                      : post.content
                    : 'No description available.';
                  const statusClasses =
                    post.status === 'published'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-yellow-100 text-yellow-800';

                  return (
                    <article
                      key={post._id}
                      className="overflow-hidden rounded-2xl border bg-white p-6 shadow-sm"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <Link
                            to={`/post/${post._id}`}
                            className="text-xl font-semibold text-slate-900 hover:text-indigo-600"
                          >
                            {post.title}
                          </Link>
                          <p className="mt-2 text-sm text-gray-500">
                            by {post.author?.name || 'Unknown'} •{' '}
                            {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusClasses}`}
                        >
                          {post.status || 'draft'}
                        </span>
                      </div>

                      <p className="mt-4 text-sm leading-6 text-slate-700">
                        {excerpt}
                      </p>

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

                      <div className="mt-5 flex flex-wrap items-center gap-3">
                        <Link
                          to={`/post/${post._id}`}
                          className="text-sm font-medium text-indigo-600 hover:underline"
                        >
                          View post
                        </Link>
                      </div>
                      <span className="mt-4">
                        <Trash
                          className="mt-4 text-red-600 cursor-pointer"
                          onClick={() => handleDeletePost(post._id)}
                        />
                      </span>
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
