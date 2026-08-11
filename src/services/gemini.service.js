export const generarInterpretacion = async (prompt) => {
    const response = await fetch(`${process.env.GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [
                {
                    parts: [{ text: prompt }]
                }
            ]
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data?.error?.message || 'Error al consultar la API de Gemini');
    }

    const texto = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!texto) {
        throw new Error('Gemini no devolvio una interpretacion valida');
    }

    return texto;
};
