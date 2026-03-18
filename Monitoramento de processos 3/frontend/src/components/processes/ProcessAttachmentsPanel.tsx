import { useState, useRef } from 'react';
import { useProcessAttachments, useUploadAttachment, useDeleteAttachment, useDownloadAttachment } from '../../hooks/useProcessAttachments';
import { useAddProcessUpdate } from '../../hooks/useProcess';
import { useAuth } from '../../context/AuthContext';
import { Paperclip, Upload, Trash2, Download, FileText, Image, File } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface ProcessAttachmentsPanelProps {
    processId: string;
}

function getFileIcon(mimeType: string | null) {
    if (!mimeType) return <File size={16} className="text-slate-400" />;
    if (mimeType.startsWith('image/')) return <Image size={16} className="text-blue-400" />;
    if (mimeType.includes('pdf')) return <FileText size={16} className="text-red-400" />;
    return <FileText size={16} className="text-slate-400" />;
}

function formatBytes(bytes: number | null) {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
}

export default function ProcessAttachmentsPanel({ processId }: ProcessAttachmentsPanelProps) {
    const { profile } = useAuth();
    const { data: attachments, isLoading } = useProcessAttachments(processId);
    const { mutateAsync: addUpdate } = useAddProcessUpdate();
    const upload = useUploadAttachment(processId);
    const deleteAtt = useDeleteAttachment(processId);
    const download = useDownloadAttachment();
    const fileRef = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);

    const canEdit = profile?.role !== 'VIEWER';

    const handleFiles = async (files: FileList | null) => {
        if (!files || !profile) return;
        for (const file of Array.from(files)) {
            if (file.size > 52428800) {
                toast.error(`${file.name} excede o limite de 50MB.`);
                continue;
            }
            await upload.mutateAsync({ file, userId: profile.id });
            await addUpdate({
                process_id: processId,
                content: `Anexo adicionado: ${file.name}`,
                created_by: profile.id,
                is_system: true,
            });
            toast.success(`${file.name} enviado!`);
        }
    };

    return (
        <div className="space-y-3">
            {canEdit && (
                <div
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
                    onClick={() => fileRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${dragging
                        ? 'border-emerald-400 bg-emerald-500/10'
                        : 'border-slate-700 hover:border-emerald-500 hover:bg-emerald-500/5'
                        }`}
                >
                    <Upload size={20} className="mx-auto mb-2 text-slate-400" />
                    <p className="text-sm text-slate-400">Arraste arquivos aqui ou <span className="text-emerald-400">clique para selecionar</span></p>
                    <p className="text-xs text-slate-500 mt-1">PDF, Word, Excel, Imagens — máx. 50MB por arquivo</p>
                    <input
                        ref={fileRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => handleFiles(e.target.files)}
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp,.txt"
                    />
                </div>
            )}

            {isLoading ? (
                <div className="flex justify-center py-4">
                    <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-emerald-500" />
                </div>
            ) : attachments && attachments.length > 0 ? (
                <div className="space-y-2">
                    {attachments.map((att) => (
                        <div key={att.id} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 group">
                            {getFileIcon(att.mime_type)}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-200 truncate">{att.file_name}</p>
                                <p className="text-xs text-slate-500">
                                    {formatBytes(att.file_size)} · {format(new Date(att.created_at), 'dd/MM/yyyy HH:mm')}
                                </p>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => download.mutate({ filePath: att.file_path, fileName: att.file_name })}
                                    className="p-1.5 rounded text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                                    title="Baixar"
                                >
                                    <Download size={14} />
                                </button>
                                {canEdit && (
                                    <button
                                        onClick={async () => {
                                            if (confirm(`Excluir "${att.file_name}"?`)) {
                                                await deleteAtt.mutateAsync({ id: att.id, filePath: att.file_path });
                                                await addUpdate({
                                                    process_id: processId,
                                                    content: `Anexo removido: ${att.file_name}`,
                                                    created_by: profile.id,
                                                    is_system: true,
                                                });
                                                toast.success('Anexo removido.');
                                            }
                                        }}
                                        className="p-1.5 rounded text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                        title="Excluir"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-6 text-slate-500 text-sm flex flex-col items-center gap-2">
                    <Paperclip size={24} className="opacity-40" />
                    <p>Nenhum anexo ainda.</p>
                </div>
            )}
        </div>
    );
}
