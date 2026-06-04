import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import http from '../api';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

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

  const featuredPost = posts[0];
  const recentPosts = posts.slice(1);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await http.get('/auth/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('authToken');
      setUser(null);
      setLogoutLoading(false);
      navigate('/login');
    }
  };

  if (loading) return <div className="p-8">Loading posts...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <main className="p-8">
      <section className="rounded-3xl border border-slate-200 bg-linear-to-br from-slate-50 via-white to-slate-100 p-8 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-4xl">
            <p className="text-sm uppercase tracking-[0.25em] text-indigo-600">
              Welcome back
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Discover the latest from our blog.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Browse stories, ideas, and insights from our authors. Find
              trending topics, featured posts, and fresh updates to keep you
              informed.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  to={featuredPost ? `/post/${featuredPost._id}` : '#'}
                  className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                >
                  Read featured article
                </Link>
                <span className="text-sm text-slate-500">
                  {posts.length} posts available
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                disabled={logoutLoading}
                className="inline-flex items-center justify-center rounded-full bg-red-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600 disabled:opacity-50"
              >
                {logoutLoading ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        {featuredPost ? (
          <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                  Featured
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-slate-900">
                  <Link
                    to={`/post/${featuredPost._id}`}
                    className="hover:text-indigo-600"
                  >
                    {featuredPost.title}
                  </Link>
                </h2>
              </div>
              <span className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700">
                {featuredPost.status || 'Draft'}
              </span>
            </div>

            <p className="mt-5 text-sm text-slate-500">
              by {featuredPost.author?.name || 'Unknown'} •{' '}
              {new Date(featuredPost.createdAt).toLocaleDateString()}
            </p>
            <p className="mt-6 text-base leading-7 text-slate-700">
              {(featuredPost.content || '').slice(0, 260)}
              {featuredPost.content?.length > 260 ? '…' : ''}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {featuredPost.categories?.map((category) => (
                <span
                  key={category}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase text-slate-600"
                >
                  {category}
                </span>
              ))}
            </div>
            <div className="mt-8 flex items-center gap-4">
              <Link
                to={`/post/${featuredPost._id}`}
                className="text-sm font-semibold text-indigo-600 hover:underline"
              >
                Read full story
              </Link>
            </div>
          </article>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm text-slate-500">
              No featured post available yet.
            </p>
          </div>
        )}

        <aside className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Quick reads
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Recent articles you may enjoy.
            </p>
            <div className="mt-5 space-y-4">
              {recentPosts.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No additional posts found.
                </p>
              ) : (
                recentPosts.map((post) => (
                  <Link
                    key={post._id}
                    to={`/post/${post._id}`}
                    className="block rounded-2xl border border-slate-200 p-4 text-sm transition hover:border-indigo-300 hover:bg-slate-50"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-slate-900">
                        {post.title}
                      </span>
                      <span className="text-xs text-slate-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-2 text-slate-600">
                      {(post.content || '').slice(0, 90)}
                      {post.content?.length > 90 ? '…' : ''}
                    </p>
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Explore categories
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Browse by topic and interest.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {Array.from(
                new Set(posts.flatMap((post) => post.categories || [])),
              )
                .slice(0, 8)
                .map((category) => (
                  <span
                    key={category}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                  >
                    {category}
                  </span>
                ))}
              {posts.flatMap((post) => post.categories || []).length === 0 && (
                <span className="text-sm text-slate-500">
                  No categories yet.
                </span>
              )}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
};

export default Home;
