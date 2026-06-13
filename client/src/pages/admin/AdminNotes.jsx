import { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import { Trash2, Download, ExternalLink } from 'lucide-react'

export default function AdminNotes() {
  const [notes, setNotes] = useState([])
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 })
  const [loading, setLoading] = useState(true)

  const fetchNotes = async (page = 1) => {
    setLoading(true)
    try {
      const { data } = await api.get(`/admin/notes?page=${page}&limit=15`)
      setNotes(data.notes)
      setPagination(data.pagination)
    } catch {
      toast.error('Failed to load notes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchNotes() }, [])

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete note "${title}"?`)) return
    try {
      await api.delete(`/admin/notes/${id}`)
      toast.success('Note deleted.')
      fetchNotes(pagination.page)
    } catch { toast.error('Failed') }
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Notes Moderation</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{pagination.total} total notes</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                {['Title', 'Subject', 'Branch/Year', 'Uploader', 'Downloads', 'Uploaded', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-gray-50 dark:border-gray-800">
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : notes.map(note => (
                <tr key={note._id}
                  className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 max-w-[180px] truncate">
                      {note.title}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">{note.subject}</td>
                  <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">
                    {note.branch} · Y{note.year}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">
                    {note.uploader?.name || '—'}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">
                    {note.downloadCount || 0}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 dark:text-gray-500">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <a href={note.fileUrl} target="_blank" rel="noreferrer"
                        className="text-gray-400 hover:text-indigo-500 transition-colors">
                        <ExternalLink size={14} />
                      </a>
                      <button onClick={() => handleDelete(note._id, note.title)}
                        className="text-gray-300 dark:text-gray-700 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-gray-100 dark:border-gray-800">
            {[...Array(pagination.pages)].map((_, i) => (
              <button key={i} onClick={() => fetchNotes(i + 1)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors
                  ${pagination.page === i + 1
                    ? 'bg-red-500 text-white'
                    : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}