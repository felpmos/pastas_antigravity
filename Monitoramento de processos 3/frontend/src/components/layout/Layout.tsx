import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
    LayoutDashboard,
    Users,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Sun,
    Moon,
    Menu,
    X,
    Shield,
} from 'lucide-react';

export default function Layout() {
    const { profile, signOut, loading } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-emerald-500" />
            </div>
        );
    }

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    const navItems = [
        { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard', exact: true },
        ...(profile?.role === 'SUPER_ADMIN'
            ? [{ to: '/admin/users', icon: <Users size={20} />, label: 'Usuários' }]
            : []),
    ];

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo / Header */}
            <div className={`flex items-center border-b border-border h-16 px-4 ${collapsed ? 'justify-center' : 'justify-between'}`}>
                {!collapsed && (
                    <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 shrink-0 flex items-center justify-center rounded overflow-hidden">
                            <img src="/logo-dark.png" alt="Olimpia Logo" className="h-full w-full object-contain block dark:hidden" />
                            <img src="/logo-light.png" alt="Olimpia Logo" className="h-full w-full object-contain hidden dark:block" />
                        </div>
                        <div>
                            <p className="font-semibold text-base leading-tight">SeIA</p>
                        </div>
                    </div>
                )}
                {collapsed && (
                    <div className="h-8 w-8 shrink-0 flex items-center justify-center rounded overflow-hidden">
                        <img src="/logo-dark.png" alt="Olimpia Logo" className="h-full w-full object-contain block dark:hidden" />
                        <img src="/logo-light.png" alt="Olimpia Logo" className="h-full w-full object-contain hidden dark:block" />
                    </div>
                )}
                <button
                    onClick={() => setCollapsed(v => !v)}
                    className="hidden md:flex p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    title={collapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
                >
                    {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.exact}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                            } ${collapsed ? 'justify-center' : ''}`
                        }
                        title={collapsed ? item.label : undefined}
                    >
                        <span className="shrink-0">{item.icon}</span>
                        {!collapsed && <span>{item.label}</span>}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom area */}
            <div className="border-t border-border p-3 space-y-2">
                {/* Theme toggle */}
                <button
                    onClick={toggleTheme}
                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ${collapsed ? 'justify-center' : ''}`}
                    title={theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
                >
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    {!collapsed && <span>{theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}</span>}
                </button>

                {/* User info */}
                {!collapsed && (
                    <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-2xl border border-white/5">
                        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {(profile?.name || profile?.email || 'U')[0].toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium truncate">{profile?.name || profile?.email}</p>
                            {profile?.role && (
                                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                    {profile.role === 'SUPER_ADMIN' && <Shield size={9} className="text-red-400" />}
                                    {profile.role === 'SUPER_ADMIN' ? 'Super Admin' :
                                        profile.role === 'EDITOR' ? 'Editor' :
                                            profile.role === 'VIEWER' ? 'Visualizador' : 'Usuário'}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Sign out */}
                <button
                    onClick={handleSignOut}
                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors ${collapsed ? 'justify-center' : ''}`}
                    title="Sair"
                >
                    <LogOut size={18} />
                    {!collapsed && <span>Sair</span>}
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar - desktop */}
            <aside
                className={`hidden md:flex flex-col border-r border-border bg-card transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'
                    } shrink-0`}
            >
                <SidebarContent />
            </aside>

            {/* Sidebar - mobile (drawer) */}
            <aside
                className={`fixed inset-y-0 left-0 z-30 flex flex-col border-r border-border bg-card w-64 md:hidden transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <SidebarContent />
            </aside>

            {/* Main content */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
                {/* Mobile hamburger - floating */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden fixed top-3 left-3 z-10 p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-lg"
                >
                    {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
