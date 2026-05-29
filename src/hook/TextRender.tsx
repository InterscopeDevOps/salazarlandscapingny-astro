export default function useTextRender() {
    return {
        renderText: (text: string) => {
            // Reemplaza todas las etiquetas <br/> por salto de línea
            const lines = text.replace(/<br\s*\/?>/gi, '\n').split('\n');
            return lines.reduce((acc: any[], line, index) => {
                acc.push(line);
                if (index < lines.length - 1) acc.push(<br key={index} />);
                return acc;
            }, []);
        }
    };
}