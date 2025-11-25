// src/electron/gui/app.js
document.addEventListener('DOMContentLoaded', () => {
  const loginSection = document.getElementById('login-section');
  const treatmentSection = document.getElementById('treatment-section');
  const loginForm = document.getElementById('login-form');
  const loginMsg = document.getElementById('login-msg');
  const treatmentForm = document.getElementById('treatment-form');
  const treatmentMsg = document.getElementById('treatment-msg');
  const tabs = document.querySelectorAll('.tab');
  
  // New UI elements
  const therapistList = document.getElementById('therapist-list');
  const patientSearchInput = document.getElementById('patient-search');
  const patientResults = document.getElementById('patient-results');
  const patientNumInput = document.getElementById('patient-num');
  const patientNameInput = document.getElementById('patient-name');
  const priceInput = document.getElementById('price');
  const priceListContainer = document.getElementById('price-list');
  const dateInput = document.getElementById('date');

  let cookie = null;
  let serverData = { users: [], patients: [], prices: [] };
  let currentType = 'dosu'; // Default
  let currentPatientResults = []; // Store current search results for keyboard nav
  let selectedPatientIndex = -1; // Track selected index for keyboard nav

  // Helper: Throttle function
  const throttle = (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  };

  // Target Area Logic
  const eswtTargetArea = document.getElementById('eswt-target-area');

  // Switch tabs
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentType = tab.dataset.type;
      
      // Toggle Target Area visibility
      if (currentType === 'eswt') {
        eswtTargetArea.classList.remove('hidden');
      } else {
        eswtTargetArea.classList.add('hidden');
      }

      updatePriceList();
    });
  });


  // Login handler
  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    const id = document.getElementById('login-id').value.trim();
    const pw = document.getElementById('login-pw').value.trim();
    
    try {
      const result = await window.api.login(id, pw);
      if (result.success) {
        cookie = result.cookie;
        loginMsg.textContent = 'Login successful!';
        loginMsg.style.color = '#4caf50';
        
        // Fetch data from server
        const dataResult = await window.api.fetchData();
        if (dataResult.success) {
          serverData = dataResult.data;
          initializeUI();
        } else {
          console.error('Failed to fetch data:', dataResult.error);
        }

        loginSection.classList.add('hidden');
        treatmentSection.classList.remove('hidden');
        
        // Set today's date
        const today = new Date().toISOString().split('T')[0];
        if (!dateInput.value) dateInput.value = today;

      } else {
        loginMsg.textContent = `Login failed: ${result.error}`;
        loginMsg.style.color = '#f44336';
      }
    } catch (err) {
      loginMsg.textContent = `Error: ${err.message}`;
    }
  });

  // Initialize UI with fetched data
  function initializeUI() {
    updateTherapistList();
    updatePriceList();
  }

  // New function to update therapist list with chips
  function updateTherapistList() {
    const container = document.getElementById('therapist-list-container');
    container.innerHTML = '';
    
    if (!serverData || !serverData.users) return;

    serverData.users.forEach((user, index) => {
      const chip = document.createElement('div');
      chip.className = 'therapist-chip';
      chip.textContent = `${index + 1}. ${user.name}`; // Add numbering
      chip.tabIndex = 0;
      chip.dataset.value = user.name;
      
      chip.addEventListener('click', () => {
        selectTherapist(chip, user.name);
      });

      chip.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectTherapist(chip, user.name);
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          const next = container.children[index + 1] || container.children[0];
          next.focus();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          const prev = container.children[index - 1] || container.children[container.children.length - 1];
          prev.focus();
        } else if (e.key === 'Tab' && !e.shiftKey) {
          // Jump to patient search on Tab
          e.preventDefault();
          patientSearchInput.focus();
        }
      });

      container.appendChild(chip);
    });
  }

  // Global key listener for shortcuts (1-9)
  document.addEventListener('keydown', (e) => {
    // Ignore if typing in an editable input field
    const active = document.activeElement;
    const isEditableInput = active.tagName === 'INPUT' && !active.readOnly && active.type !== 'checkbox' && active.type !== 'radio' && active.type !== 'submit' && active.type !== 'button';
    const isTextArea = active.tagName === 'TEXTAREA';
    
    if (isEditableInput || isTextArea) return;
    
    // Ignore if target area is focused (it has its own handler)
    if (active === eswtTargetArea) return;

    const key = parseInt(e.key);
    if (!isNaN(key) && key >= 1 && key <= 9) {
      const index = key - 1;
      
      // Context-sensitive selection
      // If Patient is selected (patientNum has value), control Price
      // Otherwise, control Therapist
      
      if (patientNumInput.value) {
        // Select Price
        const container = document.getElementById('price-list');
        if (container && container.children[index]) {
          const chip = container.children[index];
          // Trigger click to select
          chip.click();
        }
      } else {
        // Select Therapist
        const container = document.getElementById('therapist-list-container');
        if (container && container.children[index]) {
          const chip = container.children[index];
          const name = chip.dataset.value;
          selectTherapist(chip, name);
        }
      }
    }
  });

  // New function to handle therapist selection
  function selectTherapist(chip, name) {
    const container = document.getElementById('therapist-list-container');
    const hiddenInput = document.getElementById('therapist');
    
    // Update UI
    Array.from(container.children).forEach(c => c.classList.remove('selected'));
    chip.classList.add('selected');
    
    // Update value
    hiddenInput.value = name;
    
    // Focus the chip to allow keyboard navigation (Tab to move next)
    // Do NOT auto-focus patient search
    chip.focus();
  }

  let filteredPrices = []; // Store current prices for keyboard nav
  let selectedPriceIndex = -1;

  function updatePriceList() {
    priceListContainer.innerHTML = '';
    selectedPriceIndex = -1;
    priceInput.value = '';
    filteredPrices = [];
    
    if (!serverData || !serverData.prices) return;

    // Filter prices based on current type
    const currentType = document.querySelector('.tab.active').dataset.type;
    
    filteredPrices = serverData.prices.filter(p => {
      // Filter by type and ensure value exists
      return p.type === currentType && p.value;
    });

    filteredPrices.forEach((priceItem, index) => {
      const chip = document.createElement('div');
      chip.className = 'chip';
      const priceVal = Number(priceItem.value);
      const displayName = priceItem.name || priceItem.value; // Fallback to value if name missing
      
      chip.textContent = `${index + 1}. ${displayName} (${priceVal.toLocaleString()})`; 
      chip.dataset.value = priceItem.value;
      
      chip.addEventListener('click', () => {
        selectPrice(index);
      });

      priceListContainer.appendChild(chip);
    });
  }

  function selectPrice(index) {
    if (index < 0 || index >= filteredPrices.length) return;
    
    selectedPriceIndex = index;
    const p = filteredPrices[index];
    
    priceInput.value = p.value;
    
    // Update visual selection
    const chips = priceListContainer.querySelectorAll('.chip');
    chips.forEach((chip, i) => {
      if (i === index) {
        chip.classList.add('selected');
      } else {
        chip.classList.remove('selected');
      }
    });

    // If ESWT, move focus to Target Area container
    // REMOVED: Auto-focus caused issues. User wants explicit Tab navigation.
    // if (currentType === 'eswt') {
    //   eswtTargetArea.focus();
    // }
  }

  // Target Area Keyboard Logic
  // Make container focusable
  eswtTargetArea.tabIndex = 0;
  eswtTargetArea.style.outline = 'none'; // Visual style handled by CSS if needed, or keep default focus ring

  eswtTargetArea.addEventListener('keydown', (e) => {
    const key = e.key;
    let targetKey = null;

    if (key >= '1' && key <= '9') targetKey = key;
    if (key === '0') targetKey = '0';
    if (key === '-') targetKey = '-';

    if (targetKey) {
      e.preventDefault();
      const checkbox = eswtTargetArea.querySelector(`input[data-key="${targetKey}"]`);
      if (checkbox) {
        checkbox.checked = !checkbox.checked;
        // Optional: Visual feedback or just rely on checkbox state
      }
    }
    
    // Handle Shift+Tab to go back to Price
    if (e.key === 'Tab' && e.shiftKey) {
      e.preventDefault();
      priceInput.focus();
    }
  });

  // Keyboard Navigation for Price (Arrow keys)
  // We can keep this attached to priceInput or make it global context-sensitive too.
  // Since we have global 1-9, arrow keys on priceInput are good for fine-tuning.
  priceInput.addEventListener('keydown', (e) => {
    if (filteredPrices.length === 0) return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (selectedPriceIndex + 1) % filteredPrices.length;
      selectPrice(nextIndex);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (selectedPriceIndex - 1 + filteredPrices.length) % filteredPrices.length;
      selectPrice(prevIndex);
    }
  });

  // Patient Search Logic (Throttled)
  patientSearchInput.addEventListener('input', throttle((e) => {
    const query = e.target.value.trim().toLowerCase();
    selectedPatientIndex = -1; // Reset selection

    if (query.length < 1) {
      patientResults.classList.add('hidden');
      currentPatientResults = [];
      return;
    }

    const filtered = serverData.patients.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.chartNumber.toString().includes(query)
    ).slice(0, 10); // Limit to 10 results

    currentPatientResults = filtered;
    renderPatientResults(filtered);
  }, 300));

  // Keyboard Navigation for Patient Search
  patientSearchInput.addEventListener('keydown', (e) => {
    if (currentPatientResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedPatientIndex = (selectedPatientIndex + 1) % currentPatientResults.length;
      updatePatientSelection();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedPatientIndex = (selectedPatientIndex - 1 + currentPatientResults.length) % currentPatientResults.length;
      updatePatientSelection();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedPatientIndex >= 0 && selectedPatientIndex < currentPatientResults.length) {
        selectPatient(currentPatientResults[selectedPatientIndex]);
      }
    }
  });

  function updatePatientSelection() {
    const items = patientResults.querySelectorAll('.result-item');
    items.forEach((item, index) => {
      if (index === selectedPatientIndex) {
        item.classList.add('selected');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('selected');
      }
    });
  }

  function selectPatient(p) {
    patientNumInput.value = p.chartNumber;
    patientNameInput.value = p.name;
    patientSearchInput.value = ''; // Clear search
    patientResults.classList.add('hidden');
    currentPatientResults = [];
    selectedPatientIndex = -1;
    
    // Move focus to Price input to enable 1-9 shortcuts for Price
    priceInput.focus();
  }

  function renderPatientResults(patients) {
    patientResults.innerHTML = '';
    if (patients.length === 0) {
      patientResults.classList.add('hidden');
      return;
    }

    patients.forEach((p, index) => {
      const div = document.createElement('div');
      div.className = 'result-item';
      if (index === selectedPatientIndex) div.classList.add('selected');
      div.textContent = `${p.name} (${p.chartNumber})`;
      div.addEventListener('click', () => {
        selectPatient(p);
      });
      patientResults.appendChild(div);
    });
    patientResults.classList.remove('hidden');
  }

  // Hide results when clicking outside
  document.addEventListener('click', (e) => {
    if (!patientSearchInput.contains(e.target) && !patientResults.contains(e.target)) {
      patientResults.classList.add('hidden');
    }
  });

  // Treatment submit handler
  treatmentForm.addEventListener('submit', async e => {
    e.preventDefault();
    const type = document.querySelector('.tab.active').dataset.type;
    
    // Collect target areas
    const targetAreas = [];
    if (type === 'eswt') {
      document.querySelectorAll('input[name="target_area"]:checked').forEach(cb => {
        targetAreas.push(cb.value);
      });
    }

    const params = {
      date: dateInput.value.replace(/-/g, ''),
      therapist: document.getElementById('therapist').value, // Use hidden input
      patientNum: Number(patientNumInput.value),
      price: Number(priceInput.value),
      patientType: document.getElementById('first-visit').checked ? '신환' : '재진',
      isReserved: !document.getElementById('no-reserve').checked,
      targetAreas, // Add target areas
    };

    let result;
    if (type === 'dosu') {
      result = await window.api.saveDosu(params, cookie, serverData); // Pass serverData as userList
    } else {
      result = await window.api.saveEswt(params, cookie, serverData);
    }

    if (result.success) {
      treatmentMsg.textContent = 'Saved successfully!';
      treatmentMsg.style.color = '#4caf50';
      
      // Clear ONLY patient fields
      patientNumInput.value = '';
      patientNameInput.value = '';
      patientSearchInput.value = '';
      
      // Clear target areas
      document.querySelectorAll('input[name="target_area"]').forEach(cb => cb.checked = false);
      
    } else {
      treatmentMsg.textContent = `Save failed: ${result.error}`;
      treatmentMsg.style.color = '#f44336';
    }
  });
});
