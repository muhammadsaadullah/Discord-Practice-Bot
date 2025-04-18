// utils/formatters.ts
// Formats moni in international moni format 1,000,000,000
export function fMoni(value) {
    return new Intl.NumberFormat("en-US").format(value);
}
