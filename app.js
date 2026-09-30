import { defaultInputs, presetScenarios, PUBLIC_MODE, getPublicCopy } from './data.js';
import { calculateModel } from './model.js';

const formFields = {
  areaHa: document.querySelector('#areaHa'),
  applicationRate: document.querySelector('#applicationRate'),
  creditablePerT: document.querySelector('#creditablePerT'),
  discount: document.querySelector('#discount'),
  rockPricePerT: document.querySelector('#rockPricePerT'),
  mrvCostPerHa: document.querySelector('#mrvCostPerHa'),
  fixedMrvCost: document.querySelector('#fixedMrvCost'),
  creditPrice: document.querySelector('#creditPrice'),
  projectSentenceOne: document.querySelector('#projectSentenceOne'),
  projectSentenceTwo: document.querySelector('#projectSentenceTwo'),
  projectSentenceThree: document.querySelector('#projectSentenceThree')
};

const outputs = {
  basaltTonnes: document.querySelector('#resultBasaltTonnes'),
  credits: document.querySelector('#resultCredits'),
  costPerCredit: document.querySelector('#resultCostPerCredit'),
  netMargin: document.querySelector('#resultNetMargin'),
  breakEvenArea: document.querySelector('#resultBreakEvenArea'),
  sentenceOutputOne: document.querySelector('#sentenceOutputOne'),
  sentenceOutputTwo: document.querySelector('#sentenceOutputTwo'),
  sentenceOutputThree: document.querySelector('#sentenceOutputThree')
};

const presetButtons = [...document.querySelectorAll('.preset-button')];
const filterButtons = [...document.querySelectorAll('.filter-button')];
const phaseButtons = [...document.querySelectorAll('.phase-toggle')];
const themeToggle = document.querySelector('#themeToggle');
const resetButton = document.querySelector('#resetModel');

function seedDefaults() {
  Object.entries(defaultInputs).forEach(([key, value]) => {
    const field = formFields[key];
    if (!field) return;
    field.value = value;
  });
}

function formatMoney(value) {
  return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
}

function updateResults() {
  const model = calculateModel({
    areaHa: formFields.areaHa.value,
    applicationRate: formFields.applicationRate.value,
    creditablePerT: formFields.creditablePerT.value,
    discount: formFields.discount.value,
    rockPricePerT: formFields.rockPricePerT.value,
    mrvCostPerHa: formFields.mrvCostPerHa.value,
    fixedMrvCost: formFields.fixedMrvCost.value,
    creditPrice: formFields.creditPrice.value
  });

  outputs.basaltTonnes.textContent = `${model.basaltTonnes.toLocaleString('en-IE', { maximumFractionDigits: 0 })} t`;
  outputs.credits.textContent = model.credits.toLocaleString('en-IE', { maximumFractionDigits: 0 });
  outputs.costPerCredit.textContent = `€${model.costPerCredit.toLocaleString('en-IE', { maximumFractionDigits: 0 })}`;
  outputs.netMargin.textContent = formatMoney(model.netMargin);

  if (model.breakEvenArea === null || !Number.isFinite(model.breakEvenArea)) {
    outputs.breakEvenArea.textContent = model.alwaysLoss ? 'No break-even' : 'n/a';
  } else {
    outputs.breakEvenArea.textContent = `${model.breakEvenArea.toLocaleString('en-IE', { maximumFractionDigits: 0 })} ha`;
  }

  outputs.sentenceOutputOne.textContent = getPublicCopy(formFields.projectSentenceOne.value);
  outputs.sentenceOutputTwo.textContent = getPublicCopy(formFields.projectSentenceTwo.value);
  outputs.sentenceOutputThree.textContent = getPublicCopy(formFields.projectSentenceThree.value);
}

function applyPreset(presetKey) {
  const preset = presetScenarios[presetKey];
  if (!preset) return;

  Object.entries(preset.values).forEach(([key, value]) => {
    const field = formFields[key];
    if (!field) return;
    field.value = value;
  });

  presetButtons.forEach((button) => {
    const active = button.dataset.preset === presetKey;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  updateResults();
}

function handleInput(event) {
  const field = event.target;
  if (field && field.id) {
    const outputKey = `sentenceOutput${field.id.replace('projectSentence', '')}`;
    const outputNode = outputs[outputKey];
    if (outputNode) {
      outputNode.textContent = getPublicCopy(field.value);
    }
  }

  updateResults();
}

function bindFormInputs() {
  Object.values(formFields).forEach((field) => {
    if (!field) return;
    field.addEventListener('input', handleInput);
    field.addEventListener('change', handleInput);
  });
}

function bindPresetButtons() {
  presetButtons.forEach((button) => {
    button.addEventListener('click', () => applyPreset(button.dataset.preset));
    button.setAttribute('aria-pressed', String(button.classList.contains('is-active')));
  });
}

function bindFilters() {
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
    });
  });
}

function bindPhases() {
  phaseButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const content = button.nextElementSibling;
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!expanded));
      content.hidden = expanded;
    });
  });
}

function bindReset() {
  resetButton.addEventListener('click', () => {
    seedDefaults();
    presetButtons.forEach((button) => {
      const active = button.dataset.preset === 'baseline';
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    updateResults();
  });
}

function bindThemeToggle() {
  const storedTheme = window.localStorage.getItem('theme');
  if (storedTheme === 'dark') {
    document.body.classList.add('dark');
    themeToggle.textContent = 'Light mode';
  }

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const dark = document.body.classList.contains('dark');
    window.localStorage.setItem('theme', dark ? 'dark' : 'light');
    themeToggle.textContent = dark ? 'Light mode' : 'Dark mode';
  });
}

seedDefaults();
bindFormInputs();
bindPresetButtons();
bindFilters();
bindPhases();
bindReset();
bindThemeToggle();
updateResults();

if (PUBLIC_MODE) {
  document.title = 'Public ERW model';
}

window.addEventListener('error', (event) => {
  console.error(event.error || event.message);
});
