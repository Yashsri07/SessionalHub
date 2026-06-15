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