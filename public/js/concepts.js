/* =========================================
   CONCEPT SHOWCASE SCRIPTS
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    initNeuralGraph();
    initTerminal();
});

/* =========================================
   1. NEURAL GRAPH (CANVAS)
   ========================================= */
function initNeuralGraph() {
    const canvas = document.getElementById('neural-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let nodes = [];

    // Resize
    const resize = () => {
        width = canvas.parentElement.offsetWidth;
        height = canvas.parentElement.offsetHeight;
        canvas.width = width;
        canvas.height = height;
    };
    window.addEventListener('resize', resize);
    resize();

    // Node Class
    class Node {
        constructor(x, y, label) {
            this.x = x || Math.random() * width;
            this.y = y || Math.random() * height;
            this.vx = (Math.random() - 0.5) * 1;
            this.vy = (Math.random() - 0.5) * 1;
            this.label = label;
            this.radius = label ? 8 : 3; // Larger for core nodes
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.label ? '#60a5fa' : '#334155';
            ctx.fill();

            if (this.label) {
                ctx.fillStyle = '#fff';
                ctx.font = '14px Inter';
                ctx.fillText(this.label, this.x + 15, this.y + 5);
            }
        }
    }

    // Create Nodes
    const labels = ["Salesforce", "Data Eng", "AI & Analytics", "SAP"];
    // Add central nodes
    labels.forEach(l => nodes.push(new Node(null, null, l)));
    // Add background dust
    for (let i = 0; i < 30; i++) nodes.push(new Node(null, null, null));

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw Connections
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)';
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.stroke();
                }
            }
        }

        // Update & Draw Nodes
        nodes.forEach(node => {
            node.update();
            node.draw();
        });

        requestAnimationFrame(animate);
    }
    animate();
}

/* =========================================
   3. COMMAND TERMINAL
   ========================================= */
function initTerminal() {
    const lines = document.querySelectorAll('.cmd-line');
    const display = document.querySelector('.terminal-output');
    const displayTitle = display?.querySelector('h3');
    const displayDesc = display?.querySelector('p');

    const data = {
        'crm': { title: 'Salesforce Optimized', desc: 'Running Apex diagnostics... Custom LWC deployed. Sales velocity increased by 40%.' },
        'data': { title: 'Data Pipeline Active', desc: 'ETL process initialized. Warehousing synced. Real-time stream available.' },
        'ai': { title: 'Neural Model Trained', desc: 'LLM agents deployed. Predictive accuracy at 98.4%. Insight generation active.' }
    };

    lines.forEach(line => {
        line.addEventListener('click', () => {
            const key = line.getAttribute('data-cmd');
            if (data[key] && display) {
                // Hide first
                display.classList.remove('active');

                // Simulate processing
                setTimeout(() => {
                    displayTitle.innerText = data[key].title;
                    displayDesc.innerText = data[key].desc;
                    display.classList.add('active');
                }, 200);
            }
        });
    });
}
