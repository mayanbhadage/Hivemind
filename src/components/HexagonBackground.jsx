import { useEffect, useRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Coffee, Clock, Zap, Code, Brain, Rocket, Star, Heart, Music, Camera, Globe, Anchor, Beer, Gamepad2, Headphones, Terminal, Cpu, Database, Cloud, Server, MountainSnow, Guitar, Cat, Dog, Atom, Settings, Tent, ChessQueen, Binary, Binoculars, Hop, Cookie, GitGraph, Pi, Snowflake, MousePointer, Bug, FileCode, Variable } from 'lucide-react';


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

        // Helper to get grid color (Defined *before* usage)
        const getGridColor = () => {
            return getComputedStyle(document.documentElement).getPropertyValue('--hex-grid-color').trim();
        };

        let animationFrameId;
        let w, h;
        const hexSize = 25;
        const hexagons = [];
        const activeHexagons = new Set();
        const ripples = []; // Store shockwaves
        let gridColor = getGridColor();
        let isDark = document.documentElement.getAttribute('data-theme') === 'dark';

        // Wandering Highlight State (Iter 3: Staggered Batch)
        let activeBatch = []; // Array of { hex, startTime, endTime, assignedHue }
        let nextWindowTime = Date.now() + 1000; // Start shortly after load

        // Doodle Icons
        const icons = [Coffee, Clock, Zap, Code, Brain, Rocket, Star, Heart, Music, Camera, Globe, Anchor, Beer, Gamepad2, Headphones, Terminal, Cpu, Database, Cloud, Server, MountainSnow, Guitar, Cat, Dog, Atom, Settings, Tent, ChessQueen, Binary, Binoculars, Hop, Cookie, GitGraph, Pi, Snowflake, MousePointer, Bug, FileCode, Variable];
        const doodleAssets = [];

        // Neon Color Palettes (Hues)
        const neonColors = [120, 190, 300, 280, 60, 0, 240, 330];

        // Pre-render icons to images
        const loadDoodles = async () => {
            doodleAssets.length = 0;

            const promises = icons.map(async (Icon) => {
                const assets = { base: null, neons: {} };

                // 1. Create Base Image
                const baseSvg = renderToStaticMarkup(
                    <Icon
                        size={hexSize * 1.2}
                        strokeWidth={1.5}
                        color={isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"}
                    />
                );
                assets.base = await loadImage(`data:image/svg+xml;base64,${btoa(baseSvg)}`);

                // 2. Create Neon Images
                const neonPromises = neonColors.map(async (hue) => {
                    const color = `hsl(${hue}, 100%, 60%)`;
                    const neonSvg = renderToStaticMarkup(
                        <Icon
                            size={hexSize * 1.2}
                            strokeWidth={2}
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
            init();
        };

        const loadImage = (src) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.src = src;
                img.onload = () => resolve(img);
                img.onerror = (e) => {
                    console.error("Failed to load image", e);
                    resolve(null);
                };
            });
        };

        // Theme Observer
        const observer = new MutationObserver(() => {
            gridColor = getGridColor();
            isDark = document.documentElement.getAttribute('data-theme') === 'dark';
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
                // Debug Visualization
                if (hex.hasConflict) {
                    offscreenCtx.fillStyle = 'rgba(255, 0, 0, 0.5)';
                    offscreenCtx.beginPath();
                    for (let i = 0; i < 6; i++) {
                        const angle = (Math.PI / 3) * i - Math.PI / 6;
                        const px = hex.x + hexSize * Math.cos(angle);
                        const py = hex.y + hexSize * Math.sin(angle);
                        if (i === 0) offscreenCtx.moveTo(px, py);
                        else offscreenCtx.lineTo(px, py);
                    }
                    offscreenCtx.closePath();
                    offscreenCtx.fill();
                }

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
            activeHexagons.clear();
            gridColor = getGridColor();
            isDark = document.documentElement.getAttribute('data-theme') === 'dark';

            // Reset wandering state on re-init
            activeBatch = [];
            nextWindowTime = Date.now() + 1000;

            const r = hexSize;
            const wHex = Math.sqrt(3) * r;
            const hHex = 2 * r;

            const rows = Math.ceil(h / (hHex * 0.75)) + 2;
            const cols = Math.ceil(w / wHex) + 2;

            // Initial Generation
            for (let row = -1; row < rows; row++) {
                for (let col = -1; col < cols; col++) {
                    const isEvenRow = Math.abs(row) % 2 === 0;
                    const xOffset = isEvenRow ? 0 : (wHex / 2);
                    const cx = col * wHex + xOffset;
                    const cy = row * (hHex * 0.75);

                    // Initial random assignment
                    const doodleIndex = Math.floor(Math.random() * doodleAssets.length);

                    const hex = {
                        row, col,
                        x: cx,
                        y: cy,
                        intensity: 0,
                        hue: 180,
                        doodleIndex: doodleIndex,
                        neighbors: [], // Restore neighbors for conflict resolution
                        hasConflict: false
                    };
                    hexagons.push(hex);
                }
            }

            // Link Neighbors (Distance-Based for Robustness)
            // Physics logic: link anything close enough to be a neighbor.
            // Dist between neighbors is ~sqrt(3)*r ~= 43px.
            // Next closest (diagonal skipping 1) is ~75px.
            // Check threshold: 60px squared = 3600.
            const thresholdSq = 60 * 60;

            hexagons.forEach(hex => {
                // Brute force is fast enough for initialization frames
                hexagons.forEach(neighbor => {
                    if (hex === neighbor) return;
                    const dx = hex.x - neighbor.x;
                    const dy = hex.y - neighbor.y;
                    const distSq = dx * dx + dy * dy;

                    if (distSq < thresholdSq) {
                        hex.neighbors.push(neighbor);
                    }
                });
            });

            // Iterative Conflict Resolution for Doodles
            const resolveConflicts = () => {
                let conflictsFound = true;
                let passes = 0;
                const maxPasses = 50;

                while (conflictsFound && passes < maxPasses) {
                    conflictsFound = false;
                    passes++;
                    const useDeterministic = passes > 20;

                    hexagons.forEach(hex => {
                        const neighborIndices = new Set();
                        hex.neighbors.forEach(n => neighborIndices.add(n.doodleIndex));

                        if (neighborIndices.has(hex.doodleIndex)) {
                            conflictsFound = true;
                            // Deterministic Solver
                            const validIndices = [];
                            for (let i = 0; i < doodleAssets.length; i++) {
                                if (!neighborIndices.has(i)) validIndices.push(i);
                            }

                            if (validIndices.length > 0) {
                                if (useDeterministic) {
                                    hex.doodleIndex = validIndices[0];
                                } else {
                                    hex.doodleIndex = validIndices[Math.floor(Math.random() * validIndices.length)];
                                }
                            }
                        }
                    });
                }

                // Final Unconditional Check: Flag conflicts RED
                hexagons.forEach(hex => {
                    const neighborIndices = new Set();
                    hex.neighbors.forEach(n => neighborIndices.add(n.doodleIndex));
                    if (neighborIndices.has(hex.doodleIndex)) {
                        hex.hasConflict = true;
                        // Force a random change as a last ditch if red appears
                        const validIndices = [];
                        for (let i = 0; i < doodleAssets.length; i++) {
                            if (!neighborIndices.has(i)) validIndices.push(i);
                        }
                        if (validIndices.length > 0) hex.doodleIndex = validIndices[0];
                    } else {
                        hex.hasConflict = false;
                    }
                });
            };

            resolveConflicts();
            renderStaticGrid();
        };

        const update = () => {
            ctx.clearRect(0, 0, w, h);

            if (doodleAssets.length > 0) {
                ctx.drawImage(offscreenCanvas, 0, 0);
            }

            const now = Date.now();

            // --- Wandering Highlight Logic (Iter 3: Staggered Batch) ---

            // 1. Generate New Batch
            if (now > nextWindowTime && hexagons.length > 0) {
                const count = 25;
                // Filter for Top 40% of screen
                const topCandidateHexes = hexagons.filter(h => h.y < h * 0.4);
                const candidates = topCandidateHexes.length > count ? topCandidateHexes : hexagons;

                activeBatch = [];
                const usedIndices = new Set();

                // Color Pool Shuffling
                const colorPool = [...neonColors, ...neonColors, ...neonColors];
                // Fisher-Yates shuffle
                for (let i = colorPool.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [colorPool[i], colorPool[j]] = [colorPool[j], colorPool[i]];
                }

                let colorIdx = 0;

                // Select 10 unique hexes
                while (activeBatch.length < count && usedIndices.size < candidates.length) {
                    const idx = Math.floor(Math.random() * candidates.length);
                    if (!usedIndices.has(idx)) {
                        usedIndices.add(idx);

                        // Stagger start time: Random delay between 0 and 8000ms
                        // This ensures they appear scattered throughout the 10s window
                        const delay = Math.random() * 8000;
                        const startTime = now + delay;

                        activeBatch.push({
                            hex: candidates[idx],
                            startTime: startTime,
                            endTime: startTime + 1800, // 1.8s hold duration
                            assignedHue: colorPool[colorIdx % colorPool.length]
                        });
                        colorIdx++;
                    }
                }

                nextWindowTime = now + 10000; // Next batch in 10 seconds
            }

            // 2. Process Active Batch
            // Check if any hexes in the batch are currently "alive" based on their individual timeline
            activeBatch.forEach(item => {
                if (now >= item.startTime && now < item.endTime) {
                    item.hex.intensity = 1.0;
                    if (!activeHexagons.has(item.hex)) {
                        item.hex.hue = item.assignedHue;
                        activeHexagons.add(item.hex);
                    }
                }
            });

            // 1. Update Ripples (Expansion & Acceleration)
            for (let i = ripples.length - 1; i >= 0; i--) {
                const r = ripples[i];
                r.speed += r.acceleration;
                r.radius += r.speed;

                // Remove dead ripples
                if (r.radius > r.maxRadius) {
                    ripples.splice(i, 1);
                    continue;
                }

                // 2. Ignite Hexagons (Spatial Check)
                const ringWidth = r.speed * 3.0;
                const innerRadiusSq = (r.radius - ringWidth) ** 2;
                const outerRadiusSq = (r.radius) ** 2;

                hexagons.forEach(hex => {
                    const dx = hex.x - r.x;
                    const dy = hex.y - r.y;
                    const distSq = dx * dx + dy * dy;

                    if (distSq >= innerRadiusSq && distSq <= outerRadiusSq) {
                        // Ignite!
                        if (hex.intensity < 0.3) {
                            hex.intensity = 1.0;
                            hex.hue = r.hue;
                            activeHexagons.add(hex);
                        }
                    }
                });
            }

            // 3. Render Active Hexagons (Fade Out)
            ctx.globalCompositeOperation = 'lighter';

            activeHexagons.forEach(hex => {
                hex.intensity *= 0.92; // Fast decay for "spark" look

                if (hex.intensity < 0.01) {
                    hex.intensity = 0;
                    activeHexagons.delete(hex);
                    return;
                }

                const assets = doodleAssets[hex.doodleIndex % doodleAssets.length];
                if (assets) {
                    const neonImg = assets.neons[hex.hue];
                    if (neonImg) {
                        const iconSize = hexSize * 0.8;
                        const alpha = Math.min(1, hex.intensity);
                        ctx.globalAlpha = alpha;

                        ctx.drawImage(
                            neonImg,
                            hex.x - iconSize / 2,
                            hex.y - iconSize / 2,
                            iconSize,
                            iconSize
                        );
                    }
                }
            });

            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 1;

            animationFrameId = requestAnimationFrame(update);
        };

        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
                active: true
            };
        };

        const getHexAt = (x, y) => {
            // Simple brute force closest hex for interaction
            for (const hex of hexagons) {
                const dx = hex.x - x;
                const dy = hex.y - y;
                const dSq = dx * dx + dy * dy;
                if (dSq < hexSize * hexSize) {
                    return hex;
                }
            }
            return null;
        };

        const handleClick = (e) => {
            if (e.target.closest('a, button, input, textarea, select, [role="button"], .glass-panel')) {
                return;
            }

            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerHex = getHexAt(x, y);

            // Updated Interaction Logic:
            // Only trigger shockwave if specific hexagon is highlighted (intensity > 0.5)
            // AND we found a hex at that location.
            if (!centerHex || centerHex.intensity <= 0.5) {
                return;
            }

            // Iter 3: Inherit hex color
            const hue = centerHex.hue || neonColors[colorIndexRef.current % neonColors.length];

            // Should probably increment random ref just to keep entropy moving, 
            // even if we don't use it for this specific click
            colorIndexRef.current++;

            // Create Shockwave
            ripples.push({
                x: x,
                y: y,
                radius: 0,
                maxRadius: Math.max(w, h) * 1.5,
                speed: 10,         // Start fast
                acceleration: 0.5, // Get faster
                hue: hue
            });

            // Maintain intensity on click
            centerHex.intensity = 1.0;
            centerHex.hue = hue;
            activeHexagons.add(centerHex);
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
