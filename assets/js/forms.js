import { getLocale } from './language.js';
import { getContent } from '../../data/content.js';
import { iconSend, iconX } from './icons.js';

export const WHATSAPP_NUMBER = '201039172696';
export const WHATSAPP_DISPLAY = '+201039172696';
export const WHATSAPP_URL = 'https://wa.me/201039172696';
export const MOTMAIN_TELEGRAM_URL = 'https://t.me/+hT9o9oJwoghhYjdk';

const CATEGORY_IDS = ['private', 'training', 'workshops', 'initiatives', 'recorded', 'retreats'];

function content() {
  return getContent(getLocale());
}

function getSubOptions(categoryId, lists) {
  switch (categoryId) {
    case 'private':
      return lists.contactSessions ?? [];
    case 'training':
      return lists.contactPrograms ?? [];
    case 'workshops':
      return lists.contactWorkshops ?? [];
    case 'initiatives':
      return lists.contactInitiatives ?? [];
    case 'recorded':
      return lists.contactRecorded ?? [];
    case 'retreats':
      return lists.contactRetreats ?? [];
    default:
      return [];
  }
}

function getSubCategoryLabel(categoryId, contact) {
  switch (categoryId) {
    case 'private':
      return contact.selectSession;
    case 'training':
      return contact.selectProgram;
    case 'workshops':
      return contact.selectWorkshop;
    case 'initiatives':
      return contact.selectInitiative;
    case 'recorded':
      return contact.selectRecorded;
    case 'retreats':
      return contact.selectRetreat;
    default:
      return contact.selectProgram;
  }
}

function listsFromContent(data) {
  return {
    contactSessions: data.contactSessions ?? [],
    contactPrograms: data.contactPrograms ?? [],
    contactWorkshops: data.contactWorkshops ?? [],
    contactInitiatives: data.contactInitiatives ?? [],
    contactRecorded: data.contactRecorded ?? [],
    contactRetreats: data.contactRetreats ?? [],
  };
}

function allOptions(data) {
  const lists = listsFromContent(data);
  return [
    ...lists.contactPrograms,
    ...lists.contactSessions,
    ...lists.contactInitiatives,
    ...lists.contactRecorded,
    ...lists.contactRetreats,
    ...lists.contactWorkshops,
  ];
}

function categoryForSlug(slug, data) {
  const map = {
    private: data.contactSessions,
    training: data.contactPrograms,
    workshops: data.contactWorkshops,
    initiatives: data.contactInitiatives,
    recorded: data.contactRecorded,
    retreats: data.contactRetreats,
  };
  return CATEGORY_IDS.find((id) => (map[id] ?? []).some((option) => option.slug === slug));
}

function getCategoryLabel(categoryId, data) {
  return data.contactCategories?.find((category) => category.id === categoryId)?.label ?? categoryId;
}

function getSubOptionLabel(slug, data, categoryId) {
  const options = getSubOptions(categoryId, listsFromContent(data));
  return (
    options.find((option) => option.slug === slug)?.label ??
    allOptions(data).find((option) => option.slug === slug)?.label ??
    slug
  );
}

function prefillMessage(contact, label) {
  if (typeof contact.prefillMessage === 'function') return contact.prefillMessage(label);
  if (typeof contact.prefillMessage === 'string') {
    return contact.prefillMessage.replace('{program}', label).replace('{label}', label);
  }
  return label;
}

function buildWhatsAppUrl(form) {
  const data = content();
  const tpl = data.contact.whatsappTemplate;
  const categoryId = form.elements.service_category?.value || 'private';
  const sub = form.elements.sub_option?.value || '';
  const categoryLabel = getCategoryLabel(categoryId, data);
  const subLabel = sub ? getSubOptionLabel(sub, data, categoryId) : '';
  const fullName = form.elements.full_name?.value || '';
  const email = form.elements.email?.value || '';
  const phone = form.elements.phone?.value || '';
  const message = form.elements.message?.value || '';

  const textMessage =
    `${tpl.header}\n\n` +
    `${tpl.name} ${fullName || tpl.unspecified}\n` +
    `${tpl.email} ${email || tpl.unspecified}\n` +
    `${tpl.phone} ${phone || tpl.unspecified}\n` +
    `${tpl.service} ${categoryLabel}\n` +
    (subLabel ? `${tpl.subCategory} ${subLabel}\n` : '') +
    `${tpl.details} ${message || tpl.noDetails}`;

  return `${WHATSAPP_URL}?text=${encodeURIComponent(textMessage)}`;
}

