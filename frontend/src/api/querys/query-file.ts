
export const backendUrl = import.meta.env.VITE_API_URL;

export const getUrl = async (token: string, file: File) => {
    const urlResponse = await fetch(`${backendUrl}/transcription/upload-url`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({
            contentType: file.type,
            fileName: file.name
        })
    });
    return urlResponse;
}

export const uploadFile = async (url: string, file: File) => {
    const uploadResponse = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': file.type
        },
        body: file
    });
    return uploadResponse;
}

export const transcribeFile = async (token: string, key: string, fileName: string) => {
    const transcribeResponse = await fetch(`${backendUrl}/transcription/transcribe-file`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({
            s3Key: key,
            fileName: fileName
        })
    });
    return transcribeResponse;
}



export const saveTranscription = async (token: string, fullTranscript: string, userId: string) => {
    const response = await fetch(`${backendUrl}/transcription`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({
            transcription: fullTranscript,
            userId: userId
        })
    });
    return response;
}

export const getToken = async (idToken: string) => {
    const response = await fetch(`${backendUrl}/transcription/token`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': idToken,
        },
    });
    return response;
}

export const getTranscription = async (token: string, limit: number = 10, lastKey?: string) => {
    let url = `${backendUrl}/transcription?limit=${limit}`;
    if (lastKey) {
        url += `&lastKey=${encodeURIComponent(lastKey)}`;
    }

    const response = await fetch(url, {
        headers: {
            Authorization: token,
        }
    });
    return response;
}



export const getTranscriptionFile = async (token: string, key: string) => {
    const response = await fetch(`${backendUrl}/transcription/file?key=${encodeURIComponent(key)}`, {
        headers: {
            Authorization: token || '',
        }
    });
    return response;
}