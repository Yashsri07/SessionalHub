/* =====================================
   AUTHENTICATION
===================================== */

function getToken() {
  return localStorage.getItem('access_token');
}

function requireAuth() {
  const token = getToken();

  if (!token) {
    window.location.href = '/login.html';
    return false;
  }

  return true;
}

async function authFetch(url, options = {}) {
  const token = getToken();

  if (!token) {
    window.location.href = '/login.html';
    return null;
  }

  options.headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(url, options);

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');

    window.location.href = '/login.html';
    return null;
  }

  return response;
}

let uploadedFiles = {
  qp: null,
  as: null,
};

document.addEventListener('DOMContentLoaded', () => {
  // Authentication check
  if (!requireAuth()) return;

  initializeSidebar();
  initializeProfile();
  initializeEvaluationUploads();
  //   loadTeacherDashboard();
});

function initializeEvaluationUploads() {
  document.getElementById('qpInput')?.addEventListener('change', (event) => {
    if (event.target.files.length) handleFileSelect('qp', event.target.files[0]);
  });

  document.getElementById('asInput')?.addEventListener('change', (event) => {
    if (event.target.files.length) handleMultiFileSelect('as', event.target.files);
  });
}

function initializeSidebar() {
  document.querySelectorAll('.sidebar li').forEach((item) => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.sidebar li').forEach((link) => link.classList.remove('active'));
      item.classList.add('active');
    });
  });
}

function showSection(sectionId, element) {
  document
    .querySelectorAll('.content-section')
    .forEach((section) => section.classList.add('hidden'));
  document.getElementById(sectionId).classList.remove('hidden');
  document.querySelectorAll('.sidebar li').forEach((item) => item.classList.remove('active'));
  if (element) element.parentElement.classList.add('active');
}

