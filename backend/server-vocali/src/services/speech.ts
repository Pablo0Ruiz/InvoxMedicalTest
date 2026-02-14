import { createSpeechmaticsJWT } from "@speechmatics/auth";

const apiKey = process.env.SPEECHMATICS_API_KEY;

export const generateToken = async () => {
  if (!apiKey) throw new Error("SPEECHMATICS_API_KEY is not defined");

  const jwt = await createSpeechmaticsJWT({
    type: "rt",
    apiKey: apiKey!,
    ttl: 3600,
  });

  return jwt;
};

export const transcribeAudioFile = async (audioUrl: string) => {
  if (!apiKey) throw new Error("SPEECHMATICS_API_KEY is not defined");

  const formData = new FormData();
  const config = {
    type: 'transcription',
    transcription_config: {
      language: 'es',
      operating_point: 'enhanced',
    },
    fetch_data: {
      url: audioUrl
    }
  };

  formData.append('config', JSON.stringify(config));

  try {
    const response = await fetch('https://asr.api.speechmatics.com/v2/jobs', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Speechmatics API Error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error submitting job:", error);
    throw error;
  }
}

export const getJobStatus = async (jobId: string) => {
  if (!apiKey) throw new Error("SPEECHMATICS_API_KEY is not defined");

  try {
    const response = await fetch(`https://asr.api.speechmatics.com/v2/jobs/${jobId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`Failed to check job status: ${response.status}`, errorText);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error checking job status:", error);
    return null;
  }
};

export const getJobTranscript = async (jobId: string) => {
  if (!apiKey) throw new Error("SPEECHMATICS_API_KEY is not defined");

  try {
    const response = await fetch(`https://asr.api.speechmatics.com/v2/jobs/${jobId}/transcript?format=json-v2`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get transcript: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching transcript:", error);
    throw error;
  }
};