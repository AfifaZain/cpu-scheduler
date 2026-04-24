
# 🖥️ Multi-Algorithm CPU Scheduling Simulator

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)]()

A comprehensive, interactive web-based simulation tool designed to visualize and analyze CPU Scheduling Algorithms. This project allows users to input process details, execute various scheduling strategies, and compare performance metrics such as Waiting Time, Turnaround Time, and Response Time. It also includes a comparative analysis with Android's Completely Fair Scheduler (CFS).

This project was developed as part of the Operating Systems curriculum to demonstrate deep understanding of process management, scheduling logic, and performance benchmarking.

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation & Setup](#-installation--setup)
- [Usage Guide](#-usage-guide)
- [Algorithms Implemented](#-algorithms-implemented)
- [Performance Metrics](#-performance-metrics)
- [Android CFS Comparison](#-android-cfs-comparison)
- [Project Structure](#-project-structure)
- [Screenshots](#-screenshots)
- [Future Scope](#-future-scope)
- [License](#-license)
- [Author](#-author)

## ✨ Features

- **6+ Scheduling Algorithms:** Supports FCFS, SJF, SRTF, Priority, Round Robin, and Multilevel Queue.
- **Interactive GUI:** Clean, responsive web interface built with vanilla HTML/CSS/JS.
- **Dynamic Visualization:** Real-time Gantt Chart generation using Chart.js.
- **Performance Benchmarking:** Automatic calculation of Average Waiting Time, Turnaround Time, and Response Time.
- **Export Capability:** Option to export simulation results (PDF/CSV).
- **Real-World Analysis:** Dedicated section comparing simulated algorithms with Android's CFS behavior.
- **No Backend Required:** Runs entirely in the browser using client-side JavaScript.
- **Error Handling:** Validates input fields to prevent invalid process data.

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **HTML5** | Structure and semantics of the application |
| **CSS3** | Styling, layout (Grid/Flexbox), and responsiveness |
| **JavaScript (ES6)** | Core logic, scheduling algorithms, and DOM manipulation |
| **Chart.js** | Rendering the dynamic Gantt Chart visualization |
| **html2pdf.js** | Client-side PDF generation for reports |
| **GitHub Pages** | Hosting and deployment |

## 🚀 Installation & Setup

This project is static and requires no server-side installation. You can run it locally or host it online.

### Option 1: Run Locally
1. **Clone the repository:**
   bash
   git clone https://github.com/your-username/cpu-scheduler.git
   
2. **Navigate to the folder:**
   bash
   cd cpu-scheduler
   
3. **Open the project:**
   - Simply double-click `index.html` to open it in your browser.
   - **Recommended:** Use VS Code with the "Live Server" extension for a better development experience.

### Option 2: Host on GitHub Pages
1. Push your code to a GitHub repository.
2. Go to **Settings > Pages**.
3. Select the `main` branch and save.
4. Your site will be live at `https://your-username.github.io/cpu-scheduler`.

## 📖 Usage Guide

1. **Add Processes:**
   - Enter the **Process ID** (e.g., P1).
   - Enter **Arrival Time** (when the process enters the ready queue).
   - Enter **Burst Time** (CPU time required).
   - Enter **Priority** (1 = Highest, higher numbers = Lower priority).
   - Click **Add Process**.

2. **Select Algorithm:**
   - Choose from the dropdown menu (FCFS, SJF, SRTF, etc.).

3. **Run Simulation:**
   - Click **Run Simulation**.
   - View the **Gantt Chart** to see the execution order.
   - Analyze the **Performance Metrics** table below the chart.

4. **Export:**
   - Click **Export Report** to download a PDF summary of your results.

5. **Clear Data:**
   - Use the delete button next to each process in the table to remove specific entries before running a new simulation.

## 🧠 Algorithms Implemented

### 1. First Come First Serve (FCFS)
- **Type:** Non-Preemptive
- **Logic:** Processes are executed in the order of their arrival.
- **Pros:** Simple to implement; low overhead.
- **Cons:** Can suffer from the Convoy Effect (short processes wait for long ones); poor average waiting time.

### 2. Shortest Job First (SJF)
- **Type:** Non-Preemptive
- **Logic:** The process with the smallest burst time is executed first.
- **Pros:** Optimal for minimizing average waiting time.
- **Cons:** Requires knowledge of burst time in advance; can cause starvation for long processes.

### 3. Shortest Remaining Time First (SRTF)
- **Type:** Preemptive
- **Logic:** Similar to SJF, but if a new process arrives with a shorter remaining time than the current process, the CPU switches context.
- **Pros:** Better response time than SJF; optimal for preemptive systems.
- **Cons:** High context switching overhead; requires accurate burst time prediction.

### 4. Priority Scheduling
- **Type:** Non-Preemptive (in this simulation)
- **Logic:** Processes are executed based on priority values.
- **Pros:** Critical processes run first; good for real-time systems.
- **Cons:** Low priority processes may starve indefinitely.

### 5. Round Robin (RR)
- **Type:** Preemptive
- **Logic:** Each process gets a fixed time slot (Quantum = 2ms). If not finished, it goes to the back of the queue.
- **Pros:** Fair CPU sharing; good response time; no starvation.
- **Cons:** Average waiting time can be higher than SJF; performance depends heavily on quantum size.

### 6. Multilevel Queue (MLQ)
- **Type:** Non-Preemptive (between queues)
- **Logic:** Processes are divided into separate queues (e.g., System vs. User). System processes have strict priority over User processes.
- **Pros:** Segregates processes based on behavior; flexible.
- **Cons:** Rigid; can starve lower queues completely.

## 📊 Performance Metrics

The simulator calculates the following key operating system metrics:

1. **Completion Time (CT):** The time at which the process finishes execution.
2. **Turnaround Time (TAT):** Total time taken from arrival to completion.
   math
   TAT = Completion Time - Arrival Time
   
3. **Waiting Time (WT):** Total time the process waited in the ready queue.
   math
   WT = Turnaround Time - Burst Time
   
4. **Response Time (RT):** Time from arrival until the process gets the CPU for the first time.
   math
   RT = First CPU Time - Arrival Time
   

##  Android CFS Comparison

This project addresses **Objective 3 (Contemporary)** by comparing standard academic algorithms with real-world Android behavior.

| Feature | Simulated Algorithms (e.g., RR, Priority) | Android CFS (Completely Fair Scheduler) |
| :--- | :--- | :--- |
| **Basis** | Fixed Burst Time or Priority | **vruntime** (Virtual Runtime) |
| **Preemption** | Fixed Time Quantum or Priority | Dynamic, based on vruntime drift |
| **Fairness** | Static (can starve low priority) | High (aims for equal CPU share) |
| **Complexity** | O(1) or O(N) | O(log N) using Red-Black Trees |
| **Use Case** | Educational / Batch Systems | Modern Mobile / Desktop OS (Linux) |
| **Starvation** | Possible in Priority/MLQ | Prevented via vruntime boosting |

*Note: CFS does not use fixed time slices. It tracks how long a process has run using `vruntime`. The process with the lowest `vruntime` is selected next, ensuring fairness over time.*

## 📂 Project Structure

text
cpu-scheduler/
├── index.html          # Main HTML structure
├── style.css           # Custom CSS styling
├── script.js           # Algorithm logic & Chart.js integration
── README.md           # Project documentation
└── assets/             # (Optional) Images or icons


## 📸 Screenshots

*(Add screenshots of your project here to make the README visually appealing)*

![Input Form](./assets/input.png)
*Figure 1: Process Input Form*

![Gantt Chart](./assets/gantt.png)
*Figure 2: Dynamic Gantt Chart Visualization*

![Metrics](./assets/metrics.png)
*Figure 3: Performance Metrics Dashboard*

##  Future Scope

- [ ] Add **Multi-Level Feedback Queue (MLFQ)** support.
- [ ] Implement **Memory Management** simulation (Page Replacement Algorithms).
- [ ] Add **Dark Mode** toggle.
- [ ] Allow users to customize the **Time Quantum** for Round Robin.
- [ ] Add **Step-by-Step Animation** to show context switching.
- [ ] Integrate **Backend (Node.js/Python)** to save simulation history.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Afifa Zain Apurba**
- **Email:** afifa.zain@northsouth.edu
- **Institution:** North South University
- **Department:** Computer Science and Engineering

---
*Built for Educational Purposes | Operating Systems Project*
