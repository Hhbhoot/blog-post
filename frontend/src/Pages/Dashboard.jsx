import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import AdminNav from '../Components/AdminNav';
import http from '../api';
import LoadingSpinner from '../Components/LoadingSpinner';
import {
  Users,
  FileText,
  PlusCircle,
  ArrowUpRight,
  BookOpen,
  Calendar,
  LayoutDashboard,
} from 'lucide-react';

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

        if (postsRes.data && postsRes.data.data) {
          setRecentPosts(postsRes.data.data);
          setTotalPosts(
            postsRes.data.pagination?.total || postsRes.data.data.length
          );
        }

        if (usersRes.data && usersRes.data.data) {
          setTotalUsers(usersRes.data.data.length);
        }
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 pb-16">
      <AdminNav />
      <main className="max-w-7xl mx-auto px-6 mt-8">
        {/* Title area */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm mb-1.5 uppercase tracking-wider">
            <LayoutDashboard className="w-4 h-4" />
            <span>Management Console</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Dashboard Overview
          </h1>
          <p className="mt-2 text-sm text-slate-500 max-w-xl">
            Overview of users, posts, and recent activity for admin management.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading dashboard metrics..." />
        ) : error ? (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl font-medium max-w-lg">
            ⚠️ {error}
          </div>
        ) : (
          <section className="space-y-8">
            {/* Stats grid */}
            <div className="grid gap-6 sm:grid-cols-3">
              {/* Users Stat */}
              <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-xs group transition-all duration-300 hover:shadow-md hover:border-slate-350">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-full pointer-events-none" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Total Users
                  </span>
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <p className="mt-4 text-4xl font-extrabold text-slate-900 tracking-tight">
                  {totalUsers}
                </p>
                <Link
                  to="/admin/users"
                  className="mt-6 inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  <span>Manage users</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Posts Stat */}
              <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-xs group transition-all duration-300 hover:shadow-md hover:border-slate-350">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-full pointer-events-none" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Total Posts
                  </span>
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-50 text-purple-600">
                    <FileText className="w-4 h-4" />
                  </div>
                </div>
                <p className="mt-4 text-4xl font-extrabold text-slate-900 tracking-tight">
                  {totalPosts}
                </p>
                <Link
                  to="/admin/posts"
                  className="mt-6 inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-800 transition-colors"
                >
                  <span>Manage posts</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Quick Actions Stat */}
              <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-xs group transition-all duration-300 hover:shadow-md hover:border-slate-350">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Quick Actions
                  </span>
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600">
                    <PlusCircle className="w-4 h-4" />
                  </div>
                </div>
                <p className="mt-4 text-xl font-extrabold text-slate-900 tracking-tight">
                  Publish Article
                </p>
                <Link
                  to="/admin/posts/create"
                  className="mt-8 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  <span>Create new post</span>
                  <PlusCircle className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Recent Posts log */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Recent Activity
                  </h2>
                  <p className="text-xs text-slate-400">
                    Latest published entries and drafts fetched from the
                    database.
                  </p>
                </div>
                <Link
                  to="/admin/posts"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-850 transition-colors inline-flex items-center gap-1"
                >
                  <span>View all posts</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {recentPosts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
                  <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-400 font-medium">
                    No recent activity available.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {recentPosts.map((post) => (
                    <article
                      key={post._id}
                      className="rounded-2xl border border-slate-100 hover:border-indigo-100 hover:bg-slate-50/20 p-5 transition-all duration-200 shadow-3xs"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-1">
                          <h3 className="text-base font-bold text-slate-950">
                            <Link
                              to={`/post/${post._id}`}
                              className="hover:text-indigo-600 transition-colors"
                            >
                              {post.title}
                            </Link>
                          </h3>
                          <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-slate-400" />
                              by {post.author?.name || 'Unknown'}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`self-start inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                            post.status === 'published'
                              ? 'bg-emerald-50 border border-emerald-100 text-emerald-700'
                              : 'bg-amber-50 border border-amber-100 text-amber-700'
                          }`}
                        >
                          {post.status || 'draft'}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-slate-500">
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
