const TABLA_PITAGORICA = {
    A: 1, J: 1, S: 1,
    B: 2, K: 2, T: 2,
    C: 3, L: 3, U: 3,
    D: 4, M: 4, V: 4,
    E: 5, N: 5, W: 5,
    F: 6, O: 6, X: 6,
    G: 7, P: 7, Y: 7,
    H: 8, Q: 8, Z: 8,
    I: 9, R: 9
};

const VOCALES = ['A', 'E', 'I', 'O', 'U'];

const reducirNumero = (numero) => {
    while (numero > 9 && numero !== 11 && numero !== 22 && numero !== 33) {
        numero = String(numero)
            .split('')
            .reduce((suma, digito) => suma + Number(digito), 0);
    }
    return numero;
};

const normalizarTexto = (texto) => texto
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z]/g, '');

export const calcularNumeroVida = (fechaNacimiento) => {
    const fecha = new Date(fechaNacimiento);
    const digitos = `${fecha.getUTCDate()}${fecha.getUTCMonth() + 1}${fecha.getUTCFullYear()}`;

    const suma = digitos
        .split('')
        .reduce((total, digito) => total + Number(digito), 0);

    return reducirNumero(suma);
};

export const calcularNumeroExpresion = (nombreCompleto) => {
    const letras = normalizarTexto(nombreCompleto);

    const suma = letras
        .split('')
        .reduce((total, letra) => total + (TABLA_PITAGORICA[letra] || 0), 0);

    return reducirNumero(suma);
};

export const calcularNumeroAlma = (nombreCompleto) => {
    const letras = normalizarTexto(nombreCompleto);

    const suma = letras
        .split('')
        .filter((letra) => VOCALES.includes(letra))
        .reduce((total, letra) => total + (TABLA_PITAGORICA[letra] || 0), 0);

    return reducirNumero(suma);
};

export const calcularPuntajeCompatibilidad = (perfil1, perfil2) => {
    const diferencias =
        Math.abs(perfil1.numeroVida - perfil2.numeroVida) +
        Math.abs(perfil1.numeroExpresion - perfil2.numeroExpresion) +
        Math.abs(perfil1.numeroAlma - perfil2.numeroAlma);

    const puntaje = 100 - (diferencias * 5);

    return Math.max(0, Math.min(100, puntaje));
};
