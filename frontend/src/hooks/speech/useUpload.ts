import { useState } from "react";



const useUpload = () => {
    const [file, setFile] = useState<File | null>(null);
    
    const fileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const selectedFile = e.target.files?.[0];
            if (selectedFile && selectedFile.type.startsWith('audio/')) {
                setFile(selectedFile);
            } else if (selectedFile) {
                alert('Por favor, selecciona un archivo de audio válido');
                e.target.value = '';
            }
        };

        
    return {
        file,
        fileChange
    }
}

export default useUpload;