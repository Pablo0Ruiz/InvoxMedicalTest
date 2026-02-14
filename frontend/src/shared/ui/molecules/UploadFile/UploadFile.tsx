import { Button, Input } from "@/shared/ui/atoms";
import {useUploadFile} from "@/hooks/uploadFile";
import { uploadFileVariants } from "./UploadFile.variants";

const UploadFile = () => {
    const { file, fileChange, uploading, status, handleSubmit } = useUploadFile();
    
    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className={uploadFileVariants.default}>
                    <Input
                        type="file"
                        accept="audio/*,.mp3,.wav,.ogg,.m4a,.flac"
                        onChange={fileChange}
                        className="hidden"
                        id="audio-upload"
                    />
                    <label
                        htmlFor="audio-upload"
                        className={uploadFileVariants.label}
                    >
                        <span className="text-4xl">☁️</span>
                        <span className="text-gray-300 font-medium">
                            {file ? file.name : "Haz clic para seleccionar un audio"}
                        </span>
                        <span className="text-xs text-gray-500">
                            MP3, WAV, OGG, M4A up to 20MB
                        </span>
                    </label>
                </div>

                {status && (
                    <div className={`text-sm text-center p-2 rounded ${status.includes('Error') ? 'bg-red-900/50 text-red-200' : 'bg-blue-900/50 text-blue-200'}`}>
                        {status}
                    </div>
                )}

                <Button
                    type="submit"
                    disabled={!file || uploading}
                    variant="primary"
                    size="lg"
                    className="w-full"
                >
                    {uploading ? 'Procesando...' : 'Subir y Transcribir'}
                </Button>
            </form>
        </div>
    );
};

export default UploadFile;