import { useState } from 'react';
import { FileText, Clock, CheckCircle, AlertCircle, ChevronDown } from 'lucide-react';
import { useProcesses } from '../../hooks/useProcesses';

interface StatsCardsProps {
    onFilterChange?: (filter: { status?: string; isPriority?: boolean } | null) => void;
    activeStatus?: string | null;
    activePriority?: boolean | null;
}

export default function StatsCards({ onFilterChange, activeStatus, activePriority }: StatsCardsProps) {
    const { data: processes } = useProcesses();
    const [collapsed, setCollapsed] = useState(false);

    const total = processes?.length || 0;
    const inProgress = processes?.filter(p => p.status === 'IN_PROGRESS' || p.status === 'AWAITING_SIGNATURE' || p.status === 'AWAITING').length || 0;
    const completed = processes?.filter(p => p.status === 'COMPLETED').length || 0;
    const priority = processes?.filter(p => p.is_priority && p.status !== 'COMPLETED' && p.status !== 'ARCHIVED').length || 0;

    // Overall progress percentage
    const progressPct = total > 0 ? Math.round((completed / total) * 100) : 0;

    const cards = [
        {
            id: 'total',
            label: 'Total de Processos',
            value: total,
            icon: <FileText size={18} className="text-emerald-400" />,
            subtitle: `${inProgress} em andamento`,
            gradient: 'from-emerald-500/20 to-transparent',
            borderColor: 'border-emerald-500/20',
            activeBorderColor: 'border-emerald-500 shadow-emerald-500/20',
            filter: null,
            isActive: activeStatus === null && activePriority === null
        },
        {
            id: 'priority',
            label: 'Prioritários',
            value: priority,
            icon: <AlertCircle size={18} className="text-amber-400" />,
            subtitle: total > 0 ? `${Math.round((priority / total) * 100)}% do total` : '0% do total',
            gradient: 'from-amber-500/15 to-transparent',
            borderColor: 'border-amber-500/20',
            activeBorderColor: 'border-amber-500 shadow-amber-500/20',
            filter: { isPriority: true },
            isActive: activePriority === true
        },
        {
            id: 'in_progress',
            label: 'Em Andamento',
            value: inProgress,
            icon: <Clock size={18} className="text-blue-400" />,
            subtitle: total > 0 ? `${Math.round((inProgress / total) * 100)}% do total` : '0% do total',
            gradient: 'from-blue-500/15 to-transparent',
            borderColor: 'border-blue-500/20',
            activeBorderColor: 'border-blue-500 shadow-blue-500/20',
            filter: { status: 'IN_PROGRESS' },
            isActive: activeStatus === 'IN_PROGRESS'
        },
        {
            id: 'completed',
            label: 'Concluídos',
            value: completed,
            icon: <CheckCircle size={18} className="text-emerald-400" />,
            subtitle: `${progressPct}% concluído`,
            gradient: 'from-emerald-500/15 to-transparent',
            borderColor: 'border-emerald-500/20',
            activeBorderColor: 'border-emerald-500 shadow-emerald-500/20',
            showProgress: true,
            progressPct,
            filter: { status: 'COMPLETED' },
            isActive: activeStatus === 'COMPLETED'
        },
    ];

    return (
        <div className="mb-6">
            {/* Cabeçalho colapsável */}
            <button
                onClick={() => setCollapsed(v => !v)}
                className="flex items-center gap-2 mb-3 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors group"
            >
                <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${collapsed ? '-rotate-90' : ''}`}
                />
                <span>{collapsed ? 'Mostrar painel de estatísticas' : 'Ocultar painel de estatísticas'}</span>
            </button>

            {/* Grid de cards */}
            {!collapsed && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {cards.map((card) => (
                        <button
                            key={card.id}
                            onClick={() => onFilterChange?.(card.filter)}
                            className={`text-left rounded-xl border ${card.isActive ? card.activeBorderColor : card.borderColor} bg-card relative overflow-hidden p-5 flex flex-col justify-between gap-3 transition-all hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
                        >
                            {/* Gradient glow */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} pointer-events-none transition-opacity ${card.isActive ? 'opacity-100' : 'opacity-50'}`} />

                            <div className="relative flex items-center justify-between">
                                <div className={`flex items-center gap-2 text-sm font-medium ${card.isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                                    {card.icon}
                                    {card.label}
                                </div>
                            </div>

                            <div className="relative">
                                <p className={`text-3xl font-bold tracking-tight ${card.isActive ? 'text-foreground' : ''}`}>{card.value}</p>
                                <p className={`text-xs mt-0.5 ${card.isActive ? 'text-foreground/80' : 'text-muted-foreground'}`}>{card.subtitle}</p>
                            </div>

                            {card.showProgress && total > 0 && (
                                <div className="relative space-y-1">
                                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
                                            style={{ width: `${card.progressPct}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
