import { GenerateRequest, GenerateResponse } from '../types';
import { MODEL_MAPPING } from '../constants';

export const generateConcept = async (params: GenerateRequest): Promise<GenerateResponse> => {
  // Map the enum to the actual model string expected by backend
  const modelName = MODEL_MAPPING[params.modelChoice];

  try {
    const response = await fetch('/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        images: params.images,
        prompt: params.prompt,
        aspectRatio: params.aspectRatio,
        modelName: modelName
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Server Error: ${response.status}`);
    }

    return {
      resultBase64: data.resultBase64,
      mimeType: data.mimeType,
      timing: data.timing
    };

  } catch (error: any) {
    console.error("Generation API Error:", error);
    throw new Error(error.message || "Gagal menghubungkan ke server.");
  }
};
