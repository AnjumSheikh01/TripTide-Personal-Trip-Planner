import { useEffect, useMemo, useState } from 'react';
import {
  Anchor, ArrowDownRight, ArrowUpRight, CalendarDays, Check, ChevronDown,
  ChevronLeft, ChevronRight, CircleHelp, Compass, Download, Ellipsis, MapPin,
  Menu, Plus, Search, SlidersHorizontal, Sparkles, Trash2, Wallet, X
} from 'lucide-react';

const seedTrips = [
  {
    id: 'trip-1', name: 'A little escape to the coast', destination: 'Goa, India',
    startDate: '2026-11-14', endDate: '2026-11-18', budget: 18000,
    cover: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=85',
    color: 'blue', notes: 'Slow mornings, sea air, and no packed schedule.',
    activities: [
      { id: 'a1', day: '2026-11-14', time: '10:00', title: 'Check in & settle', place: 'Candolim', cost: 0, done: true },
      { id: 'a2', day: '2026-11-14', time: '17:00', title: 'Sunset beach walk', place: 'Candolim Beach', cost: 0, done: false },
      { id: 'a3', day: '2026-11-15', time: '09:30', title: 'Breakfast by the sea', place: 'Local café', cost: 650, done: false },
      { id: 'a4', day: '2026-11-15', time: '14:00', title: 'Explore old Goa', place: 'Old Goa', cost: 1200, done: false }
    ]
  },
  {
    id: 'trip-2', name: 'Weekend in the hills', destination: 'Darjeeling, India',
    startDate: '2026-12-05', endDate: '2026-12-08', budget: 12500,
    cover: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=85',
    color: 'green', notes: 'Pack a warm layer and leave room for tea stops.',
    activities: [
      { id: 'b1', day: '2026-12-05', time: '16:00', title: 'Walk around Mall Road', place: 'Chowrasta', cost: 300, done: false },
      { id: 'b2', day: '2026-12-06', time: '05:00', title: 'Sunrise viewpoint', place: 'Tiger Hill', cost: 900, done: false }
    ]
  },
  {
    id: 'trip-3', name: 'Culture, cafés & city walks', destination: 'Kolkata, India',
    startDate: '2027-01-22', endDate: '2027-01-25', budget: 9000,
    cover: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=1000&q=85',
    color: 'coral', notes: 'Architecture, bookstores, and excellent food.',
    activities: [
      { id: 'c1', day: '2027-01-22', time: '11:00', title: 'Visit the flower market', place: 'Malik Ghat', cost: 200, done: false },
      { id: 'c2', day: '2027-01-23', time: '15:00', title: 'Bookshop afternoon', place: 'College Street', cost: 800, done: false }
    ]
  }
];

const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(n) || 0);
const dateFmt = (value, options = { day: 'numeric', month: 'short' }) => value ? new Date(`${value}T12:00:00`).toLocaleDateString('en-IN', options) : 'Choose date';
const dayDiff = (start, end) => {
  if (!start || !end) return 1;
  return Math.max(1, Math.round((new Date(`${end}T12:00:00`) - new Date(`${start}T12:00:00`)) / 86400000) + 1);
};
const makeId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

