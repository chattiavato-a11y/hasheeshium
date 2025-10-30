(function () {
  const form = document.querySelector('.apply-form');
  if (!form) {
    return;
  }

  const statusEl = form.querySelector('[data-form-status]');
  const sections = Array.from(form.querySelectorAll('.form-section[data-field]'));
  let suppressResetStatus = false;

  const updateStatus = (message, isError = false) => {
    if (!statusEl) {
      return;
    }

    statusEl.textContent = message;
    statusEl.classList.toggle('is-error', Boolean(isError));
    statusEl.classList.toggle('is-visible', Boolean(message));
  };

  const createToggleState = (section, inputsContainer, requiresAccept, addBtn, removeBtn, acceptBtn, editBtn) => {
    const setState = (accepted) => {
      const inputs = Array.from(inputsContainer.querySelectorAll('input'));
      inputs.forEach((input) => {
        input.disabled = accepted;
        if (!accepted && requiresAccept) {
          input.required = true;
        }
      });

      if (addBtn) {
        addBtn.disabled = accepted;
      }

      if (removeBtn) {
        removeBtn.disabled = accepted || inputs.length === 0;
      }

      if (acceptBtn) {
        acceptBtn.hidden = accepted;
      }

      if (editBtn) {
        editBtn.hidden = !accepted;
      }

      section.classList.toggle('completed', accepted);
      section.dataset.completed = accepted ? 'true' : 'false';
    };

    return setState;
  };

  sections.forEach((section) => {
    const inputsContainer = section.querySelector('[data-inputs]');
    if (!inputsContainer) {
      return;
    }

    const addBtn = section.querySelector('.circle-btn.add');
    const removeBtn = section.querySelector('.circle-btn.remove');
    const acceptBtn = section.querySelector('.accept-btn');
    const editBtn = section.querySelector('.edit-btn');
    const requiresAccept = section.hasAttribute('data-requires-accept');
    const placeholder = section.dataset.placeholder || `Add ${section.dataset.section || 'an entry'}`;
    const fieldName = section.dataset.field || 'entry';

    const updateRemoveState = () => {
      if (removeBtn) {
        const count = inputsContainer.childElementCount;
        const completed = section.dataset.completed === 'true';
        removeBtn.disabled = completed || count === 0;
      }
    };

    const addField = () => {
      if (section.dataset.completed === 'true') {
        return;
      }

      const input = document.createElement('input');
      input.type = 'text';
      input.name = `${fieldName}[]`;
      input.placeholder = placeholder;
      input.autocomplete = 'off';
      if (requiresAccept) {
        input.required = true;
      }

      inputsContainer.appendChild(input);
      input.focus();
      updateRemoveState();
    };

    const setSectionState = createToggleState(section, inputsContainer, requiresAccept, addBtn, removeBtn, acceptBtn, editBtn);
    setSectionState(false);
    updateRemoveState();

    if (addBtn) {
      addBtn.addEventListener('click', addField);
    }

    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        if (section.dataset.completed === 'true') {
          return;
        }

        const lastInput = inputsContainer.lastElementChild;
        if (lastInput) {
          inputsContainer.removeChild(lastInput);
          updateRemoveState();
        }
      });
    }

    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
        const inputs = Array.from(inputsContainer.querySelectorAll('input'));
        if (!inputs.length) {
          window.alert('Add at least one entry.');
          return;
        }

        const hasEmpty = inputs.some((input) => !input.value.trim());
        if (hasEmpty) {
          window.alert('Please fill out all fields before accepting.');
          return;
        }

        setSectionState(true);
        updateRemoveState();
      });
    }

    if (editBtn) {
      editBtn.addEventListener('click', () => {
        setSectionState(false);
        updateRemoveState();
        const firstInput = inputsContainer.querySelector('input');
        if (firstInput) {
          firstInput.focus();
        }
      });
    }

    section.dataset.completed = 'false';
  });

  const resetSections = () => {
    sections.forEach((section) => {
      const inputsContainer = section.querySelector('[data-inputs]');
      const addBtn = section.querySelector('.circle-btn.add');
      const removeBtn = section.querySelector('.circle-btn.remove');
      const acceptBtn = section.querySelector('.accept-btn');
      const editBtn = section.querySelector('.edit-btn');
      const requiresAccept = section.hasAttribute('data-requires-accept');

      if (inputsContainer) {
        inputsContainer.innerHTML = '';
      }

      section.classList.remove('completed');
      section.dataset.completed = 'false';

      if (addBtn) {
        addBtn.disabled = false;
      }

      if (removeBtn) {
        removeBtn.disabled = true;
      }

      if (acceptBtn) {
        acceptBtn.hidden = false;
      }

      if (editBtn) {
        editBtn.hidden = true;
      }

      if (requiresAccept && inputsContainer) {
        Array.from(inputsContainer.querySelectorAll('input')).forEach((input) => {
          input.required = true;
        });
      }
    });
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    updateStatus('');

    if (!form.reportValidity()) {
      updateStatus('Please complete the highlighted fields before submitting.', true);
      return;
    }

    for (const section of sections) {
      const inputs = Array.from(section.querySelectorAll('[data-inputs] input'));
      const requiresAccept = section.hasAttribute('data-requires-accept');
      const completed = section.dataset.completed === 'true';

      if (requiresAccept && inputs.length && !completed) {
        updateStatus(`Accept your entries in “${section.dataset.section}” or remove them before submitting.`, true);
        const acceptBtn = section.querySelector('.accept-btn');
        if (acceptBtn) {
          acceptBtn.focus();
        }
        return;
      }

      if (!requiresAccept) {
        inputs.forEach((input) => {
          if (!input.value.trim()) {
            input.remove();
          }
        });
      }
    }

    updateStatus('Application submitted successfully. Our talent team will reach out shortly.');
    resetSections();
    suppressResetStatus = true;
    form.reset();
    window.requestAnimationFrame(() => {
      suppressResetStatus = false;
    });
  });

  form.addEventListener('reset', () => {
    resetSections();
    if (!suppressResetStatus) {
      updateStatus('');
    }
  });
})();
