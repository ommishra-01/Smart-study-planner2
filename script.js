let subjects = JSON.parse(localStorage.getItem("subjects")) || [];
let chart;

function saveData() {
    localStorage.setItem("subjects", JSON.stringify(subjects));
}

function addSubject() {
    let name = subject.value;
    let examDate = document.getElementById("examDate").value;
    let totalHours = hours.value;

    if (!name || !examDate || !totalHours) {
        alert("Fill all fields");
        return;
    }

    let daysLeft = Math.ceil((new Date(examDate) - new Date()) / (1000 * 3600 * 24));
    if (daysLeft <= 0) {
        alert("Exam date must be future");
        return;
    }

    subjects.push({
        name,
        daysLeft,
        hoursPerDay: (totalHours / daysLeft).toFixed(2),
        progress: 0
    });

    saveData();
    displaySubjects();
    updateChart();
}

function displaySubjects() {
    planTable.innerHTML = `
    <tr>
        <th>Subject</th>
        <th>Days Left</th>
        <th>Hours/Day</th>
        <th>Progress</th>
        <th>Tip</th>
        <th>Action</th>
    </tr>`;

    subjects.forEach((s, i) => {
        let tip = getSmartTip(s);

        let row = planTable.insertRow();
        row.innerHTML = `
            <td>${s.name}</td>
            <td>${s.daysLeft}</td>
            <td>${s.hoursPerDay}</td>
            <td>
                <progress value="${s.progress}" max="100"></progress>
                <button onclick="updateProgress(${i})">+10%</button>
            </td>
            <td>${tip}</td>
            <td><button onclick="deleteSubject(${i})">❌</button></td>
        `;
    });
}

function getSmartTip(subject) {
    if (subject.daysLeft < 5) return "⚠ Focus daily + revise";
    if (subject.hoursPerDay > 3) return "📘 Split into sessions";
    if (subject.progress < 30) return "🚀 Increase consistency";
    return "✅ On track";
}

function updateProgress(i) {
    subjects[i].progress = Math.min(100, subjects[i].progress + 10);
    saveData();
    displaySubjects();
    updateChart();
}

function deleteSubject(i) {
    subjects.splice(i, 1);
    saveData();
    displaySubjects();
    updateChart();
}

function updateChart() {
    let ctx = document.getElementById("progressChart").getContext("2d");

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: subjects.map(s => s.name),
            datasets: [{
                label: 'Progress %',
                data: subjects.map(s => s.progress)
            }]
        }
    });
}

displaySubjects();
updateChart();