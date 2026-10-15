const today = new Date();
const dateString = today.toLocaleDateString('en-GB');

function updateDate(){
  const el = document.getElementById('current-date');
  if(el) el.textContent = `Date: ${dateString}`;
}
updateDate();

function showReport(name, work, pending, issues, date){
  document.getElementById('reportContent').innerHTML = `
    <h3>Daily Report - ${date}</h3>
    <p><strong>Employee:</strong> ${name}</p>
    <p><strong>Work Done:</strong> ${work}</p>
    <p><strong>Pending:</strong> ${pending || 'Nothing'}</p>
    <p><strong>Issues:</strong> ${issues || 'No issues'}</p>
    <button onclick="copyReport()" style="background:#00ff88;color:black;width:100%;padding:12px;border-radius:8px;border:none;font-weight:bold;margin-top:10px;">📋 Copy Report</button>
  `;
  document.getElementById('saveReportBtn').style.display='block';
}

document.getElementById('reportForm').addEventListener('submit', function(e){
  e.preventDefault();
  const name = document.getElementById('employeeName').value;
  const work = document.getElementById('completed').value;
  const pending = document.getElementById('pending').value;
  const issues = document.getElementById('issues').value;
  showReport(name, work, pending, issues, dateString);
});

function copyReport(){
  navigator.clipboard.writeText(document.getElementById('reportContent').innerText);
  alert('Copied!');
}
function saveReport(){
  const data = {
    date: dateString,
    name: document.getElementById('employeeName').value,
    completed: document.getElementById('completed').value,
    pending: document.getElementById('pending').value,
    issues: document.getElementById('issues').value
  };
  let reports = JSON.parse(localStorage.getItem('reports')) || [];
  reports.push(data);
  localStorage.setItem('reports', JSON.stringify(reports));
  showPreviousReports();
  alert('Saved!');
}
function showPreviousReports(){
  const div = document.getElementById('reportHistory');
  let reports = JSON.parse(localStorage.getItem('reports')) || [];
  if(reports.length===0){ div.innerHTML='<p>No previous reports</p>'; return; }
  div.innerHTML='';
  for(let i=reports.length-1; i>=0; i--){
    const r = reports[i];
    div.innerHTML += `<div class="history-item"><span><strong>${r.date}</strong> - ${r.name}</span><span><button class="view-btn" onclick="loadReport(${i})">View</button><button class="del-btn" onclick="deleteReport(${i})">Delete</button></span></div>`;
  }
}
function loadReport(i){
  const reports = JSON.parse(localStorage.getItem('reports')) || [];
  const r = reports[i];
  document.getElementById('employeeName').value = r.name;
  document.getElementById('completed').value = r.completed;
  document.getElementById('pending').value = r.pending;
  document.getElementById('issues').value = r.issues;
  showReport(r.name, r.completed, r.pending, r.issues, r.date);
  window.scrollTo({top:0, behavior:'smooth'});
}
function deleteReport(i){
  let reports = JSON.parse(localStorage.getItem('reports')) || [];
  if(confirm('Delete?')){
    reports.splice(i,1);
    localStorage.setItem('reports', JSON.stringify(reports));
    showPreviousReports();
  }
}
document.getElementById('saveReportBtn').addEventListener('click', saveReport);
showPreviousReports();