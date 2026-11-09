// Convierte 150000 en "$150.000"
export function formatearPrecio(valor: number): string {
  const digitos = String(Math.round(Math.abs(valor)));
  const signo = valor < 0 ? '-' : '';
  let resultado = '';

  for (let i = 0; i < digitos.length; i++) {
    if (i > 0 && (digitos.length - i) % 3 === 0) {
      resultado += '.';
    }

    resultado += digitos[i];
  }

  return '$' + signo + resultado;
}