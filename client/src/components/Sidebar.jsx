import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const S = {
  sidebar: {
    width: 240,
    minHeight: '100vh',
    background: '#fff',
    borderRight: '1px solid #E2E8F0',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    left: 0, top: 0, bottom: 0,
    zIndex: 50,
    fontFamily: "'DM Sans', sans-serif",
  },

  brand: {
    padding: '24px 20px 20px',
    borderBottom: '1px solid #F1F5F9',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },

  brandIcon: {
    width: 36, height: 36,
    borderRadius: 10,
    background: 'linear-gradient(135deg, #0EA5E9, #0D9488)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 18,
  },

  brandName: {
    fontFamily: "'Sora', sans-serif",
    fontSize: 14,
    fontWeight: 700,
    color: '#1E293B',
    letterSpacing: '-0.3px',
  },

  brandSub: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 1,
  },

  nav: {
    flex: 1,
    padding: '16px 12px',
    overflowY: 'auto',
  },

  navSection: {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '1.2px',
    textTransform: 'uppercase',
    color: '#CBD5E1',
    padding: '12px 8px 6px',
  },

  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 12px',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    color: '#64748B',
    textDecoration: 'none',
    transition: 'all 0.15s',
    marginBottom: 2,
  },

  navLinkActive: {
    background: 'linear-gradient(135deg, rgba(14,165,233,0.1), rgba(13,148,136,0.08))',
    color: '#0EA5E9',
    fontWeight: 600,
  },

  navIcon: {
    width: 32, height: 32,
    borderRadius: 7,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 15,
    background: '#F8FAFC',
    flexShrink: 0,
  },

  navIconActive: {
    background: 'linear-gradient(135deg, #0EA5E9, #0D9488)',
  },

  bottom: {
    padding: '16px 12px',
    borderTop: '1px solid #F1F5F9',
  },

  userCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 12px',
    borderRadius: 8,
    background: '#F8FAFC',
    marginBottom: 8,
  },

  avatar: {
    width: 32, height: 32,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #0EA5E9, #0D9488)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 13,
    color: '#fff',
    fontWeight: 600,
    flexShrink: 0,
  },

  userName: {
    fontSize: 12,
    fontWeight: 600,
    color: '#1E293B',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  userRole: {
    fontSize: 10,
    color: '#94A3B8',
    textTransform: 'capitalize',
  },

  logoutBtn: {
    width: '100%',
    padding: '9px',
    background: 'none',
    border: '1px solid #E2E8F0',
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 500,
    color: '#64748B',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    transition: 'all 0.15s',
  },
};

const navItems = [
  { label: 'Dashboard',  path: '/dashboard', icon: '📊', section: 'Main' },
  { label: 'Upload ECG', path: '/upload',    icon: '📤', section: 'Main' },
  { label: 'Patients',   path: '/patients',  icon: '👥', section: 'Main' },
  { label: 'Reports',    path: '/reports',   icon: '📄', section: 'Clinical' },
  { label: 'Admin',      path: '/admin',     icon: '⚙️', section: 'System', adminOnly: true },
  { label: 'Settings',   path: '/settings',  icon: '🔧', section: 'System' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sections = ['Main', 'Clinical', 'System'];

  return (
    <aside style={S.sidebar}>
      {/* Brand */}
      <div style={S.brand}>
        <div style={S.brandIcon}>🫀</div>
        <div>
          <div style={S.brandName}>CardioAI</div>
          <div style={S.brandSub}>ECG Platform</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={S.nav}>
        {sections.map(section => {
          const items = navItems.filter(
            n => n.section === section &&
            (!n.adminOnly || user?.role === 'admin')
          );
          if (!items.length) return null;
          return (
            <div key={section}>
              <div style={S.navSection}>{section}</div>
              {items.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  style={({ isActive }) => ({
                    ...S.navLink,
                    ...(isActive ? S.navLinkActive : {}),
                  })}
                >
                  {({ isActive }) => (
                    <>
                      <div style={{ ...S.navIcon, ...(isActive ? S.navIconActive : {}) }}>
                        {item.icon}
                      </div>
                      {item.label}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          );
        })}
      </nav>

      {/* Bottom user card */}
      <div style={S.bottom}>
        <div style={S.userCard}>
          <div style={S.avatar}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <div style={S.userName}>{user?.name || 'User'}</div>
            <div style={S.userRole}>{user?.role}</div>
          </div>
        </div>
        <button
          style={S.logoutBtn}
          onClick={handleLogout}
          onMouseEnter={e => { e.target.style.background = '#FEF2F2'; e.target.style.borderColor = '#FCA5A5'; e.target.style.color = '#DC2626'; }}
          onMouseLeave={e => { e.target.style.background = 'none';    e.target.style.borderColor = '#E2E8F0'; e.target.style.color = '#64748B'; }}
        >
          🚪 Sign out
        </button>
      </div>
    </aside>
  );
}