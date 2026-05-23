    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const previewArea = document.getElementById('previewArea');
    const previewImg = document.getElementById('previewImg');
    const previewName = document.getElementById('previewName');
    const btnRemove = document.getElementById('btnRemove');
    const btnPredict = document.getElementById('btnPredict');
    const btnText = document.getElementById('btnText');
    const spinner = document.getElementById('spinner');
    const resultArea = document.getElementById('resultArea');
    const resultClass = document.getElementById('resultClass');
    const scoresGrid = document.getElementById('scoresGrid');
    const errorMsg = document.getElementById('errorMsg');

    let selectedFile = null;

    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault(); dropZone.classList.remove('dragover');
      if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
    });
    fileInput.addEventListener('change', () => { if (fileInput.files[0]) handleFile(fileInput.files[0]); });
    btnRemove.addEventListener('click', resetAll);

    function handleFile(file) {
      if (!file.type.startsWith('image/')) { showError('Only image files are allowed.'); return; }
      selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImg.src = e.target.result;
        previewName.textContent = file.name;
        previewArea.classList.add('visible');
        btnPredict.disabled = false;
        resultArea.classList.remove('visible');
        hideError();
      };
      reader.readAsDataURL(file);
    }

    function resetAll() {
      selectedFile = null; fileInput.value = '';
      previewArea.classList.remove('visible');
      resultArea.classList.remove('visible');
      btnPredict.disabled = true; hideError();
    }

    btnPredict.addEventListener('click', async () => {
      if (!selectedFile) return;
      spinner.classList.add('visible');
      btnText.textContent = 'Predicting...';
      btnPredict.disabled = true;
      resultArea.classList.remove('visible');
      hideError();

      try {
        const formData = new FormData();
        formData.append('image', selectedFile);
        const res = await fetch('/api/predict', { method: 'POST', body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Prediction failed');
        showResult(data.result);
      } catch (err) {
        showError(err.message);
      } finally {
        spinner.classList.remove('visible');
        btnText.textContent = 'Predict';
        btnPredict.disabled = false;
      }
    });

    function showResult(result) {
      resultClass.textContent = result.class;
      scoresGrid.innerHTML = '';
      const sorted = Object.entries(result.scores).sort((a, b) => b[1] - a[1]);
      sorted.forEach(([cls, score]) => {
        const pct = (score * 100).toFixed(1);
        const isTop = cls === result.class;
        const row = document.createElement('div');
        row.className = 'score-row';
        row.innerHTML = `
          <span class="score-name">${cls}</span>
          <div class="score-bar-wrap"><div class="score-bar${isTop ? ' top' : ''}" style="width:0%" data-pct="${pct}"></div></div>
          <span class="score-pct">${pct}%</span>`;
        scoresGrid.appendChild(row);
      });
      resultArea.classList.add('visible');
      requestAnimationFrame(() => {
        document.querySelectorAll('.score-bar').forEach(b => { b.style.width = b.dataset.pct + '%'; });
      });
    }

    function showError(msg) { errorMsg.textContent = msg; errorMsg.classList.add('visible'); }
    function hideError() { errorMsg.classList.remove('visible'); }