function App() {
  const [trips, setTrips] = useState(() => {
    try { const saved = localStorage.getItem('triptide-trips'); return saved ? JSON.parse(saved) : seedTrips; }
    catch { return seedTrips; }
  });
  const [activeId, setActiveId] = useState(() => trips[0]?.id || 'trip-1');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All trips');
  const [showTripForm, setShowTripForm] = useState(false);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [toast, setToast] = useState('');
  const [tripForm, setTripForm] = useState({ name: '', destination: '', startDate: '', endDate: '', budget: '10000', notes: '' });
  const [activityForm, setActivityForm] = useState({ day: '', time: '10:00', title: '', place: '', cost: '0' });

  useEffect(() => { localStorage.setItem('triptide-trips', JSON.stringify(trips)); }, [trips]);
  const activeTrip = trips.find(t => t.id === activeId) || trips[0];
  const visibleTrips = useMemo(() => trips.filter(t => {
    const matches = `${t.name} ${t.destination}`.toLowerCase().includes(query.toLowerCase());
    const status = filter === 'All trips' || (filter === 'Upcoming' && t.endDate >= '2026-10-23') || (filter === 'Past' && t.endDate < '2026-10-23');
    return matches && status;
  }), [trips, query, filter]);
  const totalBudget = trips.reduce((sum, t) => sum + Number(t.budget || 0), 0);
  const plannedSpend = trips.reduce((sum, t) => sum + t.activities.reduce((s, a) => s + Number(a.cost || 0), 0), 0);
  const activities = activeTrip?.activities || [];
  const spent = activities.reduce((sum, a) => sum + Number(a.cost || 0), 0);
  const budgetPct = activeTrip?.budget ? Math.min(100, Math.round(spent / activeTrip.budget * 100)) : 0;
  const days = activeTrip ? Array.from({ length: dayDiff(activeTrip.startDate, activeTrip.endDate) }, (_, i) => {
    const d = new Date(`${activeTrip.startDate}T12:00:00`); d.setDate(d.getDate() + i);
    return d.toISOString().slice(0, 10);
  }) : [];
  const [selectedDay, setSelectedDay] = useState('');
  const chosenDay = days.includes(selectedDay) ? selectedDay : (days[0] || '');
  const dayActivities = activities.filter(a => a.day === chosenDay).sort((a, b) => a.time.localeCompare(b.time));

  function notify(message) { setToast(message); window.setTimeout(() => setToast(''), 2600); }
  function updateTrip(id, updater) { setTrips(prev => prev.map(t => t.id === id ? updater(t) : t)); }
  function addTrip(e) {
    e.preventDefault();
    if (!tripForm.name.trim() || !tripForm.destination.trim() || !tripForm.startDate || !tripForm.endDate) return;
    if (tripForm.endDate < tripForm.startDate) { notify('End date must be on or after the start date.'); return; }
    const next = { ...tripForm, id: makeId(), budget: Number(tripForm.budget) || 0, cover: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=85', color: 'blue', activities: [] };
    setTrips(prev => [next, ...prev]); setActiveId(next.id); setShowTripForm(false);
    setTripForm({ name: '', destination: '', startDate: '', endDate: '', budget: '10000', notes: '' }); notify('Your trip is ready to plan.');
  }
  function addActivity(e) {
    e.preventDefault();
    if (!activeTrip || !activityForm.title.trim() || !activityForm.day) return;
    updateTrip(activeTrip.id, t => ({ ...t, activities: [...t.activities, { ...activityForm, id: makeId(), cost: Number(activityForm.cost) || 0, done: false }] }));
    setShowActivityForm(false); setActivityForm({ day: chosenDay, time: '10:00', title: '', place: '', cost: '0' }); notify('Activity added to your itinerary.');
  }
  function toggleActivity(id) {
    updateTrip(activeTrip.id, t => ({ ...t, activities: t.activities.map(a => a.id === id ? { ...a, done: !a.done } : a) }));
  }
  function deleteActivity(id) {
    updateTrip(activeTrip.id, t => ({ ...t, activities: t.activities.filter(a => a.id !== id) })); notify('Activity removed.');
  }
  function deleteTrip(id) {
    const next = trips.filter(t => t.id !== id);
    setTrips(next); if (activeId === id) setActiveId(next[0]?.id || '');
    notify('Trip deleted.');
  }
  function exportTrips() {
    const blob = new Blob([JSON.stringify(trips, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = 'triptide-trips.json'; a.click(); URL.revokeObjectURL(url); notify('Trip backup downloaded.');
  }

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
      <div className="brand"><span className="brand-mark"><Anchor size={19} /></span><span>trip<span className="brand-light">tide</span><small>MAKE ROOM FOR WONDER</small></span></div>
      <div className="workspace-label">WORKSPACE</div>
      <nav className="nav-list">
        <button className="nav-item active"><Compass size={18} /> Overview <span className="nav-dot" /></button>
        <button className="nav-item" onClick={() => { setFilter('All trips'); document.getElementById('my-trips')?.scrollIntoView({ behavior: 'smooth' }); }}><MapPin size={18} /> My trips <span className="nav-count">{trips.length}</span></button>
        <button className="nav-item" onClick={() => { setShowTripForm(true); setMobileNav(false); }}><CalendarDays size={18} /> Plan a trip</button>
      </nav>
      <div className="sidebar-divider" />
      <div className="workspace-label">YOUR COLLECTION</div>
      <div className="mini-trip-list">
        {trips.slice(0, 4).map(t => <button key={t.id} className={`mini-trip ${activeId === t.id ? 'selected' : ''}`} onClick={() => { setActiveId(t.id); setMobileNav(false); }}>
          <img src={t.cover} alt="" /><span><strong>{t.destination.split(',')[0]}</strong><small>{dateFmt(t.startDate)} – {dateFmt(t.endDate)}</small></span><span className="mini-dot" />
        </button>)}
        <button className="add-collection" onClick={() => setShowTripForm(true)}><Plus size={15} /> Add a new trip</button>
      </div>
      <div className="sidebar-bottom">
        <div className="travel-tip"><span className="tip-icon"><Sparkles size={17} /></span><strong>A little reminder</strong><p>The best trips leave a little room for the unexpected.</p><span className="tip-decoration">✳</span></div>
        <div className="profile"><div className="avatar">A</div><span><strong>Your travel desk</strong><small>Personal workspace</small></span><Ellipsis size={18} /></div>
      </div>
    </aside>

    <main className="main-content">
      <header className="topbar">
        <button className="icon-button mobile-menu" onClick={() => setMobileNav(!mobileNav)} aria-label="Toggle navigation"><Menu size={20} /></button>
        <div className="breadcrumb">Workspace <ChevronRight size={14} /> <strong>Overview</strong></div>
        <div className="topbar-actions"><span className="today-label"><span className="live-dot" /> YOUR NEXT CHAPTER AWAITS</span><button className="icon-button" title="Export trip backup" onClick={exportTrips}><Download size={17} /></button><button className="primary-button top-add" onClick={() => setShowTripForm(true)}><Plus size={17} /> New trip</button></div>
      </header>

      <section className="welcome-row">
        <div><div className="eyebrow"><span /> YOUR PERSONAL TRAVEL PLANNER</div><h1>Make plans. <em>Make memories.</em></h1><p>All your little getaways, in one lovely place.</p></div>
        <div className="welcome-stamp"><Compass size={24} /><span>COLLECT<br />MOMENTS</span><i>✳</i></div>
      </section>

      <section className="stats-grid">
        <article className="stat-card stat-primary"><div className="stat-top"><span>Trips in your journal</span><span className="stat-icon"><MapPin size={17} /></span></div><div className="stat-number">{trips.length.toString().padStart(2, '0')}<small> trips</small></div><div className="stat-foot"><span className="stat-trend"><ArrowUpRight size={14} /> Your stories are growing</span></div><div className="stat-watermark"><Compass size={86} /></div></article>
        <article className="stat-card"><div className="stat-top"><span>Planned budgets</span><span className="stat-icon warm"><Wallet size={17} /></span></div><div className="stat-number">{fmt(totalBudget)}</div><div className="stat-foot"><span className="muted">Across all saved trips</span></div><div className="stat-line"><span style={{ width: `${totalBudget ? Math.min(100, plannedSpend / totalBudget * 100) : 0}%` }} /></div></article>
        <article className="stat-card"><div className="stat-top"><span>Activities planned</span><span className="stat-icon lilac"><CalendarDays size={17} /></span></div><div className="stat-number">{trips.reduce((s,t)=>s+t.activities.length,0).toString().padStart(2,'0')}<small> activities</small></div><div className="stat-foot"><span className="muted">Little moments to look forward to</span></div><div className="tiny-calendar"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div></article>
      </section>

      <section className="section-block" id="my-trips">
        <div className="section-heading"><div><div className="section-kicker">THE PLACES ON YOUR MIND</div><h2>Your trips <span className="heading-count">{trips.length}</span></h2></div><button className="text-button" onClick={() => { setFilter(filter === 'All trips' ? 'Upcoming' : 'All trips'); }}>{filter === 'All trips' ? 'Upcoming only' : 'Show all trips'} <ArrowUpRight size={15} /></button></div>
        <div className="trip-toolbar"><div className="search-box"><Search size={17} /><input aria-label="Search trips" placeholder="Find a destination or trip..." value={query} onChange={e => setQuery(e.target.value)} /><kbd>⌘ K</kbd></div><button className="filter-button" onClick={() => setFilter(filter === 'Past' ? 'All trips' : filter === 'Upcoming' ? 'Past' : 'Upcoming')}><SlidersHorizontal size={16} /> {filter} <ChevronDown size={14} /></button></div>
        {visibleTrips.length ? <div className="trip-grid">{visibleTrips.map((trip, index) => {
          const tripSpend = trip.activities.reduce((s,a)=>s+Number(a.cost||0),0);
          const tripDays = dayDiff(trip.startDate, trip.endDate);
          return <article key={trip.id} className={`trip-card ${activeId === trip.id ? 'trip-selected' : ''}`}>
            <button className="trip-cover-button" onClick={() => { setActiveId(trip.id); document.getElementById('itinerary')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} aria-label={`Open ${trip.name}`}>
              <img className="trip-cover" src={trip.cover} alt={`${trip.destination} scenery`} onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80'; }} />
              <span className={`trip-status ${trip.endDate < '2026-10-23' ? 'status-past' : ''}`}>{trip.endDate < '2026-10-23' ? 'Past trip' : 'On the horizon'}</span>
              <span className="cover-number">0{index + 1}</span>
            </button>
            <div className="trip-card-body"><div className="trip-location"><MapPin size={13} /> {trip.destination}</div><h3>{trip.name}</h3><div className="trip-dates"><CalendarDays size={14} /> {dateFmt(trip.startDate, {day:'numeric',month:'short',year:'numeric'})} <span>—</span> {dateFmt(trip.endDate, {day:'numeric',month:'short',year:'numeric'})}</div>
              <div className="trip-card-bottom"><div className="trip-length"><span className="length-icon"><CalendarDays size={14}/></span><span><strong>{tripDays} days</strong><small>{trip.activities.length} planned activities</small></span></div><div className="trip-budget"><small>Budget</small><strong>{fmt(trip.budget)}</strong></div></div>
              <div className="trip-progress"><span style={{width:`${trip.budget ? Math.min(100,tripSpend/trip.budget*100):0}%`}} /></div>
              <div className="trip-card-actions"><button onClick={() => { setActiveId(trip.id); document.getElementById('itinerary')?.scrollIntoView({behavior:'smooth'}); }}>Open itinerary <ArrowUpRight size={14}/></button><button className="delete-trip" aria-label={`Delete ${trip.name}`} title="Delete trip" onClick={() => deleteTrip(trip.id)}><Trash2 size={15}/></button></div>
            </div>
          </article>;
        })}</div> : <div className="empty-state"><Compass size={30}/><h3>No trips found just yet</h3><p>Try a different search or create a new trip to get started.</p><button className="primary-button" onClick={() => setShowTripForm(true)}><Plus size={16}/> Plan your first trip</button></div>}
      </section>

      {activeTrip && <section className="itinerary-layout" id="itinerary">
        <div className="itinerary-main">
          <div className="section-heading itinerary-heading"><div><div className="section-kicker">A DAY AT A TIME</div><h2>Your itinerary <span className="heading-count">{activities.length}</span></h2></div><button className="primary-button" onClick={() => { setActivityForm({ day: chosenDay || activeTrip.startDate, time: '10:00', title: '', place: '', cost: '0' }); setShowActivityForm(true); }}><Plus size={16}/> Add activity</button></div>
          <div className="itinerary-trip-banner"><img src={activeTrip.cover} alt="" /><div><span className="section-kicker">CURRENTLY PLANNING</span><h3>{activeTrip.name}</h3><p><MapPin size={14}/> {activeTrip.destination} <span>·</span> {dayDiff(activeTrip.startDate, activeTrip.endDate)} days</p></div><button className="icon-button" title="Export trip backup" onClick={exportTrips}><Download size={16}/></button></div>
          <div className="day-tabs">{days.map((day, i) => <button key={day} className={chosenDay === day ? 'day-tab active-day' : 'day-tab'} onClick={() => setSelectedDay(day)}><small>DAY {i+1}</small><strong>{dateFmt(day,{day:'2-digit',month:'short'})}</strong><span>{new Date(`${day}T12:00:00`).toLocaleDateString('en-IN',{weekday:'short'})}</span></button>)}</div>
          <div className="timeline">
            {dayActivities.length ? dayActivities.map((activity, i) => <article className={`activity-row ${activity.done ? 'activity-done' : ''}`} key={activity.id}><div className="activity-time">{activity.time}</div><div className="timeline-rail"><button className="activity-check" aria-label={activity.done ? 'Mark incomplete' : 'Mark complete'} onClick={() => toggleActivity(activity.id)}>{activity.done && <Check size={13}/>}</button></div><div className="activity-card"><div className="activity-content"><div className="activity-title-row"><h4>{activity.title}</h4><button className="delete-activity" title="Delete activity" onClick={() => deleteActivity(activity.id)}><X size={15}/></button></div><p><MapPin size={13}/> {activity.place || 'Location to be decided'}</p></div><div className="activity-cost">{fmt(activity.cost)}</div></div></article>) : <div className="empty-day"><CalendarDays size={23}/><strong>A little breathing room</strong><span>Nothing planned for this day yet. Leave it open or add something lovely.</span><button className="text-button" onClick={() => { setActivityForm({day:chosenDay,time:'10:00',title:'',place:'',cost:'0'}); setShowActivityForm(true); }}><Plus size={15}/> Add to this day</button></div>}
          </div>
        </div>
        <aside className="budget-panel"><div className="budget-panel-heading"><span className="budget-icon"><Wallet size={17}/></span><div><span className="section-kicker">KEEP IT COMFY</span><h3>Trip budget</h3></div><CircleHelp size={16} className="help-icon" /></div><div className="budget-total">{fmt(activeTrip.budget)}<small>planned budget</small></div><div className="budget-meter"><div className="meter-track"><span style={{width:`${budgetPct}%`}} /></div><div className="meter-labels"><span>{budgetPct}% planned</span><span>{fmt(Math.max(0,activeTrip.budget-spent))} left</span></div></div><div className="budget-divider"/><div className="budget-line"><span><span className="legend-dot planned-dot"/>Planned activities</span><strong>{fmt(spent)}</strong></div><div className="budget-line"><span><span className="legend-dot remaining-dot"/>Remaining</span><strong>{fmt(Math.max(0,activeTrip.budget-spent))}</strong></div><div className="budget-note"><Sparkles size={16}/><p>{spent > activeTrip.budget ? 'You are over budget. Review activities and adjust costs to get back on track.' : budgetPct > 75 ? 'You have used most of your budget. Keep an eye on the little extras.' : 'A little planning now leaves more room for spontaneous moments later.'}</p></div><div className="notes-box"><span>YOUR TRIP NOTE</span><p>{activeTrip.notes || 'Add a note to remember what matters most on this trip.'}</p></div></aside>
      </section>}
      <footer className="footer"><span>✳</span> Made for the places you haven't been yet. <span className="footer-right">TRIPTIDE © 2026</span></footer>
    </main>

    {mobileNav && <button className="nav-scrim" onClick={() => setMobileNav(false)} aria-label="Close navigation"/>}
    {showTripForm && <div className="modal-backdrop" onMouseDown={e => { if(e.target===e.currentTarget)setShowTripForm(false); }}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="trip-modal-title"><div className="modal-header"><div><span className="section-kicker">SOMETHING TO LOOK FORWARD TO</span><h2 id="trip-modal-title">Plan a new trip</h2><p>Start with the basics. The little details can come later.</p></div><button className="icon-button" onClick={() => setShowTripForm(false)} aria-label="Close"><X size={19}/></button></div><form onSubmit={addTrip} className="modal-form"><label>Trip name<input autoFocus required placeholder="e.g. A long weekend away" value={tripForm.name} onChange={e=>setTripForm({...tripForm,name:e.target.value})}/></label><label>Destination<input required placeholder="e.g. Jaipur, India" value={tripForm.destination} onChange={e=>setTripForm({...tripForm,destination:e.target.value})}/></label><div className="form-row"><label>Start date<input type="date" required value={tripForm.startDate} onChange={e=>setTripForm({...tripForm,startDate:e.target.value,endDate:tripForm.endDate && tripForm.endDate<e.target.value ? e.target.value : tripForm.endDate})}/></label><label>End date<input type="date" min={tripForm.startDate||undefined} required value={tripForm.endDate} onChange={e=>setTripForm({...tripForm,endDate:e.target.value})}/></label></div><label>Budget (₹)<input type="number" min="0" step="100" value={tripForm.budget} onChange={e=>setTripForm({...tripForm,budget:e.target.value})}/></label><label>Trip note <textarea rows="2" placeholder="What do you want this trip to feel like?" value={tripForm.notes} onChange={e=>setTripForm({...tripForm,notes:e.target.value})}/></label><div className="modal-actions"><button type="button" className="secondary-button" onClick={()=>setShowTripForm(false)}>Maybe later</button><button className="primary-button" type="submit"><Plus size={16}/> Create trip</button></div></form></section></div>}
    {showActivityForm && activeTrip && <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setShowActivityForm(false);}}><section className="modal activity-modal" role="dialog" aria-modal="true" aria-labelledby="activity-modal-title"><div className="modal-header"><div><span className="section-kicker">MAKE A LITTLE PLAN</span><h2 id="activity-modal-title">Add an activity</h2><p>Put one lovely thing on the itinerary.</p></div><button className="icon-button" onClick={()=>setShowActivityForm(false)} aria-label="Close"><X size={19}/></button></div><form onSubmit={addActivity} className="modal-form"><label>Activity name<input autoFocus required placeholder="e.g. Explore the old town" value={activityForm.title} onChange={e=>setActivityForm({...activityForm,title:e.target.value})}/></label><label>Place or address<input placeholder="e.g. City centre" value={activityForm.place} onChange={e=>setActivityForm({...activityForm,place:e.target.value})}/></label><div className="form-row"><label>Day<select required value={activityForm.day} onChange={e=>setActivityForm({...activityForm,day:e.target.value})}>{days.map((d,i)=><option key={d} value={d}>Day {i+1} · {dateFmt(d,{day:'numeric',month:'short'})}</option>)}</select></label><label>Time<input type="time" required value={activityForm.time} onChange={e=>setActivityForm({...activityForm,time:e.target.value})}/></label></div><label>Estimated cost (₹)<input type="number" min="0" step="50" value={activityForm.cost} onChange={e=>setActivityForm({...activityForm,cost:e.target.value})}/></label><div className="modal-actions"><button type="button" className="secondary-button" onClick={()=>setShowActivityForm(false)}>Cancel</button><button className="primary-button" type="submit"><Plus size={16}/> Add activity</button></div></form></section></div>}
    {toast && <div className="toast"><Check size={16}/>{toast}</div>}
  </div>;
}
export default App;