function updateWhatsAppLinks(form) {
  const url = buildWhatsAppUrl(form);
  document.querySelectorAll('#form-whatsapp-export-btn, [data-whatsapp-export]').forEach((link) => {
    link.setAttribute('href', url);
  });
}

function fillSelect(select, options, placeholder) {
  if (!select) return;
  const current = select.value;
  select.innerHTML = '';
  if (placeholder != null) {
    const empty = document.createElement('option');
    empty.value = '';
    empty.textContent = placeholder;
    select.appendChild(empty);
  }
  options.forEach((option) => {
    const node = document.createElement('option');
    node.value = option.id ?? option.slug;
    node.textContent = option.label;
    select.appendChild(node);
  });
  if ([...select.options].some((opt) => opt.value === current)) select.value = current;
}

function rebuildSubOptions(form) {
  const data = content();
  const categoryId = form.elements.service_category?.value || 'private';
  const options = getSubOptions(categoryId, listsFromContent(data));
  const block = document.getElementById('specific-program-select-block') || form.querySelector('[data-sub-option-block]');
  const select = form.elements.sub_option;
  const label = form.querySelector('[data-sub-option-label], #specific-program-select-block .contact-field-label');

  if (label) label.textContent = getSubCategoryLabel(categoryId, data.contact);

  if (!options.length) {
    if (block) block.hidden = true;
    if (select) {
      select.required = false;
      select.innerHTML = '';
      select.value = '';
      select.removeAttribute('aria-invalid');
    }
    return;
  }

  if (block) block.hidden = false;
  if (select) {
    select.required = true;
    fillSelect(select, options, data.contact.selectProgramPlaceholder);
  }
}

function clearFieldErrors(form) {
  form.querySelectorAll('[data-field-error]').forEach((el) => {
    el.hidden = true;
    el.textContent = '';
  });
  form.querySelectorAll('[aria-invalid="true"]').forEach((el) => {
    el.removeAttribute('aria-invalid');
  });
}

function showFieldError(input, message) {
  if (!input) return;
  input.setAttribute('aria-invalid', 'true');
  const wrap = input.closest('.contact-field-wrap, [data-sub-option-block]');
  const host = wrap?.querySelector('[data-field-error]') || input.parentElement?.querySelector('[data-field-error]');
  if (host) {
    host.hidden = false;
    host.textContent = message;
  }
}

function validateForm(form) {
  const data = content();
  const contact = data.contact ?? {};
  clearFieldErrors(form);

  const name = form.elements.full_name?.value?.trim() ?? '';
  const phone = form.elements.phone?.value?.trim() ?? '';
  const email = form.elements.email?.value?.trim() ?? '';
  const categoryId = form.elements.service_category?.value || '';
  const sub = form.elements.sub_option?.value || '';
  const subRequired = Boolean(form.elements.sub_option?.required);

  let firstInvalid = null;

  if (!name) {
    showFieldError(form.elements.full_name, contact.errorNameRequired || contact.required || 'Required');
    firstInvalid ??= form.elements.full_name;
  }

  if (!phone) {
    showFieldError(form.elements.phone, contact.errorPhoneRequired || contact.required || 'Required');
    firstInvalid ??= form.elements.phone;
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showFieldError(form.elements.email, contact.errorEmailInvalid || 'Invalid email');
    firstInvalid ??= form.elements.email;
  }

  if (!categoryId) {
    showFieldError(form.elements.service_category, contact.errorCategoryRequired || contact.required || 'Required');
    firstInvalid ??= form.elements.service_category;
  }

  if (subRequired && !sub) {
    showFieldError(form.elements.sub_option, contact.errorSubRequired || contact.required || 'Required');
    firstInvalid ??= form.elements.sub_option;
  }

  if (firstInvalid) {
    firstInvalid.focus?.();
    return false;
  }
  return true;
}