function initializeProfile() {
  const profile = document.querySelector('.profile');
  if (!profile) return;
  profile.addEventListener('click', () =>
    document.getElementById('profileModal').classList.toggle('show'),
  );
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function handleFileSelect(type, file) {
  uploadedFiles[type] = file;
  document.getElementById(type + 'Name').textContent = file.name;
  document.getElementById(type + 'Meta').textContent = formatFileSize(file.size);
  document.getElementById(type + 'Empty').classList.add('hidden');
  document.getElementById(type + 'Filled').classList.remove('hidden');
  document.getElementById(type + 'Card').classList.add('filled');
  document.getElementById('uploadError').classList.add('hidden');
}

function handleMultiFileSelect(type, fileList) {
  uploadedFiles[type] = fileList;
  const totalSize = Array.from(fileList).reduce((sum, file) => sum + file.size, 0);
  document.getElementById(type + 'Name').textContent = fileList.length + ' answer sheets selected';
  document.getElementById(type + 'Meta').textContent = formatFileSize(totalSize) + ' total';
  document.getElementById(type + 'Empty').classList.add('hidden');
  document.getElementById(type + 'Filled').classList.remove('hidden');
  document.getElementById(type + 'Card').classList.add('filled');
  document.getElementById('uploadError').classList.add('hidden');
}

function resetUpload(type) {
  uploadedFiles[type] = null;
  document.getElementById(type + 'Empty').classList.remove('hidden');
  document.getElementById(type + 'Filled').classList.add('hidden');
  document.getElementById(type + 'Card').classList.remove('filled');
  document.getElementById(type + 'Input').value = '';
}

function tryEvaluate() {
  const hasAnswerSheets = uploadedFiles.as && uploadedFiles.as.length > 0;
  if (!uploadedFiles.qp || !hasAnswerSheets) {
    document.getElementById('uploadError').classList.remove('hidden');
    return;
  }
  document.querySelector('.panel').classList.add('hidden');
  document.getElementById('evaluatingPanel').classList.remove('hidden');
  runBulkEvaluation(uploadedFiles.as.length);
}

function runBulkEvaluation(sheetCount) {
  const textEl = document.getElementById('evaluatingText');
  let current = 1;
  textEl.textContent = `Evaluating sheet ${current} of ${sheetCount}...`;
  const interval = setInterval(() => {
    current++;
    if (current <= sheetCount)
      textEl.textContent = `Evaluating sheet ${current} of ${sheetCount}...`;
  }, 500);
  setTimeout(
    () => {
      clearInterval(interval);
      document.getElementById('evaluatingPanel').classList.add('hidden');
      document.getElementById('resultsPanel').classList.remove('hidden');
    },
    Math.min(sheetCount, 6) * 500 + 400,
  );
}

function resetEvaluation() {
  resetUpload('qp');
  resetUpload('as');
  document.getElementById('uploadError').classList.add('hidden');
  document.getElementById('resultsPanel').classList.add('hidden');
  document.getElementById('evaluatingPanel').classList.add('hidden');
  document.querySelector('.panel').classList.remove('hidden');
}

async function loadTeacherDashboard() {
  try {
    const [summaryResponse, notesResponse, studentsResponse] = await Promise.all([
      authFetch('/api/student/dashboard'),
      authFetch('/api/content?content_type=notes'),
      authFetch('/api/teacher/students'),
    ]);

    if (!summaryResponse || !notesResponse || !studentsResponse) {
      return;
    }

    const summary = await summaryResponse.json();
    const notes = await notesResponse.json();
    const students = await studentsResponse.json();

    document.getElementById('studentsCount').textContent = students.students.length;

    document.getElementById('notesCount').textContent = summary.notes;

    document.getElementById('papersCount').textContent = summary.pyqs;

    document.getElementById('evalCount').textContent = 0;

    renderTeacherNotes(notes.items || []);
    renderTeacherStudents(students.students || []);
  } catch (error) {
    console.error('Dashboard loading error:', error);
  }
}

async function uploadTeachingContent(type) {
  const config = {
    notes: {
      file: 'notesFile',
      subject: 'notesSubject',
      title: 'notesTitle',
      unit: 'notesUnit',
    },
    syllabus: {
      file: 'syllabusFile',
      subject: 'syllabusSubject',
      titleValue: 'Updated syllabus',
      unitValue: 'Uploaded syllabus file',
    },
    pyq: {
      file: 'pyqFile',
      subject: 'pyqSubject',
      titleValue: 'Previous year paper',
      year: 'pyqYear',
      examType: 'pyqExamType',
    },
  }[type];

  const fileInput = document.getElementById(config.file);
  if (!fileInput?.files?.length) {
    alert('Please choose a file first');
    return;
  }

  const formData = new FormData();
  formData.append('content_type', type);
  formData.append('subject', document.getElementById(config.subject).value);
  formData.append(
    'title',
    config.title ? document.getElementById(config.title).value : config.titleValue,
  );
  formData.append(
    'unit',
    config.unit ? document.getElementById(config.unit).value : config.unitValue || '',
  );
  formData.append('year', config.year ? document.getElementById(config.year).value : '');
  formData.append(
    'exam_type',
    config.examType ? document.getElementById(config.examType).value : '',
  );
  formData.append('file', fileInput.files[0]);

  const response = await authFetch('/api/teacher/uploads', {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    alert('Upload failed');
    return;
  }

  fileInput.value = '';
  alert('Uploaded successfully');
  loadTeacherDashboard();
}

function renderTeacherNotes(items) {
  const target = document.getElementById('teacherNotesList');
  if (!target) return;
  target.innerHTML = items.length
    ? ''
    : '<div class="list-row"><span>No notes uploaded yet</span></div>';
  items.forEach((item) => {
    target.insertAdjacentHTML(
      'beforeend',
      `<div class="list-row"><a href="${item.file_url}" target="_blank">${item.title}</a><span class="list-meta">${item.subject} · ${item.unit || 'General'}</span></div>`,
    );
  });
}

function renderTeacherStudents(students) {
  const target = document.getElementById('teacherStudentsBody');
  if (!target) return;
  target.innerHTML = students.length ? '' : '<tr><td colspan="4">No students added yet</td></tr>';
  students.forEach((student) => {
    target.insertAdjacentHTML(
      'beforeend',
      `<tr><td>${student.username}</td><td>${student.name}</td><td>-</td><td>${student.gmail}</td></tr>`,
    );
  });
}

function logout() {
  if (!confirm('Are you sure you want to logout?')) return;

  localStorage.removeItem('access_token');
  localStorage.removeItem('user');

  window.location.href = '/login.html';
}
