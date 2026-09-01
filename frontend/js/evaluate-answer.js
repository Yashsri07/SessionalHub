const state = { examId: null };
const $ = (selector) => document.querySelector(selector);

function setStatus(id, message, kind = '') {
  const item = $(id);
  item.textContent = message;
  item.className = `status ${kind}`;
}
function enable(id) {
  $(id).classList.remove('disabled');
}
function escapeHtml(value) {
  const node = document.createElement('span');
  node.textContent = value || '';
  return node.innerHTML;
}
async function api(path, options = {}) {
  const response = await fetch(path, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.detail || `Request failed (${response.status})`);
  return data;
}

$('#exam-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = event.submitter;
  button.disabled = true;
  setStatus('#exam-status', 'Uploading question paper…');
  try {
    const data = await api('/exams', { method: 'POST', body: new FormData(event.target) });
    state.examId = data.exam_id;
    setStatus(
      '#exam-status',
      'Question paper uploaded. Now upload the student answer sheets.',
      'success',
    );
    enable('#sheets-card');
  } catch (error) {
    setStatus('#exam-status', error.message, 'error');
  } finally {
    button.disabled = false;
  }
});

$('#sheets-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = event.submitter;
  button.disabled = true;
  setStatus('#sheets-status', 'Uploading answer sheets…');
  try {
    const data = await api(`/exams/${state.examId}/sheets`, {
      method: 'POST',
      body: new FormData(event.target),
    });
    setStatus(
      '#sheets-status',
      `${data.count} answer sheet(s) uploaded. You can now extract the answers.`,
      'success',
    );
    enable('#prepare-card');
  } catch (error) {
    setStatus('#sheets-status', error.message, 'error');
  } finally {
    button.disabled = false;
  }
});

$('#prepare-button').addEventListener('click', async (event) => {
  const button = event.currentTarget;
  button.disabled = true;
  setStatus(
    '#prepare-status',
    'Extracting questions and answers with local Ollama. This can take a minute…',
  );
  try {
    const data = await api(`/exams/${state.examId}/prepare`, { method: 'POST' });
    $('#rubric').innerHTML = data.rubric
      .map(
        (item) =>
          `<article><strong>Question ${escapeHtml(item.question_number)}</strong><br>Concepts: ${escapeHtml(item.expected_concepts.join(', ') || '—')}<br>Keywords: ${escapeHtml(item.keywords.join(', ') || '—')}<br>${item.formula_expected ? 'Formula expected. ' : ''}${item.diagram_expected ? 'Diagram expected — visual review required.' : ''}</article>`,
      )
      .join('');
    setStatus(
      '#prepare-status',
      `${data.questions.length} questions extracted. Check the answer requirements below, then generate marksheets.`,
      'success',
    );
    enable('#grade-card');
  } catch (error) {
    setStatus('#prepare-status', error.message, 'error');
  } finally {
    button.disabled = false;
  }
});

$('#grade-button').addEventListener('click', async (event) => {
  const button = event.currentTarget;
  button.disabled = true;
  setStatus(
    '#grade-status',
    'Generating marksheets locally. Keep this tab open; handwritten PDFs can take time…',
  );
  try {
    const data = await api(`/exams/${state.examId}/grade`, { method: 'POST' });
    $('#results').innerHTML =
      `<h2>Generated marksheets</h2>${data.results.map((result) => `<article class="result"><div><h3>Roll no. ${escapeHtml(result.roll_number)}</h3><p>${result.total_awarded} / ${result.total_max} • ${result.needs_review ? 'Teacher review needed' : 'No automatic review flags'}</p></div><a class="download" href="/exams/${state.examId}/results/${result.id}/marksheet">Download marksheet PDF</a></article>`).join('')}`;
    setStatus(
      '#grade-status',
      `${data.results.length} marksheet(s) generated successfully.`,
      'success',
    );
  } catch (error) {
    setStatus('#grade-status', error.message, 'error');
  } finally {
    button.disabled = false;
  }
});