function applyPrefill(form) {
  const params = new URLSearchParams(location.search);
  const preselected =
    params.get('session') || params.get('program') || window.__preSelectedProgram;
  if (!preselected) return;

  const data = content();
  const optionMatch = allOptions(data).find(
    (option) => option.slug === preselected || option.label === preselected,
  );

  if (optionMatch) {
    const categoryId = categoryForSlug(optionMatch.slug, data);
    if (categoryId && form.elements.service_category) {
      form.elements.service_category.value = categoryId;
      rebuildSubOptions(form);
      if (form.elements.sub_option) form.elements.sub_option.value = optionMatch.slug;
      if (form.elements.message) form.elements.message.value = prefillMessage(data.contact, optionMatch.label);
      return;
    }
  }

  const categoryMatch = data.contactCategories?.find(
    (category) => category.id === preselected || category.label === preselected,
  );
  if (categoryMatch && form.elements.service_category) {
    form.elements.service_category.value = categoryMatch.id;
    rebuildSubOptions(form);
  }
}

function setFormBusy(form, busy) {
  form.setAttribute('aria-busy', busy ? 'true' : 'false');
  form.querySelectorAll('button[type="submit"], [data-form-submit]').forEach((btn) => {
    btn.disabled = busy;
  });
}

function showSuccess(form) {
  const data = content();
  const panel = document.getElementById('contact-success-panel');
  const fullName = form.elements.full_name?.value || '';
  const categoryId = form.elements.service_category?.value || 'private';
  const sub = form.elements.sub_option?.value || '';

  form.hidden = true;
  if (panel) {
    panel.hidden = false;
    const nameEl = panel.querySelector('[data-success-name]');
    const serviceEl = panel.querySelector('[data-success-service]');
    const subEl = panel.querySelector('[data-success-sub]');
    const subWrap = panel.querySelector('[data-success-sub-wrap]');
    if (nameEl) nameEl.textContent = fullName;
    if (serviceEl) serviceEl.textContent = getCategoryLabel(categoryId, data);
    if (subEl) subEl.textContent = sub ? getSubOptionLabel(sub, data, categoryId) : '';
    if (subWrap) subWrap.hidden = !sub;
  }
}

function resetForm(form) {
  form.reset();
  clearFieldErrors(form);
  if (form.elements.service_category) form.elements.service_category.value = 'private';
  rebuildSubOptions(form);
  form.hidden = false;
  setFormBusy(form, false);
  const panel = document.getElementById('contact-success-panel');
  if (panel) panel.hidden = true;
  updateWhatsAppLinks(form);
}

export function refreshForms() {
  const form = document.getElementById('booking-form-element');
  if (!form) return;
  const data = content();
  fillSelect(form.elements.service_category, data.contactCategories ?? []);
  rebuildSubOptions(form);
  updateWhatsAppLinks(form);
}

export function initForms() {
  const form = document.getElementById('booking-form-element');
  if (!form) return;

  const data = content();
  fillSelect(form.elements.service_category, data.contactCategories ?? []);
  if (form.elements.service_category && !form.elements.service_category.value) {
    form.elements.service_category.value = 'private';
  }
  rebuildSubOptions(form);
  applyPrefill(form);
  updateWhatsAppLinks(form);

  form.elements.service_category?.addEventListener('change', () => {
    rebuildSubOptions(form);
    updateWhatsAppLinks(form);
  });

  form.addEventListener('input', () => updateWhatsAppLinks(form));
  form.addEventListener('change', () => updateWhatsAppLinks(form));

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!validateForm(form)) return;

    setFormBusy(form, true);
    updateWhatsAppLinks(form);

    // No backend yet: prepare payload for Laravel and open WhatsApp as the delivery channel.
    const payload = new FormData(form);
    form.dataset.lastPayload = JSON.stringify(Object.fromEntries(payload.entries()));

    const exportLink = document.getElementById('form-whatsapp-export-btn');
    const url = exportLink?.getAttribute('href') || buildWhatsAppUrl(form);
    window.open(url, '_blank', 'noopener,noreferrer');
    showSuccess(form);
    setFormBusy(form, false);
  });

  document.querySelectorAll('[data-submit-another], #contact-submit-another').forEach((btn) => {
    btn.addEventListener('click', () => resetForm(form));
  });
}

