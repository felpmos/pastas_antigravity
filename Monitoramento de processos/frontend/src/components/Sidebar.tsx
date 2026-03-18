import { Sun, Moon, Database, LayoutDashboard, ChevronRight } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Sidebar({ isOpen }: { isOpen: boolean }) {
    const { theme, setTheme } = useTheme();
    const location = useLocation();
    const { user } = useAuth();

    const handleThemeToggle = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    ];

    const userInitials = user?.email
        ? user.email.split('@')[0].slice(0, 2).toUpperCase()
        : 'US';

    return (
        <div
            className={`h-full flex flex-col z-20 shrink-0 transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-[72px]'}`}
            style={{
                backgroundColor: '#0f172a',
                borderRight: '1px solid rgba(255,255,255,0.06)',
            }}
        >
            {/* Logo */}
            <div className={`px-4 py-5 flex items-center gap-3 ${!isOpen && 'justify-center'}`} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #3b83f7, #2563eb)' }}
                >
                    <Database className="w-5 h-5 text-white" />
                </div>
                {isOpen && (
                    <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                        <span className="font-bold text-lg text-white tracking-tight leading-none block">SeIA</span>
                        <span className="text-[10px] text-slate-500 font-medium tracking-widest uppercase">Olímpia</span>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {isOpen && (
                    <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 mb-2 animate-in fade-in duration-300">Menu</p>
                )}
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative"
                            style={{
                                backgroundColor: isActive
                                    ? 'rgba(59,131,247,0.15)'
                                    : 'transparent',
                                color: isActive ? '#3b83f7' : '#94a3b8',
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive) {
                                    (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.05)';
                                    (e.currentTarget as HTMLElement).style.color = '#cbd5e1';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                                    (e.currentTarget as HTMLElement).style.color = '#94a3b8';
                                }
                            }}
                        >
                            {isActive && (
                                <span
                                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full"
                                    style={{ backgroundColor: '#3b83f7' }}
                                />
                            )}
                            <item.icon className="w-4.5 h-4.5 shrink-0" style={{ width: '18px', height: '18px' }} />
                            {isOpen && (
                                <span className="font-medium text-sm flex-1 animate-in fade-in slide-in-from-left-2 duration-300">{item.name}</span>
                            )}
                            {(isActive && isOpen) && (
                                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="px-3 pb-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {/* Theme toggle */}
                <button
                    onClick={handleThemeToggle}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 mt-3 mb-3 ${!isOpen && 'justify-center'}`}
                    style={{ color: '#64748b' }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.05)';
                        (e.currentTarget as HTMLElement).style.color = '#94a3b8';
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                        (e.currentTarget as HTMLElement).style.color = '#64748b';
                    }}
                    title={!isOpen ? (theme === 'dark' ? 'Modo Claro' : 'Modo Escuro') : ''}
                >
                    {theme === 'dark' ? (
                        <>
                            <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                            {isOpen && <span className="text-xs font-medium animate-in fade-in duration-300">Modo Claro</span>}
                        </>
                    ) : (
                        <>
                            <Moon className="w-4 h-4 shrink-0" />
                            {isOpen && <span className="text-xs font-medium animate-in fade-in duration-300">Modo Escuro</span>}
                        </>
                    )}
                </button>

                {/* User info */}
                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${!isOpen && 'justify-center'}`} style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                    <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-md"
                        style={{ background: 'linear-gradient(135deg, #3b83f7, #8b5cf6)' }}
                    >
                        {userInitials}
                    </div>
                    {isOpen && (
                        <div className="flex-1 min-w-0 animate-in fade-in slide-in-from-left-2 duration-300">
                            <p className="text-xs font-semibold text-slate-300 truncate">
                                {user?.email?.split('@')[0] || 'Usuário'}
                            </p>
                            <p className="text-[10px] text-slate-600 truncate">
                                {user?.email || ''}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
