const substitutionRegex = /\%\[([A-Za-z_]+)\]\%/g;

export function replacePlaceholders(input: string, substitutions: Record<string, any>) {
  return input.replaceAll(substitutionRegex, (m, g1) => (g1 in substitutions ? `${substitutions[g1]}` : m));
}
