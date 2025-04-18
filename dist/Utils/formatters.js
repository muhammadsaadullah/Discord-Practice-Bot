// utils/formatters.ts
// Formats moni in international moni format 1,000,000,000
export function fMoni(value) {
    return new Intl.NumberFormat("en-US").format(value);
}
// Formats numbers in string to international moni format 1,000,000,000
// using t format rank 
export function fStr(value) {
    console.log(value);
    const num = parseInt(value, 10); // Convert string to number
    console.log(num);
    return new Intl.NumberFormat("en-US").format(num).toString(); // Ensure the return is a string
}
