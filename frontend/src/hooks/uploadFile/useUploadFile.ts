import useUpload from "@/hooks/speech/useUpload";
import { useState } from "react";
import { getUrl, transcribeFile, uploadFile } from '@/api/querys/query-file';
import { fetchAuthSession } from 'aws-amplify/auth';

const useUploadFile = () => {
    const { file, fileChange } = useUpload();
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        setStatus("Iniciando carga...");

        try {
            const session = await fetchAuthSession();
            const token = session.tokens?.idToken?.toString();

            if (!token) throw new Error("No auth token found");

            setStatus("Obteniendo URL de carga...");
            const urlResponse = await getUrl(token, file);

            if (!urlResponse.ok) throw new Error("Failed to get upload URL");
            const { uploadUrl, key } = await urlResponse.json();

            setStatus("Subiendo archivo a S3...");
            const uploadResponse = await uploadFile(uploadUrl, file);

            if (!uploadResponse.ok) throw new Error("Failed to upload file to S3");

            setStatus("Iniciando transcripción...");
            const transcribeResponse = await transcribeFile(token, key, file.name);

            if (!transcribeResponse.ok) throw new Error("Failed to start transcription");

            setStatus("¡Archivo subido y procesando!");
            setTimeout(() => {
                setStatus(null);
                window.location.reload();
            }, 2000);

        } catch (error) {
            console.error("Upload error:", error);
            setStatus("Error durante el proceso.");
        } finally {
            setUploading(false);
        }
    };

    return {
        file,
        fileChange,
        uploading,
        status,
        handleSubmit
    };
}

export default useUploadFile;