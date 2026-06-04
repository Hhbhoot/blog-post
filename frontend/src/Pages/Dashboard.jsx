import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import AdminNav from '../Components/AdminNav';
import http from '../api';

const Dashboard = () => {
  const [totalPosts, setTotalPosts] = useState(0);
  const [recentPosts, setRecentPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const [postsRes, usersRes] = await Promise.all([
          http.get('/post?page=1&limit=3'),
          http.get('/auth/get-users'),
        ]);

        const postsData = postsRes.data?.data || [];
        const postsCount =
          postsRes.data?.pagination?.totalPosts ?? postsData.length;
        const usersData = Array.isArray(usersRes.data?.data)
          ? usersRes.data.data
          : [];

        setTotalPosts(postsCount);
        setRecentPosts(postsData);
        setTotalUsers(usersData.length);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div>
      <AdminNav />
      <main className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Overview of users, posts, and recent activity for admin management.
          </p>
        </div>

        {loading ? (
          <div className="text-gray-600">Loading dashboard...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <section className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">Total users</p>
                <p className="mt-3 text-4xl font-semibold text-slate-900">
                  {totalUsers}
                </p>
                <Link
                  to="/admin/users"
                  className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:underline"
                >
                  Manage users
                </Link>
              </div>
              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">Total posts</p>
                <p className="mt-3 text-4xl font-semibold text-slate-900">
                  {totalPosts}
                </p>
                <Link
                  to="/admin/posts"
                  className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:underline"
                >
                  Manage posts
                </Link>
              </div>
              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">Quick action</p>
                <p className="mt-3 text-4xl font-semibold text-slate-900">
                  Create
                </p>
                <Link
                  to="/admin/posts/create"
                  className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:underline"
                >
                  New post
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Recent posts
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Latest published entries and drafts fetched from the blog.
                  </p>
                </div>
                <Link
                  to="/admin/posts"
                  className="text-sm font-medium text-indigo-600 hover:underline"
                >
                  View all posts
                </Link>
              </div>

              {recentPosts.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-600">
                  No recent posts available.
                </div>
              ) : (
                <div className="mt-6 grid gap-4">
                  {recentPosts.map((post) => (
                    <article
                      key={post._id}
                      className="rounded-2xl border border-slate-200 p-4 transition hover:border-indigo-300"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">
                            <Link
                              to={`/post/${post._id}`}
                              className="hover:text-indigo-600"
                            >
                              {post.title}
                            </Link>
                          </h3>
                          <p className="text-sm text-gray-500">
                            by {post.author?.name || 'Unknown'} •{' '}
                            {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
                          {post.status || 'draft'}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-700">
                        {(post.content || '').slice(0, 180)}
                        {post.content?.length > 180 ? '…' : ''}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
