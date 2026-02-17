import { useState, useRef, useCallback } from 'react';

const CDN_URL = 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/';
const SCRIPT_URL = CDN_URL + 'pyodide.js';
const MAX_EXEC_MS = 10000;

let pyodidePromise = null;

function loadScript() {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${SCRIPT_URL}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement('script');
    s.src = SCRIPT_URL;
    s.async = true;
    s.onload = resolve;
    s.onerror = () => reject(new Error('Failed to load Pyodide script'));
    document.head.appendChild(s);
  });
}

async function initPyodide() {
  if (pyodidePromise) return pyodidePromise;
  pyodidePromise = (async () => {
    await loadScript();
    // eslint-disable-next-line no-undef
    const pyodide = await loadPyodide({ indexURL: CDN_URL });
    return pyodide;
  })();
  return pyodidePromise;
}

export function usePyodide() {
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const pyRef = useRef(null);

  const runPython = useCallback(async (code) => {
    setError(null);
    let stdout = '';
    let stderr = '';

    try {
      if (!pyRef.current) {
        setIsLoading(true);
        pyRef.current = await initPyodide();
        setIsReady(true);
        setIsLoading(false);
      }

      const py = pyRef.current;

      // Capture stdout/stderr
      py.setStdout({ batched: (text) => { stdout += text + '\n'; } });
      py.setStderr({ batched: (text) => { stderr += text + '\n'; } });

      // Run with timeout
      const result = await Promise.race([
        (async () => {
          try {
            await py.runPythonAsync(code);
          } catch (e) {
            stderr += e.message + '\n';
          }
        })(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Execution timed out (10s limit)')), MAX_EXEC_MS)
        ),
      ]);

      void result;
      return { stdout: stdout.trimEnd(), stderr: stderr.trimEnd() };
    } catch (e) {
      setIsLoading(false);
      if (e.message.includes('timed out')) {
        return { stdout: stdout.trimEnd(), stderr: 'Execution timed out (10s limit)' };
      }
      setError(e.message);
      return { stdout: '', stderr: e.message };
    }
  }, []);

  return { runPython, isLoading, isReady, error };
}
