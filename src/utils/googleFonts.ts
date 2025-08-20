// src/utils/googleFonts.ts
export interface FontConfig {
  family: string;
  weights: number[];
  italicWeights?: number[];
}

// Função para gerar a URL do Google Fonts
export function generateGoogleFontsLink(fonts: FontConfig[]): string {
  if (!fonts || fonts.length === 0) return '';
  
  const query = fonts.map((font) => {
    const family = font.family.replace(/ /g, '+');
    let queryPart = `family=${family}:`;
    
    if (font.italicWeights && font.italicWeights.length > 0) {
      // adiciona pesos normais
      queryPart += 'wght@' + font.weights.join(';');
      // adiciona pesos itálicos
      const italicPart = font.italicWeights.map(i => `1,${i}`).join(';');
      queryPart += `;${italicPart}`;
    } else {
      queryPart += 'wght@' + font.weights.join(';');
    }

    return queryPart;
  }).join('&');

  return `https://fonts.googleapis.com/css2?${query}&display=swap`;
}

// Função para gerar <style> com variáveis CSS
export function generateFontCSSVariables(fonts: FontConfig[]): string {
  const varNames = ['--primary-font', '--secondary-font', '--tertiary-font'];
  let css = ':root { ';

  fonts.forEach((f, i) => {
    css += `${varNames[i]}: '${f.family}', sans-serif; `;
  });

  css += ' }';
  return css;
}
