import { useEffect, useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const useGeminiSummary = (highlights) => {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGeminiSummary = async () => {
      if (!highlights || typeof highlights !== 'object') return;

      try {
        setLoading(true);

        const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'models/gemini-pro' });

        const prompt = `
You are a product description writer.

Below is structured product highlight data grouped by feature sections. 
Summarize this into a short, fluent, customer-friendly paragraph for an e-commerce product page. 
Avoid technical repetition. Return only one paragraph.

Here is the data:
${JSON.stringify(highlights, null, 2)}
        `;

        const result = await model.generateContent({
          contents: [{ parts: [{ text: prompt }] }],
        });

        const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text || 'No summary available.';
        setSummary(text);
      } catch (err) {
        console.error('Gemini error:', err);
        setSummary('Sorry, something went wrong while generating summary.');
      } finally {
        setLoading(false);
      }
    };

    fetchGeminiSummary();
  }, [highlights]);

  return { summary, loading };
};

export default useGeminiSummary;
