import { useState } from 'react';
import StatsCards from '../components/dashboard/StatsCards';
import ProcessTable from '../components/processes/ProcessTable';
import ProcessFormModal from '../components/processes/ProcessFormModal';
import { useProcesses } from '../hooks/useProcesses';
import { useAuth } from '../context/AuthContext';
import { Plus, Search, Filter } from 'lucide-react';

export default function Dashboard() {
    const { profile } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [orderBy, setOrderBy] = useState('created_at');
    const [orderDir, setOrderDir] = useState<'asc' | 'desc'>('desc');
    const [showFilters, setShowFilters] = useState(false);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [priorityFilter, setPriorityFilter] = useState<boolean | null>(null);

    const { data: processes, isLoading } = useProcesses({
        searchQuery,
        orderBy,
        orderDirection: orderDir,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        status: statusFilter || undefined,
        isPriority: priorityFilter || undefined,
    });

    const canCreate = profile?.role !== 'VIEWER';

    const handleSortChange = (newOrderBy: string, newDir: 'asc' | 'desc') => {
        setOrderBy(newOrderBy);
        setOrderDir(newDir);
    };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <p className="text-muted-foreground text-sm mt-1">Visão geral e monitoramento de processos Sei</p>
                </div>
                {canCreate && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-emerald-900/20"
                    >
                        <Plus size={18} />
                        Novo Processo
                    </button>
                )}
            </div>

            <StatsCards
                activeStatus={statusFilter}
                activePriority={priorityFilter}
                onFilterChange={(filter) => {
                    if (filter === null) {
                        setStatusFilter(null);
                        setPriorityFilter(null);
                    } else {
                        setStatusFilter(filter.status ?? null);
                        setPriorityFilter(filter.isPriority ?? null);
                    }
                }}
            />

            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar por SEI, assunto, referência..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-card border border-border rounded-lg pl-9 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                        />
                    </div>
                    <div className="flex gap-2 relative">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 border px-3 py-2 rounded-lg text-sm font-medium transition-colors ${showFilters || dateFrom || dateTo
                                ? 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600'
                                : 'bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted'
                                }`}
                        >
                            <Filter size={16} />
                            Filtros de Data
                            {(dateFrom || dateTo) && (
                                <span className="flex items-center justify-center w-5 h-5 ml-1 text-[10px] bg-white text-slate-700 rounded-full font-bold">
                                    {(dateFrom ? 1 : 0) + (dateTo ? 1 : 0)}
                                </span>
                            )}
                        </button>

                        {showFilters && (
                            <div className="absolute right-0 top-full mt-2 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-xl z-50 p-4 space-y-4">
                                <div>
                                    <label className="text-xs font-medium text-slate-400 mb-1.5 block">Data Inicial</label>
                                    <input
                                        type="date"
                                        value={dateFrom}
                                        onChange={(e) => setDateFrom(e.target.value)}
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50 [color-scheme:dark]"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-400 mb-1.5 block">Data Final</label>
                                    <input
                                        type="date"
                                        value={dateTo}
                                        onChange={(e) => setDateTo(e.target.value)}
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50 [color-scheme:dark]"
                                    />
                                </div>
                                <button
                                    onClick={() => {
                                        setDateFrom('');
                                        setDateTo('');
                                        setShowFilters(false);
                                    }}
                                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Limpar Filtro
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <ProcessTable
                    processes={processes || []}
                    isLoading={isLoading}
                    onSortChange={handleSortChange}
                    currentOrderBy={orderBy}
                    currentDirection={orderDir}
                />
            </div>

            {canCreate && (
                <ProcessFormModal open={isModalOpen} onOpenChange={setIsModalOpen} />
            )}
        </div>
    );
}
