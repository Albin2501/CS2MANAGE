export function formatPrice(number: number, bool: boolean) {
    if (bool) return `${number.toFixed(2)}€`;
    else if (number > 0) return `+${number.toFixed(2)}€`;
    else return `${number.toFixed(2)}€`;
}

export function formatDate(date: Date) {
    return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
}