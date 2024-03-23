export function createTextNode(text) {
  return {
    type: 'TEXT_ELEMTNT',
    nodeValue: text,
    props: {
      children: [],
    },
  };
}
export function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children,
    },
  };
}
