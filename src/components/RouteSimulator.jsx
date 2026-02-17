import { useState, useMemo } from 'react';
import styles from './RouteSimulator.module.css';

/* ── Mock data ────────────────────────────────────────────────── */
const MOCK_CUSTOMERS = [
  { id: 1, company_name: 'Bristol Bakery', email: 'orders@bristolbakery.co.uk', phone: '0117 9001234', outstanding_balance: 2500.00, created_at: '2024-11-15T09:30:00Z' },
  { id: 2, company_name: 'London Tech Ltd', email: 'accounts@londontech.co.uk', phone: '020 71234567', outstanding_balance: 8000.00, created_at: '2024-11-20T14:15:00Z' },
  { id: 3, company_name: 'Manchester Supplies', email: 'info@manchestersupplies.co.uk', phone: '0161 2345678', outstanding_balance: 1200.00, created_at: '2024-12-01T10:00:00Z' },
];

const MOCK_INVOICES = [
  { id: 1, client: 'Bristol Bakery', amount: 2500, status: 'overdue' },
  { id: 2, client: 'London Tech Ltd', amount: 8000, status: 'paid' },
  { id: 3, client: 'Manchester Supplies', amount: 1200, status: 'pending' },
];

let nextCustomerId = 4;
let nextInvoiceId = 4;

