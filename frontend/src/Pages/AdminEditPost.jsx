import { useState, useEffect } from 'react';
import http from '../api';
import { useNavigate, useParams, Link } from 'react-router';
import AdminNav from '../Components/AdminNav';
import { useToast } from '../hooks/useToast';
import LoadingSpinner from '../Components/LoadingSpinner';
import {
  UploadCloud,
  Tag,
  FolderOpen,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

const AdminEditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    title: '',
    content: '',
    categories: '',
    tags: '',
    status: 'draft',
  });
  const [file, setFile] = useState(null);
  const [existingImage, setExistingImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const res = await http.get(`/post/${id}`);
        if (res.data && res.data.data) {
          const post = res.data.data;
          setForm({
            title: post.title || '',
            content: post.content || '',
            categories: post.categories ? post.categories.join(', ') : '',
            tags: post.tags ? post.tags.join(', ') : '',
            status: post.status || 'draft',
          });
          setExistingImage(post.featuredImage || '');
        }
      } catch (err) {
        showToast(err.message || 'Failed to load post data.', 'error');
        navigate('/admin/posts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate, showToast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleFile = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('content', form.content);
      fd.append('status', form.status);
      if (file) fd.append('featuredImage', file);

      if (form.categories) {
        fd.append(
          'categories',
          JSON.stringify(
            form.categories
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
          )
        );
      } else {
        fd.append('categories', JSON.stringify([]));
      }

      if (form.tags) {
        fd.append(
          'tags',
          JSON.stringify(
            form.tags
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
          )
        );
      } else {
        fd.append('tags', JSON.stringify([]));
      }

      const res = await http.patch(`/post/${id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (
        res.data &&
        (res.data.status === 'success' ||
          res.data.success === 'success' ||
          res.data.success === true)
      ) {
        showToast('Post updated successfully!', 'success');
        setMessage({ type: 'success', text: 'Post updated successfully!' });
        setTimeout(() => {
          navigate('/admin/posts');
        }, 1200);
      } else {
        throw new Error(res.data.message || 'Failed to update post');
      }
    } catch (err) {
      showToast(err.message || 'Error updating post.', 'error');
      setMessage({
        type: 'error',
        text: err.message || 'Server error occurred',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <LoadingSpinner message="Retrieving post details..." />;

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 pb-20">
      <AdminNav />
      <main className="max-w-3xl mx-auto px-6 mt-8">
        {/* Title/Actions Section */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Edit Article
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Modify the article contents, tags, and status.
            </p>
          </div>
          <Link
            to="/admin/posts"
            className="text-xs font-bold text-slate-500 hover:text-slate-700 bg-white border border-slate-200/80 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
        </div>

        {/* Message Banner */}
        {message && (
          <div
            className={`flex items-center gap-3 p-4 mb-6 text-sm font-medium border rounded-2xl transition-all ${
              message.type === 'success'
                ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                : 'bg-rose-50 border-rose-100 text-rose-700'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Editor Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white border border-slate-200 p-8 rounded-3xl shadow-3xs"
        >
          {/* Post Title */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Post Title
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. 10 Tips for Advanced Coding..."
              className="w-full border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-800 placeholder-slate-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-sm font-medium"
              required
              maxLength={150}
            />
          </div>

          {/* Post Content */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Post Content
            </label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Write your article body content here..."
              className="w-full border border-slate-200 rounded-2xl px-4 py-4 text-slate-800 placeholder-slate-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-sm h-60 leading-relaxed font-medium"
              required
            />
          </div>

          {/* Featured Image Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Featured Image
            </label>

            {/* Show Current Image if present */}
            {existingImage && !file && (
              <div className="mb-2">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">
                  Current Image:
                </p>
                <div className="relative w-40 h-24 rounded-lg overflow-hidden border border-slate-200">
                  <img
                    src={`${import.meta.env.VITE_API_URL_IMAGE}/${existingImage}`}
                    alt="Current Featured Cover"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            <div className="relative border-2 border-dashed border-slate-200 hover:border-indigo-400/80 rounded-2xl p-6 text-center transition-colors cursor-pointer group">
              <input
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                {file ? (
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-700">
                      Selected file:
                    </p>
                    <p className="text-xs text-indigo-650 font-semibold">
                      {file.name}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-bold text-slate-600">
                      Click to upload new image
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Leave blank to keep existing image
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Categorization Inputs Grid */}
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Categories */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 inline-flex items-center gap-1">
                <FolderOpen className="w-3.5 h-3.5 text-slate-400" />
                <span>Categories</span>
              </label>
              <input
                type="text"
                name="categories"
                value={form.categories}
                onChange={handleChange}
                placeholder="tech, lifestyle, tutorial"
                className="w-full border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-800 placeholder-slate-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-sm font-medium"
              />
              <span className="text-[10px] text-slate-400">
                Separate values with commas
              </span>
            </div>

            {/* Tags */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 inline-flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                <span>Tags</span>
              </label>
              <input
                type="text"
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="react, coding, beginners"
                className="w-full border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-800 placeholder-slate-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-sm font-medium"
              />
              <span className="text-[10px] text-slate-400">
                Separate values with commas
              </span>
            </div>
          </div>

          {/* Status Selection */}
          <div className="flex flex-col gap-2 max-w-xs">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Publish Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-800 outline-none bg-white transition-all duration-200 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-sm font-semibold cursor-pointer"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          {/* Submit Action */}
          <div className="border-t border-slate-100 pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center px-6 py-3.5 text-sm font-bold text-white bg-indigo-650 rounded-2xl hover:bg-indigo-750 active:scale-95 transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AdminEditPost;
