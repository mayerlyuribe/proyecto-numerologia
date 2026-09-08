const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const generarInterpretacion = async (prompt, intentos = 3) => {
    for (let intento = 1; intento <= intentos; intento++) {
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

        if (response.ok) {
            const texto = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!texto) {
                throw new Error('Gemini no devolvio una interpretacion valida');
            }
            return texto;
        }

        const esSaturacion = response.status === 503
            || /high demand|overloaded/i.test(data?.error?.message || '');

        // Si es el último intento, o el error no es de saturación, se rinde ya.
        if (!esSaturacion || intento === intentos) {
            throw new Error(data?.error?.message || 'Error al consultar la API de Gemini');
        }

        // Espera progresiva antes de reintentar: 1s, 2s, 4s...
        await esperar(1000 * 2 ** (intento - 1));
    }
};