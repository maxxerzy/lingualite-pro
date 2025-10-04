const ROOT_ID = 'react-bits-root';

function initialiseReactBitsExplorer() {
  const mountNode = document.getElementById(ROOT_ID);
  if (!mountNode || mountNode.dataset.state === 'initialised') {
    return;
  }

  mountNode.dataset.state = 'loading';

  const setContent = (html, state = 'idle') => {
    mountNode.dataset.state = state;
    mountNode.innerHTML = html;
  };

  setContent(
    `<div class="react-bits-placeholder">React Bits wird geladen …</div>`,
    'loading'
  );

  const load = async () => {
    try {
      const [React, ReactDOMClient, ReactBits] = await Promise.all([
        import('https://esm.sh/react@18?dev'),
        import('https://esm.sh/react-dom@18/client?dev'),
        import('https://esm.sh/react-bits?bundle&target=es2020')
      ]);

      const { createElement, useMemo } = React;
      const { createRoot } = ReactDOMClient;

      const componentNames = Object.keys(ReactBits).filter(
        (key) => key && key[0] === key[0]?.toUpperCase()
      );

      const Explorer = () => {
        const names = useMemo(() => [...componentNames].sort(), [componentNames]);
        const hasEntries = names.length > 0;

        return createElement(
          'div',
          { className: 'react-bits-content' },
          createElement(
            'p',
            { className: 'react-bits-hint' },
            hasEntries
              ? 'Klicke auf einen Komponenten-Namen, um dessen Props im Browser zu inspizieren.'
              : 'react-bits wurde geladen, aber es wurden keine Komponenten-Exporte gefunden.'
          ),
          hasEntries
            ? createElement(
                'div',
                { className: 'react-bits-grid', role: 'list' },
                names.map((name) =>
                  createElement(
                    'button',
                    {
                      key: name,
                      type: 'button',
                      className: 'react-bits-chip',
                      role: 'listitem',
                      onClick: () =>
                        console.info('react-bits component', name, ReactBits[name])
                    },
                    name
                  )
                )
              )
            : null,
          createElement(
            'div',
            { className: 'react-bits-footer' },
            'Alle Komponenten werden direkt aus dem CDN geladen. Öffne die Konsole für weitere Informationen.'
          )
        );
      };

      const root = createRoot(mountNode);
      root.render(createElement(Explorer));
      mountNode.dataset.state = 'initialised';
    } catch (error) {
      console.error('React Bits konnte nicht geladen werden.', error);
      setContent(
        `<div class="react-bits-error">React Bits konnte nicht geladen werden. ` +
          `Bitte stelle eine Internetverbindung sicher oder installiere das Paket lokal.<br><code>${error.message}</code></div>`,
        'error'
      );
    }
  };

  load();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialiseReactBitsExplorer, {
    once: true
  });
} else {
  initialiseReactBitsExplorer();
}
