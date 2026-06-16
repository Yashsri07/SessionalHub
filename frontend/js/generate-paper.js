let selectedSubject = 'DBMS';

document.querySelectorAll('.subject-card').forEach((card) => {
  card.addEventListener('click', () => {

    if (card.dataset.s !== 'DBMS') {
      alert('🚧 This subject is under development. Currently only DBMS is available.');
      return;
    }

    document.querySelectorAll('.subject-card').forEach((c) => 
      c.classList.remove('selected')
    );

    card.classList.add('selected');
    selectedSubject = card.dataset.s;
  });
});

let selectedSubject = '';

let selectedUnits = [];
// document.querySelectorAll('.subject-card').forEach((card) => {
//   card.addEventListener('click', () => {
//     document.querySelectorAll('.subject-card').forEach((c) => c.classList.remove('selected'));
//     card.classList.add('selected');
//     selectedSubject = card.dataset.s;
//   });
// });

function toggleTopics(id, show) {
  document.getElementById(id).classList.toggle('hidden', !show);
}

function goStep(n) {
  [1, 2, 3, 4].forEach((i) =>
    document.getElementById('step' + i).classList.add('hidden')
  );

  document.getElementById('step' + n).classList.remove('hidden');

  if (n === 2) {
    document.getElementById('subjectLabel').textContent = selectedSubject;
  }
}
  if (n === 2) document.getElementById('subjectLabel').textContent = selectedSubject;

  if (n === 2) {
    document.getElementById('subjectLabel').textContent = selectedSubject;
  }

  if (n === 3) {
    console.log('Selected Subject:', selectedSubject);
    document.getElementById('selectedSummary').textContent = selectedSubject + ' · Topics Selected';
  }


  
  


async function loadSubjects() {
  const response = await fetch('http://127.0.0.1:8000/subjects');

  const data = await response.json();

  const grid = document.getElementById('subjectGrid');

  grid.innerHTML = '';

  data.subjects.forEach((subject) => {
    const card = document.createElement('div');

    card.className = 'subject-card';

    card.innerHTML = subject;

    card.addEventListener('click', () => {
      document.querySelectorAll('.subject-card').forEach((c) => c.classList.remove('selected'));

      card.classList.add('selected');

      selectedSubject = subject;

      console.log(selectedSubject);
      await loadUnits(subject);
    });

    grid.appendChild(card);
  });
}

async function loadUnits(subject) {
  const response = await fetch(`http://127.0.0.1:8000/units/${subject}`);

  const data = await response.json();

  // create unit checkboxes
}

async function generatePaper() {
  if (!selectedSubject) {
    alert('Please select a subject');

    return;
  }
  const payload = {
    subject: selectedSubject,

    units: [1],

    difficulty: document.getElementById('difficulty').value,

    marks: parseInt(document.getElementById('marks').value),
  };
  console.log(payload);
  try {
    const response = await fetch('http://127.0.0.1:8000/generate-paper', {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(payload),
    });

    const data = await response.json();

    document.getElementById('generatedPaper').textContent = data.paper;
    goStep(4);
  } catch (error) {
    console.error(error);

    alert('Failed to generate paper');
  }
}

function downloadPaper() {
  window.open('http://127.0.0.1:8000/download-paper');
}

window.onload = () => {
  loadSubjects();
};

