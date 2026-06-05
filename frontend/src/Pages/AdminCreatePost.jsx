import { useState } from 'react';
import http from '../api';
import { useNavigate } from 'react-router';
import AdminNav from '../Components/AdminNav';

const AdminCreatePost = () => {
  const [form, setForm] = useState({
    title: '',
    content: '',
    categories: '',
    tags: '',
    status: 'draft',
  });
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleFile = (e) => {
    setFile(e.target.files[0]);
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
      }

      const res = await http.post('/post/create', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (
        res.data &&
        (res.data.success === 'success' || res.data.success === true)
      ) {
        setMessage({ type: 'success', text: 'Post created successfully' });
        navigate('/admin/posts');
      } else {
        throw new Error(res.data.message || 'Failed to create post');
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Server error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <AdminNav />
      <main className="p-8 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Create Post (Admin)</h1>
        {message && (
          <div
            className={`p-3 mb-4 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
              maxLength={150}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded h-40"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Featured Image
            </label>
            <input type="file" accept="image/*" onChange={handleFile} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Categories (comma separated)
            </label>
            <input
              name="categories"
              value={form.categories}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Tags (comma separated)
            </label>
            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="border px-3 py-2 rounded"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            {isSubmitting ? 'Creating...' : 'Create Post'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default AdminCreatePost;
