import { useState, useEffect } from 'react'
import api from '../api/axios'
import Layout from '../components/Layout'
import toast from 'react-hot-toast'
import { Plus, Calendar, MapPin, Users, X } from 'lucide-react'

const categories = ['academic', 'cultural', 'sports', 'technical', 'placement', 'other']

function CreateEventModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: '', description: '', category: 'other',
    date: '', endDate: '', venue: '', organizer: '',
    registrationLink: '', maxParticipants: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/events', form)
      toast.success('Event created!')
      onSuccess()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">Create Event</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input placeholder="Event Title *" required
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          <textarea placeholder="Description" rows={2}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <select className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              {categories.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
            </select>
            <input placeholder="Organizer"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.organizer} onChange={e => setForm(f => ({ ...f, organizer: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Start Date *</label>
              <input type="datetime-local" required
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">End Date</label>
              <input type="datetime-local"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
            </div>
          </div>
          <input placeholder="Venue"
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={form.venue} onChange={e => setForm(f => ({ ...f, venue: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Registration Link"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.registrationLink} onChange={e => setForm(f => ({ ...f, registrationLink: e.target.value }))} />
            <input type="number" placeholder="Max Participants"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.maxParticipants} onChange={e => setForm(f => ({ ...f, maxParticipants: e.target.value }))} />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
              {loading ? 'Creating...' : 'Create Event'}
            </button>
          </div>
          {/* Events grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
        </form>
      </div>
    </div>
  )
}

export default function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState({ category: '', upcoming: 'true' })

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filter.category) params.append('category', filter.category)
      if (filter.upcoming) params.append('upcoming', filter.upcoming)
      const { data } = await api.get(`/events?${params}`)
      setEvents(data.events)
    } catch {
      toast.error('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchEvents() }, [filter])

  const handleAttend = async (id) => {
    try {
      const { data } = await api.patch(`/events/${id}/attend`)
      toast.success(data.attending ? 'You\'re attending!' : 'Removed from attendees')
      fetchEvents()
    } catch { toast.error('Failed') }
  }

  const categoryColor = {
    academic: 'bg-blue-50 text-blue-600',
    cultural: 'bg-pink-50 text-pink-600',
    sports: 'bg-green-50 text-green-600',
    technical: 'bg-indigo-50 text-indigo-600',
    placement: 'bg-amber-50 text-amber-600',
    other: 'bg-gray-100 text-gray-600',
  }

  return (
    <Layout>
      {showModal && <CreateEventModal onClose={() => setShowModal(false)} onSuccess={fetchEvents} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="text-sm text-gray-500 mt-0.5">Campus events & activities</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
          <Plus size={15} /> Create Event
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 flex flex-wrap gap-3">
        <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none"
          value={filter.category} onChange={e => setFilter(f => ({ ...f, category: e.target.value }))}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
        </select>
        <div className="flex gap-2">
          {[['true', 'Upcoming'], ['', 'All Events']].map(([val, label]) => (
            <button key={val}
              onClick={() => setFilter(f => ({ ...f, upcoming: val }))}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                ${filter.upcoming === val ? 'bg-indigo-600 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Events */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse h-40" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20">
          <Calendar size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No events found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map(event => (
            <div key={event._id}
              className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${categoryColor[event.category]}`}>
                    {event.category}
                  </span>
                  <h3 className="text-sm font-semibold text-gray-900 mt-1.5">{event.title}</h3>
                  {event.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{event.description}</p>
                  )}
                </div>
                <div className="bg-indigo-50 rounded-lg p-2 text-center shrink-0 min-w-[48px]">
                  <p className="text-lg font-bold text-indigo-600 leading-none">
                    {new Date(event.date).getDate()}
                  </p>
                  <p className="text-[9px] text-indigo-400 uppercase">
                    {new Date(event.date).toLocaleString('default', { month: 'short' })}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 text-xs text-gray-400 mb-4">
                {event.venue && (
                  <span className="flex items-center gap-1"><MapPin size={11} /> {event.venue}</span>
                )}
                {event.organizer && <span>by {event.organizer}</span>}
                <span className="flex items-center gap-1">
                  <Users size={11} /> {event.attendees?.length || 0}
                  {event.maxParticipants ? ` / ${event.maxParticipants}` : ''} attending
                </span>
              </div>

              <div className="flex gap-2">
                <button onClick={() => handleAttend(event._id)}
                  className="flex-1 py-2 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  Attend
                </button>
                {event.registrationLink && (
                  <a href={event.registrationLink} target="_blank" rel="noreferrer"
                    className="flex-1 py-2 text-xs font-medium border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-center">
                    Register
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}