/* ── Route parser ─────────────────────────────────────────────── */
function parseRoutes(code) {
  const routes = [];
  const regex = /@app\.route\(\s*['"]([^'"]+)['"]\s*(?:,\s*methods\s*=\s*\[([^\]]*)\])?\s*\)/g;
  let match;
  while ((match = regex.exec(code)) !== null) {
    const path = match[1];
    const methodsStr = match[2];
    const methods = methodsStr
      ? methodsStr.replace(/['" ]/g, '').split(',').map(m => m.toUpperCase())
      : ['GET'];
    methods.forEach(method => {
      routes.push({ method, path });
    });
  }
  return routes;
}

function routeToRegex(routePath) {
  const pattern = routePath.replace(/<(?:int|string|float):(\w+)>/g, '(?<$1>[^/]+)').replace(/<(\w+)>/g, '(?<$1>[^/]+)');
  return new RegExp('^' + pattern + '$');
}

/* ── Mock response logic ──────────────────────────────────────── */
function simulateRequest(method, url, body, routes) {
  const delay = 50 + Math.floor(Math.random() * 150);

  // Find matching route
  let matchedRoute = null;
  let params = {};
  for (const route of routes) {
    if (route.method !== method) continue;
    const regex = routeToRegex(route.path);
    const m = url.match(regex);
    if (m) {
      matchedRoute = route;
      params = m.groups || {};
      break;
    }
  }

  if (!matchedRoute) {
    return { status: 404, body: { error: 'Not found' }, delay };
  }

  const path = matchedRoute.path;

  // Root / health-style routes
  if (path === '/') {
    return { status: 200, body: { status: 'ok', message: 'Your setup is working!' }, delay };
  }
  if (path === '/hello') {
    return { status: 200, body: { message: 'Hello! Welcome to my first API!' }, delay };
  }
  if (path === '/api/health') {
    return { status: 200, body: { status: 'healthy', database: 'connected' }, delay };
  }

  // Customers
  if (path === '/api/customers' && method === 'GET') {
    return { status: 200, body: MOCK_CUSTOMERS, delay };
  }
  if ((path === '/api/customers/<int:customer_id>' || path === '/api/customers/<int:id>') && method === 'GET') {
    const id = parseInt(params.customer_id || params.id);
    const customer = MOCK_CUSTOMERS.find(c => c.id === id);
    if (!customer) return { status: 404, body: { error: 'Customer not found' }, delay };
    return { status: 200, body: customer, delay };
  }
  if (path === '/api/customers' && method === 'POST') {
    if (!body || (!body.company_name && !body.name) || !body.email) {
      return { status: 400, body: { error: 'company_name and email are required' }, delay };
    }
    const newCustomer = { id: nextCustomerId++, ...body, created_at: new Date().toISOString() };
    return { status: 201, body: newCustomer, delay };
  }
  if (path === '/api/customers' && method === 'DELETE') {
    return { status: 200, body: { message: 'Deleted' }, delay };
  }

  // Invoices
  if (path === '/api/invoices' && method === 'GET') {
    return { status: 200, body: MOCK_INVOICES, delay };
  }
  if (path === '/api/invoices/<int:invoice_id>' && method === 'GET') {
    const id = parseInt(params.invoice_id);
    const invoice = MOCK_INVOICES.find(inv => inv.id === id);
    if (!invoice) return { status: 404, body: { error: 'Invoice not found' }, delay };
    return { status: 200, body: invoice, delay };
  }
  if (path === '/api/invoices' && method === 'POST') {
    if (!body || !body.client || !body.amount) {
      return { status: 400, body: { error: 'client and amount are required' }, delay };
    }
    const newInvoice = { id: nextInvoiceId++, client: body.client, amount: body.amount, status: body.status || 'pending' };
    return { status: 201, body: newInvoice, delay };
  }

  // Register / Login
  if (path === '/api/register' && method === 'POST') {
    if (!body || !body.email || !body.password) {
      return { status: 400, body: { error: 'email and password are required' }, delay };
    }
    if (body.password.length < 8) {
      return { status: 400, body: { error: 'Password must be at least 8 characters' }, delay };
    }
    return { status: 201, body: { success: true, message: 'Account created' }, delay };
  }
  if (path === '/api/login' && method === 'POST') {
    if (!body || !body.email || !body.password) {
      return { status: 400, body: { error: 'email and password are required' }, delay };
    }
    return { status: 200, body: { success: true, data: { token: 'eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImRlbW9AZXhhbXBsZS5jb20iLCJyb2xlIjoiYWRtaW4ifQ.simulated' } }, delay };
  }

  // Generic PUT with id parameter
  if (method === 'PUT') {
    if (!body) return { status: 400, body: { error: 'Request body is required' }, delay };
    return { status: 200, body: { ...body, id: parseInt(params.customer_id || params.id || params.invoice_id || 1) }, delay };
  }

  // Fallback for matched but unhandled
  return { status: 200, body: { message: 'OK' }, delay };
}

const METHOD_COLORS = { GET: styles.methodGet, POST: styles.methodPost, PUT: styles.methodPut, DELETE: styles.methodDelete };

/* ── Component ────────────────────────────────────────────────── */
export default function RouteSimulator({ code }) {
  const routes = useMemo(() => parseRoutes(code), [code]);

  const [method, setMethod] = useState(routes[0]?.method || 'GET');
  const [url, setUrl] = useState(routes[0]?.path?.replace(/<(?:int|string|float):(\w+)>/g, '1') || '/');
  const [bodyText, setBodyText] = useState('{\n  \n}');
  const [response, setResponse] = useState(null);
  const [sending, setSending] = useState(false);

  const needsBody = method === 'POST' || method === 'PUT';

  const handleSend = () => {
    setSending(true);
    setResponse(null);

    let parsedBody = null;
    if (needsBody && bodyText.trim()) {
      try {
        parsedBody = JSON.parse(bodyText);
      } catch {
        setResponse({ status: 400, body: { error: 'Invalid JSON in request body' }, delay: 0 });
        setSending(false);
        return;
      }
    }

    const result = simulateRequest(method, url, parsedBody, routes);
    setTimeout(() => {
      setResponse(result);
      setSending(false);
    }, result.delay);
  };

  const statusClass = response
    ? response.status < 300 ? styles.status2xx : response.status < 500 ? styles.status4xx : styles.status5xx
    : '';

  // Build quick route buttons
  const uniqueRoutes = routes.reduce((acc, r) => {
    const key = `${r.method} ${r.path}`;
    if (!acc.some(x => `${x.method} ${x.path}` === key)) acc.push(r);
    return acc;
  }, []);

  const selectRoute = (r) => {
    setMethod(r.method);
    setUrl(r.path.replace(/<(?:int|string|float):(\w+)>/g, '1'));
    setResponse(null);
  };

  return (
    <div className={styles.simulator}>
      <div className={styles.simHeader}>
        <span className={styles.simTitle}>{'\u{1F9EA}'} Route Simulator</span>
        <span className={styles.simHint}>Simulated — no real server</span>
      </div>

      {/* Route quick-select */}
      {uniqueRoutes.length > 1 && (
        <div className={styles.routeTabs}>
          {uniqueRoutes.map((r, i) => (
            <button
              key={i}
              className={`${styles.routeTab} ${METHOD_COLORS[r.method] || ''}`}
              onClick={() => selectRoute(r)}
            >
              <span className={styles.routeTabMethod}>{r.method}</span>
              <span className={styles.routeTabPath}>{r.path}</span>
            </button>
          ))}
        </div>
      )}

      {/* Request bar */}
      <div className={styles.requestBar}>
        <select
          value={method}
          onChange={(e) => { setMethod(e.target.value); setResponse(null); }}
          className={`${styles.methodSelect} ${METHOD_COLORS[method] || ''}`}
        >
          {['GET', 'POST', 'PUT', 'DELETE'].map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className={styles.urlInput}
          placeholder="/api/..."
        />
        <button onClick={handleSend} disabled={sending} className={styles.sendBtn}>
          {sending ? 'Sending...' : 'Send'}
        </button>
      </div>

      {/* Request body */}
      {needsBody && (
        <div className={styles.bodySection}>
          <label className={styles.bodyLabel}>Request Body (JSON)</label>
          <textarea
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            className={styles.bodyInput}
            rows={4}
            spellCheck={false}
          />
        </div>
      )}

      {/* Response */}
      {response && (
        <div className={styles.responseSection}>
          <div className={styles.responseMeta}>
            <span className={`${styles.statusBadge} ${statusClass}`}>
              {response.status} {response.status < 300 ? 'OK' : response.status < 500 ? 'Error' : 'Server Error'}
            </span>
            <span className={styles.responseTime}>{response.delay}ms</span>
            <span className={styles.responseHeaders}>Content-Type: application/json</span>
          </div>
          <pre className={styles.responseBody}>
            {JSON.stringify(response.body, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
