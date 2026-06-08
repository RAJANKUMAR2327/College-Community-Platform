import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import Layout from '../components/Layout'
import toast from 'react-hot-toast'
import {
  Upload, Download, Heart, Bookmark,
  Search, Filter, FileText, X
} from 'lucide-react'

function UploadModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: '', subject: '', branch: '',
    year: '', semester: '', description: '', tags: '',
  })
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return toast.error('Please select a file')
    setLoading(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      fd.append('tags', JSON.stringify(form.tags.split(',').map(t => t.trim()).filter(Boolean)))
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
          <h2 className="text-lg font-semibold text-gray-900">Upload Note</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            placeholder="Title *" required
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="Subject *" required
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
            />
            <input
              placeholder="Branch *" required
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.branch} onChange={e => setForm(f => ({ ...f, branch: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select
              required
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))}
            >
              <option value="">Year *</option>
              {[1,2,3,4,5].map(y => <option key={y} value={y}>Year {y}</option>)}
            </select>
            <select
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.semester} onChange={e => setForm(f => ({ ...f, semester: e.target.value }))}
            >
              <option value="">Semester</option>
              {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Sem {s}</option>)}
            </select>
          </div>
          <textarea
            placeholder="Description"
            rows={2}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          />
          <input
            placeholder="Tags (comma separated: unit-4, deadlocks)"
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
          />
          <div
            className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-indigo-400 transition-colors"
            onClick={() => document.getElementById('note-file').click()}
          >
            {file ? (
              <p className="text-sm text-indigo-600 font-medium">{file.name}</p>
            ) : (
              <>
                <Upload size={20} className="mx-auto text-gray-400 mb-1" />
                <p className="text-sm text-gray-500">Click to upload PDF or image</p>
                <p className="text-xs text-gray-400">Max 20MB</p>
              </>
            )}
            <input
              id="note-file" type="file" className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={e => setFile(e.target.files[0])}
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50">
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
    <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start gap-3">
        <div className="bg-indigo-50 p-2.5 rounded-lg shrink-0">
          <FileText size={18} className="text-indigo-500" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-gray-900 truncate">{note.title}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{note.subject}</p>
        </div>
      </div>

      {note.description && (
        <p className="text-xs text-gray-500 mt-2 line-clamp-2">{note.description}</p>
      )}

      <div className="flex flex-wrap gap-1 mt-3">
        <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
          {note.branch}
        </span>
        <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
          Year {note.year}
        </span>
        {note.tags?.slice(0, 2).map(tag => (
          <span key={tag} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
        <div className="flex items-center gap-1">
          <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center text-[9px] font-bold text-indigo-600">
            {note.uploader?.name?.charAt(0)}
          </div>
          <span className="text-[11px] text-gray-500">{note.uploader?.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onLike(note._id)}
            className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-red-500 transition-colors">
            <Heart size={13} /> {note.likes?.length || 0}
          </button>
          <button onClick={() => onBookmark(note._id)}
            className="text-gray-400 hover:text-indigo-500 transition-colors">
            <Bookmark size={13} />
          </button>
          <button onClick={() => onDownload(note._id, note.fileUrl)}
            className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-green-500 transition-colors">
            <Download size={13} /> {note.downloadCount || 0}
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
  const [filters, setFilters] = useState({ branch: '', year: '', subject: '' })
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })

  const fetchNotes = async (page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit: 12 })
      if (search) params.append('search', search)
      if (filters.branch) params.append('branch', filters.branch)
      if (filters.year) params.append('year', filters.year)
      if (filters.subject) params.append('subject', filters.subject)
      const { data } = await api.get(`/notes?${params}`)
      setNotes(data.notes)
      setPagination(data.pagination)
    } catch {
      toast.error('Failed to load notes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchNotes() }, [search, filters])

  const handleLike = async (id) => {
    try {
      await api.patch(`/notes/${id}/like`)
      fetchNotes(pagination.page)
    } catch { toast.error('Failed to like') }
  }

  const handleBookmark = async (id) => {
    try {
      await api.patch(`/notes/${id}/bookmark`)
      toast.success('Bookmark updated!')
    } catch { toast.error('Failed to bookmark') }
  }

  const handleDownload = async (id, url) => {
    try {
      await api.patch(`/notes/${id}/download`)
      window.open(url, '_blank')
    } catch { toast.error('Failed to download') }
  }

  return (
    <Layout>
      {showModal && (
        <UploadModal onClose={() => setShowModal(false)} onSuccess={() => fetchNotes()} />
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notes</h1>
          <p className="text-sm text-gray-500 mt-0.5">{pagination.total} notes shared by students</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <Upload size={15} /> Upload Note
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-48">
          <Search size={15} className="text-gray-400" />
          <input
            placeholder="Search notes..."
            className="flex-1 text-sm outline-none"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={filters.branch}
          onChange={e => setFilters(f => ({ ...f, branch: e.target.value }))}
        >
          <option value="">All Branches</option>
          {['CSE','ECE','EEE','Mechanical','Chemical','Civil'].map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        <select
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={filters.year}
          onChange={e => setFilters(f => ({ ...f, year: e.target.value }))}
        >
          <option value="">All Years</option>
          {[1,2,3,4,5].map(y => <option key={y} value={y}>Year {y}</option>)}
        </select>
        {(search || filters.branch || filters.year) && (
          <button
            onClick={() => { setSearch(''); setFilters({ branch: '', year: '', subject: '' }) }}
            className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1"
          >
            <X size={14} /> Clear
          </button>
        )}
      </div>

      {/* Notes grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse h-40" />
          ))}
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-20">
          <FileText size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No notes found</p>
          <button onClick={() => setShowModal(true)}
            className="mt-3 text-sm text-indigo-600 hover:underline">
            Upload the first one
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map(note => (
              <NoteCard key={note._id} note={note}
                onLike={handleLike} onBookmark={handleBookmark} onDownload={handleDownload} />
            ))}
          </div>
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {[...Array(pagination.pages)].map((_, i) => (
                <button key={i}
                  onClick={() => fetchNotes(i + 1)}
                  className={`w-8 h-8 rounded-lg text-sm ${pagination.page === i + 1 ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
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