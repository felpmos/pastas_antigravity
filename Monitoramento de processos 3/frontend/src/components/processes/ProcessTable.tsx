import React, { useState, useRef, useEffect } from 'react';
import { Process } from '../../hooks/useProcesses';
import { Copy, ChevronDown, Calendar, Clock, TrendingDown, ArrowUpDown, ChevronRight, GitBranch } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useProcessLinks } from '../../hooks/useProcessLinks';

interface ProcessTableProps {
    processes: Process[];
    isLoading: boolean;
    onSortChange?: (orderBy: string, direction: 'asc' | 'desc') => void;
    currentOrderBy?: string;
    currentDirection?: 'asc' | 'desc';
}

const statusMap: Record<string, { label: string; color: string }> = {
    AWAITING: { label: 'Aguardando', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
    IN_PROGRESS: { label: 'Em Andamento', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    AWAITING_SIGNATURE: { label: 'Aguard. Assinatura', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    COMPLETED: { label: 'Concluído', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    ARCHIVED: { label: 'Arquivado', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
};

interface DateSortMenuProps {
    onSelect: (orderBy: string, dir: 'asc' | 'desc') => void;
    current: string;
}

function DateSortMenu({ onSelect, current }: DateSortMenuProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const options = [
        { label: 'Últimos adicionados', icon: <TrendingDown size={14} />, orderBy: 'created_at', dir: 'desc' as const },
        { label: 'Primeiros adicionados', icon: <ArrowUpDown size={14} />, orderBy: 'created_at', dir: 'asc' as const },
        { label: 'Últimos modificados', icon: <Clock size={14} />, orderBy: 'updated_at', dir: 'desc' as const },
        { label: 'Data do processo (recente)', icon: <Calendar size={14} />, orderBy: 'date', dir: 'desc' as const },
        { label: 'Data do processo (antiga)', icon: <Calendar size={14} />, orderBy: 'date', dir: 'asc' as const },
    ];

    return (
        <div ref={ref} className="relative inline-flex items-center">
            <button
                onClick={(e) => { e.stopPropagation(); setOpen(v => !v); }}
                className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors group cursor-pointer"
            >
                Data
                <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
                <div className="absolute top-full left-0 mt-1 bg-popover border border-border rounded-lg shadow-xl z-50 min-w-[200px] py-1 overflow-hidden">
                    {options.map((opt) => (
                        <button
                            key={opt.orderBy + opt.dir}
                            onClick={() => { onSelect(opt.orderBy, opt.dir); setOpen(false); }}
                            className={`flex items-center gap-2.5 w-full px-3 py-2 text-sm text-left transition-colors cursor-pointer ${current === opt.orderBy + opt.dir
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                        >
                            {opt.icon}
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// Row for subprocess expanded inline
function SubprocessRow({ parentId, navigate, colWidths }: {
    parentId: string;
    navigate: ReturnType<typeof useNavigate>;
    colWidths: { id: number; sei: number; assunto: number; status: number; data: number };
}) {
    const { data: links, isLoading } = useProcessLinks(parentId);

    if (isLoading) {
        return (
            <tr>
                <td colSpan={5} className="py-2 px-4 pl-10">
                    <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-emerald-500" />
                </td>
            </tr>
        );
    }

    const activeLinks = (links || []).filter(l =>
        l?.child_process && l.child_process.id && !l.child_process.deleted_at
    );

    if (activeLinks.length === 0) {
        return (
            <tr>
                <td colSpan={5} className="py-2 px-8 text-xs text-muted-foreground italic">
                    Nenhum subprocesso encontrado.
                </td>
            </tr>
        );
    }

    return (
        <>
            {activeLinks.map((link) => {
                const cp = link.child_process!;
                const st = statusMap[cp.status ?? 'AWAITING'] ?? statusMap['AWAITING'];
                return (
                    <tr
                        key={link.id}
                        onClick={() => navigate(`/process/${cp.id}`)}
                        className="hover:bg-emerald-500/5 transition-colors cursor-pointer bg-slate-900/30"
                        title="Ver subprocesso"
                    >
                        <td style={{ width: colWidths.id, minWidth: colWidths.id, maxWidth: colWidths.id }} className="px-4 py-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1 pl-4 text-emerald-400">
                                <GitBranch size={12} className="shrink-0" />
                            </div>
                        </td>
                        <td style={{ width: colWidths.sei, minWidth: colWidths.sei, maxWidth: colWidths.sei }} className="px-4 py-3 font-mono text-xs text-muted-foreground truncate">
                            {cp.sei_number}
                        </td>
                        <td style={{ width: colWidths.assunto, minWidth: colWidths.assunto, maxWidth: colWidths.assunto }} className="px-4 py-3 truncate">
                            <div className="flex items-center gap-2 pl-2">
                                <span className="text-slate-500 text-xs font-mono">└─</span>
                                <span className="text-sm text-foreground/80 truncate">{cp.subject}</span>
                            </div>
                        </td>
                        <td style={{ width: colWidths.status, minWidth: colWidths.status, maxWidth: colWidths.status }} className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${st.color}`}>
                                {st.label}
                            </span>
                        </td>
                        <td style={{ width: colWidths.data, minWidth: colWidths.data, maxWidth: colWidths.data }} className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                            {cp.date ? format(new Date(cp.date + 'T00:00:00'), 'dd/MM/yyyy') : '—'}
                        </td>
                    </tr>
                );
            })}
        </>
    );
}

// Lazy expand button
function ExpandButton({ processId, isExpanded, onToggle }: {
    processId: string;
    isExpanded: boolean;
    onToggle: (e: React.MouseEvent) => void;
}) {
    const { data: links } = useProcessLinks(processId);
    const hasSubprocesses = (links || []).filter(l =>
        l?.child_process && l.child_process.id && !l.child_process.deleted_at
    ).length > 0;

    if (!hasSubprocesses) {
        return <span className="w-4 shrink-0" />;
    }

    return (
        <button
            onClick={onToggle}
            className="shrink-0 p-0.5 rounded hover:bg-emerald-500/20 text-emerald-400 transition-colors cursor-pointer"
            title={isExpanded ? 'Recolher subprocessos' : 'Expandir subprocessos'}
        >
            {isExpanded
                ? <ChevronDown size={14} />
                : <ChevronRight size={14} />}
        </button>
    );
}

export default function ProcessTable({ processes, isLoading, onSortChange, currentOrderBy = 'created_at', currentDirection = 'desc' }: ProcessTableProps) {
    const navigate = useNavigate();
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    const [colWidths, setColWidths] = useState({
        id: 100,
        sei: 180,
        assunto: 450,
        status: 220,
        data: 150
    });

    const isResizing = useRef(false);
    const startX = useRef(0);
    const startWidth = useRef(0);
    const currentCol = useRef<string | null>(null);

    const startResize = (e: React.MouseEvent, col: keyof typeof colWidths) => {
        e.stopPropagation();
        e.preventDefault();
        isResizing.current = true;
        startX.current = e.pageX;
        startWidth.current = colWidths[col];
        currentCol.current = col;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isResizing.current || !currentCol.current) return;
        requestAnimationFrame(() => {
            const diff = e.pageX - startX.current;
            setColWidths(prev => ({
                ...prev,
                [currentCol.current!]: Math.max(80, startWidth.current + diff)
            }));
        });
    };

    const handleMouseUp = () => {
        isResizing.current = false;
        currentCol.current = null;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    const toggleExpand = (e: React.MouseEvent, processId: string) => {
        e.stopPropagation();
        setExpandedRows(prev => {
            const next = new Set(prev);
            if (next.has(processId)) {
                next.delete(processId);
            } else {
                next.add(processId);
            }
            return next;
        });
    };

    const copySei = (sei: string, e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(sei);
        toast.success('Número SEI copiado!');
    };

    if (isLoading) {
        return (
            <div className="flex justify-center p-12">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-emerald-500" />
            </div>
        );
    }

    if (processes.length === 0) {
        return (
            <div className="text-center p-12 border border-border rounded-lg bg-muted/5">
                <p className="text-muted-foreground">Nenhum processo encontrado.</p>
            </div>
        );
    }

    const ColSep = ({ col }: { col: keyof typeof colWidths }) => (
        <div
            onMouseDown={(e) => startResize(e, col)}
            className="absolute right-0 top-0 bottom-0 w-[4px] cursor-col-resize z-10 flex items-center justify-center group/sep"
            title="Arrastar para redimensionar"
        >
            <div className="w-px h-3/5 bg-border group-hover/sep:bg-emerald-500 group-hover/sep:w-[2px] transition-all rounded-full" />
        </div>
    );

    return (
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col h-full w-full">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse table-fixed">
                    <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border">
                        <tr>
                            <th style={{ width: colWidths.id }} className="relative px-4 py-3 font-medium select-none truncate">
                                #
                                <ColSep col="id" />
                            </th>
                            <th style={{ width: colWidths.sei }} className="relative px-4 py-3 font-medium select-none truncate">
                                SEI
                                <ColSep col="sei" />
                            </th>
                            <th style={{ width: colWidths.assunto }} className="relative px-4 py-3 font-medium select-none truncate">
                                Assunto
                                <ColSep col="assunto" />
                            </th>
                            <th style={{ width: colWidths.status }} className="relative px-4 py-3 font-medium select-none truncate">
                                Status
                                <ColSep col="status" />
                            </th>
                            <th style={{ width: colWidths.data }} className="relative px-4 py-3 font-medium select-none truncate">
                                {onSortChange ? (
                                    <DateSortMenu
                                        current={currentOrderBy + currentDirection}
                                        onSelect={onSortChange}
                                    />
                                ) : 'Data'}
                                <ColSep col="data" />
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {processes.map((process) => {
                            const st = statusMap[process.status ?? 'AWAITING'] ?? statusMap['AWAITING'];
                            const isExpanded = expandedRows.has(process.id);
                            return (
                                <React.Fragment key={process.id}>
                                    <tr
                                        onClick={() => navigate(`/process/${process.id}`)}
                                        className="hover:bg-muted/30 transition-colors cursor-pointer group"
                                    >
                                        <td style={{ width: colWidths.id, minWidth: colWidths.id, maxWidth: colWidths.id }} className="px-4 py-3 text-xs text-muted-foreground truncate">
                                            <div className="flex items-center gap-1">
                                                <ExpandButton
                                                    processId={process.id}
                                                    isExpanded={isExpanded}
                                                    onToggle={(e) => toggleExpand(e, process.id)}
                                                />
                                                <span className="font-medium text-foreground">{process.sequential_id}</span>
                                            </div>
                                        </td>
                                        <td style={{ width: colWidths.sei, minWidth: colWidths.sei, maxWidth: colWidths.sei }} className="px-4 py-3 font-mono text-xs font-medium text-foreground truncate">
                                            <button
                                                onClick={(e) => copySei(process.sei_number, e)}
                                                className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors cursor-pointer w-full text-left"
                                                title={process.sei_number}
                                            >
                                                <span className="truncate block">{process.sei_number}</span>
                                                <Copy size={11} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                            </button>
                                        </td>
                                        <td style={{ width: colWidths.assunto, minWidth: colWidths.assunto, maxWidth: colWidths.assunto }} className="px-4 py-3 truncate">
                                            <div className="font-medium text-foreground truncate" title={process.subject}>
                                                {process.subject}
                                            </div>
                                            <div className="text-xs text-muted-foreground truncate" title={process.reference_number || 'Sem referência'}>
                                                {process.reference_number || 'Sem referência'}
                                            </div>
                                        </td>
                                        <td style={{ width: colWidths.status, minWidth: colWidths.status, maxWidth: colWidths.status }} className="px-4 py-3">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${st.color} truncate max-w-full`}>
                                                {st.label}
                                            </span>
                                        </td>
                                        <td style={{ width: colWidths.data, minWidth: colWidths.data, maxWidth: colWidths.data }} className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                                            {process.date ? format(new Date(process.date + 'T00:00:00'), 'dd/MM/yyyy') : '—'}
                                        </td>
                                    </tr>
                                    {isExpanded && (
                                        <SubprocessRow
                                            parentId={process.id}
                                            navigate={navigate}
                                            colWidths={colWidths}
                                        />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
