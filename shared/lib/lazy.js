const cache = new Map();

export function lazyLoadModule(path) {
  if (!cache.has(path)) {
    cache.set(
      path,
      import(path).then((module) => {
        cache.set(path, Promise.resolve(module));
        return module;
      })
    );
  }
  return cache.get(path);
}

export function prefetchModule(path) {
  if (typeof document === 'undefined') return;
  if (document.querySelector(`link[rel="modulepreload"][href="${path}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'modulepreload';
  link.href = path;
  document.head.appendChild(link);
}
