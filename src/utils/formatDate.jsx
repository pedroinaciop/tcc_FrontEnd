export function formattedFieldDate(data) {
    if (!data) return '';

    if (typeof data === 'string' && data.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        return data;
    }

    const dateObj = new Date(data);
    if (isNaN(dateObj.getTime())) return '';

    return dateObj.toLocaleDateString('pt-BR');
}

export function formattedFieldDateDefault(data) {
    if (!data) return '';

    const dateObj = new Date(data);
    data = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
    
    return data;
}