import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export interface ProcessAttachment {
    id: string;
    process_id: string;
    file_name: string;
    file_path: string;
    file_size: number | null;
    mime_type: string | null;
    uploaded_by: string | null;
    created_at: string;
}

export function useProcessAttachments(processId?: string) {
    return useQuery({
        queryKey: ['process_attachments', processId],
        enabled: !!processId,
        queryFn: async () => {
            const { data, error } = await supabase
                .from('process_attachments')
                .select('*')
                .eq('process_id', processId)
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data as ProcessAttachment[];
        },
    });
}

export function useUploadAttachment(processId: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ file, userId }: { file: File; userId: string }) => {
            const ext = file.name.split('.').pop();
            const filePath = `${processId}/${Date.now()}_${file.name}`;

            const { error: uploadError } = await supabase.storage
                .from('process-attachments')
                .upload(filePath, file);
            if (uploadError) throw uploadError;

            const { error: dbError } = await supabase.from('process_attachments').insert({
                process_id: processId,
                file_name: file.name,
                file_path: filePath,
                file_size: file.size,
                mime_type: file.type,
                uploaded_by: userId,
            });
            if (dbError) throw dbError;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['process_attachments', processId] }),
    });
}

export function useDeleteAttachment(processId: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, filePath }: { id: string; filePath: string }) => {
            await supabase.storage.from('process-attachments').remove([filePath]);
            const { error } = await supabase.from('process_attachments').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['process_attachments', processId] }),
    });
}

export function useDownloadAttachment() {
    return useMutation({
        mutationFn: async ({ filePath, fileName }: { filePath: string; fileName: string }) => {
            const { data, error } = await supabase.storage
                .from('process-attachments')
                .download(filePath);
            if (error) throw error;
            const url = URL.createObjectURL(data);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            a.click();
            URL.revokeObjectURL(url);
        },
    });
}
