import { useEffect, useRef, useContext, useState } from 'react'
import new_logo from '../../assets/images/logo_new.png'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { BiMenu } from 'react-icons/bi'
import { AuthContext } from '../../context/AuthContext'

const navlinks = [
  { path: '/home',       display: 'Home'          },
  { path: '/doctors',    display: 'Find a Doctor'  },
  { path: '/prediction', display: 'Predict'        },
  { path: '/ehr',        display: 'EHR'            },
  { path: '/contact',    display: 'Contact'        },
]

const Header = () => {
  const headerRef   = useRef(null)
  const menuRef     = useRef(null)
  const dropdownRef = useRef(null)
  const { state, dispatch } = useContext(AuthContext)
  const { user, role, token } = state
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => {
      const scrolled = document.body.scrollTop > 80 || document.documentElement.scrollTop > 80
      headerRef.current?.classList.toggle('sticky_header', scrolled)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const toggleMenu = () => menuRef.current.classList.toggle('show_menu')
  const handleLogout = () => { dispatch({ type: 'LOGOUT' }); setOpen(false); navigate('/home') }
  const profilePath = role === 'doctor' ? '/doctors/profile/me' : '/users/profile/me'
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : 'U'
  // Show the actual first name, skipping title prefixes like "Dr.", "Mr.", etc.
  const TITLES = ['dr.', 'mr.', 'mrs.', 'ms.', 'prof.']
  const nameParts = (user?.name || '').split(' ').filter(Boolean)
  const displayName = nameParts.find(w => !TITLES.includes(w.toLowerCase())) || nameParts[0] || 'User'

  return (
    <header className="header" ref={headerRef}>
      <div className="container">
        <div className="flex items-center justify-between">

          {/* ── Logo ── */}
          <Link to="/home" className="flex items-center gap-2 select-none">
            <img src={new_logo} className="w-[44px] h-[44px]" alt="logo" />
            <span style={{ fontWeight: 700, fontSize: 17, color: '#181A1E' }} className="hidden sm:block">
              Medi<span style={{ color: '#0067FF' }}>Cura</span>
            </span>
          </Link>

          {/* ── Nav ── */}
          <div className="navigation" ref={menuRef} onClick={toggleMenu}>
            <ul className="menu flex items-center gap-[2.7rem]">
              {navlinks.map((link, i) => (
                <li key={i}>
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      isActive
                        ? 'text-primaryColor text-[15px] leading-7 font-[600]'
                        : 'text-textColor text-[15px] leading-7 font-[500] hover:text-primaryColor transition-colors'
                    }
                  >
                    {link.display}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Right ── */}
          <div className="flex items-center gap-4" style={{ lineHeight: 'normal' }}>
            {token && user ? (
              <div style={{ position: 'relative' }} ref={dropdownRef}>

                {/* Avatar trigger button */}
                <button
                  onClick={() => setOpen(v => !v)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%', overflow: 'hidden',
                    flexShrink: 0, border: '2px solid #0067FF', outline: '2px solid #e0eeff', outlineOffset: 1
                  }}>
                    {user?.photo
                      ? <img src={user.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={user.name} />
                      : <div style={{ width: '100%', height: '100%', background: '#0067FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14 }}>{initials}</div>
                    }
                  </div>
                  <span style={{ fontWeight: 600, fontSize: 14, color: '#181A1E', maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className="hidden md:block">
                    {displayName}
                  </span>
                  <svg style={{ width: 12, height: 12, color: '#4E545F', transition: 'transform .2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} className="hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* ── Dropdown ── */}
                {open && (
                  <div style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 10px)',
                    width: 260, background: '#fff',
                    borderRadius: 16, border: '1px solid #eee',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.13)',
                    overflow: 'hidden', zIndex: 9999,
                    animation: 'dropIn .15s ease-out both'
                  }}>

                    {/* ── User info header ── */}
                    <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #f0f0f0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {/* Avatar */}
                        <div style={{
                          width: 48, height: 48, borderRadius: '50%', overflow: 'hidden',
                          flexShrink: 0, border: '2px solid #0067FF'
                        }}>
                          {user?.photo
                            ? <img src={user.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={user.name} />
                            : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#0067FF,#01B5C5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 16 }}>{initials}</div>
                          }
                        </div>
                        {/* Text block */}
                        <div style={{ overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <p style={{ fontWeight: 700, fontSize: 14, color: '#181A1E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.4, width: '100%' }}>
                            {user?.name}
                          </p>
                          <p style={{ fontSize: 11, color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2, lineHeight: 1.4, width: '100%' }}>
                            {user?.email}
                          </p>
                          <span style={{
                            marginTop: 5, fontSize: 10, fontWeight: 700,
                            padding: '2px 8px', borderRadius: 20, lineHeight: '16px',
                            background: role === 'doctor' ? '#dcfce7' : '#dbeafe',
                            color: role === 'doctor' ? '#16a34a' : '#1d4ed8',
                            textTransform: 'capitalize', letterSpacing: '0.03em',
                            whiteSpace: 'nowrap', flexShrink: 0
                          }}>
                            {role}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* ── Menu items ── */}
                    <div style={{ padding: '6px 0' }}>
                      <DropItem
                        to={profilePath}
                        onClose={() => setOpen(false)}
                        color="#0067FF"
                        bgColor="#EBF5FF"
                        label="My Profile"
                        sub="View & edit your info"
                        icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />}
                      />
                      <DropItem
                        to={profilePath}
                        onClose={() => setOpen(false)}
                        color="#01B5C5"
                        bgColor="#E0F9FB"
                        label="My Bookings"
                        sub="Manage appointments"
                        icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />}
                      />
                    </div>

                    {/* ── Divider ── */}
                    <div style={{ height: 1, background: '#f3f4f6', margin: '0 12px' }} />

                    {/* ── Logout ── */}
                    <div style={{ padding: '6px 0 4px' }}>
                      <button
                        onClick={handleLogout}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                          padding: '9px 14px', background: 'none', border: 'none', cursor: 'pointer',
                          textAlign: 'left'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#fff5f5'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                      >
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#fff0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <svg style={{ width: 15, height: 15, color: '#ef4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: 13, color: '#ef4444', lineHeight: 1.3 }}>Sign out</p>
                          <p style={{ fontSize: 11, color: '#aaa', lineHeight: 1.3, marginTop: 1 }}>See you next time!</p>
                        </div>
                      </button>
                    </div>

                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <button style={{ lineHeight: 'normal', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 40, padding: '0 20px', background: '#0067FF', color: '#fff', fontWeight: 600, fontSize: 14, borderRadius: 50, border: 'none', cursor: 'pointer' }}>
                  Login
                </button>
              </Link>
            )}

            <span className="md:hidden" onClick={toggleMenu}>
              <BiMenu className="w-6 h-6 cursor-pointer" />
            </span>
          </div>

        </div>
      </div>
    </header>
  )
}

/* ── Reusable dropdown link item ── */
const DropItem = ({ to, onClose, color, bgColor, label, sub, icon }) => {
  const [hovered, setHovered] = useState(false)
  return (
    <Link
      to={to}
      onClick={onClose}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '9px 14px', textDecoration: 'none',
        background: hovered ? '#fafafa' : 'transparent', transition: 'background .15s'
      }}
    >
      <div style={{ width: 32, height: 32, borderRadius: 8, background: hovered ? color : bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background .15s' }}>
        <svg style={{ width: 15, height: 15, color: hovered ? '#fff' : color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {icon}
        </svg>
      </div>
      <div>
        <p style={{ fontWeight: 600, fontSize: 13, color: hovered ? color : '#181A1E', lineHeight: 1.3, transition: 'color .15s' }}>{label}</p>
        <p style={{ fontSize: 11, color: '#aaa', lineHeight: 1.3, marginTop: 1 }}>{sub}</p>
      </div>
    </Link>
  )
}

export default Header
