import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Users, UserPlus, Shield, Edit2, Trash2, CheckCircle, XCircle, Mail, Search } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Profile {
    id: string;
    name: string;
    email: string;
    role: string;
    sector: string | null;
    is_active: boolean;
    created_at: string;
    last_login_at: string | null;
}

const roleOptions = [
    { value: 'SUPER_ADMIN', label: 'Super Admin', color: 'text-red-400 bg-red-500/10', description: 'Acesso total ao sistema' },
    { value: 'EDITOR', label: 'Editor', color: 'text-blue-400 bg-blue-500/10', description: 'Cria e edita processos' },
    { value: 'VIEWER', label: 'Visualizador', color: 'text-slate-400 bg-slate-500/10', description: 'Apenas leitura' },
];

function getRoleBadge(role: string) {
    const r = roleOptions.find(x => x.value === role);
    return r ? (
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.color}`}>{r.label}</span>
    ) : <span className="text-xs text-slate-500">{role}</span>;
}

export default function AdminUsersPage() {
    const { profile: currentUser } = useAuth();
    const qc = useQueryClient();
    const [search, setSearch] = useState('');
    const [showInvite, setShowInvite] = useState(false);
    const [editUser, setEditUser] = useState<Profile | null>(null);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteName, setInviteName] = useState('');
    const [invitePassword, setInvitePassword] = useState('');
    const [inviteRole, setInviteRole] = useState('VIEWER');

    if (currentUser?.role !== 'SUPER_ADMIN') {
        return (
            <div className="flex items-center justify-center h-full p-12">
                <div className="text-center space-y-2">
                    <Shield size={40} className="mx-auto text-red-400" />
                    <h2 className="text-xl font-semibold">Acesso Negado</h2>
                    <p className="text-muted-foreground">Apenas Super Admins podem acessar esta página.</p>
                </div>
            </div>
        );
    }

    const { data: users, isLoading } = useQuery({
        queryKey: ['admin_profiles'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data as Profile[];
        },
    });

    const updateRole = useMutation({
        mutationFn: async ({ id, role }: { id: string; role: string }) => {
            const { error } = await supabase.from('profiles').update({ role }).eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin_profiles'] }); toast.success('Perfil atualizado!'); setEditUser(null); },
        onError: () => toast.error('Erro ao atualizar perfil.'),
    });

    const toggleActive = useMutation({
        mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
            const { error } = await supabase.from('profiles').update({ is_active }).eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin_profiles'] }); toast.success('Status alterado!'); },
    });

    const createUser = useMutation({
        mutationFn: async () => {
            const { data, error } = await supabase.functions.invoke('create-user', {
                body: {
                    name: inviteName || inviteEmail.split('@')[0],
                    email: inviteEmail,
                    password: invitePassword,
                    role: inviteRole
                }
            });
            if (error) throw error;
            if (data?.error) throw new Error(data.error);
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['admin_profiles'] });
            toast.success('Usuário criado com sucesso!');
            setShowInvite(false);
            setInviteEmail('');
            setInviteName('');
            setInvitePassword('');
            setInviteRole('VIEWER');
        },
        onError: (e: any) => toast.error(e.message || 'Erro ao criar usuário.'),
    });

    const filtered = users?.filter(u =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Users size={24} className="text-emerald-400" />
                        Gerenciar Usuários
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">Gerencie perfis, papéis e permissões dos usuários.</p>
                </div>
                <button
                    onClick={() => setShowInvite(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-emerald-900/20"
                >
                    <UserPlus size={16} /> Criar Usuário
                </button>
            </div>

            {/* Role legend */}
            <div className="flex flex-wrap gap-3">
                {roleOptions.map(r => (
                    <div key={r.value} className={`flex items-center gap-2 px-3 py-2 rounded-lg border border-border ${r.color.replace('text-', 'bg-').replace('-400', '-500/5')}`}>
                        <span className={`text-xs font-bold ${r.color}`}>{r.label}</span>
                        <span className="text-xs text-muted-foreground">{r.description}</span>
                    </div>
                ))}
            </div>

            {/* Search */}
            <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Buscar por nome ou email..."
                    className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                />
            </div>

            {/* Invite Modal */}
            {showInvite && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md space-y-4 shadow-2xl">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <UserPlus size={20} className="text-emerald-400" /> Criar Usuário
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Nome</label>
                                <input value={inviteName} onChange={e => setInviteName(e.target.value)} placeholder="Nome completo" className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-emerald-500/50" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Email *</label>
                                <input required type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="email@prefeitura.gov.br" className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-emerald-500/50" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Senha *</label>
                                <input required type="password" value={invitePassword} onChange={e => setInvitePassword(e.target.value)} placeholder="Mínimo 6 caracteres" className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-emerald-500/50" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Nível de Acesso</label>
                                <select value={inviteRole} onChange={e => setInviteRole(e.target.value)} className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-emerald-500/50">
                                    {roleOptions.map(r => <option key={r.value} value={r.value}>{r.label} — {r.description}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <button onClick={() => setShowInvite(false)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancelar</button>
                            <button
                                onClick={() => createUser.mutate()}
                                disabled={!inviteEmail || !invitePassword || createUser.isPending}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-md disabled:opacity-50 shadow-lg shadow-emerald-900/20"
                            >
                                {createUser.isPending ? 'Criando...' : 'Criar Usuário'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editUser && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md space-y-4 shadow-2xl">
                        <h2 className="text-lg font-semibold">Editar: {editUser.name}</h2>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Nível de Acesso</label>
                            <select
                                value={editUser.role}
                                onChange={e => setEditUser({ ...editUser, role: e.target.value })}
                                className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-emerald-500/50"
                            >
                                {roleOptions.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                            </select>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setEditUser(null)} className="px-4 py-2 text-sm text-muted-foreground">Cancelar</button>
                            <button
                                onClick={() => updateRole.mutate({ id: editUser.id, role: editUser.role })}
                                disabled={updateRole.isPending}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-md shadow-lg shadow-emerald-900/20"
                            >
                                Salvar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Users Table */}
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-500" />
                </div>
            ) : (
                <div className="border border-border rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 border-b border-border">
                            <tr>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Usuário</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Papel</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Criado em</th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Último Acesso</th>
                                <th className="text-center px-4 py-3 font-medium text-muted-foreground">Status</th>
                                <th className="px-4 py-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {filtered?.map((user, i) => (
                                <tr key={user.id} className={`border-b border-border last:border-0 ${i % 2 === 0 ? '' : 'bg-muted/20'} hover:bg-muted/30 transition-colors`}>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                                {(user.name || user.email || '?')[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-medium">{user.name || '—'}</p>
                                                <p className="text-xs text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">{getRoleBadge(user.role)}</td>
                                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                                        {format(new Date(user.created_at), 'dd/MM/yyyy')}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                                        {user.last_login_at ? format(new Date(user.last_login_at), 'dd/MM/yyyy HH:mm') : '—'}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => toggleActive.mutate({ id: user.id, is_active: !user.is_active })}
                                            disabled={user.id === currentUser?.id}
                                            title={user.is_active ? 'Desativar' : 'Ativar'}
                                            className="disabled:opacity-30"
                                        >
                                            {user.is_active
                                                ? <CheckCircle size={18} className="text-emerald-400 mx-auto" />
                                                : <XCircle size={18} className="text-red-400 mx-auto" />}
                                        </button>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => setEditUser(user)}
                                            disabled={user.id === currentUser?.id}
                                            className="p-1.5 rounded text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors disabled:opacity-30"
                                            title="Editar papel"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered?.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">Nenhum usuário encontrado.</div>
                    )}
                </div>
            )}
        </div>
    );
}
