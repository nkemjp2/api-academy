/**
 * Lightweight syntax highlighter for Python, SQL, and Bash.
 * Returns an array of { text, className } tokens for React rendering.
 */

const PYTHON_KEYWORDS = new Set([
  'def', 'class', 'return', 'if', 'elif', 'else', 'for', 'while', 'in',
  'import', 'from', 'as', 'try', 'except', 'finally', 'raise', 'with',
  'and', 'or', 'not', 'is', 'None', 'True', 'False', 'lambda', 'yield',
  'pass', 'break', 'continue', 'del', 'global', 'nonlocal', 'assert',
]);

const PYTHON_BUILTINS = new Set([
  'print', 'len', 'range', 'str', 'int', 'float', 'bool', 'list', 'dict',
  'set', 'tuple', 'type', 'isinstance', 'round', 'next', 'enumerate',
  'zip', 'map', 'filter', 'sorted', 'reversed', 'any', 'all', 'sum',
  'min', 'max', 'abs', 'open', 'super', 'property',
]);

const SQL_KEYWORDS = new Set([
  'SELECT', 'FROM', 'WHERE', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET',
  'DELETE', 'CREATE', 'TABLE', 'DATABASE', 'DROP', 'ALTER', 'ADD', 'INDEX',
  'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'NOT', 'NULL', 'UNIQUE',
  'DEFAULT', 'AUTO_INCREMENT', 'INT', 'VARCHAR', 'TEXT', 'DECIMAL',
  'FLOAT', 'BOOLEAN', 'TIMESTAMP', 'DATE', 'ORDER', 'BY', 'ASC', 'DESC',
  'JOIN', 'INNER', 'LEFT', 'RIGHT', 'ON', 'AND', 'OR', 'IN', 'LIKE',
  'BETWEEN', 'IS', 'AS', 'HAVING', 'GROUP', 'LIMIT', 'OFFSET', 'UNION',
  'ALL', 'DISTINCT', 'COUNT', 'SUM', 'AVG', 'MAX', 'MIN', 'USE',
  'CURRENT_TIMESTAMP', 'IF', 'EXISTS', 'CASCADE', 'CONSTRAINT',
]);

function tokenizePython(code) {
  const tokens = [];
  let i = 0;
  
  while (i < code.length) {
    // Comments
    if (code[i] === '#') {
      let end = code.indexOf('\n', i);
      if (end === -1) end = code.length;
      tokens.push({ text: code.slice(i, end), className: 'token-comment' });
      i = end;
      continue;
    }
    
    // Triple-quoted strings
    if (code.slice(i, i + 3) === '"""' || code.slice(i, i + 3) === "'''") {
      const quote = code.slice(i, i + 3);
      let end = code.indexOf(quote, i + 3);
      if (end === -1) end = code.length - 3;
      end += 3;
      tokens.push({ text: code.slice(i, end), className: 'token-string' });
      i = end;
      continue;
    }
    
    // Strings
    if (code[i] === '"' || code[i] === "'") {
      const quote = code[i];
      // Check for f-string
      const isF = i > 0 && code[i - 1] === 'f';
      let j = i + 1;
      while (j < code.length && code[j] !== quote) {
        if (code[j] === '\\') j++;
        j++;
      }
      j = Math.min(j + 1, code.length);
      if (isF && tokens.length > 0 && tokens[tokens.length - 1].text === 'f') {
        tokens[tokens.length - 1] = { text: 'f', className: 'token-string' };
      }
      tokens.push({ text: code.slice(i, j), className: 'token-string' });
      i = j;
      continue;
    }
    
    // Decorators
    if (code[i] === '@') {
      let end = i + 1;
      while (end < code.length && /[\w.]/.test(code[end])) end++;
      // Also grab parenthesized args
      if (end < code.length && code[end] === '(') {
        let depth = 1;
        end++;
        while (end < code.length && depth > 0) {
          if (code[end] === '(') depth++;
          if (code[end] === ')') depth--;
          end++;
        }
      }
      tokens.push({ text: code.slice(i, end), className: 'token-decorator' });
      i = end;
      continue;
    }
    
    // Numbers
    if (/[0-9]/.test(code[i]) && (i === 0 || !/[a-zA-Z_]/.test(code[i - 1]))) {
      let end = i;
      while (end < code.length && /[0-9._]/.test(code[end])) end++;
      tokens.push({ text: code.slice(i, end), className: 'token-number' });
      i = end;
      continue;
    }
    
    // Words (keywords, builtins, identifiers)
    if (/[a-zA-Z_]/.test(code[i])) {
      let end = i;
      while (end < code.length && /[a-zA-Z0-9_]/.test(code[end])) end++;
      const word = code.slice(i, end);
      
      if (PYTHON_KEYWORDS.has(word)) {
        tokens.push({ text: word, className: 'token-keyword' });
      } else if (PYTHON_BUILTINS.has(word)) {
        tokens.push({ text: word, className: 'token-builtin' });
      } else if (end < code.length && code[end] === '(') {
        tokens.push({ text: word, className: 'token-function' });
      } else if (word[0] === word[0].toUpperCase() && word[0] !== word[0].toLowerCase()) {
        tokens.push({ text: word, className: 'token-classname' });
      } else {
        tokens.push({ text: word, className: '' });
      }
      i = end;
      continue;
    }
    
    // Operators
    if ('=+-*/<>!&|%^~'.includes(code[i])) {
      tokens.push({ text: code[i], className: 'token-operator' });
      i++;
      continue;
    }
    
    // Punctuation
    if ('()[]{}:,.;'.includes(code[i])) {
      tokens.push({ text: code[i], className: 'token-punctuation' });
      i++;
      continue;
    }
    
    // Whitespace and everything else
    tokens.push({ text: code[i], className: '' });
    i++;
  }
  
  return tokens;
}

