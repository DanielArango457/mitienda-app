// Convierte 150000 en "$150.000"
export function formatearPrecio(valor: number): string {
  return '$' + String(Math.round(valor)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}