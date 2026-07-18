'use client';

import Link from 'next/link';
import {
  Search, User, Menu, SlidersHorizontal, X,
  Plus, Minus, Check, Globe, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useStore, FilterState } from '@/store/useStore';
import { useState, useEffect, useRef } from 'react';

/* â”€â”€â”€ Constants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const AMENITIES_LIST = ['Wi-Fi', 'MÉ™tbÉ™x', 'Hovuz', 'Pulsuz parkinq', 'Kondisioner', 'Paltaryuyan', 'Televizor', 'Ä°ÅŸ sahÉ™si'];
const MONTHS_AZ = ['Yanvar','Fevral','Mart','Aprel','May','Ä°yun','Ä°yul','Avqust','Sentyabr','Oktyabr','Noyabr','Dekabr'];
const DAYS_AZ = ['B', 'B.e', 'Ã‡.a', 'Ã‡', 'C.a', 'C', 'Åž'];
const LOCALES = [{ code: 'az', label: 'AzÉ™rbaycanca' }, { code: 'en', label: 'English' }, { code: 'ru', label: 'Ð ÑƒÑÑÐºÐ¸Ð¹' }];
const CURRENCIES = ['AZN', 'USD', 'EUR'];
const GUEST_TYPES = [
  { key: 'adults',   label: 'BÃ¶yÃ¼klÉ™r',      sub: '13 yaÅŸ vÉ™ yuxarÄ±', min: 1 },
  { key: 'children', label: 'UÅŸaqlar',        sub: '2â€“12 yaÅŸ',         min: 0 },
  { key: 'infants',  label: 'KÃ¶rpÉ™lÉ™r',       sub: '2 yaÅŸa qÉ™dÉ™r',     min: 0 },
  { key: 'pets',     label: 'Ev heyvanlarÄ±',  sub: 'XidmÉ™t heyvanlarÄ±',min: 0 },
];

/* â”€â”€â”€ Calendar helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function buildCalendar(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array(offset).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}
function formatDate(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}
function parseDate(s: string | null): Date | null {
  if (!s) return null;
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}
function displayDate(s: string | null): string {
  if (!s) return '';
  const d = parseDate(s)!;
  return `${d.getDate()} ${MONTHS_AZ[d.getMonth()].slice(0, 3)}`;
}
function nightCount(ci: string | null, co: string | null) {
  if (!ci || !co) return 0;
  return Math.max(0, Math.round((parseDate(co)!.getTime() - parseDate(ci)!.getTime()) / 86400000));
}

/* â”€â”€â”€ Mini Calendar Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function MiniCalendar({ year, month, checkIn, checkOut, hovered, onDayClick, onDayHover }: {
  year: number; month: number;
  checkIn: string | null; checkOut: string | null; hovered: string | null;
  onDayClick: (iso: string) => void;
  onDayHover: (iso: string | null) => void;
}) {
  const cells = buildCalendar(year, month);
  const ciDate = parseDate(checkIn);
  const coDate = parseDate(checkOut) || parseDate(hovered);
  const today = new Date(); today.setHours(0, 0, 0, 0);

  return (
    <div className="min-w-[260px]">
      <p className="text-center font-semibold mb-4 text-gray-900">{MONTHS_AZ[month]} {year}</p>
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {DAYS_AZ.map(d => <span key={d} className="text-xs font-medium text-gray-400 pb-2">{d}</span>)}
        {cells.map((day, i) => {
          if (!day) return <span key={i} />;
          const iso = formatDate(year, month, day);
          const date = new Date(year, month, day);
          const isPast = date < today;
          const isStart = checkIn === iso;
          const isEnd = checkOut === iso || (!checkOut && hovered === iso);
          const inRange = ciDate && coDate && date > ciDate && date < coDate;
          return (
            <button key={i} disabled={isPast}
              onClick={() => !isPast && onDayClick(iso)}
              onMouseEnter={() => !isPast && onDayHover(iso)}
              onMouseLeave={() => onDayHover(null)}
              className={`h-9 w-9 mx-auto rounded-full text-sm transition-all
                ${isPast ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer'}
                ${(isStart || isEnd) ? 'bg-gray-900 text-white font-semibold hover:bg-gray-800' : !isPast ? 'hover:bg-gray-100' : ''}
                ${inRange && !isStart && !isEnd ? 'bg-rose-50 text-rose-600 rounded-none' : ''}`}>
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* â”€â”€â”€ Main Navbar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export default function Navbar() {
  const {
    searchQuery, setSearchQuery,
    user, logout,
    checkIn, checkOut, setCheckIn, setCheckOut,
    guests, setGuests, resetGuests,
    filters, setFilters, resetFilters,
    locale, setLocale, currency, setCurrency,
    wishlist,
  } = useStore();

  const [mounted, setMounted] = useState(false);
  const [activePanel, setActivePanel] = useState<'location' | 'dates' | 'guests' | 'filters' | null>(null);
  const [calMonth, setCalMonth] = useState(() => {
    const n = new Date(); return { year: n.getFullYear(), month: n.getMonth() };
  });
  const [hovered, setHovered] = useState<string | null>(null);
  const [selectingEnd, setSelectingEnd] = useState(false);
  const [localeOpen, setLocaleOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { if (activePanel === 'filters') setLocalFilters(filters); }, [activePanel, filters]);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActivePanel(null); setLocaleOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const rightMonth = calMonth.month === 11
    ? { year: calMonth.year + 1, month: 0 }
    : { year: calMonth.year, month: calMonth.month + 1 };

  function handleDayClick(iso: string) {
    if (!selectingEnd || !checkIn || iso <= checkIn) {
      setCheckIn(iso); setCheckOut(null); setSelectingEnd(true);
    } else {
      setCheckOut(iso); setSelectingEnd(false); setActivePanel('guests');
    }
  }

  const totalGuests = guests.adults + guests.children;
  const guestLabel = totalGuests > 0
    ? `${totalGuests} qonaq${guests.infants > 0 ? `, ${guests.infants} kÃ¶rpÉ™` : ''}${guests.pets > 0 ? `, ${guests.pets} heyvan` : ''}`
    : 'Qonaq É™lavÉ™ et';

  const datesLabel = checkIn
    ? checkOut ? `${displayDate(checkIn)} â€“ ${displayDate(checkOut)}` : displayDate(checkIn)
    : null;

  const currSymbol = currency === 'AZN' ? 'â‚¼' : currency === 'USD' ? '$' : 'â‚¬';

  function updateCount(field: 'rooms' | 'beds' | 'bathrooms', delta: number) {
    setLocalFilters(prev => ({ ...prev, [field]: Math.max(0, (prev[field] as number) + delta) }));
  }
  function toggleAmenity(a: string) {
    setLocalFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(a) ? prev.amenities.filter(x => x !== a) : [...prev.amenities, a],
    }));
  }

  const isOpen = activePanel !== null || localeOpen;

  return (
    <div ref={navRef}>
      <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 gap-4">

            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="text-rose-500 font-bold text-2xl tracking-tighter" onClick={() => setActivePanel(null)}>
                QonaqOl
              </Link>
            </div>

            {/* â”€â”€ 3-Part Search Bar â”€â”€ */}
            <div className="hidden md:flex flex-1 justify-center">
              <div className={`flex items-center border rounded-full bg-white transition-all duration-200 overflow-visible
                ${activePanel ? 'shadow-lg border-gray-300' : 'shadow-sm border-gray-300 hover:shadow-md'}`}>

                {/* Location */}
                <button onClick={() => setActivePanel(activePanel === 'location' ? null : 'location')}
                  className={`flex flex-col px-5 py-3 text-left rounded-l-full transition-colors min-w-[160px]
                    ${activePanel === 'location' ? 'bg-white ring-2 ring-inset ring-gray-800 rounded-full' : 'hover:bg-gray-50'}`}>
                  <span className="text-xs font-bold text-gray-800">Harada</span>
                  <span className="text-sm text-gray-500 truncate max-w-[120px]">{searchQuery || 'Yer axtarÄ±n'}</span>
                </button>

                <div className="w-px h-8 bg-gray-200" />

                {/* Dates */}
                <button onClick={() => setActivePanel(activePanel === 'dates' ? null : 'dates')}
                  className={`flex flex-col px-5 py-3 text-left transition-colors min-w-[130px]
                    ${activePanel === 'dates' ? 'bg-white ring-2 ring-inset ring-gray-800 rounded-full' : 'hover:bg-gray-50'}`}>
                  <span className="text-xs font-bold text-gray-800">Tarix</span>
                  <span className="text-sm text-gray-500">{datesLabel || 'Tarix É™lavÉ™ et'}</span>
                </button>

                <div className="w-px h-8 bg-gray-200" />

                {/* Guests */}
                <button onClick={() => setActivePanel(activePanel === 'guests' ? null : 'guests')}
                  className={`flex flex-col px-5 py-3 text-left transition-colors min-w-[150px]
                    ${activePanel === 'guests' ? 'bg-white ring-2 ring-inset ring-gray-800 rounded-full' : 'hover:bg-gray-50'}`}>
                  <span className="text-xs font-bold text-gray-800">Qonaqlar</span>
                  <span className="text-sm text-gray-500 truncate max-w-[110px]">{guestLabel}</span>
                </button>

                {/* Search btn */}
                <button onClick={() => setActivePanel(null)}
                  className="bg-rose-500 hover:bg-rose-600 text-white rounded-full p-3 m-2 transition flex items-center gap-2 px-4">
                  <Search size={16} strokeWidth={3} />
                  <span className="text-sm font-semibold hidden lg:block">Axtar</span>
                </button>
              </div>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2">
              {/* Filter btn */}
              <button onClick={() => setActivePanel(activePanel === 'filters' ? null : 'filters')}
                className={`hidden md:flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-medium transition-all
                  ${activePanel === 'filters' ? 'border-gray-900 bg-gray-50' : 'border-gray-300 hover:shadow-md'}`}>
                <SlidersHorizontal size={15} />
                FilterlÉ™r
              </button>

              {/* Locale / Currency */}
              <div className="relative hidden md:block">
                <button onClick={() => { setLocaleOpen(!localeOpen); setActivePanel(null); }}
                  className={`flex items-center p-2 rounded-full border transition ${localeOpen ? 'border-gray-900' : 'border-gray-300 hover:shadow-md'}`}>
                  <Globe size={18} className="text-gray-600" />
                </button>
                {localeOpen && (
                  <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50 space-y-3">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Dil</p>
                    <div className="flex flex-col gap-1">
                      {LOCALES.map(l => (
                        <button key={l.code} onClick={() => setLocale(l.code as any)}
                          className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition ${locale === l.code ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}`}>
                          {l.label} {locale === l.code && <Check size={14} />}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider pt-2 border-t">Valyuta</p>
                    <div className="flex gap-2">
                      {CURRENCIES.map(c => (
                        <button key={c} onClick={() => setCurrency(c as any)}
                          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${currency === c ? 'bg-gray-900 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Add Listing */}
              <Link href="/add-listing" className="hidden md:block text-sm font-semibold text-rose-600 border-2 border-rose-500 hover:bg-rose-50 px-4 py-2 rounded-full transition">
                Elan É™lavÉ™ et
              </Link>

              {/* User menu */}
              <div className="flex items-center gap-2 border border-gray-300 p-2 rounded-full hover:shadow-md transition cursor-pointer bg-white group relative">
                <Menu size={20} className="text-gray-500 ml-1" />
                {mounted && user ? (
                  <div className="bg-rose-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <div className="bg-gray-500 text-white rounded-full p-1"><User size={20} /></div>
                )}
                <div className="absolute right-0 top-12 w-64 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 flex flex-col text-gray-900 z-50">
                  {mounted && user ? (
                    <>
                      <div className="px-4 py-3 text-sm font-semibold border-b border-gray-100">Salam, {user.fullName}!</div>
                      {wishlist.length > 0 && <div className="px-4 py-2 text-xs text-gray-500">â¤ï¸ {wishlist.length} seÃ§ilmiÅŸ elan</div>}
                      <Link href="/profile" className="px-4 py-3 hover:bg-gray-50 text-sm font-medium">Profilim</Link>
                      <div className="h-px bg-gray-200 my-1" />
                      <Link href="/help" className="px-4 py-3 hover:bg-gray-50 text-sm">YardÄ±m MÉ™rkÉ™zi</Link>
                      <div className="h-px bg-gray-200 my-1" />
                      <div onClick={logout} className="px-4 py-3 hover:bg-gray-50 text-sm font-semibold text-rose-600 cursor-pointer">Ã‡Ä±xÄ±ÅŸ et</div>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="px-4 py-3 hover:bg-gray-50 text-sm font-semibold">GiriÅŸ edin</Link>
                      <Link href="/register" className="px-4 py-3 hover:bg-gray-50 text-sm">Qeydiyyatdan keÃ§in</Link>
                      <div className="h-px bg-gray-200 my-1" />
                      <Link href="/help" className="px-4 py-3 hover:bg-gray-50 text-sm">YardÄ±m MÉ™rkÉ™zi</Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* â”€â”€ Dropdown Panels â”€â”€ */}
        {activePanel && (
          <div className="absolute left-0 right-0 top-full z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-4">

              {/* Location */}
              {activePanel === 'location' && (
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 max-w-sm animate-in slide-in-from-top-4 fade-in duration-200">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">AxtarÄ±ÅŸ mÃ¶vqeyi</p>
                  <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input autoFocus type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                      placeholder="ÅžÉ™hÉ™r, Ã¶lkÉ™, yer..."
                      className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl outline-none focus:border-gray-900 text-sm" />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  <div className="mt-4 space-y-1">
                    {['BakÄ±', 'ÅžÉ™ki', 'QÉ™bÉ™lÉ™', 'NaxÃ§Ä±van', 'GÉ™ncÉ™'].map(city => (
                      <button key={city} onClick={() => { setSearchQuery(city); setActivePanel('dates'); }}
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-gray-50 text-sm text-gray-700 transition">
                        <span className="bg-gray-100 rounded-lg p-2 text-base">ðŸ“</span>
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Dates */}
              {activePanel === 'dates' && (
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 inline-block animate-in slide-in-from-top-4 fade-in duration-200">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex gap-3">
                      <button onClick={() => { setCheckIn(null); setCheckOut(null); setSelectingEnd(false); }}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${!checkIn ? 'bg-gray-900 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
                        Tarix seÃ§
                      </button>
                      {checkIn && checkOut && (
                        <span className="px-4 py-2 rounded-full text-sm bg-rose-50 text-rose-600 font-semibold">
                          {nightCount(checkIn, checkOut)} gecÉ™
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => setCalMonth(p => p.month === 0 ? { year: p.year - 1, month: 11 } : { year: p.year, month: p.month - 1 })}
                        className="p-2 hover:bg-gray-100 rounded-full transition"><ChevronLeft size={18} /></button>
                      <button onClick={() => setCalMonth(p => p.month === 11 ? { year: p.year + 1, month: 0 } : { year: p.year, month: p.month + 1 })}
                        className="p-2 hover:bg-gray-100 rounded-full transition"><ChevronRight size={18} /></button>
                    </div>
                  </div>
                  <div className="flex gap-10 overflow-x-auto">
                    <MiniCalendar {...calMonth} checkIn={checkIn} checkOut={checkOut} hovered={hovered} onDayClick={handleDayClick} onDayHover={setHovered} />
                    <MiniCalendar {...rightMonth} checkIn={checkIn} checkOut={checkOut} hovered={hovered} onDayClick={handleDayClick} onDayHover={setHovered} />
                  </div>
                  <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
                    <button onClick={() => { setCheckIn(null); setCheckOut(null); setSelectingEnd(false); }}
                      className="text-sm font-semibold underline hover:text-rose-500 transition">TÉ™mizlÉ™</button>
                    <button onClick={() => setActivePanel('guests')}
                      className="bg-gray-900 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-black transition">
                      NÃ¶vbÉ™ti â†’
                    </button>
                  </div>
                </div>
              )}

              {/* Guests */}
              {activePanel === 'guests' && (
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 max-w-sm animate-in slide-in-from-top-4 fade-in duration-200">
                  <div className="space-y-6">
                    {GUEST_TYPES.map(gt => (
                      <div key={gt.key} className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{gt.label}</p>
                          <p className="text-sm text-gray-500">{gt.sub}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => setGuests({ [gt.key]: Math.max(gt.min, (guests[gt.key as keyof typeof guests]) - 1) })}
                            disabled={(guests[gt.key as keyof typeof guests]) <= gt.min}
                            className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center hover:border-gray-900 transition disabled:opacity-30 disabled:cursor-not-allowed">
                            <Minus size={15} />
                          </button>
                          <span className="w-5 text-center font-semibold">{guests[gt.key as keyof typeof guests]}</span>
                          <button
                            onClick={() => setGuests({ [gt.key]: (guests[gt.key as keyof typeof guests]) + 1 })}
                            className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center hover:border-gray-900 transition">
                            <Plus size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
                    <button onClick={resetGuests} className="text-sm font-semibold underline hover:text-rose-500 transition">SÄ±fÄ±rla</button>
                    <button onClick={() => setActivePanel(null)}
                      className="bg-rose-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-rose-700 transition flex items-center gap-2">
                      <Search size={15} />
                      Axtar
                    </button>
                  </div>
                </div>
              )}

              {/* Filters */}
              {activePanel === 'filters' && (
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 animate-in slide-in-from-top-4 fade-in duration-200 max-h-[72vh] overflow-hidden flex flex-col">
                  <div className="overflow-y-auto flex-1 space-y-8 pr-1" style={{ scrollbarWidth: 'none' }}>
                    <div>
                      <h3 className="text-lg font-semibold mb-4">QiymÉ™t aralÄ±ÄŸÄ±</h3>
                      <div className="flex items-center gap-4">
                        {([['Minimum', 'minPrice'], ['Maksimum', 'maxPrice']] as const).map(([label, key]) => (
                          <div key={key} className="flex-1 border border-gray-300 rounded-xl p-3 focus-within:border-2 focus-within:border-gray-900 transition">
                            <label className="text-xs text-gray-500 font-bold block">{label}</label>
                            <div className="flex items-center gap-1">
                              <span className="text-gray-500">{currSymbol}</span>
                              <input type="number" value={localFilters[key]}
                                onChange={e => setLocalFilters({ ...localFilters, [key]: Number(e.target.value) })}
                                className="w-full outline-none font-semibold text-lg" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="h-px bg-gray-100" />
                    <div>
                      <h3 className="text-lg font-semibold mb-5">Otaqlar vÉ™ yataqlar</h3>
                      <div className="space-y-5">
                        {[{ id: 'rooms', label: 'Otaqlar' }, { id: 'beds', label: 'Yataqlar' }, { id: 'bathrooms', label: 'Hamamlar' }].map(item => (
                          <div key={item.id} className="flex items-center justify-between">
                            <span className="text-gray-800">{item.label}</span>
                            <div className="flex items-center gap-4">
                              <button onClick={() => updateCount(item.id as any, -1)} disabled={localFilters[item.id as keyof FilterState] === 0}
                                className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center hover:border-gray-900 transition disabled:opacity-30 disabled:cursor-not-allowed">
                                <Minus size={14} />
                              </button>
                              <span className="w-16 text-center text-sm font-medium">
                                {localFilters[item.id as keyof FilterState] === 0 ? 'Ä°stÉ™nilÉ™n' : localFilters[item.id as keyof FilterState]}
                              </span>
                              <button onClick={() => updateCount(item.id as any, 1)}
                                className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center hover:border-gray-900 transition">
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="h-px bg-gray-100" />
                    <div>
                      <h3 className="text-lg font-semibold mb-4">XÃ¼susi ÅŸÉ™raitlÉ™r</h3>
                      <div className="grid grid-cols-2 gap-3 pb-2">
                        {AMENITIES_LIST.map(a => {
                          const checked = localFilters.amenities.includes(a);
                          return (
                            <label key={a} onClick={() => toggleAmenity(a)} className="flex items-center gap-3 cursor-pointer group">
                              <div className={`w-6 h-6 rounded border flex items-center justify-center transition ${checked ? 'bg-black border-black text-white' : 'border-gray-300 group-hover:border-black'}`}>
                                {checked && <Check size={14} strokeWidth={3} />}
                              </div>
                              <span className="text-sm text-gray-700">{a}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-4">
                    <button onClick={handleFilterClear} className="text-sm font-semibold underline hover:text-rose-500 transition">TÉ™mizlÉ™</button>
                    <button onClick={handleFilterApply}
                      className="bg-rose-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-rose-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md flex items-center gap-2">
                      <Search size={16} />
                      Axtar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 top-20 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => { setActivePanel(null); setLocaleOpen(false); }} />
      )}
    </div>
  );

  function handleFilterApply() { setFilters(localFilters); setActivePanel(null); }
  function handleFilterClear() {
    const def = { minPrice: 0, maxPrice: 5000, rooms: 0, beds: 0, bathrooms: 0, amenities: [] };
    resetFilters(); setLocalFilters(def);
  }
}
