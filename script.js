let processes = [];
let ganttChartInstance = null;

// --- 1. Process Management ---

function addProcess() {
    const id = document.getElementById('pId').value;
    const arrival = parseInt(document.getElementById('arrival').value);
    const burst = parseInt(document.getElementById('burst').value);
    const priority = parseInt(document.getElementById('priority').value);

    if (!id || isNaN(arrival) || isNaN(burst) || isNaN(priority)) {
        alert("Please fill all fields correctly.");
        return;
    }

    processes.push({ id, arrival, burst, priority, originalBurst: burst });
    renderProcessTable();
    
    // Clear inputs
    document.getElementById('pId').value = '';
    document.getElementById('arrival').value = '';
    document.getElementById('burst').value = '';
    document.getElementById('priority').value = '';
    document.getElementById('pId').focus();
}

function removeProcess(index) {
    processes.splice(index, 1);
    renderProcessTable();
}

function renderProcessTable() {
    const tbody = document.querySelector('#processTable tbody');
    tbody.innerHTML = '';
    processes.forEach((p, index) => {
        const row = `<tr>
            <td>${p.id}</td>
            <td>${p.arrival}</td>
            <td>${p.burst}</td>
            <td>${p.priority}</td>
            <td><button class="delete-btn" onclick="removeProcess(${index})">X</button></td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

// --- 2. Scheduling Algorithms ---

function runSimulation() {
    if (processes.length === 0) {
        alert("Add processes first!");
        return;
    }

    const algo = document.getElementById('algoSelect').value;
    let result = [];

    // Deep copy processes to avoid modifying original data
    let procs = JSON.parse(JSON.stringify(processes));

    switch (algo) {
        case 'FCFS': result = simulateFCFS(procs); break;
        case 'SJF': result = simulateSJF(procs); break;
        case 'SRTF': result = simulateSRTF(procs); break;
        case 'Priority': result = simulatePriority(procs); break;
        case 'RR': result = simulateRR(procs, 2); break; // Quantum 2
        case 'MLQ': result = simulateMLQ(procs); break;
    }

    calculateAndDisplayMetrics(result, algo);
}

// Helper: Sort by Arrival
function sortByArrival(a, b) { return a.arrival - b.arrival; }

// FCFS
function simulateFCFS(procs) {
    procs.sort(sortByArrival);
    let time = 0;
    let gantt = [];
    
    procs.forEach(p => {
        if (time < p.arrival) time = p.arrival;
        gantt.push({ id: p.id, start: time, end: time + p.burst });
        p.completion = time + p.burst;
        time = p.completion;
    });
    return { gantt, processes: procs };
}

// SJF (Non-Preemptive)
function simulateSJF(procs) {
    let time = 0;
    let completed = 0;
    let gantt = [];
    let n = procs.length;
    let isCompleted = new Array(n).fill(false);

    while (completed < n) {
        // Find process with shortest burst among arrived
        let idx = -1;
        let minBurst = Infinity;

        for (let i = 0; i < n; i++) {
            if (procs[i].arrival <= time && !isCompleted[i]) {
                if (procs[i].burst < minBurst) {
                    minBurst = procs[i].burst;
                    idx = i;
                }
            }
        }

        if (idx !== -1) {
            gantt.push({ id: procs[idx].id, start: time, end: time + procs[idx].burst });
            time += procs[idx].burst;
            procs[idx].completion = time;
            isCompleted[idx] = true;
            completed++;
        } else {
            time++; // Idle time
        }
    }
    return { gantt, processes: procs };
}

// SRTF (Preemptive)
function simulateSRTF(procs) {
    let time = 0;
    let completed = 0;
    let gantt = [];
    let n = procs.length;
    let isCompleted = new Array(n).fill(false);
    let lastProcess = null;

    while (completed < n) {
        let idx = -1;
        let minRem = Infinity;

        for (let i = 0; i < n; i++) {
            if (procs[i].arrival <= time && !isCompleted[i]) {
                if (procs[i].burst < minRem) {
                    minRem = procs[i].burst;
                    idx = i;
                }
            }
        }

        if (idx !== -1) {
            if (lastProcess !== procs[idx].id) {
                // New process started or context switch
                if(lastProcess) {
                     // Update previous end time if needed (simplified for visual)
                }
                gantt.push({ id: procs[idx].id, start: time, end: time + 1 });
                lastProcess = procs[idx].id;
            } else {
                // Continue same process
                gantt[gantt.length - 1].end = time + 1;
            }

            procs[idx].burst--;
            time++;

            if (procs[idx].burst === 0) {
                procs[idx].completion = time;
                isCompleted[idx] = true;
                completed++;
                lastProcess = null;
            }
        } else {
            time++;
        }
    }
    return { gantt, processes: procs };
}

// Priority (Non-Preemptive)
function simulatePriority(procs) {
    let time = 0;
    let completed = 0;
    let gantt = [];
    let n = procs.length;
    let isCompleted = new Array(n).fill(false);

    while (completed < n) {
        let idx = -1;
        let highestPriority = Infinity; // Lower number = Higher priority

        for (let i = 0; i < n; i++) {
            if (procs[i].arrival <= time && !isCompleted[i]) {
                if (procs[i].priority < highestPriority) {
                    highestPriority = procs[i].priority;
                    idx = i;
                }
            }
        }

        if (idx !== -1) {
            gantt.push({ id: procs[idx].id, start: time, end: time + procs[idx].burst });
            time += procs[idx].burst;
            procs[idx].completion = time;
            isCompleted[idx] = true;
            completed++;
        } else {
            time++;
        }
    }
    return { gantt, processes: procs };
}

// Round Robin
function simulateRR(procs, quantum) {
    let time = 0;
    let completed = 0;
    let gantt = [];
    let n = procs.length;
    let queue = [];
    
    // Sort by arrival initially
    procs.sort(sortByArrival);
    
    // Add first process
    if(procs.length > 0) queue.push(0);
    
    let isCompleted = new Array(n).fill(false);
    let currentIdx = 0;

    while (completed < n) {
        if (queue.length === 0) {
            time++;
            // Check for new arrivals to add to queue
            for(let i=0; i<n; i++) {
                if(procs[i].arrival <= time && !isCompleted[i] && !queue.includes(i)) {
                    queue.push(i);
                }
            }
            continue;
        }

        currentIdx = queue.shift();
        let p = procs[currentIdx];

        let execTime = Math.min(p.burst, quantum);
        gantt.push({ id: p.id, start: time, end: time + execTime });
        
        time += execTime;
        p.burst -= execTime;

        // Check for new arrivals during execution
        for(let i=0; i<n; i++) {
            if(procs[i].arrival <= time && !isCompleted[i] && i !== currentIdx && !queue.includes(i)) {
                queue.push(i);
            }
        }

        if (p.burst > 0) {
            queue.push(currentIdx);
        } else {
            p.completion = time;
            isCompleted[currentIdx] = true;
            completed++;
        }
    }
    return { gantt, processes: procs };
}

// Multilevel Queue (Simplified: 2 Queues)
// Queue 1: Priority <= 3 (System), Queue 2: Priority > 3 (User)
// FCFS within queues, Queue 1 has strict priority over Queue 2
function simulateMLQ(procs) {
    let time = 0;
    let gantt = [];
    
    // Split into two queues
    let q1 = procs.filter(p => p.priority <= 3).sort(sortByArrival);
    let q2 = procs.filter(p => p.priority > 3).sort(sortByArrival);

    // Process Q1 first completely (Strict Priority between queues)
    // Note: In real MLQ, Q1 might get 80% CPU, Q2 20%. Here we do strict for simplicity.
    
    let allProcs = [...q1, ...q2]; // Merge back for metric calculation later
    
    // Run Q1
    q1.forEach(p => {
        if (time < p.arrival) time = p.arrival;
        gantt.push({ id: p.id + "(Sys)", start: time, end: time + p.burst });
        p.completion = time + p.burst;
        time = p.completion;
    });

    // Run Q2
    q2.forEach(p => {
        if (time < p.arrival) time = p.arrival;
        gantt.push({ id: p.id + "(Usr)", start: time, end: time + p.burst });
        p.completion = time + p.burst;
        time = p.completion;
    });

    return { gantt, processes: allProcs };
}

// --- 3. Metrics & Visualization ---

function calculateAndDisplayMetrics(result, algoName) {
    const { gantt, processes } = result;
    
    // Calculate Metrics
    let totalWait = 0, totalTAT = 0, totalRT = 0;
    const tbody = document.querySelector('#resultTable tbody');
    tbody.innerHTML = '';

    processes.forEach(p => {
        // Restore original burst for calculation
        let burst = p.originalBurst;
        let tat = p.completion - p.arrival;
        let wait = tat - burst;
        
        // Response Time: First time it got CPU - Arrival
        // Find first entry in Gantt for this process
        let firstEntry = gantt.find(g => g.id.startsWith(p.id)); 
        let rt = firstEntry ? firstEntry.start - p.arrival : 0;

        totalWait += wait;
        totalTAT += tat;
        totalRT += rt;

        const row = `<tr>
            <td>${p.id}</td>
            <td>${p.completion}</td>
            <td>${tat}</td>
            <td>${wait}</td>
            <td>${rt}</td>
        </tr>`;
        tbody.innerHTML += row;
    });

    const n = processes.length;
    document.getElementById('avgWait').innerText = (totalWait / n).toFixed(2);
    document.getElementById('avgTAT').innerText = (totalTAT / n).toFixed(2);
    document.getElementById('avgRT').innerText = (totalRT / n).toFixed(2);

    drawGanttChart(gantt);
}

function drawGanttChart(ganttData) {
    const ctx = document.getElementById('ganttChart').getContext('2d');
    
    if (ganttChartInstance) {
        ganttChartInstance.destroy();
    }

    // Prepare data for Chart.js (Horizontal Bar Chart)
    const labels = ganttData.map((g, i) => `Time ${g.start}-${g.end}`);
    const data = ganttData.map(g => g.end - g.start);
    const backgroundColors = ganttData.map(() => `hsl(${Math.random() * 360}, 70%, 60%)`);
    
    // We need to stack them visually. 
    // Chart.js stacked bar is tricky for Gantt. 
    // Easier approach: Use a Scatter plot or a customized Bar chart.
    // Simplified approach for beginners: Just show duration bars sequentially.
    
    // Better Gantt Approach using Bar Chart with offsets
    const datasets = ganttData.map((g, i) => ({
        label: g.id,
        data: [{ x: g.start, y: i }], // Using Scatter for precise positioning
        backgroundColor: `hsl(${i * 50}, 70%, 60%)`,
        borderColor: 'white',
        borderWidth: 1,
        barThickness: 40
    }));

    // Actually, let's use a simpler Floating Bar approach if possible, 
    // but standard Chart.js requires a plugin for floating bars easily.
    // Let's stick to a standard Bar Chart where we stack "Idle" + "Process" to push it to the right start time.
    
    const labelsSimple = ganttData.map(g => g.id);
    const dataSimple = ganttData.map(g => g.end - g.start);
    // Calculate offset (start time)
    const offsets = ganttData.map(g => g.start);

    ganttChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labelsSimple,
            datasets: [
                {
                    label: 'Wait/Idle Time',
                    data: offsets,
                    backgroundColor: 'transparent',
                    borderWidth: 0
                },
                {
                    label: 'Execution Time',
                    data: dataSimple,
                    backgroundColor: offsets.map(() => `hsl(${Math.random() * 360}, 70%, 60%)`),
                    borderWidth: 1
                }
            ]
        },
        options: {
            indexAxis: 'y',
            scales: {
                x: {
                    stacked: true,
                    title: { display: true, text: 'Time' }
                },
                y: {
                    stacked: true
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) { label += ': '; }
                            if (context.datasetIndex === 1) {
                                let start = offsets[context.dataIndex];
                                let end = start + context.raw;
                                label += ` (${start} - ${end})`;
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
}

function exportPDF() {
    const element = document.getElementById('resultsArea').parentNode; // Capture main content
    // Simple alert for demo, in real implementation use html2pdf
    alert("In a full deployment, this would download a PDF of your results.");
    // html2pdf().from(element).save(); 
}