function iconWhatsApp(cls = 'w-9 h-9') {
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;
}

function sendWhatsApp(text) {
  const w = content().whatsapp;
  const finalizeMsg = text || w.defaultMsg;
  window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(finalizeMsg)}`, '_blank', 'noopener,noreferrer');
}

function renderWhatsAppPresets(presetsHost, presets, chatbox) {
  if (!presetsHost || !presets?.length) return;
  presetsHost.innerHTML = presets
    .map(
      (preset) =>
        `<button type="button" data-whatsapp-preset class="whatsapp-preset" data-msg="${encodeURIComponent(preset.msg)}">${preset.text}</button>`,
    )
    .join('');
  presetsHost.querySelectorAll('[data-whatsapp-preset]').forEach((btn) => {
    btn.addEventListener('click', () => {
      sendWhatsApp(decodeURIComponent(btn.getAttribute('data-msg') || ''));
      if (chatbox) {
        chatbox.hidden = true;
        chatbox.classList.remove('is-open');
      }
    });
  });
}

export function initWhatsAppWidget() {
  const bubble = document.getElementById('whatsapp-trigger-bubble');
  const chatbox = document.getElementById('whatsapp-chatbox');
  const motmain = document.getElementById('motmain-trigger-bubble');
  if (!bubble && !motmain) return;

  const w = content().whatsapp;

  if (chatbox) {
    chatbox.hidden = true;
    chatbox.classList.remove('is-open');
    const presetsHost = chatbox.querySelector('[data-whatsapp-presets]');
    renderWhatsAppPresets(presetsHost, w.presets, chatbox);

    const input = chatbox.querySelector('input[type="text"], [data-whatsapp-input]');
    const sendBtn = chatbox.querySelector('[data-whatsapp-send]');
    if (sendBtn && !sendBtn.querySelector('svg')) sendBtn.innerHTML = iconSend('icon icon-sm icon-rtl-flip');

    const sendTyped = () => {
      sendWhatsApp(input?.value?.trim());
      if (input) input.value = '';
      chatbox.hidden = true;
      chatbox.classList.remove('is-open');
    };

    sendBtn?.addEventListener('click', sendTyped);
    input?.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        sendTyped();
      }
    });

    chatbox.querySelectorAll('[data-whatsapp-close]').forEach((btn) => {
      if (!btn.querySelector('svg')) btn.innerHTML = iconX('icon icon-sm');
      btn.addEventListener('click', () => {
        chatbox.hidden = true;
        chatbox.classList.remove('is-open');
      });
    });
  }

  if (bubble) {
    if (!bubble.querySelector('svg')) {
      bubble.innerHTML = iconWhatsApp('w-9 h-9 sm:w-10 sm:h-10 text-[#25D366] whatsapp-green-highlight relative z-10');
    }
    bubble.addEventListener('click', () => {
      if (!chatbox) {
        sendWhatsApp();
        return;
      }
      const willOpen = chatbox.hidden;
      chatbox.hidden = !willOpen;
      chatbox.classList.toggle('is-open', willOpen);
    });
  }

  motmain?.addEventListener('click', () => {
    window.open(MOTMAIN_TELEGRAM_URL, '_blank', 'noopener,noreferrer');
  });

  document.addEventListener('localechange', () => {
    const next = content().whatsapp;
    const presetsHost = chatbox?.querySelector('[data-whatsapp-presets]');
    renderWhatsAppPresets(presetsHost, next.presets, chatbox);
  });
}
