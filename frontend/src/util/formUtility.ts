
export const validateText = (formData: FormData, name: string): string | undefined => {
    const value = (formData.get(name) as string | null)?.trim();
    return value ? value : undefined;
}

export const validateNumber = (formData: FormData, name: string): number | undefined => {
    const value = validateText(formData, name);
    if (value === undefined) {
        return undefined;
    }
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
}
