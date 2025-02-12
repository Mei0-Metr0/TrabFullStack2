// Arquivo com funções utilitárias

export const capitalize = (text) => {
    // Retorna o texto com a primeira letra em maiúscula e o restante inalterado.
    return text.charAt(0).toUpperCase() + text.slice(1);
};

export const toUpperCaseText = (text) => {
    // Retorna o texto todo em letras maiúsculas.
    return text.toUpperCase();
};
