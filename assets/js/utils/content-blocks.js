/**
 * Shared ContentBlock renderer for rich Program structures.
 * Class prefix keeps styling structure-specific.
 */

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function paragraphTextHtml(text = '') {
  return escapeHtml(text).replace(/\n/g, '<br>');
}

/**
 * @param {Array} blocks
 * @param {string} [prefix='program-block'] BEM prefix for block classes
 */
export function renderContentBlocks(blocks = [], prefix = 'program-block') {
  const list = blocks ?? [];
  let html = '';
  let i = 0;

  while (i < list.length) {
    const block = list[i];
    if (!block?.type) {
      i += 1;
      continue;
    }

    if (block.type === 'highlight') {
      const group = [];
      while (i < list.length && list[i]?.type === 'highlight') {
        group.push(list[i]);
        i += 1;
      }

      if (group.length > 1) {
        html += `<div class="${prefix}-highlight-strip">${group
          .map(
            (item, index) =>
              `${index > 0 ? `<span class="${prefix}-highlight-strip__arrow" aria-hidden="true">→</span>` : ''}<p class="${prefix} ${prefix}--highlight">${escapeHtml(item.text)}</p>`,
          )
          .join('')}</div>`;
      } else {
        html += `<p class="${prefix} ${prefix}--highlight">${escapeHtml(group[0].text)}</p>`;
      }
      continue;
    }

    if (block.type === 'paragraph') {
      html += `<p class="${prefix} ${prefix}--paragraph">${paragraphTextHtml(block.text)}</p>`;
    } else if (block.type === 'label') {
      html += `<p class="${prefix} ${prefix}--label">${escapeHtml(block.text)}</p>`;
    } else if (block.type === 'quote') {
      html += `<blockquote class="${prefix} ${prefix}--quote">${escapeHtml(block.text)}</blockquote>`;
    } else if (block.type === 'bullets') {
      html += `<ul class="${prefix}-bullet-list">${(block.items ?? [])
        .map((item) => `<li>${escapeHtml(item)}</li>`)
        .join('')}</ul>`;
    }

    i += 1;
  }

  return html;
}

export { escapeHtml };
