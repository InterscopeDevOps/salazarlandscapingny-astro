import { useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import type { FC } from "react";
import UseTextHidden from "@/hook/UseTextHidden";

export default function AccessibilityPanel() {
    const [isOpen, setIsOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);


    // isOpen y isClosing arriba

    const [keyboardShortcuts, setKeyboardShortcuts] = useState(false);
    const [spacing, setSpacing] = useState(0);
    const [animationDisabled, setAnimationDisabled] = useState(false);
    const [highlightIndex, setHighlightIndex] = useState(0);
    const [focusMode, setFocusMode] = useState(false);
    const [cursorLarge, setCursorLarge] = useState(false);
    const [guideEnabled, setGuideEnabled] = useState(false);
    const [windowGuideEnabled, setWindowGuideEnabled] = useState(false);
    const [imageDescriptionsEnabled, setImageDescriptionsEnabled] = useState(false);
    const [readModeEnabled, setReadModeEnabled] = useState(false);
    const [showStructurePanel, setShowStructurePanel] = useState(false);


    const contrastModes = [null, "Desaturate", "Invert"] as const;
    type ContrastMode = typeof contrastModes[number];

    const [contrastMode, setContrastMode] = useState<ContrastMode>(null);

    const highlightOptions = [null, "headers", "links", "buttons", "all"];

    const fontSizes = [null, "Large", "Larger", "Largest"] as const;
    type FontSizeOption = typeof fontSizes[number];
    const [fontSizeLevel, setFontSizeLevel] = useState<FontSizeOption>(null);

    const fontOptions = [
        { name: "Font", family: "" },
        { name: "Arial", family: "Arial, sans-serif" },
        { name: "Georgia", family: "Georgia, serif" },
        { name: "Verdana", family: "Verdana, sans-serif" },
        { name: "Courier New", family: "'Courier New', monospace" },
        { name: "Tahoma", family: "Tahoma, sans-serif" },
        { name: "Trebuchet MS", family: "'Trebuchet MS', sans-serif" },
        { name: "Times New Roman", family: "'Times New Roman', serif" }
    ] as const;

    const [fontIndex, setFontIndex] = useState(0);


    const toggleAnimations = () => {
        setAnimationDisabled(prev => {
            const next = !prev;
            const site = document.getElementById("site-content");
            if (!site) return next;

            const styleId = "disable-animations-style";

            if (next) {
                if (!document.getElementById(styleId)) {
                    const style = document.createElement("style");
                    style.id = styleId;
                    style.textContent = `
                        #site-content *,
                        #site-content *::before,
                        #site-content *::after {
                            animation: none !important;
                            transition: none !important;
                            scroll-behavior: auto !important;
                            }
                    `;
                    document.head.appendChild(style);
                }
            } else {
                const existingStyle = document.getElementById(styleId);
                if (existingStyle) existingStyle.remove();
            }

            return next;
        });
    };


    const toggleCursorSize = () => {
        setCursorLarge(prev => {
            const next = !prev;
            const site = document.getElementById("site-content");
            if (!site) return next;

            if (next) {
                // Inyectar solo si no está ya agregado
                if (!document.getElementById("custom-cursor-style")) {
                    const style = document.createElement("style");
                    style.id = "custom-cursor-style";
                    style.innerHTML = `
                        .custom-cursor {
                            cursor: url("assets/images/cursor/cursor.png") 0 0, auto;
                        }

                        .custom-cursor a,
                        .custom-cursor button {
                            cursor: url("/assets/images/cursor/pointer.png") 0 0, auto;
                        }

                        .custom-cursor:active {
                            cursor: url("/assets/images/cursor/click.png") 16 16, auto;
                        }
                        `;
                    document.head.appendChild(style);
                }

                site.classList.add("custom-cursor");
            } else {
                site.classList.remove("custom-cursor");
                const existingStyle = document.getElementById("custom-cursor-style");
                if (existingStyle) existingStyle.remove();
            }


            return next;
        });
    };

    const toggleFocusMode = () => {
        setFocusMode(prev => !prev);
    };


    const handleFocusClick = useCallback((e: MouseEvent) => {
        const site = document.getElementById("site-content");
        if (!site) return;
        const target = e.target as HTMLElement;
        if (!site.contains(target)) return;

        site.querySelectorAll(".focus-selected").forEach(el => {
            el.classList.remove("outline", "outline-2", "outline-blue-500", "p-[2px]", "focus-selected");
        });

        target.classList.add("outline", "outline-2", "outline-blue-500", "p-[2px]", "focus-selected");
        e.stopPropagation();
    }, []);


    // Resetea todos los highlights aplicados
    const resetHighlights = () => {
        const site = document.getElementById("site-content");
        if (!site) return;

        const allClasses = ["highlight-link", "highlight-button", "highlight-header"];
        allClasses.forEach(cls => {
            site.querySelectorAll(`.${cls}`).forEach(el => {
                el.classList.remove(cls);
                (el as HTMLElement).style.removeProperty("background-color");
                (el as HTMLElement).style.removeProperty("color");
            });
        });
    };



    // Aplica los highlights según el tipo seleccionado
    const applyHighlights = (type: string | null) => {
        const site = document.getElementById("site-content");
        if (!site) return;

        // Eliminar estilos anteriores
        resetHighlights();

        if (!type) return;

        const applyStyle = (el: Element, className: string) => {
            el.classList.add(className);
            (el as HTMLElement).style.setProperty("background-color", "#fcd34d", "important");
            (el as HTMLElement).style.setProperty("color", "black", "important");
        };

        switch (type) {
            case "headers":
                site.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach(el => {
                    applyStyle(el, "highlight-header");
                });
                break;

            case "links":
                site.querySelectorAll("a[href]").forEach(el => {
                    applyStyle(el, "highlight-link");
                });
                break;

            case "buttons":
                site.querySelectorAll("button").forEach(el => {
                    if (el.closest(".read-button-container, .accessibility-panel, .modal")) return;
                    applyStyle(el, "highlight-button");
                });
                break;

            case "all":
                site.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach(el => {
                    applyStyle(el, "highlight-header");
                });
                site.querySelectorAll("a[href]").forEach(el => {
                    applyStyle(el, "highlight-link");
                });
                site.querySelectorAll("button").forEach(el => {
                    if (el.closest(".read-button-container, .accessibility-panel, .modal")) return;
                    applyStyle(el, "highlight-button");
                });
                break;
        }
    };

    // Cicla entre los tipos de highlight disponibles
    const cycleHighlight = () => {
        const nextIndex = (highlightIndex + 1) % highlightOptions.length;
        const nextType = highlightOptions[nextIndex];
        setHighlightIndex(nextIndex);

        applyHighlights(nextType); // null también resetea
    };


    // Aplicar highlights al cargar el componente
    const currentHighlight = highlightOptions[highlightIndex];

    // Cicla entre los modos de contraste disponibles
    const cycleContrastMode = () => {
        const nextIndex = (contrastModes.indexOf(contrastMode) + 1) % contrastModes.length;
        const nextMode = contrastModes[nextIndex];
        setContrastMode(nextMode);

        const html = document.documentElement;
        const body = document.body;

        // Limpiar filtros previos
        html.style.filter = "";
        html.style.backgroundColor = "";
        html.style.color = "";
        body.classList.remove("dark");

        // Aplicar nuevo contraste directamente a todo el documento
        switch (nextMode) {
            case "Desaturate":
                html.style.filter = "grayscale(1)";
                break;
            case "Invert":
                html.style.filter = "invert(1)";
                html.style.backgroundColor = "white";
                html.style.color = "black";
                body.classList.add("dark");
                break;
        }
    };

    // Cicla entre los tamaños de fuente disponibles
    const cycleFontSize = () => {
        const nextIndex = (fontSizes.indexOf(fontSizeLevel) + 1) % fontSizes.length;
        const nextSize = fontSizes[nextIndex];
        setFontSizeLevel(nextSize);

        const site = document.getElementById("site-content");
        if (!site) return;

        // Reset styles
        site.style.fontSize = "";
        site.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach(el => {
            (el as HTMLElement).style.fontSize = "";
        });

        if (nextSize === null) return; // salir si es default

        let scaleFactor = 1;
        switch (nextSize) {
            case "Large":
                scaleFactor = 1.15;
                break;
            case "Larger":
                scaleFactor = 1.5;
                break;
            case "Largest":
                scaleFactor = 2;
                break;
        }

        site.style.fontSize = `${100 * scaleFactor}%`;

        const headers = site.querySelectorAll("h1, h2, h3, h4, h5, h6");
        headers.forEach(header => {
            const el = header as HTMLElement;
            const computedSize = parseFloat(window.getComputedStyle(el).fontSize);
            const newSize = computedSize * scaleFactor;
            el.style.fontSize = `${newSize}px`;
        });
    };

    // Aumenta el espaciado de letras, palabras y líneas
    const toggleSpacing = () => {
        const site = document.getElementById("site-content");
        if (!site) return;

        // Si el espaciado actual es 0, se aplica el primer aumento
        if (spacing === 0) {
            const newSpacing = 0.25;
            setSpacing(newSpacing);
            site.style.letterSpacing = `${newSpacing}em`;
            site.style.wordSpacing = `${newSpacing * 2}em`;
            site.style.lineHeight = "1.7";
        } else {
            // Si ya está aplicado, lo quitamos
            setSpacing(0);
            site.style.letterSpacing = "";
            site.style.wordSpacing = "";
            site.style.lineHeight = "";
        }
    };

    // Cicla entre las fuentes disponibles
    const cycleFontFamily = () => {
        const nextIndex = (fontIndex + 1) % fontOptions.length;
        const nextFont = fontOptions[nextIndex];
        setFontIndex(nextIndex);

        const site = document.getElementById("site-content");
        if (site) {
            site.style.fontFamily = nextFont.family;
        }
    };




    // Manejo de lectura en voz alta
    // const speakText = () => {
    //     const selection = window.getSelection()?.toString().trim();
    //     const text = selection && selection.length > 0
    //         ? selection
    //         : document.getElementById("site-content")?.innerText || "";

    //     if (!text) return;

    //     if (!window.speechSynthesis) {
    //         alert("Tu navegador no soporta lectura de voz.");
    //         return;
    //     }

    //     const utterance = new SpeechSynthesisUtterance(text);
    //     utterance.lang = "es-ES";
    //     window.speechSynthesis.cancel();

    //     const speakNow = () => window.speechSynthesis.speak(utterance);

    //     // Si ya hay voces cargadas
    //     if (window.speechSynthesis.getVoices().length > 0) {
    //         speakNow();
    //     } else {
    //         // Esperar a que carguen las voces
    //         window.speechSynthesis.onvoiceschanged = () => speakNow();
    //     }
    // };

    // Mapa de atajos de teclado
    const keyboardShortcutsMap: Record<string, () => void> = {
        f: toggleFocusMode,
        c: toggleCursorSize,
        h: cycleHighlight,
        a: cycleContrastMode,
        m: toggleAnimations,
        t: cycleFontSize,
        s: toggleSpacing,
        r: () => setReadModeEnabled(prev => !prev),
        g: () => setGuideEnabled(prev => !prev),
        w: () => setWindowGuideEnabled(prev => !prev),
        i: () => setImageDescriptionsEnabled(prev => !prev),
        o: cycleFontFamily,
    };


    // Resetea todos los estilos de accesibilidad
    const resetAllAccessibility = () => {
        const site = document.getElementById("site-content");
        const html = document.documentElement;
        const body = document.body;

        // 1. Eliminar highlights con clases especiales
        resetHighlights();

        // 2. Reset estilo general
        if (site) {
            site.style.fontSize = "";
            site.style.letterSpacing = "";
            site.style.wordSpacing = "";
            site.style.lineHeight = "";
            site.style.fontFamily = "";
            site.classList.remove("custom-cursor");
            site.removeEventListener("click", handleFocusClick);
        }

        // 3. Reset estilos del HTML
        html.style.filter = "";
        html.style.backgroundColor = "";
        html.style.color = "";

        // 4. Eliminar clase dark
        body.classList.remove("dark");

        // 5. Eliminar estilos dinámicos
        ["disable-animations-style", "custom-cursor-style"].forEach(id => {
            const styleEl = document.getElementById(id);
            if (styleEl) styleEl.remove();
        });

        // 6. Eliminar botones de lectura
        document.querySelectorAll(".read-button-container").forEach(el => el.remove());

        // 7. Eliminar outline de foco
        site?.querySelectorAll(".focus-selected").forEach(el =>
            el.classList.remove("outline", "outline-2", "outline-blue-500", "p-[2px]", "focus-selected")
        );

        // 8. Resetear tooltips de imágenes
        const tooltipEl = document.getElementById("image-tooltip");
        if (tooltipEl) tooltipEl.remove();

        // 9. Limpiar overlays de guía (solo desactivar el overlay de window guide)
        setGuideEnabled(false);

        setWindowGuideEnabled(false);


        // 10. Cancelar lectura
        window.speechSynthesis.cancel();

        // 11. Reset estados de React (excepto isOpen)
        setCursorLarge(false);
        setFocusMode(false);
        setHighlightIndex(0);
        setContrastMode(null);
        setFontSizeLevel(null);
        setSpacing(0);
        setFontIndex(0);
        setAnimationDisabled(false);
        setImageDescriptionsEnabled(false);
        // No reseteamos isOpen, para que el modal permanezca abierto
        setGuideEnabled(false);
        setReadModeEnabled(false);

        // 12. Limpiar localStorage
        localStorage.removeItem("accessibilitySettings");

        // 13. Resetear estilos de encabezados
        if (site) site.style.fontSize = "";
        site?.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach(el => {
            (el as HTMLElement).style.fontSize = "";
        });
    };


    // Mover la linea de guía al mover el mouse
    useEffect(() => {
        const guideLine = document.getElementById("accessibility-guide-line");

        const moveGuide = (e: MouseEvent) => {
            if (guideLine) {
                guideLine.style.top = `${e.clientY + 12}px`; // 12px más abajo del puntero
            }
        };

        if (guideEnabled) {
            document.addEventListener("mousemove", moveGuide);
        } else {
            document.removeEventListener("mousemove", moveGuide);
        }

        return () => document.removeEventListener("mousemove", moveGuide);
    }, [guideEnabled]);

    // Manejo del modo de focus
    useEffect(() => {
        const site = document.getElementById("site-content");
        if (!site) return;

        if (focusMode) {
            site.addEventListener("click", handleFocusClick);
        } else {
            site.querySelectorAll(".focus-selected").forEach(el => {
                el.classList.remove("outline", "outline-2", "outline-blue-500", "p-[2px]", "focus-selected");
            });
            site.removeEventListener("click", handleFocusClick);
        }

        // Cleanup on unmount or focusMode change
        return () => {
            site.removeEventListener("click", handleFocusClick);
            site.querySelectorAll(".focus-selected").forEach(el => {
                el.classList.remove("outline", "outline-2", "outline-blue-500", "p-[2px]", "focus-selected");
            });
        };
    }, [focusMode, handleFocusClick]);

    // Mover la ventana de guía al mover el mouse
    useEffect(() => {
        const overlay = document.getElementById("accessibility-window-overlay");

        const moveWindow = (e: MouseEvent) => {
            if (overlay) {
                const windowHeight = 160; // altura total de la franja
                const top = e.clientY - windowHeight / 2;

                overlay.style.background = `
                linear-gradient(to bottom, 
                rgba(0,0,0,0.6) 0%, 
                rgba(0,0,0,0.6) ${top}px, 
                transparent ${top}px,
                transparent ${top + windowHeight}px,
                rgba(0,0,0,0.6) ${top + windowHeight}px,
                rgba(0,0,0,0.6) 100%)
            `;
            }
        };

        if (windowGuideEnabled) {
            document.addEventListener("mousemove", moveWindow);
        } else {
            document.removeEventListener("mousemove", moveWindow);
        }

        return () => document.removeEventListener("mousemove", moveWindow);
    }, [windowGuideEnabled]);

    // Manejo de tooltips para imágenes
    useEffect(() => {
        const tooltip = document.createElement("div");
        tooltip.id = "image-tooltip";
        tooltip.style.position = "fixed";
        tooltip.style.zIndex = "9999";
        tooltip.style.padding = "8px 12px";
        tooltip.style.backgroundColor = "rgba(0,0,0,0.9)";
        tooltip.style.color = "#fff";
        tooltip.style.borderRadius = "8px";
        tooltip.style.fontSize = "18px";
        tooltip.style.maxWidth = "300px";
        tooltip.style.pointerEvents = "none";
        tooltip.style.display = "none";
        document.body.appendChild(tooltip);

        const showTooltip = (e: MouseEvent) => {
            const target = e.target as HTMLImageElement;
            if (target.tagName.toLowerCase() === "img") {
                const alt = target.alt || "No description available";
                tooltip.textContent = alt;
                tooltip.style.display = "block";
                tooltip.style.top = `${e.clientY + 20}px`;
                tooltip.style.left = `${e.clientX + 20}px`;
            }
        };

        const moveTooltip = (e: MouseEvent) => {
            tooltip.style.top = `${e.clientY + 20}px`;
            tooltip.style.left = `${e.clientX + 20}px`;
        };

        const hideTooltip = () => {
            tooltip.style.display = "none";
        };

        if (imageDescriptionsEnabled) {
            document.addEventListener("mouseover", showTooltip);
            document.addEventListener("mousemove", moveTooltip);
            document.addEventListener("mouseout", hideTooltip);
        } else {
            document.removeEventListener("mouseover", showTooltip);
            document.removeEventListener("mousemove", moveTooltip);
            document.removeEventListener("mouseout", hideTooltip);
            const tooltipEl = document.getElementById("image-tooltip");
            if (tooltipEl) tooltipEl.remove();
        }

        return () => {
            document.removeEventListener("mouseover", showTooltip);
            document.removeEventListener("mousemove", moveTooltip);
            document.removeEventListener("mouseout", hideTooltip);
            const tooltipEl = document.getElementById("image-tooltip");
            if (tooltipEl) tooltipEl.remove();
        };
    }, [imageDescriptionsEnabled]);


    // Manejo de lectura en voz alta
    useEffect(() => {
        if (!readModeEnabled) {
            document.querySelectorAll(".read-button-container").forEach(el => el.remove());
            return;
        }

        const site = document.getElementById("site-content");
        if (!site) return;

        const headingsAndParas = site.querySelectorAll("p, h1, h2, h3, h4, h5, h6");

        const handledContainers = new Set<Element>();

        headingsAndParas.forEach(el => {
            const parent = el.closest("section, article, div");

            // Si está dentro de un contenedor que ya tiene botón, saltar
            if (parent && handledContainers.has(parent)) return;

            // Recolectar texto dependiendo si está dentro de contenedor o solo
            let text = "";
            let targetElement: Element = el;

            if (parent) {
                const textNodes = parent.querySelectorAll("p, h1, h2, h3, h4, h5, h6");
                textNodes.forEach(node => {
                    text += (node as HTMLElement).innerText.trim() + " ";
                });

                if (text.trim().length < 10 || parent.querySelector(".read-button-container")) return;

                handledContainers.add(parent);
                targetElement = parent;
            } else {
                text = (el as HTMLElement).innerText.trim();
                if (text.length < 10 || el.nextElementSibling?.classList.contains("read-button-container")) return;
            }

            // Crear contenedor y botón
            const container = document.createElement("div");
            container.className = "read-button-container";
            container.style.display = "flex";
            container.style.justifyContent = "flex-start";
            container.style.marginBottom = "4px";
            container.style.marginTop = "4px";

            const buttonWrapper = document.createElement("div");
            container.appendChild(buttonWrapper);

            // Insertar justo después del elemento objetivo
            targetElement.insertAdjacentElement("afterbegin", container);

            const root = createRoot(buttonWrapper);
            root.render(
                <button
                    onClick={() => {
                        const utterance = new SpeechSynthesisUtterance(text.trim());
                        utterance.lang = "en-US";
                        window.speechSynthesis.cancel();
                        window.speechSynthesis.speak(utterance);
                    }}
                    className="bg-green-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2 hover:bg-green-700 transition"
                    title="Leer en voz alta"
                    aria-label="Leer en voz alta"
                >
                    <i className="fa-regular fa-circle-microphone"></i>
                </button>
            );
        });

        return () => {
            document.querySelectorAll(".read-button-container").forEach(el => el.remove());
        };
    }, [readModeEnabled]);


    // Manejo de atajos de teclado
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (!keyboardShortcuts) return;
            const fn = keyboardShortcutsMap[e.key.toLowerCase()];
            if (fn) {
                e.preventDefault();
                fn();
            }
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [keyboardShortcuts, highlightIndex, contrastMode, fontSizeLevel, fontIndex, spacing, readModeEnabled]);


    // Aplica configuraciones guardadas al DOM y React state
    const applyAccessibilitySettings = (settings: any) => {
        const site = document.getElementById("site-content");
        if (!site) return;

        // Aplicar highlights según índice guardado
        if (settings.highlightIndex !== undefined && settings.highlightIndex !== null) {
            applyHighlights(highlightOptions[settings.highlightIndex] ?? null);
            setHighlightIndex(settings.highlightIndex);
        }

        // Aplicar contraste
        if (settings.contrastMode !== undefined) {
            setContrastMode(settings.contrastMode);
            const html = document.documentElement;
            const body = document.body;
            html.style.filter = "";
            html.style.backgroundColor = "";
            html.style.color = "";
            body.classList.remove("dark");
            switch (settings.contrastMode) {
                case "Desaturate":
                    html.style.filter = "grayscale(1)";
                    break;
                case "Invert":
                    html.style.filter = "invert(1)";
                    html.style.backgroundColor = "white";
                    html.style.color = "black";
                    body.classList.add("dark");
                    break;
            }
        }

        // Aplicar tamaño de fuente
        if (settings.fontSizeLevel !== undefined) {
            setFontSizeLevel(settings.fontSizeLevel);
            cycleFontSizeRestore(settings.fontSizeLevel);
        }

        // Aplicar espaciado
        if (settings.spacing !== undefined) {
            setSpacing(settings.spacing);
            if (settings.spacing > 0) {
                site.style.letterSpacing = `${settings.spacing}em`;
                site.style.wordSpacing = `${settings.spacing * 2}em`;
                site.style.lineHeight = "1.7";
            } else {
                site.style.letterSpacing = "";
                site.style.wordSpacing = "";
                site.style.lineHeight = "";
            }
        }

        // Aplicar fuente
        if (settings.fontIndex !== undefined) {
            setFontIndex(settings.fontIndex);
            const font = fontOptions[settings.fontIndex];
            if (site) {
                site.style.fontFamily = font.family;
            }
        }

        // Aplicar animaciones
        if (settings.animationDisabled !== undefined) {
            setAnimationDisabled(settings.animationDisabled);
            const styleId = "disable-animations-style";
            if (settings.animationDisabled) {
                if (!document.getElementById(styleId)) {
                    const style = document.createElement("style");
                    style.id = styleId;
                    style.textContent = `
            #site-content *,
            #site-content *::before,
            #site-content *::after {
              animation: none !important;
              transition: none !important;
              scroll-behavior: auto !important;
            }
          `;
                    document.head.appendChild(style);
                }
            } else {
                const styleEl = document.getElementById(styleId);
                if (styleEl) styleEl.remove();
            }
        }

        // Aplicar cursor grande
        if (settings.cursorLarge !== undefined) {
            setCursorLarge(settings.cursorLarge);
            if (settings.cursorLarge) {
                if (!document.getElementById("custom-cursor-style")) {
                    const style = document.createElement("style");
                    style.id = "custom-cursor-style";
                    style.innerHTML = `
            .custom-cursor {
              cursor: url("/assets/images/cursor/cursor.png") 0 0, auto;
            }
            .custom-cursor a,
            .custom-cursor button {
              cursor: url("/assets/images/cursor/pointer.png") 0 0, auto;
            }
            .custom-cursor:active {
              cursor: url("/assets/images/cursor/click.png") 16 16, auto;
            }
          `;
                    document.head.appendChild(style);
                }
                site.classList.add("custom-cursor");
            } else {
                site.classList.remove("custom-cursor");
                const existingStyle = document.getElementById("custom-cursor-style");
                if (existingStyle) existingStyle.remove();
            }
        }

        // Aplicar modo focus
        if (settings.focusMode !== undefined) {
            setFocusMode(settings.focusMode);
            if (settings.focusMode) {
                site.addEventListener("click", handleFocusClick);
            } else {
                site.removeEventListener("click", handleFocusClick);
                site.querySelectorAll(".focus-selected").forEach(el => {
                    el.classList.remove("outline", "outline-2", "outline-blue-500", "p-[2px]", "focus-selected");
                });
            }
        }

        // Aplicar otros ajustes booleanos simples
        if (settings.guideEnabled !== undefined) setGuideEnabled(settings.guideEnabled);
        if (settings.windowGuideEnabled !== undefined) setWindowGuideEnabled(settings.windowGuideEnabled);
        if (settings.imageDescriptionsEnabled !== undefined) setImageDescriptionsEnabled(settings.imageDescriptionsEnabled);
        if (settings.readModeEnabled !== undefined) setReadModeEnabled(settings.readModeEnabled);
        if (settings.keyboardShortcuts !== undefined) setKeyboardShortcuts(settings.keyboardShortcuts);
    };

    // Función auxiliar para restaurar tamaño fuente al DOM sin cambiar estado React
    const cycleFontSizeRestore = (fontSize: FontSizeOption) => {
        const site = document.getElementById("site-content");
        if (!site) return;

        site.style.fontSize = "";
        site.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach(el => {
            (el as HTMLElement).style.fontSize = "";
        });

        if (fontSize === null) return;

        let scaleFactor = 1;
        switch (fontSize) {
            case "Large": scaleFactor = 1.15; break;
            case "Larger": scaleFactor = 1.5; break;
            case "Largest": scaleFactor = 2; break;
        }

        site.style.fontSize = `${100 * scaleFactor}%`;
        const headers = site.querySelectorAll("h1, h2, h3, h4, h5, h6");
        headers.forEach(header => {
            const el = header as HTMLElement;
            const computedSize = parseFloat(window.getComputedStyle(el).fontSize);
            const newSize = computedSize * scaleFactor;
            el.style.fontSize = `${newSize}px`;
        });
    };

    // Al montar componente, leer configuración guardada y aplicarla
    useEffect(() => {
        const saved = localStorage.getItem("accessibilitySettings");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                applyAccessibilitySettings(parsed);
            } catch (error) {
                console.error("Error loading accessibility settings:", error);
            }
        }
    }, []);

    // Guardar cambios al cambiar estados (tu useEffect actual)
    useEffect(() => {
        localStorage.setItem("accessibilitySettings", JSON.stringify({
            highlightIndex,
            contrastMode,
            fontSizeLevel,
            spacing,
            fontIndex,
            animationDisabled,
            cursorLarge,
            focusMode,
            imageDescriptionsEnabled,
            windowGuideEnabled,
            guideEnabled,
            readModeEnabled,
            keyboardShortcuts
        }));
    }, [
        highlightIndex,
        contrastMode,
        fontSizeLevel,
        spacing,
        fontIndex,
        animationDisabled,
        cursorLarge,
        focusMode,
        imageDescriptionsEnabled,
        windowGuideEnabled,
        guideEnabled,
        readModeEnabled,
        keyboardShortcuts
    ]);


    return (
        <>

            {/* Botón flotante para abrir el panel */}
            <button
                onClick={() => {
                    setIsOpen(true);
                    setIsAnimating(true);
                    setTimeout(() => setIsAnimating(false), 10); // Forzar reflujo para transición
                }}
                className="fixed w-12 h-12 bottom-[85px] justify-center items-center left-4 text-xl ring-4 ring-white/80 bg-[var(--primary)] text-white  rounded-full shadow-lg hover:bg-[var(--btn-hover-color)] focus:outline-none focus:ring-2 focus:ring-[var(--tertiary)] z-[40]"
                aria-label="Abrir herramientas de accesibilidad"
            >
                <i className="fa-solid fa-child-reaching" />
            </button>

            {guideEnabled && (
                <div
                    id="accessibility-guide-line"
                    style={{
                        position: "fixed",
                        left: 0,
                        right: 0,
                        height: "10px",
                        backgroundColor: "black",
                        border: "2px solid yellow",
                        zIndex: 9999,
                        pointerEvents: "none",
                    }}
                />
            )}

            {windowGuideEnabled && (
                <div
                    id="accessibility-window-overlay"
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 9998,
                        pointerEvents: "none",
                    }}
                />
            )}

            {(isOpen || isAnimating) && (
                <div className={`fixed top-[120px] left-2 md:left-16 w-[360px] max-w-[95vw] max-h-[90vh] h-auto z-[10002] pointer-events-none transition-all duration-300 ${isOpen && !isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <div className="absolute inset-0 border-4 border-[var(--primary)] rounded-3xl shadow-2xl pointer-events-none backdrop-blur-2xl"></div>
                    <aside 
                        className="relative bg-white/90 rounded-3xl flex flex-col p-4 space-y-4 overflow-auto font-sans pointer-events-auto"
                        style={{ boxShadow: '0 8px 32px 0 rgba(15, 76, 129, 0.15)' }}
                    >
                        <header className="flex items-center justify-between pb-2 border-b border-[var(--primary)]">
                            <div className="flex items-center gap-2">
                                <i className="fa-solid fa-child-reaching text-[var(--primary)] text-2xl" />
                                <h1 className="text-xl font-bold text-[var(--primary)]">Accessibility</h1>
                            </div>
                            <button
                                onClick={() => {
                                    setIsAnimating(true);
                                    setTimeout(() => {
                                        setIsOpen(false);
                                        setIsAnimating(false);
                                    }, 300);
                                }}
                                className="bg-[var(--primary)] text-white rounded-full w-8 h-8 transition"
                                aria-label="Cerrar panel de accesibilidad"
                            >
                                <i className="fa-solid fa-xmark text-lg" />
                            </button>
                        </header>
                        <section className="flex justify-between items-center">
                            <span className="text-base font-semibold text-[var(--primary)]">Customize</span>
                            <button
                                onClick={resetAllAccessibility}
                                className="flex items-center gap-1 text-[var(--secondary)] hover:text-[var(--primary)] text-sm"
                                aria-label="Reset all accessibility settings"
                                title="Reset all accessibility settings"
                            >
                                <i className="fa-solid fa-rotate-left" /> Reset
                            </button>
                        </section>
                        <button
                            className="w-full border border-[var(--primary)] text-[var(--primary)] py-1 rounded-lg hover:bg-[var(--tertiary)]/40 transition text-xs font-medium mx-auto mt-1"
                            onClick={() => setShowStructurePanel(prev => !prev)}
                        >
                            {showStructurePanel ? (
                                <span className="flex justify-center items-center gap-2">
                                    <i className="fa-solid fa-chevron-left" />
                                    Hide structure
                                </span>
                            ) : (
                                <span>
                                    <UseTextHidden text="Navigate by page structure" />
                                </span>
                            )}
                        </button>
                        {showStructurePanel && (
                            <div className="p-2 overflow-y-auto">
                                <div className="space-y-2">
                                    <StructureSection
                                        title="Landmarks"
                                        selector="main, nav, footer, header, aside"
                                        icon={() => <i className="fa-solid fa-book-open" />}
                                    />
                                    <StructureSection
                                        title="Headings"
                                        selector="h1, h2, h3, h4, h5, h6"
                                        icon={() => <i className="fa-solid fa-highlighter" />}
                                    />
                                    <StructureSection
                                        title="Links"
                                        selector="a[href]"
                                        icon={() => <i className="fa-solid fa-link" />}
                                    />
                                </div>
                            </div>
                        )}
                        {!showStructurePanel && (
                            <>
                                <div className="flex items-center justify-between px-2">
                                    <span className="text-xs text-[var(--primary)]/80 font-medium"><UseTextHidden text="Keyboard Shortcuts" /></span>
                                    <button
                                        onClick={() => setKeyboardShortcuts(!keyboardShortcuts)}
                                        className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors duration-300 ${keyboardShortcuts ? "bg-[var(--primary)]" : "bg-gray-300"}`}
                                    >
                                        <div
                                            className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${keyboardShortcuts ? "translate-x-5" : "translate-x-0"}`}
                                        />
                                    </button>
                                </div>
                                <div className="grid grid-cols-3 gap-4 px-1 pb-3">
                                    <ToolButton
                                        icon={<i className="fa-solid fa-crosshairs" />}
                                        label="Focus"
                                        onClick={toggleFocusMode}
                                        isActive={focusMode}
                                        shortcutKey="F"
                                        showShortcutKey={keyboardShortcuts}
                                    />
                                    <ToolButton
                                        icon={<i className="fa-solid fa-mouse-pointer" />}
                                        label="Cursor"
                                        onClick={toggleCursorSize}
                                        isActive={cursorLarge}
                                        shortcutKey="C"
                                        showShortcutKey={keyboardShortcuts}
                                    />
                                    <ToolButton
                                        icon={<i className="fa-solid fa-highlighter" />}
                                        label={currentHighlight ? `${currentHighlight}` : "Highlight"}
                                        onClick={cycleHighlight}
                                        dotsIndex={highlightIndex > 0 ? highlightIndex - 1 : undefined}
                                        dotsCount={highlightOptions.length - 1}
                                        isActive={!!currentHighlight}
                                        shortcutKey="H"
                                        showShortcutKey={keyboardShortcuts}
                                    />
                                    <ToolButton
                                        icon={<i className="fa-solid fa-circle-half-stroke" />}
                                        label={contrastMode ? `${contrastMode}` : "Contrast"}
                                        onClick={cycleContrastMode}
                                        isActive={!!contrastMode}
                                        dotsIndex={contrastModes.indexOf(contrastMode) > 0 ? contrastModes.indexOf(contrastMode) - 1 : undefined}
                                        dotsCount={contrastModes.length - 1}
                                        shortcutKey="A"
                                        showShortcutKey={keyboardShortcuts}
                                    />
                                    <ToolButton
                                        icon={<i className="fa-solid fa-wave-square" />}
                                        label="Animation"
                                        onClick={toggleAnimations}
                                        isActive={animationDisabled}
                                        shortcutKey="M"
                                        showShortcutKey={keyboardShortcuts}
                                    />
                                    <ToolButton
                                        icon={<i className="fa-solid fa-text-height" />}
                                        label={fontSizeLevel ? `${fontSizeLevel}` : "Text Size"}
                                        onClick={cycleFontSize}
                                        isActive={!!fontSizeLevel}
                                        dotsIndex={fontSizes.indexOf(fontSizeLevel) > 0 ? fontSizes.indexOf(fontSizeLevel) - 1 : undefined}
                                        dotsCount={fontSizes.length - 1}
                                        shortcutKey="T"
                                        showShortcutKey={keyboardShortcuts}
                                    />
                                    <ToolButton
                                        icon={<i className="fa-solid fa-arrows-up-down-left-right" />}
                                        label="Spacing"
                                        onClick={toggleSpacing}
                                        isActive={spacing > 0}
                                        shortcutKey="S"
                                        showShortcutKey={keyboardShortcuts}
                                    />
                                    <ToolButton
                                        icon={<i className="fa-solid fa-font" />}
                                        label={fontOptions[fontIndex].name}
                                        onClick={cycleFontFamily}
                                        isActive={fontIndex > 0}
                                        dotsIndex={fontIndex > 0 ? fontIndex - 1 : undefined}
                                        dotsCount={fontOptions.length - 1}
                                        shortcutKey="O"
                                        showShortcutKey={keyboardShortcuts}
                                    />
                                    <ToolButton
                                        icon={<i className="fa-regular fa-window-maximize" />}
                                        label="Guide"
                                        onClick={() => setGuideEnabled(prev => !prev)}
                                        isActive={guideEnabled}
                                        shortcutKey="G"
                                        showShortcutKey={keyboardShortcuts}
                                    />
                                    <ToolButton
                                        icon={<i className="fa-solid fa-window-restore" />}
                                        label="Window"
                                        onClick={() => setWindowGuideEnabled(prev => !prev)}
                                        isActive={windowGuideEnabled}
                                        shortcutKey="W"
                                        showShortcutKey={keyboardShortcuts}
                                    />
                                    <ToolButton
                                        icon={<i className="fa-regular fa-image" />}
                                        label="Images"
                                        onClick={() => setImageDescriptionsEnabled(prev => !prev)}
                                        isActive={imageDescriptionsEnabled}
                                        shortcutKey="I"
                                        showShortcutKey={keyboardShortcuts}
                                    />
                                    <ToolButton
                                        icon={<i className="fa-solid fa-volume-high" />}
                                        label="Read Aloud"
                                        onClick={() => setReadModeEnabled(prev => !prev)}
                                        isActive={readModeEnabled}
                                        shortcutKey="R"
                                        showShortcutKey={keyboardShortcuts}
                                    />
                                </div>
                            </>
                        )}
                    </aside>
                </div>
            )}

        </>
    );
}

function ToolButton({
    icon,
    label,
    onClick,
    dotsIndex,     // índice activo (opcional)
    dotsCount = 0, // total de dots visibles (opcional)
    isActive = false,
    shortcutKey,
    showShortcutKey = false,
}: {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
    dotsIndex?: number;
    dotsCount?: number;
    isActive?: boolean;
    shortcutKey?: string;
    showShortcutKey?: boolean;
}) {
    return (
        <button
            onClick={onClick}
            className={`relative flex flex-col items-center justify-center rounded-xl p-2 min-h-[64px] min-w-[64px] bg-[var(--primary)]  shadow-md hover:shadow-xl hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${isActive ? 'ring-2 ring-[var(--tertiary)]' : ''}`}
        >
            <div className="text-2xl text-white mb-0 flex items-center justify-center">{icon}</div>
            <span className="capitalize text-[13px] text-white font-semibold mb-0 text-center leading-tight">{label}</span>
            {shortcutKey && showShortcutKey && (
                <span className="absolute bottom-1 right-1 bg-white/30 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold shadow">{shortcutKey.toUpperCase()}</span>
            )}
            {/* Solo mostrar dots si se especifica dotsCount */}
            {dotsCount > 0 && typeof dotsIndex === "number" && (
                <div className="absolute top-1 left-1 flex gap-[2px]">
                    {Array.from({ length: dotsCount }).map((_, i) => (
                        <span
                            key={i}
                            className={`h-1.5 w-1.5 rounded-full ${i === dotsIndex
                                ? "bg-white"
                                : "bg-[var(--tertiary)] opacity-50"}
                            `}
                        />
                    ))}
                </div>
            )}
        </button>
    );
}

function StructureSection({
    title,
    icon: Icon, // renombramos por convención a PascalCase
    selector,
}: {
    title: string;
    icon: FC<{ className?: string }>;
    selector: string;
}) {
    const [expanded, setExpanded] = useState(true);
    const [elements, setElements] = useState<HTMLElement[]>([]);

    useEffect(() => {
        const site = document.getElementById("site-content");
        if (!site) return;
        const found = Array.from(site.querySelectorAll(selector));
        setElements(found as HTMLElement[]);
    }, [selector]);

    return (
        <div className="mb-3 border border-purple-700 rounded">
            <button
                onClick={() => setExpanded(prev => !prev)}
                className="flex justify-between items-center w-full text-left bg-purple-900/45 py-2 px-3"
            >
                <span className="flex items-center gap-2 font-semibold">
                    <Icon className="text-lg" />
                    {title}
                </span>
                <span className="text-xl">
                    {expanded ? <i className="fa-solid fa-chevron-up" /> : <i className="fa-solid fa-chevron-down" />}
                </span>
            </button>

            {expanded && (
                <ul className="px-6 py-5 mt-1 list-disc text-[16px] text-purple-200 space-y-1">
                    {elements.map((el, i) => (
                        <li key={i} className="flex items-start gap-2">
                            <i className="fa-solid fa-circle text-[10px] mt-2 font-normal" />

                            <button
                                className="hover:underline text-left"
                                onClick={() => el.scrollIntoView({ behavior: "smooth", block: "center" })}
                            >
                                <span className="capitalize font-medium">{el.tagName.toLowerCase()}</span>:{" "}
                                <span className="text-purple-400">{el.innerText.trim().substring(0, 50)}</span>
                            </button>
                        </li>
                    ))}
                </ul>

            )}
        </div>
    );
}
