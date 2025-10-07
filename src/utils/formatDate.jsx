// Formata data para exibição no padrão brasileiro (dd/mm/yyyy)
export function formatDateToBrazilian(data) {
    if (!data) return '';

    // Se já estiver no formato dd/mm/yyyy, retorna direto
    if (typeof data === 'string' && data.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        return data;
    }

    const dateObj = new Date(data);
    if (isNaN(dateObj.getTime())) return '';

    return dateObj.toLocaleDateString('pt-BR');
}


// Converte uma data para o formato ISO (yyyy-MM-dd), com opção de somar dias
export function formatDateToISO(data, daysToAdd = 0) {
    if (!data) return '';

    const dateObj = new Date(data);
    dateObj.setDate(dateObj.getDate() + Number(daysToAdd));

    return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
}


// Converte para formato invertido (dd-yyyy-MM) — caso use em casos específicos
export function formatDateToInvertedISO(data, daysToAdd = 0) {
    if (!data) return '';

    // Tenta normalizar o formato da data antes de criar o objeto
    const parsedDate = typeof data === 'string' && data.includes('/')
        ? data.split('/').reverse().join('-') // transforma "07/10/2025" em "2025-10-07"
        : data;

    const dateObj = new Date(parsedDate);

    // Garante que a data é válida
    if (isNaN(dateObj)) return '';

    dateObj.setDate(dateObj.getDate() + Number(daysToAdd));

    // Retorna no formato YYYY-MM-DD
    return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
}

