import { useEffect, useRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Coffee, Clock, Zap, Code, Brain, Rocket, Star, Heart, Music, Camera, Globe, Anchor, Beer, Gamepad, Headphones, Terminal, Cpu, Database, Cloud, Server, Wifi } from 'lucide-react';

export default function HexagonBackground() {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: 0, y: 0, active: false });
    const colorIndexRef = useRef(0); // Track color rotation

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Offscreen canvas for static grid
        const offscreenCanvas = document.createElement('canvas');
        const offscreenCtx = offscreenCanvas.getContext('2d');

        let animationFrameId;
        let w, h;
        const hexSize = 25; // Reduced from 50
        const hexagons = [];
        const ripples = [];
        let isDark = document.documentElement.getAttribute('data-theme') === 'dark';

        // Doodle Icons
        const icons = [Coffee, Clock, Zap, Code, Brain, Rocket, Star, Heart, Music, Camera, Globe, Anchor, Beer, Gamepad, Headphones, Terminal, Cpu, Database, Cloud, Server, Wifi];
        // Structure: [{ base: Image, neons: { [hue]: Image } }]
        const doodleAssets = [];

        // Neon Color Palettes (Hues)
        // Green (120), Cyan/Blue (190), Pink (300), Purple (280), Yellow (60)
        const neonColors = [120, 190, 300, 280, 60];

        // Pre-render icons to images
        const loadDoodles = async () => {
            doodleAssets.length = 0; // Clear existing

            const promises = icons.map(async (Icon) => {
                const assets = { base: null, neons: {} };

                // 1. Create Base Image (Faint)
                const baseSvg = renderToStaticMarkup(
                    <Icon
                        size={hexSize * 1.2}
                        strokeWidth={1.5}
                        color={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}
                    />
                );
                assets.base = await loadImage(`data:image/svg+xml;base64,${btoa(baseSvg)}`);

                // 2. Create Neon Images for each color
                const neonPromises = neonColors.map(async (hue) => {
                    const color = `hsl(${hue}, 100%, 60%)`; // Bright neon color
                    const neonSvg = renderToStaticMarkup(
                        <Icon
                            size={hexSize * 1.2}
                            strokeWidth={2} // Slightly thicker for highlight
                            color={color}
                        />
                    );
                    const img = await loadImage(`data:image/svg+xml;base64,${btoa(neonSvg)}`);
                    assets.neons[hue] = img;
                });
                await Promise.all(neonPromises);

                return assets;
            });

            const loadedAssets = await Promise.all(promises);
            doodleAssets.push(...loadedAssets);
            init(); // Re-init after loading images
        };

        const loadImage = (src) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.src = src;
                img.onload = () => resolve(img);
            });
        };

        // Helper to get grid color
        const getGridColor = () => {
            return getComputedStyle(document.documentElement).getPropertyValue('--hex-grid-color').trim();
        };
        let gridColor = getGridColor();

        // Theme Observer
        const observer = new MutationObserver(() => {
            gridColor = getGridColor();
            isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            // Reload doodles with new theme color
            loadDoodles();
        });
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });

        const renderStaticGrid = () => {
            if (!w || !h) return;
            offscreenCanvas.width = w;
            offscreenCanvas.height = h;
            offscreenCtx.clearRect(0, 0, w, h);

            offscreenCtx.strokeStyle = gridColor;
            offscreenCtx.lineWidth = 1;

            hexagons.forEach(hex => {
                // Draw Hexagon Outline
                offscreenCtx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const angle = (Math.PI / 3) * i - Math.PI / 6;
                    const px = hex.x + hexSize * Math.cos(angle);
                    const py = hex.y + hexSize * Math.sin(angle);
                    if (i === 0) offscreenCtx.moveTo(px, py);
                    else offscreenCtx.lineTo(px, py);
                }
                offscreenCtx.closePath();
                offscreenCtx.stroke();

                // Draw Base Doodle
                if (doodleAssets.length > 0) {
                    const assets = doodleAssets[hex.doodleIndex % doodleAssets.length];
                    if (assets && assets.base) {
                        const iconSize = hexSize * 0.8;
                        offscreenCtx.drawImage(
                            assets.base,
                            hex.x - iconSize / 2,
                            hex.y - iconSize / 2,
                            iconSize,
                            iconSize
                        );
                    }
                }
            });
        };

        const init = () => {
            if (doodleAssets.length === 0) return; // Wait for images

            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
            hexagons.length = 0;
            ripples.length = 0;
            gridColor = getGridColor();
            isDark = document.documentElement.getAttribute('data-theme') === 'dark';

            const r = hexSize;
            const wHex = Math.sqrt(3) * r;
            const hHex = 2 * r;

            const rows = Math.ceil(h / (hHex * 0.75)) + 2;
            const cols = Math.ceil(w / wHex) + 2;

            const gridMap = new Map(); // Store doodleIndex for (row,col)

            // Initial Generation
            for (let row = -1; row < rows; row++) {
                for (let col = -1; col < cols; col++) {
                    const isEvenRow = Math.abs(row) % 2 === 0;
                    const xOffset = isEvenRow ? 0 : (wHex / 2);
                    const cx = col * wHex + xOffset;
                    const cy = row * (hHex * 0.75);

                    // Initial random assignment
                    const doodleIndex = Math.floor(Math.random() * doodleAssets.length);
                    gridMap.set(`${row},${col}`, doodleIndex);

                    hexagons.push({
                        row, col, // Store grid coordinates for neighbor lookup
                        x: cx,
                        y: cy,
                        intensity: 0,
                        hue: 180,
                        doodleIndex: doodleIndex
                    });
                }
            }

            // Helper: Get all 6 neighbors for a given hex
            const getNeighbors = (r, c) => {
                const isEven = Math.abs(r) % 2 === 0;
                const neighbors = [];
                // Directions: [rowDiff, colDiff]
                // Note: colDiff depends on row parity for diagonal neighbors

                // Left & Right
                neighbors.push([r, c - 1]); // Left
                neighbors.push([r, c + 1]); // Right

                // Top & Bottom
                if (isEven) {
                    neighbors.push([r - 1, c - 1]); // Top-Left
                    neighbors.push([r - 1, c]);     // Top-Right
                    neighbors.push([r + 1, c - 1]); // Bottom-Left
                    neighbors.push([r + 1, c]);     // Bottom-Right
                } else {
                    neighbors.push([r - 1, c]);     // Top-Left
                    neighbors.push([r - 1, c + 1]); // Top-Right
                    neighbors.push([r + 1, c]);     // Bottom-Left
                    neighbors.push([r + 1, c + 1]); // Bottom-Right
                }
                return neighbors;
            };

            // Iterative Conflict Resolution
            const resolveConflicts = () => {
                let conflictsFound = true;
                let passes = 0;
                const maxPasses = 10;

                while (conflictsFound && passes < maxPasses) {
                    conflictsFound = false;
                    passes++;

                    hexagons.forEach(hex => {
                        const neighbors = getNeighbors(hex.row, hex.col);
                        const neighborIndices = new Set();

                        neighbors.forEach(([nr, nc]) => {
                            if (gridMap.has(`${nr},${nc}`)) {
                                neighborIndices.add(gridMap.get(`${nr},${nc}`));
                            }
                        });

                        if (neighborIndices.has(hex.doodleIndex)) {
                            conflictsFound = true;
                            // Pick a new valid index
                            let newIndex;
                            let attempts = 0;
                            do {
                                newIndex = Math.floor(Math.random() * doodleAssets.length);
                                attempts++;
                            } while (neighborIndices.has(newIndex) && attempts < 50);

                            hex.doodleIndex = newIndex;
                            gridMap.set(`${hex.row},${hex.col}`, newIndex);
                        }
                    });
                }
                console.log(`Hexagon Grid: Resolved conflicts in ${passes} passes.`);
            };

            resolveConflicts();

            // Expose Validation Function
            window.validateHexGrid = () => {
                let valid = true;
                let conflictCount = 0;
                hexagons.forEach(hex => {
                    const neighbors = getNeighbors(hex.row, hex.col);
                    neighbors.forEach(([nr, nc]) => {
                        if (gridMap.has(`${nr},${nc}`)) {
                            const neighborIndex = gridMap.get(`${nr},${nc}`);
                            if (neighborIndex === hex.doodleIndex) {
                                console.error(`Conflict at [${hex.row},${hex.col}] with neighbor [${nr},${nc}]: Doodle ${hex.doodleIndex}`);
                                valid = false;
                                conflictCount++;
                            }
                        }
                    });
                });
                if (valid) {
                    console.log("%c Hexagon Grid Validated: No Conflicts Found! ", "background: #22c55e; color: #fff");
                    return true;
                } else {
                    console.error(`Hexagon Grid Validation Failed: ${conflictCount} conflicts found.`);
                    return false;
                }
            };

            renderStaticGrid();
        };

        const update = () => {
            ctx.clearRect(0, 0, w, h);

            if (doodleAssets.length > 0) {
                ctx.drawImage(offscreenCanvas, 0, 0);
            }

            // Update Ripples
            for (let i = ripples.length - 1; i >= 0; i--) {
                const r = ripples[i];
                r.radius += r.speed;
                if (r.radius > r.maxRadius) {
                    ripples.splice(i, 1);
                }
            }

            const hasRipples = ripples.length > 0;

            hexagons.forEach(hex => {
                // Decay
                if (hex.intensity > 0) {
                    hex.intensity *= 0.92;
                    if (hex.intensity < 0.01) hex.intensity = 0;
                }

                // Ripple Influence
                if (hasRipples) {
                    ripples.forEach(r => {
                        const dx = hex.x - r.x;
                        const dy = hex.y - r.y;
                        if (Math.abs(dx) < r.radius + 50 && Math.abs(dy) < r.radius + 50) {
                            const d = Math.sqrt(dx * dx + dy * dy);
                            const ringWidth = 60; // Slightly wider ring
                            if (Math.abs(d - r.radius) < ringWidth) {
                                const ringIntensity = (1 - Math.abs(d - r.radius) / ringWidth) * r.strength * (1 - r.radius / r.maxRadius);
                                if (ringIntensity > 0.1) {
                                    hex.intensity += ringIntensity * 0.5;
                                    hex.hue = r.hue; // Adopt ripple color
                                }
                            }
                        }
                    });
                }

                // Clamp
                hex.intensity = Math.min(1, Math.max(0, hex.intensity));

                // Draw Active Hexagons (Doodle Highlight Only)
                if (hex.intensity > 0.01) {
                    const assets = doodleAssets[hex.doodleIndex % doodleAssets.length];
                    if (assets) {
                        const neonImg = assets.neons[hex.hue];
                        if (neonImg) {
                            const iconSize = hexSize * 0.8;

                            ctx.globalAlpha = hex.intensity;
                            ctx.shadowBlur = 15 * hex.intensity;
                            ctx.shadowColor = `hsl(${hex.hue}, 100%, 60%)`;

                            ctx.drawImage(
                                neonImg,
                                hex.x - iconSize / 2,
                                hex.y - iconSize / 2,
                                iconSize,
                                iconSize
                            );

                            ctx.shadowBlur = 0;
                            ctx.globalAlpha = 1;
                        }
                    }
                }
            });

            animationFrameId = requestAnimationFrame(update);
        };

        const handleMouseMove = (e) => {
            mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
        };

        const handleClick = (e) => {
            // Ignore clicks on interactive elements
            if (e.target.closest('a, button, input, textarea, select, [role="button"]')) {
                return;
            }

            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Cycle colors
            const hue = neonColors[colorIndexRef.current % neonColors.length];
            colorIndexRef.current++;

            ripples.push({
                x: x,
                y: y,
                radius: 0,
                maxRadius: Math.max(w, h) * 1.5, // Cover entire screen
                speed: 12,
                strength: 1.2,
                hue: hue
            });
        };

        loadDoodles();
        update();

        window.addEventListener('resize', init);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('click', handleClick);

        return () => {
            window.removeEventListener('resize', init);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('click', handleClick);
            cancelAnimationFrame(animationFrameId);
            observer.disconnect();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: -1,
                background: 'var(--bg-color)',
                transition: 'background 0.3s'
            }}
        />
    );
}
