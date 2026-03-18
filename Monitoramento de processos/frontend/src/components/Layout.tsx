import React from 'react';
import { Sidebar } from './Sidebar';
import { LogOut, Bell, Menu } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Mapeamento de rotas para títulos de breadcrumb
const routeTitles: Record<string, string> = {
    '/': 'Dashboard',
    '/kanban': 'Quadro Kanban',
    '/relatorios': 'Relatórios',
};

export function Layout({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = React.useState(true);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const pageTitle = routeTitles[location.pathname] || 'Painel';
    const userInitials = user?.email
        ? user.email.split('@')[0].slice(0, 2).toUpperCase()
        : 'US';

    return (
        <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
            <Sidebar isOpen={sidebarOpen} />

            <div className="flex-1 flex flex-col relative overflow-y-auto overflow-x-hidden min-w-0">
                {/* Header SeIA */}
                <header
                    className="h-14 flex items-center justify-between px-6 sticky top-0 z-10 shrink-0"
                    style={{
                        backgroundColor: 'var(--card)',
                        borderBottom: '1px solid var(--border)',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}
                >
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-4 text-sm">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                            title={sidebarOpen ? "Recolher menu" : "Expandir menu"}
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-2">
                            <span style={{ color: 'var(--muted-foreground)' }} className="font-medium">SeIA</span>
                            <span style={{ color: 'var(--border)' }}>/</span>
                            <span style={{ color: 'var(--foreground)' }} className="font-semibold">{pageTitle}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {/* Notification bell */}
                        <button
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                            style={{ color: 'var(--muted-foreground)' }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--muted)';
                                (e.currentTarget as HTMLElement).style.color = 'var(--foreground)';
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                                (e.currentTarget as HTMLElement).style.color = 'var(--muted-foreground)';
                            }}
                            title="Notificações"
                        >
                            <Bell className="w-4 h-4" />
                        </button>

                        {/* Divider */}
                        <div className="w-px h-5 mx-1" style={{ backgroundColor: 'var(--border)' }} />

                        {/* User email */}
                        <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
                            {user?.email?.split('@')[0] || 'Usuário'}
                        </span>

                        {/* Avatar */}
                        <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                            style={{ background: 'linear-gradient(135deg, #3b83f7, #8b5cf6)' }}
                        >
                            {userInitials}
                        </div>

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors ml-1"
                            style={{ color: 'var(--muted-foreground)' }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(239,68,68,0.1)';
                                (e.currentTarget as HTMLElement).style.color = '#ef4444';
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                                (e.currentTarget as HTMLElement).style.color = 'var(--muted-foreground)';
                            }}
                            title="Sair do sistema"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </header>

                {/* Main content */}
                <main className="flex-1 p-6 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}
