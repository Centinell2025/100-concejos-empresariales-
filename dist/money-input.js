// Keep the user's original decimal separator on both keyboard input and paste.
// Native number inputs can silently drop the comma before a form ever sees it.
const BeaconMoneyInput = (() => {
  const maximumCents = 999999999999;
  const copy = {
    en: {
      hint: 'Example: 1250.75. Enter the amount without thousands separators.',
      invalid: 'Use digits and up to two decimal places, without thousands separators.',
      range: 'The maximum is USD 9999999999.99.',
      positive: 'Enter an amount greater than zero.'
    },
    es: {
      hint: 'Ejemplo: 1250,75. Escribe el importe sin separadores de miles.',
      invalid: 'Usa dígitos y hasta dos decimales, sin separadores de miles.',
      range: 'El máximo es de 9999999999,99 USD.',
      positive: 'El importe debe ser mayor que cero.'
    },
    it: {
      hint: 'Esempio: 1250,75. Inserisci l’importo senza separatori delle migliaia.',
      invalid: 'Usa cifre e fino a due decimali, senza separatori delle migliaia.',
      range: 'Il massimo è 9999999999,99 USD.',
      positive: 'Inserisci un importo maggiore di zero.'
    }
  };

  function parse(text, minimum, optional) {
    const source = text.trim();
    if (source === '' && optional) return {cents: 0};
    // Accept either decimal separator. A grouping mark or a third decimal
    // is ambiguous and must never be silently removed or rounded.
    if (!/^(?:\d+(?:[.,]\d{1,2})?|[.,]\d{1,2})$/.test(source)) return {error: 'invalid'};
    const [whole, fraction = ''] = source.split(/[.,]/);
    const cents = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
    if (!Number.isSafeInteger(cents) || cents > maximumCents) return {error: 'range'};
    if (cents < minimum) return {error: 'positive'};
    return {cents};
  }

  function field(name, label, cents, {required = false, minimum = 0} = {}) {
    const separator = language === 'en' ? '.' : ',';
    const value = cents == null ? '' : Math.floor(cents / 100) + separator + String(cents % 100).padStart(2, '0');
    const id = 'money-' + name;
    return `<div class="form-field">
      <label for="${id}">${tr(label)}${required ? ' *' : ''}</label>
      <input id="${id}" name="${name}" type="text" inputmode="decimal"
             data-money-min="${minimum}" value="${value}" ${required ? 'required' : ''}
             aria-describedby="${id}-hint">
      <small id="${id}-hint"></small>
    </div>`;
  }

  function describe(input, result, showError) {
    const words = copy[language] || copy.en;
    const hint = document.getElementById(input.id + '-hint');
    if (showError && result.error) {
      input.setAttribute('aria-invalid', 'true');
      hint.textContent = words[result.error];
      return;
    }
    input.removeAttribute('aria-invalid');
    if (input.value.trim() === '' || result.error) {
      hint.textContent = words.hint;
      return;
    }
    const region = {en: 'en-US', es: 'es-ES', it: 'it-IT'}[language] || 'en-US';
    hint.textContent = new Intl.NumberFormat(region, {
      style: 'currency', currency: 'USD', currencyDisplay: 'code'
    }).format(result.cents / 100);
  }

  function parseField(input) {
    return parse(input.value, Number(input.dataset.moneyMin), !input.required);
  }

  function bind(form) {
    for (const input of form.querySelectorAll('[data-money-min]')) {
      describe(input, parseField(input), false);
      input.addEventListener('input', () => describe(input, parseField(input), input.hasAttribute('aria-invalid')));
    }
  }

  function read(form) {
    const values = {};
    for (const input of form.querySelectorAll('[data-money-min]')) {
      const result = parseField(input);
      describe(input, result, true);
      if (result.error) {
        input.focus();
        return null;
      }
      values[input.name] = result.cents;
    }
    return values;
  }

  return {field, bind, read};
})();
