export function formatDomain(domain: string): string {
    let formattedDomain = domain;
  
    // Asegurarse de que el dominio empieza con https://
    if (!formattedDomain.startsWith('http://') && !formattedDomain.startsWith('https://')) {
      formattedDomain = `https://${formattedDomain}`;
    }
  
    // Asegurarse de que el dominio termina con /
    if (!formattedDomain.endsWith('/')) {
      formattedDomain = `${formattedDomain}/`;
    }
  
    return formattedDomain;
  }
  