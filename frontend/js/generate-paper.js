let selectedSubject = '';

// document.querySelectorAll('.subject-card').forEach((card) => {
//   card.addEventListener('click', async () => {
//     if (!subject.enabled) {
//       alert('🚧 Coming Soon');
//       return;
//     }

//     document.querySelectorAll('.subject-card').forEach((c) => c.classList.remove('selected'));

//     card.classList.add('selected');

//     selectedSubject = subject.name;

//     await loadUnits(subject.name);
//   });
// });

// let selectedSubject = '';

let selectedUnits = [];
// document.querySelectorAll('.subject-card').forEach((card) => {
//   card.addEventListener('click', () => {
//     document.querySelectorAll('.subject-card').forEach((c) => c.classList.remove('selected'));
//     card.classList.add('selected');
//     selectedSubject = card.dataset.s;
//   });
// });
let selectedTopics = [];

function toggleTopics(id, show) {
  document.getElementById(id).classList.toggle('hidden', !show);
}

function goStep(n) {
  [1, 2, 3, 4].forEach((i) => document.getElementById('step' + i).classList.add('hidden'));

  document.getElementById('step' + n).classList.remove('hidden');

  if (n === 2) {
    document.getElementById('subjectLabel').textContent = selectedSubject;
  }

  if (n === 3) {
    selectedTopics = [];

    document.querySelectorAll('.topic-item input:checked').forEach((checkbox) => {
      const label = document.querySelector(`label[for="${checkbox.id}"]`);

      selectedTopics.push(label.textContent);
    });

    document.getElementById('selectedSummary').textContent =
      `${selectedSubject} · ${selectedTopics.length} topics selected`;

    renderSelectedTopics();
  }
}

async function loadSubjects() {
  // const response = await fetch('http://127.0.0.1:3000/api/paper/subjects');

  // const data = await response.json();

  const response = await fetch('/subjects');
  const data = await response.json();

  console.log(data);

  const grid = document.getElementById('subjectGrid');

  grid.innerHTML = '';

  data.subjects.forEach((subject, index) => {
    const card = document.createElement('div');

    card.className = 'subject-card';

    if (!subject.enabled) {
      card.classList.add('disabled');
    }

    card.innerHTML = `
      <div class="subj-name">${subject.name}</div>
      <div class="subj-code">${subject.code}</div>
      <div class="subj-meta">${subject.units} Units</div>
      ${!subject.enabled ? '<span class="coming-soon">Coming Soon</span>' : ''}
    `;

    // First enabled subject auto select
    if (index === 0 && subject.enabled) {
      card.classList.add('selected');
      selectedSubject = subject.name;
      loadUnits(subject.name);
    }

    card.addEventListener('click', async () => {
      if (!subject.enabled) {
        alert('🚧 Coming Soon');
        return;
      }

      document.querySelectorAll('.subject-card').forEach((c) => c.classList.remove('selected'));

      card.classList.add('selected');

      selectedSubject = subject.name;

      console.log('Selected Subject:', selectedSubject);

      await loadUnits(subject.name);
    });

    grid.appendChild(card);
  });
}

async function loadUnits(subject) {
  const response = await fetch(`/units/${encodeURIComponent(subject)}`);

  const data = await response.json();

  const container = document.getElementById('unitContainer');

  container.innerHTML = '';

  data.units.forEach((unit) => {
    let topicsHTML = '';

    unit.topics.forEach((topic, index) => {
      topicsHTML += `
    <div class="topic-item">
      <input
        type="checkbox"
        id="topic${unit.number}_${index}"
        class="unit-${unit.number}"
        checked
      />
      <label for="topic${unit.number}_${index}">
        ${topic}
      </label>
    </div>
  `;
    });

    const block = document.createElement('div');

    block.className = 'unit-block';

    block.innerHTML = `
  <div class="unit-header">
    <input
      type="checkbox"
      id="unit${unit.number}"
      value="${unit.number}"
      checked
      onchange="toggleUnitTopics(${unit.number}, this.checked)"
    />

    <label for="unit${unit.number}">
      Unit ${unit.number}
    </label>
  </div>

  <div class="topics-list">
    ${topicsHTML}
  </div>
`;
    container.appendChild(block);
  });
}

function toggleUnitTopics(unitNumber, isChecked) {
  document.querySelectorAll(`.unit-${unitNumber}`).forEach((checkbox) => {
    checkbox.checked = isChecked;
  });
}

function renderSelectedTopics() {
  const container = document.getElementById('selectedTopics');

  container.innerHTML = '';

  selectedTopics.forEach((topic) => {
    const tag = document.createElement('span');

    tag.className = 'tag';

    tag.textContent = topic;

    container.appendChild(tag);
  });
}

async function generatePaper() {
  selectedUnits = [];

  document.querySelectorAll('#unitContainer .unit-header input:checked').forEach((checkbox) => {
    selectedUnits.push(parseInt(checkbox.value));
  });
  if (!selectedSubject) {
    alert('Please select a subject');

    return;
  }
  console.log(selectedUnits);
  selectedTopics = [];

  document.querySelectorAll('.topic-item input:checked').forEach((checkbox) => {
    const label = document.querySelector(`label[for="${checkbox.id}"]`);

    selectedTopics.push(label.textContent.trim());
  });
  console.log(selectedTopics);

  const payload = {
    subject: selectedSubject,
    units: selectedUnits,
    topics: selectedTopics,
    difficulty: document.getElementById('difficulty').value,
    marks: parseInt(document.getElementById('marks').value),
  };

  console.log(payload);
  try {
    const response = await fetch('/generate-paper', {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log(errorText);
      throw new Error(errorText);
    }

    const data = await response.json();

    document.getElementById('generatedPaper').textContent = data.paper;
    goStep(4);
  } catch (error) {
    console.error(error);

    alert('Failed to generate paper');
  }
}

function downloadPaper() {
  window.open('/download-paper');
}

window.onload = () => {
  loadSubjects();
};
