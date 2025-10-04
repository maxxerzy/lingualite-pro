# React Bits Integration

Dieses Projekt unterstützt jetzt einen experimentellen Playground für [react-bits](https://github.com/DavidHDev/react-bits).
Die Integration funktioniert komplett clientseitig und lädt React und react-bits direkt aus dem CDN `esm.sh`.
Dadurch kann ohne Build-Setup mit den Komponenten experimentiert werden.

## Verwendung

1. Öffne `index.html` lokal im Browser oder über einen Entwicklungsserver.
2. Navigiere zum Tab **Einstellungen**.
3. Im Abschnitt **React Bits Komponenten** werden – sofern eine Internetverbindung besteht –
   automatisch alle benannten Exporte des Pakets geladen und als klickbare Liste dargestellt.
4. Ein Klick auf einen Komponenten-Namen schreibt die exportierte Referenz in die Browser-Konsole.
   Dadurch lässt sich z.B. das Prop-Interface inspizieren oder ein eigenes Playground-Snippet erstellen.

> **Hinweis:** Die Integration benötigt eine Internetverbindung. Hinter strikten Proxies kann der Download
> der Module blockiert werden. In diesem Fall erscheint eine Fehlermeldung innerhalb des Panels.

## Lokaler Fallback

Falls der CDN-Zugriff nicht möglich ist, kann das Paket auch lokal installiert werden:

```bash
npm install react react-dom react-bits
```

Anschließend lässt sich die Explorer-Datei (`js/integrations/react-bits-explorer.js`) so anpassen,
 dass statt des CDN-Pfads ein lokaler Import (`import React from 'react';` usw.) verwendet wird.

## Weiterführende Ideen

- Der Explorer kann als Ausgangspunkt für eigene React-Microfrontends dienen.
- Über einen dedizierten Build-Schritt (z. B. Vite oder esbuild) können komplette React-Views
  mit Lingualite-Logik kombiniert werden.
- Die Komponenten-Liste lässt sich erweitern, um direkt Playground-Beispiele oder Code-Snippets
  für häufig verwendete Komponenten zu rendern.