function tokenizeSQL(code) {
  const tokens = [];
  let i = 0;
  
  while (i < code.length) {
    // Comments
    if (code.slice(i, i + 2) === '--') {
      let end = code.indexOf('\n', i);
      if (end === -1) end = code.length;
      tokens.push({ text: code.slice(i, end), className: 'token-sql-comment' });
      i = end;
      continue;
    }
    
    // Strings
    if (code[i] === "'") {
      let j = i + 1;
      while (j < code.length && code[j] !== "'") j++;
      j = Math.min(j + 1, code.length);
      tokens.push({ text: code.slice(i, j), className: 'token-sql-string' });
      i = j;
      continue;
    }
    
    // Numbers
    if (/[0-9]/.test(code[i]) && (i === 0 || !/[a-zA-Z_]/.test(code[i - 1]))) {
      let end = i;
      while (end < code.length && /[0-9.]/.test(code[end])) end++;
      tokens.push({ text: code.slice(i, end), className: 'token-sql-number' });
      i = end;
      continue;
    }
    
    // Words
    if (/[a-zA-Z_]/.test(code[i])) {
      let end = i;
      while (end < code.length && /[a-zA-Z0-9_]/.test(code[end])) end++;
      const word = code.slice(i, end);
      
      if (SQL_KEYWORDS.has(word.toUpperCase())) {
        tokens.push({ text: word, className: 'token-sql-keyword' });
      } else if (['COUNT', 'SUM', 'AVG', 'MAX', 'MIN'].includes(word.toUpperCase())) {
        tokens.push({ text: word, className: 'token-sql-function' });
      } else {
        tokens.push({ text: word, className: '' });
      }
      i = end;
      continue;
    }
    
    tokens.push({ text: code[i], className: '' });
    i++;
  }
  
  return tokens;
}

function tokenizeBash(code) {
  const tokens = [];
  let i = 0;
  
  while (i < code.length) {
    // Comments
    if (code[i] === '#') {
      let end = code.indexOf('\n', i);
      if (end === -1) end = code.length;
      tokens.push({ text: code.slice(i, end), className: 'token-bash-comment' });
      i = end;
      continue;
    }
    
    // Strings
    if (code[i] === '"' || code[i] === "'") {
      const q = code[i];
      let j = i + 1;
      while (j < code.length && code[j] !== q) {
        if (code[j] === '\\') j++;
        j++;
      }
      j = Math.min(j + 1, code.length);
      tokens.push({ text: code.slice(i, j), className: 'token-bash-string' });
      i = j;
      continue;
    }
    
    // Flags
    if (code[i] === '-' && i > 0 && code[i - 1] === ' ') {
      let end = i;
      while (end < code.length && code[end] !== ' ' && code[end] !== '\n') end++;
      tokens.push({ text: code.slice(i, end), className: 'token-bash-flag' });
      i = end;
      continue;
    }
    
    // Words
    if (/[a-zA-Z_]/.test(code[i])) {
      let end = i;
      while (end < code.length && /[a-zA-Z0-9_:/.\\-]/.test(code[end])) end++;
      const word = code.slice(i, end);
      const bashCmds = new Set(['pip', 'python', 'curl', 'npm', 'cd', 'mkdir', 'ls', 'cat', 'echo', 'export', 'source', 'sudo', 'apt', 'brew']);
      if (bashCmds.has(word)) {
        tokens.push({ text: word, className: 'token-bash-command' });
      } else {
        tokens.push({ text: word, className: '' });
      }
      i = end;
      continue;
    }
    
    tokens.push({ text: code[i], className: '' });
    i++;
  }
  
  return tokens;
}

export function highlight(code, language) {
  if (!code) return [{ text: '', className: '' }];
  
  switch (language) {
    case 'python': return tokenizePython(code);
    case 'sql': return tokenizeSQL(code);
    case 'bash': return tokenizeBash(code);
    default: return [{ text: code, className: '' }];
  }
}
