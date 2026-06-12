import EmptyState from '../components/EmptyState'
import { useState, useEffect } from 'react'
import api from '../api/axios'
import Layout from '../components/Layout'
import toast from 'react-hot-toast'
import { CardSkeleton } from '../components/Skeleton'
import {
  Upload,
  Download,
  Heart,
  Bookmark,
  Search,
  FileText,
  X,
} from 'lucide-react'

function UploadModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: '',
    subject: '',
    branch: '',
    year: '',
    semester: '',
    description: '',
    tags: '',
  })

  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!file) {
      toast.error('Please select a file')
      return
    }

    setLoading(true)

    try {
      const fd = new FormData()

      Object.entries(form).forEach(([key, value]) => {
        fd.append(key, value)
      })

      fd.append(
        'tags',
        JSON.stringify(
          form.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        )
      )

      fd.append('file', file)

      await api.post('/notes', fd)

      toast.success('Note uploaded!')
      onSuccess()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">Upload Note</h2>

          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            required
            placeholder="Title *"
            className="w-full border rounded-lg px-3 py-2"
            value={form.title}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                title: e.target.value,
              }))
            }
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              required
              placeholder="Subject *"
              className="w-full border rounded-lg px-3 py-2"
              value={form.subject}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  subject: e.target.value,
                }))
              }
            />

            <input
              required
              placeholder="Branch *"
              className="w-full border rounded-lg px-3 py-2"
              value={form.branch}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  branch: e.target.value,
                }))
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <select
              required
              className="border rounded-lg px-3 py-2"
              value={form.year}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  year: e.target.value,
                }))
              }
            >
              <option value="">Year *</option>
              {[1, 2, 3, 4, 5].map((y) => (
                <option key={y} value={y}>
                  Year {y}
                </option>
              ))}
            </select>

            <select
              className="border rounded-lg px-3 py-2"
              value={form.semester}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  semester: e.target.value,
                }))
              }
            >
              <option value="">Semester</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>
                  Sem {s}
                </option>
              ))}
            </select>
          </div>

          <textarea
            rows={3}
            placeholder="Description"
            className="w-full border rounded-lg px-3 py-2"
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />

          <input
            placeholder="Tags (comma separated)"
            className="w-full border rounded-lg px-3 py-2"
            value={form.tags}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                tags: e.target.value,
              }))
            }
          />

          <input
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border rounded-lg py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white rounded-lg py-2"
            >
              {loading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function NoteCard({ note, onLike, onBookmark, onDownload }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-start gap-3">
        <div className="bg-indigo-50 p-2 rounded-lg">
          <FileText size={18} className="text-indigo-500" />
        </div>

        <div className="flex-1">
          <h3 className="font-semibold">{note.title}</h3>
          <p className="text-sm text-gray-500">{note.subject}</p>
        </div>
      </div>

      {note.description && (
        <p className="text-sm text-gray-500 mt-2">
          {note.description}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mt-3">
        <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full">
          {note.branch}
        </span>

        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
          Year {note.year}
        </span>
      </div>

      <div className="flex justify-between items-center mt-4 border-t pt-3">
        <span className="text-xs text-gray-500">
          {note.uploader?.name}
        </span>

        <div className="flex gap-3">
          <button onClick={() => onLike(note._id)}>
            <Heart size={16} />
          </button>

          <button onClick={() => onBookmark(note._id)}>
            <Bookmark size={16} />
          </button>

          <button
            onClick={() =>
              onDownload(note._id, note.fileUrl)
            }
          >
            <Download size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Notes() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  const [search, setSearch] = useState('')

  const [filters, setFilters] = useState({
    branch: '',
    year: '',
    subject: '',
  })

  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  })

  const fetchNotes = async (page = 1) => {
    try {
      setLoading(true)

      const params = new URLSearchParams({
        page,
        limit: 12,
      })

      if (search) params.append('search', search)
      if (filters.branch) params.append('branch', filters.branch)
      if (filters.year) params.append('year', filters.year)
      if (filters.subject) params.append('subject', filters.subject)

      const { data } = await api.get(`/notes?${params}`)

      setNotes(data.notes || [])
      setPagination(data.pagination || {})
    } catch (error) {
      toast.error('Failed to load notes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [search, filters])

  const handleLike = async (id) => {
    try {
      await api.patch(`/notes/${id}/like`)
      fetchNotes(pagination.page)
    } catch {
      toast.error('Failed to like')
    }
  }

  const handleBookmark = async (id) => {
    try {
      await api.patch(`/notes/${id}/bookmark`)
      toast.success('Bookmark updated')
    } catch {
      toast.error('Failed to bookmark')
    }
  }

  const handleDownload = async (id, url) => {
    try {
      await api.patch(`/notes/${id}/download`)
      window.open(url, '_blank')
    } catch {
      toast.error('Download failed')
    }
  }

  return (
    <Layout>
      {showModal && (
        <UploadModal
          onClose={() => setShowModal(false)}
          onSuccess={() => fetchNotes()}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Notes</h1>

          <p className="text-gray-500 text-sm">
            {pagination.total || 0} notes shared
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Upload size={16} />
          Upload Note
        </button>
      </div>

      <div className="bg-white rounded-xl border p-4 mb-6 flex gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-52">
          <Search size={16} />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes..."
            className="flex-1 outline-none"
          />
        </div>

        <select
          value={filters.branch}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              branch: e.target.value,
            }))
          }
          className="border rounded-lg px-3 py-2"
        >
          <option value="">All Branches</option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
          <option value="EEE">EEE</option>
          <option value="Mechanical">Mechanical</option>
          <option value="Civil">Civil</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onLike={handleLike}
                onBookmark={handleBookmark}
                onDownload={handleDownload}
              />
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {[...Array(pagination.pages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => fetchNotes(i + 1)}
                  className={`w-8 h-8 rounded ${
                    pagination.page === i + 1
                      ? 'bg-indigo-600 text-white'
                      : 'border'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </Layout>
  )
}