import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import AdBanner from '../Components/ads/AdBanner';
import AdSidebar from '../Components/ads/AdSidebar';
import AdInContent from '../Components/ads/AdInContent';
import AdStickyFooter from '../Components/ads/AdStickyFooter';
import { useAuth } from '../hooks/useAuth';
import http from '../api';
import LoadingSpinner from '../Components/LoadingSpinner';
import {
  BookOpen,
  User,
  Calendar,
  Tag,
  ChevronRight,
  LogOut,
  Compass,
  Sparkles,
  LayoutDashboard,
} from 'lucide-react';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const { user, setUser } = useAuth();
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

  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin');
    }
  }, [user, navigate]);

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

  if (loading) return <LoadingSpinner message="Fetching latest stories..." />;
  if (error)
    return (
      <div className="p-8 text-rose-600 max-w-lg mx-auto text-center font-medium border border-rose-100 bg-rose-50/50 rounded-2xl mt-12">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 pb-16">
      {/* Public Header Navigation */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-4 shadow-sm select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-[0_4px_10px_rgba(99,102,241,0.2)] text-white font-bold text-sm">
              B
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
              BlogSpace
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {user && (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-600 rounded-full border border-slate-200/60">
                <User className="w-3.5 h-3.5 text-slate-500" />
                {user.name}
              </span>
            )}
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100 hover:bg-indigo-100/60 transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Admin Panel
              </Link>
            )}
            <button
              type="button"
              disabled={logoutLoading}
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer disabled:opacity-50"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{logoutLoading ? 'Logging out...' : 'Logout'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-8">
        {/* Hero Banner Section */}
        <section className="relative overflow-hidden rounded-3xl border border-indigo-950/20 bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-950 p-8 md:p-12 shadow-xl text-white">
          <div className="absolute top-[-20%] right-[-20%] w-[50%] h-[100%] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Discover Insights</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
              Discover the latest from our blog.
            </h1>
            <p className="mt-4 text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Browse stories, ideas, and insights from our authors. Find
              trending topics, featured posts, and fresh updates to keep you
              informed.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {featuredPost && (
                <Link
                  to={`/post/${featuredPost._id}`}
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-indigo-950 shadow-md hover:bg-slate-50 transition-all duration-200 active:scale-95"
                >
                  Read Featured Article
                </Link>
              )}
              <span className="text-sm text-slate-400 font-medium bg-white/5 border border-white/10 px-4 py-3 rounded-2xl">
                {posts.length} stories published
              </span>
            </div>
          </div>
        </section>

        {/* Ad Space */}
        <div className="mt-8">
          <AdBanner />
        </div>

        {/* Feed Grid */}
        <section className="mt-10 grid gap-8 lg:grid-cols-3">
          {/* Main Feed Column (Featured / Recent Posts) */}
          <div className="lg:col-span-2 space-y-8">
            {featuredPost ? (
              <article className="overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-xs transition-all duration-300 hover:shadow-md group">
                {/* Optional Featured Image */}
                {featuredPost.featuredImage ? (
                  <div className="relative h-72 md:h-96 w-full overflow-hidden">
                    <img
                      src={`${import.meta.env.VITE_API_URL_IMAGE}/${featuredPost.featuredImage}`}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span className="absolute top-4 right-4 rounded-full bg-white/95 backdrop-blur-xs border border-indigo-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 shadow-sm">
                      Featured
                    </span>
                  </div>
                ) : (
                  <div className="h-4 bg-gradient-to-r from-indigo-500 to-purple-600" />
                )}

                <div className="p-8">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-semibold mb-4">
                    <span className="inline-flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      {featuredPost.author?.name || 'Unknown'}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(featuredPost.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight leading-snug">
                    <Link
                      to={`/post/${featuredPost._id}`}
                      className="hover:text-indigo-600 transition-colors"
                    >
                      {featuredPost.title}
                    </Link>
                  </h2>

                  <p className="mt-4 text-base text-slate-600 leading-relaxed">
                    {(featuredPost.content || '').slice(0, 260)}
                    {featuredPost.content?.length > 260 ? '…' : ''}
                  </p>

                  <div className="mt-6">
                    <AdInContent />
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {featuredPost.categories?.map((category) => (
                      <span
                        key={category}
                        className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-slate-600"
                      >
                        <Compass className="w-3 h-3 text-slate-400" />
                        {category}
                      </span>
                    ))}
                  </div>

                  <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
                    <Link
                      to={`/post/${featuredPost._id}`}
                      className="inline-flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors group/link"
                    >
                      <span>Read full story</span>
                      <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </article>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-xs">
                <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">
                  No stories available yet. Check back soon!
                </p>
              </div>
            )}

            <div className="mt-6">
              <AdInContent />
            </div>
          </div>

          {/* Sidebar Widgets Column */}
          <aside className="space-y-8">
            <AdSidebar />

            {/* Quick Reads Widget */}
            <div className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-indigo-500" />
                <h3 className="text-lg font-bold text-slate-900">
                  Quick Reads
                </h3>
              </div>
              <div className="space-y-4">
                {recentPosts.length === 0 ? (
                  <p className="text-sm text-slate-400 font-medium">
                    No additional posts found.
                  </p>
                ) : (
                  recentPosts.map((post) => (
                    <Link
                      key={post._id}
                      to={`/post/${post._id}`}
                      className="block rounded-2xl border border-slate-100 p-4 transition-all duration-200 hover:border-indigo-200 hover:bg-slate-50/50 hover:shadow-xs group"
                    >
                      <div className="flex items-center justify-between gap-2 text-xs text-slate-400 font-medium">
                        <span className="inline-flex items-center gap-1 font-bold text-slate-500 group-hover:text-indigo-600 transition-colors">
                          {post.author?.name || 'Author'}
                        </span>
                        <span>
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="mt-2 text-sm font-bold text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors">
                        {post.title}
                      </h4>
                      <p className="mt-2 text-xs text-slate-500 leading-relaxed line-clamp-2">
                        {(post.content || '').slice(0, 90)}
                      </p>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* Explore Categories Widget */}
            <div className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <Compass className="w-5 h-5 text-purple-500" />
                <h3 className="text-lg font-bold text-slate-900">
                  Explore Categories
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {Array.from(
                  new Set(posts.flatMap((post) => post.categories || []))
                )
                  .slice(0, 8)
                  .map((category) => (
                    <span
                      key={category}
                      className="inline-flex items-center gap-1 rounded-full bg-slate-100 hover:bg-indigo-50 border border-slate-200/40 hover:border-indigo-100 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-indigo-600 transition-all cursor-pointer"
                    >
                      <Tag className="w-3 h-3 text-slate-400" />
                      {category}
                    </span>
                  ))}
                {posts.flatMap((post) => post.categories || []).length ===
                  0 && (
                  <span className="text-sm text-slate-400 font-medium">
                    No categories found.
                  </span>
                )}
              </div>
            </div>
          </aside>
        </section>

        {/* Bottom Ad Space */}
        <div className="mt-10">
          <AdBanner />
        </div>
      </main>

      {/* Sticky footer ad */}
      <AdStickyFooter />
    </div>
  );
};

export default Home;
