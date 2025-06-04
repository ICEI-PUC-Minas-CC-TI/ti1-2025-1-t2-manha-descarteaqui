/**
 * Função genérica para criar e adicionar elementos ao DOM
 * @param {string} tagName - Nome da tag do elemento (ex: 'div', 'span', 'input')
 * @param {Object} attributes - Atributos do elemento (ex: { id: 'element-id', className: 'element-class' })
 * @param {HTMLElement} parent - Elemento pai onde o novo elemento será adicionado
 * @param {string} [textContent] - Texto opcional para o elemento
 * @returns {HTMLElement} - O elemento criado
 */
export function criarElemento(tagName, attributes, parent, textContent = "") {
  const element = document.createElement(tagName);

  // Adiciona os atributos ao elemento
  for (const [key, value] of Object.entries(attributes)) {
    element[key] = value;
  }

  // Adiciona texto ao elemento, se fornecido
  if (textContent) {
    element.textContent = textContent;
  }

  // Adiciona o elemento ao pai
  if (parent) {
    parent.appendChild(element);
  }

  return element;
}