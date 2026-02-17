// =====================================================================
// API ACADEMY — Complete Lesson Data (v2)
// 23 lessons, 5 modules: Setup → Foundation → Database → Production → Capstone
// =====================================================================

const LESSONS = [
  // ===================================================================
  // MODULE: SETUP
  // ===================================================================
  {
    id: 'setup',
    module: 'Setup',
    title: 'Setting Up Your Dev Environment',
    icon: '🛠️',
    readingTime: 8,
    content: [
      {
        type: 'analogy',
        title: 'Before You Cook, Set Up the Kitchen',
        text: `Before a chef can make a meal, they need a kitchen — oven, fridge, knives, chopping board. You can't cook without tools.

Same with coding. Before you write a single line of Python, you need to install your tools:

1. **Python** — The programming language itself
2. **MySQL** — The database where your data lives
3. **A code editor** — Where you write and edit code (VS Code)
4. **A terminal** — Where you run your programs (Command Prompt / Terminal)
5. **pip** — Python's "app store" for downloading extra tools

This lesson walks you through installing everything on **Windows**, **Mac**, or **Linux**.`,
      },
      {
        type: 'code',
        title: 'Step 1: Install Python',
        language: 'bash',
        code: `# Check if Python is already installed:
python --version
# or on Mac/Linux:
python3 --version

# If not installed:
# Windows: Download from https://www.python.org/downloads/
#   IMPORTANT: Check "Add Python to PATH" during installation!
#
# Mac: 
brew install python3
#
# Ubuntu/Debian Linux:
sudo apt update
sudo apt install python3 python3-pip

# Verify installation:
python3 --version
# Should output: Python 3.11.x (or similar)`,
        explanation: `**PATH** is like your computer's address book. When you type "python" in the terminal, your computer looks through PATH to find where Python is installed. If Python isn't in PATH, your computer says "I don't know what python is." That's why the checkbox during Windows installation is critical.

**pip** comes bundled with Python 3.4+. It's Python's package manager — like an app store where you download libraries (extra tools) that other developers have built.`,
      },
      {
        type: 'code',
        title: 'Step 2: Install MySQL',
        language: 'bash',
        code: `# Windows: Download MySQL Community Server from
#   https://dev.mysql.com/downloads/mysql/
#   Choose "MySQL Installer for Windows" — it's a GUI wizard.
#   Remember the root password you set!

# Mac:
brew install mysql
brew services start mysql

# Ubuntu/Debian Linux:
sudo apt install mysql-server
sudo mysql_secure_installation

# Verify MySQL is running:
mysql -u root -p
# Enter your password, and you should see: mysql>
# Type 'exit' to leave.`,
        explanation: `MySQL runs as a "service" — a background program that's always listening for requests, like a receptionist who never leaves the desk. Even when you close the terminal, MySQL keeps running.

The **root** user is the admin account. In production, you'd create a separate user with limited permissions — never use root in a live app.`,
      },
      {
        type: 'code',
        title: 'Step 3: Install VS Code & Set Up a Project',
        language: 'bash',
        code: `# Download VS Code from: https://code.visualstudio.com/
# Install these extensions (click the Extensions icon, search, install):
#   - Python (by Microsoft)
#   - MySQL (by Weijan Chen) — optional, lets you browse DB in VS Code

# Create your project folder:
mkdir api-academy-project
cd api-academy-project

# Create a virtual environment (an isolated Python sandbox):
python3 -m venv venv

# Activate it:
# Windows:
venv\\Scripts\\activate
# Mac/Linux:
source venv/bin/activate

# Your terminal prompt should now show (venv) at the start.
# Install your first packages:
pip install flask flask-mysqldb

# Save your dependencies list:
pip freeze > requirements.txt`,
        explanation: `A **virtual environment** (venv) is like a separate toolbox for each project. Without it, all your projects share the same Python packages — and if Project A needs version 1.0 of a library but Project B needs version 2.0, things break.

With venv, each project has its own isolated set of packages. Think of it as each project having its own kitchen with its own set of ingredients, instead of everyone sharing one pantry.

**requirements.txt** is your shopping list. When someone else wants to run your project, they just run \`pip install -r requirements.txt\` to get all the same packages.`,
      },
      {
        type: 'code',
        title: 'Step 4: Verify Everything Works',
        language: 'python',
        code: `# Create a file called test_setup.py and paste this:

from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello():
    return {"status": "ok", "message": "Your setup is working!"}

if __name__ == '__main__':
    print("Starting server at http://localhost:5000")
    app.run(debug=True)

# Run it:
# python test_setup.py
#
# Open your browser and go to: http://localhost:5000
# You should see: {"message":"Your setup is working!","status":"ok"}
#
# Press Ctrl+C in the terminal to stop the server.`,
        explanation: `If you see the JSON response in your browser, congratulations — Python, Flask, and your development environment are all working. You're ready to build APIs.

**localhost** means "this computer." Port **5000** is like a door number — Flask listens on door 5000 by default. So http://localhost:5000 means "talk to the program on this computer, at door 5000."`,
      },
      {
        type: 'quiz',
        question: 'Why should you create a virtual environment (venv) for each Python project?',
        options: [
          'It makes Python run faster',
          'It isolates each project\'s packages so they don\'t conflict',
          'It\'s required by Flask',
          'It protects against viruses',
        ],
        correct: 1,
        explanation: 'Virtual environments prevent package version conflicts between projects. Project A might need Flask 2.0 while Project B needs Flask 3.0 — venv keeps them separate.',
      },
      {
        type: 'challenge',
        title: 'Verify Your Setup',
        description: 'Complete these steps and check each one off:',
        steps: [
          'Open a terminal and run `python3 --version` — confirm you see Python 3.8+',
          'Run `mysql -u root -p` — confirm you can log in to MySQL',
          'Create a folder, set up a venv, and install Flask',
          'Create test_setup.py, run it, and visit http://localhost:5000 in your browser',
          'Take a screenshot of the JSON response in your browser — you\'re ready for the next lesson',
        ],
      },
    ],
  },

  // ===================================================================
  // MODULE: FOUNDATION
  // ===================================================================
  {
    id: 'what-is-api',
    module: 'Foundation',
    title: 'What is an API? (And Why Should You Care?)',
    icon: '🌐',
    readingTime: 6,
    content: [
      {
        type: 'analogy',
        title: 'Think of It Like a Restaurant',
        text: `Imagine you're at a restaurant. You (the customer) want food from the kitchen. But you don't walk into the kitchen yourself — you give your order to the waiter, and the waiter brings back your food.

An **API** (Application Programming Interface) works the same way:
• **You (the customer)** = A mobile app, website, or another program
• **The waiter** = The API
• **The kitchen** = The server/database where data lives

The API is the middleman. It takes requests ("I want all the customers from the database"), goes to the server, gets the data, and brings it back in a neat format.`,
      },
      {
        type: 'realworld',
        title: 'Real-World Examples You Already Use',
        text: `Every time you use an app, you're using APIs without knowing it:

🌦️ **Weather App** — Your phone asks a weather API: "What's the weather in Bristol?" The API returns: "12°C, cloudy."

💳 **Online Payment** — When you pay with Stripe, your shop's website talks to the payment API: "Charge this card £50." The API responds: "Payment successful."

📱 **Social Media Login** — "Sign in with Google" uses Google's API to verify your identity without the website ever seeing your password.

🚗 **Uber/Bolt** — The app asks a maps API: "How far is the driver?" The API returns the distance and estimated time.

💼 **Accounting Software** — Xero's API lets other apps pull your invoices, create transactions, and check balances — without opening Xero itself.`,
      },
      {
        type: 'concept',
        title: 'What is a REST API?',
        text: `REST (Representational State Transfer) is a set of rules for how APIs should work. Think of it as the "grammar" of APIs. A REST API uses standard web addresses (URLs) and simple actions:

**GET** — Read data (like browsing a menu)
**POST** — Create new data (like placing a new order)
**PUT** — Update existing data (like changing your order)
**DELETE** — Remove data (like cancelling your order)

These are called **HTTP methods**. Every website uses HTTP — it's the language of the internet.`,
      },
      {
        type: 'code',
        title: 'What an API Request & Response Looks Like',
        language: 'text',
        code: `REQUEST:
  Method:  GET
  URL:     https://api.example.com/customers
  Headers: Content-Type: application/json

RESPONSE:
  Status: 200 OK
  Body:
  {
      "customers": [
          {
              "id": 1,
              "name": "Bristol Bakery",
              "email": "orders@bristolbakery.co.uk"
          },
          {
              "id": 2,
              "name": "London Tech Ltd",
              "email": "hello@londontech.io"
          }
      ]
  }`,
        explanation: `Every API interaction has two parts: a **request** (what you're asking for) and a **response** (what you get back).

**JSON** (JavaScript Object Notation) is the format APIs use to send data. It's just text organised with curly braces {} and square brackets []. Think of it as a universal language that every programming language can understand — like English being the common language in international business.

**Status codes** tell you what happened: 200 means success, 404 means not found, 500 means the server broke.`,
      },
      {
        type: 'quiz',
        question: 'A mobile app wants to get a list of products from an online shop. Which HTTP method should it use?',
        options: ['GET', 'POST', 'DELETE', 'PUT'],
        correct: 0,
        explanation: 'GET is used to read/retrieve data. Think of it as "going to get" something — you\'re not changing anything, just looking.',
      },
      {
        type: 'challenge',
        title: 'Explore a Real API',
        description: 'Try calling a real, free API to see how it works:',
        steps: [
          'Open your browser and visit: https://jsonplaceholder.typicode.com/users',
          'You should see JSON data with 10 fake users. This is a real API response!',
          'Now try: https://jsonplaceholder.typicode.com/users/1 — this gets just one user (ID 1)',
          'Try: https://jsonplaceholder.typicode.com/posts?userId=1 — this gets all posts by user 1',
          'Notice the pattern: /resource for all items, /resource/id for one item, and ?key=value for filtering',
        ],
      },
    ],
  },

  // ─── NEW: How HTTP Works ────────────────────────────────────────────
  {
    id: 'http-mechanics',
    module: 'Foundation',
    title: 'How HTTP Actually Works',
    icon: '📡',
    readingTime: 8,
    content: [
      {
        type: 'analogy',
        title: 'The Postal Service of the Internet',
        text: `HTTP is the postal service of the internet. Every time you visit a website or call an API, here's what actually happens — in the same way a letter gets delivered:

1. **You write the letter** — Your browser or app creates an HTTP request (what you want, where to send it)
2. **You put it in an envelope** — The request gets packaged with headers (extra info on the envelope: who sent it, what format the reply should be in)
3. **DNS looks up the address** — Your computer asks: "Where does api.example.com actually live?" DNS (Domain Name System) is like the internet's phone book. It translates the human-readable name to a numeric IP address (like 104.21.55.123)
4. **The postman delivers it** — The request travels through the internet to the server
5. **The server opens it and replies** — The server reads your request, does the work, and sends back a response
6. **You open the reply** — Your browser/app reads the response and displays it

All of this happens in milliseconds. Every single time.`,
      },
      {
        type: 'concept',
        title: 'The Three Ways to Send Data to an API',
        text: `There are three places you can put data in an HTTP request. This confuses many beginners because the course uses all three — so let's make them crystal clear:

**1. URL Parameters (Path Parameters)**
Data embedded IN the URL itself.
Example: \`GET /api/customers/42\`
The "42" is the parameter. Used for identifying specific resources.

**2. Query Parameters**
Data added after a \`?\` in the URL. Used for filtering, sorting, searching.
Example: \`GET /api/invoices?status=overdue&min_amount=1000\`
You can chain multiple with \`&\`.

**3. Request Body (JSON Body)**
Data sent INSIDE the request, not in the URL. Used for creating/updating resources.
Example: \`POST /api/customers\` with body: \`{"name": "Bristol Bakery", "email": "info@bristol.co.uk"}\`
Only POST and PUT typically have a body. GET requests should NOT have a body.`,
      },
      {
        type: 'code',
        title: 'HTTP Headers — The Metadata Envelope',
        language: 'text',
        code: `Every HTTP request/response has HEADERS — metadata about the message.

REQUEST HEADERS (what your app sends):
  Content-Type: application/json     ← "I'm sending JSON data"
  Accept: application/json           ← "Please reply in JSON"
  Authorization: Bearer eyJhb...     ← "Here's my login token"
  X-API-Key: sk_live_abc123          ← "Here's my API key"

RESPONSE HEADERS (what the server sends back):
  Content-Type: application/json     ← "My reply is JSON"
  Content-Length: 1024               ← "The reply is 1024 bytes"
  X-RateLimit-Remaining: 98         ← "You have 98 requests left"

COMMON STATUS CODES:
  2xx = Success
    200 OK              ← Request worked
    201 Created         ← New resource created
    204 No Content      ← Worked, nothing to return

  4xx = Client Error (YOUR fault)
    400 Bad Request     ← Your data was malformed
    401 Unauthorised    ← You didn't prove who you are
    403 Forbidden       ← You proved who you are but can't access this
    404 Not Found       ← This URL doesn't exist
    409 Conflict        ← Duplicate (e.g., email already exists)
    422 Unprocessable   ← Data format is right but values are wrong
    429 Too Many Reqs   ← You're sending requests too fast

  5xx = Server Error (THE SERVER's fault)
    500 Internal Error  ← Something crashed on the server
    502 Bad Gateway     ← Server behind a proxy is down
    503 Unavailable     ← Server is overloaded or in maintenance`,
        explanation: `Think of headers like the outside of an envelope:

**Content-Type** tells the server what language you're speaking. If you send JSON but forget this header, the server might not understand your data. Flask's \`request.get_json()\` relies on this header being set to \`application/json\`.

**Status codes** are the most important thing in the response. Your app should ALWAYS check the status code before trying to read the data. A 200 means "here's your data." A 404 means "this doesn't exist, don't try to parse the body as valid data."

Memorising the main status codes makes debugging 10x faster. When something fails, the status code tells you immediately WHERE the problem is.`,
      },
      {
        type: 'code',
        title: 'All Three Data Methods in Flask',
        language: 'python',
        code: `from flask import Flask, jsonify, request

app = Flask(__name__)

# 1. URL Parameters — data IN the URL path
@app.route('/api/customers/<int:customer_id>')
def get_customer(customer_id):
    # customer_id comes from the URL: /api/customers/42 → customer_id = 42
    return jsonify({"customer_id": customer_id})

# 2. Query Parameters — data AFTER the ? in the URL
@app.route('/api/invoices')
def get_invoices():
    # URL: /api/invoices?status=overdue&min_amount=1000
    status = request.args.get('status')            # "overdue"
    min_amount = request.args.get('min_amount', 0)  # "1000" (or 0 if missing)
    page = request.args.get('page', 1, type=int)    # auto-converts to int
    
    return jsonify({
        "filters": {"status": status, "min_amount": min_amount},
        "page": page
    })

# 3. Request Body — JSON data INSIDE the request
@app.route('/api/customers', methods=['POST'])
def create_customer():
    data = request.get_json()  # Reads the JSON body
    # data = {"name": "Bristol Bakery", "email": "info@bristol.co.uk"}
    
    name = data.get('name')
    email = data.get('email')
    
    return jsonify({"created": {"name": name, "email": email}}), 201`,
        explanation: `The key rule:
• **URL params** = identifying WHICH resource (\`/customers/42\`)
• **Query params** = HOW to filter/sort/paginate (\`?status=overdue\`)
• **Request body** = the CONTENT you're creating or updating

**request.args** gives you query parameters (everything after ?).
**request.get_json()** gives you the JSON body.
Flask handles URL parameters automatically via \`<int:customer_id>\`.

When building your API, be consistent. Don't put filters in the body or resource IDs in query params. Follow the convention above.`,
      },
      {
        type: 'quiz',
        question: 'You want to fetch all invoices that are overdue and have amounts over £1000. Where should this filter data go?',
        options: [
          'In the URL path: /api/invoices/overdue/1000',
          'In query parameters: /api/invoices?status=overdue&min_amount=1000',
          'In the request body as JSON',
          'In the HTTP headers',
        ],
        correct: 1,
        explanation: 'Query parameters are the standard for filtering, sorting, and pagination on GET requests. URL path params are for identifying specific resources. Request body is for POST/PUT data. Headers are for metadata like auth tokens.',
      },
      {
        type: 'challenge',
        title: 'Map the HTTP Flow',
        description: 'Build understanding of HTTP by examining real requests:',
        steps: [
          'Open your browser\'s Developer Tools (F12 or right-click → Inspect → Network tab)',
          'Visit any website and watch the network requests appear — each row is one HTTP request',
          'Click on any request and examine: the URL, method, status code, request headers, and response headers',
          'Visit https://jsonplaceholder.typicode.com/posts?userId=1 with DevTools open. Find the Content-Type header in the response.',
          'Try visiting https://jsonplaceholder.typicode.com/nonexistent — what status code do you get? What does it mean?',
        ],
      },
    ],
  },

  {
    id: 'python-basics',
    module: 'Foundation',
    title: 'Python Basics for API Development',
    icon: '🐍',
    readingTime: 10,
    content: [
      {
        type: 'analogy',
        title: 'Why Python?',
        text: `If programming languages were tools in a workshop:
• **C++** would be a precision lathe — powerful but complex
• **Java** would be a Swiss Army knife — versatile but heavy
• **Python** would be a cordless drill — easy to pick up, gets the job done quickly, and everyone has one

Python reads almost like English. It's used by Google, Netflix, Instagram, Spotify, and NASA. It's the #1 language for beginners AND one of the top languages for professionals.`,
      },
      {
        type: 'code',
        title: 'Variables — Storing Information',
        language: 'python',
        code: `# A variable is like a labelled box where you store things

company_name = "Weorc Limited"     # Text (called a "string")
num_employees = 12                  # A whole number (called an "integer")
revenue = 45000.50                  # A decimal number (called a "float")
is_active = True                    # True or False (called a "boolean")

# You can use these variables later:
print(f"{company_name} has {num_employees} employees")
# Output: Weorc Limited has 12 employees

# f"..." is an f-string — it lets you embed variables inside text
# The {variable_name} gets replaced with the variable's value`,
        explanation: `Think of variables like labelled jars in a kitchen. The label tells you what's inside, and you can change the contents anytime. The = sign means "put this value into this variable" — it's NOT the same as "equals" in maths.

Naming convention: use **snake_case** (lowercase with underscores) for variables and functions. This is standard Python style.`,
      },
      {
        type: 'code',
        title: 'Lists & Dictionaries — Organising Data',
        language: 'python',
        code: `# A LIST is like a shopping list — items in order
fruits = ["apple", "banana", "mango"]
print(fruits[0])    # Output: apple  (counting starts at 0!)
print(fruits[2])    # Output: mango
fruits.append("orange")  # Add to the end

# A DICTIONARY is like a real dictionary — look up a "key" to get a "value"
customer = {
    "name": "Bristol Bakery",
    "email": "orders@bristolbakery.co.uk",
    "outstanding_balance": 2500.00,
    "days_overdue": 45
}

print(customer["name"])              # Output: Bristol Bakery
print(customer["outstanding_balance"])  # Output: 2500.0

# Get a value safely (returns None instead of crashing if key missing):
print(customer.get("phone"))         # Output: None
print(customer.get("phone", "N/A")) # Output: N/A`,
        explanation: `This is crucial: **Dictionaries in Python look identical to JSON**. When your API receives data from a mobile app, it arrives as JSON. Python automatically converts it into a dictionary you can work with. This is why Python is so natural for building APIs.

API responses are essentially lists of dictionaries: \`[{"name": "A"}, {"name": "B"}]\``,
      },
      {
        type: 'code',
        title: 'Functions — Reusable Actions',
        language: 'python',
        code: `# A function is a recipe — define it once, use it many times

def calculate_late_fee(amount, days_overdue):
    """Calculate the late payment fee for an invoice."""
    if days_overdue <= 0:
        return 0
    
    daily_rate = 0.02  # 2% per day
    fee = amount * daily_rate * days_overdue
    return round(fee, 2)

# Now USE the function:
fee1 = calculate_late_fee(1000, 30)
print(f"Late fee: £{fee1}")    # Output: Late fee: £600.0

fee2 = calculate_late_fee(5000, 0)
print(f"Late fee: £{fee2}")    # Output: Late fee: £0

# Functions can return dictionaries (perfect for APIs!):
def get_customer_summary(name, balance):
    return {
        "customer": name,
        "balance": balance,
        "status": "overdue" if balance > 0 else "clear"
    }`,
        explanation: `Functions are like templates. Instead of calculating late fees manually every time, you create a function once and reuse it. The values in parentheses (amount, days_overdue) are called **parameters** — they're the blanks you fill in each time.

In API development, each endpoint (URL) calls a function to do its work. The function returns a dictionary, and Flask converts it to JSON automatically.`,
      },
      {
        type: 'code',
        title: 'Error Handling with Try/Except',
        language: 'python',
        code: `# What happens if something goes wrong?
# Without error handling, your program crashes.
# With try/except, you catch the error and handle it gracefully.

def safe_divide(a, b):
    try:
        result = a / b
        return {"result": result}
    except ZeroDivisionError:
        return {"error": "Cannot divide by zero"}
    except TypeError:
        return {"error": "Both values must be numbers"}

print(safe_divide(10, 2))    # {'result': 5.0}
print(safe_divide(10, 0))    # {'error': 'Cannot divide by zero'}
print(safe_divide(10, "a"))  # {'error': 'Both values must be numbers'}`,
        explanation: `**try/except** is your safety net. The code inside \`try\` runs normally. If it crashes, Python jumps to the matching \`except\` block instead of killing your program.

This is essential for APIs because a crashed server = every user loses access. With try/except, one bad request doesn't take down the whole system.`,
      },
      {
        type: 'quiz',
        question: 'What Python data structure looks most like JSON and is used to send/receive API data?',
        options: ['List', 'Tuple', 'Dictionary', 'Set'],
        correct: 2,
        explanation: 'Dictionaries use key-value pairs with curly braces {}, which is identical to JSON format. This makes Python a natural fit for API development.',
      },
      {
        type: 'challenge',
        title: 'Build a Mini Data Model',
        description: 'Practice Python fundamentals by creating a small invoice data system:',
        steps: [
          'Create a file called `invoice_model.py`',
          'Define a list of 3 invoice dictionaries, each with: id, client, amount, days_overdue, and status',
          'Write a function `get_overdue(invoices)` that returns only invoices where days_overdue > 30',
          'Write a function `total_outstanding(invoices)` that sums all amounts where status is "unpaid"',
          'Print the results of both functions. Run with: python invoice_model.py',
        ],
      },
    ],
  },

  // ─── NEW: Debugging & Reading Errors ─────────────────────────────────
  {
    id: 'debugging',
    module: 'Foundation',
    title: 'Debugging — When Things Go Wrong',
    icon: '🔍',
    readingTime: 9,
    content: [
      {
        type: 'analogy',
        title: 'Error Messages Are Your Friends',
        text: `Imagine you're driving and your car dashboard lights up with a warning. You have two options:

❌ Panic, close your eyes, and hope it goes away
✅ Read the warning, understand what it means, and fix the issue

Most beginners see a Python error message and do the first option. They see a wall of red text and freeze. But error messages are actually **the most helpful thing Python gives you**. They tell you exactly what went wrong, on which line, and often hint at how to fix it.

This lesson teaches you to read errors like a mechanic reads dashboard warnings — calmly, systematically, and with confidence.`,
      },
      {
        type: 'code',
        title: 'Anatomy of a Python Traceback',
        language: 'python',
        code: `# This code has a bug. Let's see what the error looks like:

def get_customer_email(customer):
    return customer["email"]

def send_reminder(customer):
    email = get_customer_email(customer)
    print(f"Sending reminder to {email}")

# Oops — this customer dict is missing the "email" key
bad_customer = {"name": "Bristol Bakery", "phone": "0117 123 4567"}
send_reminder(bad_customer)

# Python outputs this traceback:
#
# Traceback (most recent call last):
#   File "app.py", line 10, in <module>        ← 3. Where YOUR code started
#     send_reminder(bad_customer)
#   File "app.py", line 6, in send_reminder     ← 2. The function that called it
#     email = get_customer_email(customer)
#   File "app.py", line 3, in get_customer_email ← 1. Where it actually crashed
#     return customer["email"]
# KeyError: 'email'                              ← THE ERROR MESSAGE`,
        explanation: `**Read tracebacks BOTTOM TO TOP.** The most important information is at the very bottom:

1. **Last line = the error type and message**: \`KeyError: 'email'\` means "you tried to access a dictionary key called 'email' that doesn't exist"
2. **Line above = exactly where it crashed**: File "app.py", line 3
3. **Lines above that = the chain of function calls** that led to the crash

Common errors you'll see:
• **KeyError** — Dictionary key doesn't exist. Fix: use \`.get("key")\` instead of \`["key"]\`
• **TypeError** — Wrong data type (e.g., adding a string to a number). Fix: convert types
• **IndentationError** — Spaces/tabs are wrong. Fix: use consistent 4-space indentation
• **ModuleNotFoundError** — Package not installed. Fix: \`pip install package-name\`
• **NameError** — Variable doesn't exist. Fix: check spelling and scope
• **SyntaxError** — Invalid Python code. Fix: look for missing colons, brackets, quotes`,
      },
      {
        type: 'code',
        title: 'Common Flask & MySQL Errors (and How to Fix Them)',
        language: 'python',
        code: `# ERROR 1: "OperationalError: Access denied for user 'root'@'localhost'"
# CAUSE:  Wrong database password in your Flask config
# FIX:    Check app.config['MYSQL_PASSWORD'] matches your MySQL password

# ERROR 2: "OperationalError: Unknown database 'weorc_db'"
# CAUSE:  The database doesn't exist yet
# FIX:    Log into MySQL and run: CREATE DATABASE weorc_db;

# ERROR 3: "IntegrityError: Duplicate entry 'info@bristol.co.uk' for key 'email'"
# CAUSE:  You're inserting a row with an email that already exists (UNIQUE constraint)
# FIX:    Check for duplicates before inserting, or use try/except

# ERROR 4: "TypeError: Object of type Decimal is not JSON serializable"
# CAUSE:  MySQL returns DECIMAL values, which Flask can't auto-convert to JSON
# FIX:    Convert to float: float(row["amount"]) or use a custom encoder

# ERROR 5: "Method Not Allowed" (405)
# CAUSE:  You sent a POST request to a route that only accepts GET
# FIX:    Add methods=['POST'] to @app.route() or check your request method

# ERROR 6: "400 Bad Request: Failed to decode JSON"
# CAUSE:  Missing Content-Type header or invalid JSON in the request body
# FIX:    Ensure your request includes: Content-Type: application/json

# DEBUGGING TECHNIQUE: Add print statements to trace values
@app.route('/api/customers', methods=['POST'])
def create_customer():
    data = request.get_json()
    print(f"DEBUG: Received data = {data}")        # What did we actually receive?
    print(f"DEBUG: Type = {type(data)}")            # Is it a dict or None?
    print(f"DEBUG: Keys = {data.keys() if data else 'None'}")
    # ... rest of your logic`,
        explanation: `**The Debug Mindset:**

When something breaks, don't guess. Investigate systematically:
1. **Read the error message** (bottom of traceback)
2. **Find the line** where it crashed
3. **Add print()** before that line to see what the variables actually contain
4. **Compare expected vs actual** — what did you expect the variable to be vs what it actually is?

Flask's \`debug=True\` mode gives you an interactive error page in the browser — you can even run Python code right in the browser to inspect variables. NEVER use debug mode in production though — it exposes your source code.`,
      },
      {
        type: 'code',
        title: 'Professional Debugging with Logging',
        language: 'python',
        code: `import logging
from flask import Flask

app = Flask(__name__)

# Set up logging (instead of print statements)
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s %(levelname)s: %(message)s'
)
logger = logging.getLogger(__name__)

@app.route('/api/customers/<int:id>')
def get_customer(id):
    logger.info(f"Fetching customer {id}")
    
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM customers WHERE id = %s", (id,))
        customer = cur.fetchone()
        cur.close()
        
        if not customer:
            logger.warning(f"Customer {id} not found")
            return jsonify({"error": "Not found"}), 404
        
        logger.info(f"Found customer: {customer['company_name']}")
        return jsonify(customer)
    
    except Exception as e:
        logger.error(f"Database error fetching customer {id}: {e}")
        return jsonify({"error": "Server error"}), 500

# Log levels (in order of severity):
# DEBUG   — Detailed info for diagnosing problems
# INFO    — General events ("user logged in", "invoice created")
# WARNING — Something unexpected but not broken yet
# ERROR   — Something failed
# CRITICAL — The whole app is broken`,
        explanation: `**Why logging instead of print()?**

\`print()\` is fine during development, but in production:
• print output disappears when the server restarts
• You can't filter by severity (errors vs info)
• You can't send logs to monitoring services
• There's no timestamp to know WHEN something happened

Logging gives you all of that. In production, you'd set the level to WARNING so you only see problems, not every single request. During development, set it to DEBUG to see everything.`,
      },
      {
        type: 'quiz',
        question: 'You get this error: `KeyError: \'email\'`. What does it mean and how do you fix it?',
        options: [
          'The email is invalid — add email validation',
          'A dictionary doesn\'t have the key "email" — use .get("email") instead of ["email"]',
          'The email column doesn\'t exist in MySQL — run ALTER TABLE',
          'Flask can\'t parse the email — restart the server',
        ],
        correct: 1,
        explanation: 'KeyError means you tried to access a dictionary key that doesn\'t exist. Using .get("email") returns None instead of crashing. Always use .get() when the key might not be present — especially with user-submitted data.',
      },
      {
        type: 'challenge',
        title: 'Debug a Broken API',
        description: 'Practice debugging by intentionally breaking and fixing code:',
        steps: [
          'Take your working Flask app and change the MySQL password in the config to something wrong — run it and read the error',
          'Remove the Content-Type header from a cURL POST request — observe the error Flask returns',
          'Try inserting a duplicate email into your database — read the IntegrityError',
          'Add logging to one endpoint: log the request data, the SQL query, and the result',
          'Introduce a typo in a variable name and practice reading the NameError traceback',
        ],
      },
    ],
  },

  {
    id: 'flask-intro',
    module: 'Foundation',
    title: 'Flask — Your API Framework',
    icon: '🧪',
    readingTime: 10,
    content: [
      {
        type: 'analogy',
        title: 'Flask = Your Business Receptionist',
        text: `Building an API from scratch in Python is like running a business where you personally handle every phone call, every email, every letter, and every visitor at the door.

**Flask** is like hiring a receptionist. It handles all the boring stuff:
• Listening for incoming requests (someone visiting your API's URL)
• Figuring out what they want (which endpoint they're hitting)
• Routing them to the right department (calling the right function)
• Sending back the response in the right format (JSON)

You just focus on the business logic — what actually happens when someone makes a request.

Flask is called a **"micro-framework"** because it's lightweight. It gives you the essentials and lets you choose what else to add. This is the opposite of Django, which is a "batteries-included" framework that gives you everything but is heavier.`,
      },
      {
        type: 'code',
        title: 'Your First Flask API — 7 Lines of Code',
        language: 'python',
        code: `# Save this as app.py

from flask import Flask

app = Flask(__name__)

@app.route('/hello')
def say_hello():
    return {"message": "Hello! Welcome to my first API!"}

if __name__ == '__main__':
    app.run(debug=True)`,
        explanation: `Line by line:

1. **from flask import Flask** — Like getting your toolkit out of the shed
2. **app = Flask(__name__)** — Create your API application. __name__ tells Flask where to find your project's files.
3. **@app.route('/hello')** — A "decorator". It says: "When someone goes to /hello, run the function below." Think of it as a label you stick on a function.
4. **def say_hello()** — The function that runs when /hello is visited
5. **return {"message": "..."}** — Flask automatically converts this dictionary to JSON!
6. **app.run(debug=True)** — Starts your server. debug=True means it auto-restarts when you change code.

To test: run \`python app.py\` then visit http://localhost:5000/hello in your browser.`,
      },
      {
        type: 'code',
        title: 'Full CRUD Endpoints (with Fake Data)',
        language: 'python',
        code: `from flask import Flask, jsonify, request

app = Flask(__name__)

# Fake data (we'll use a real database later)
invoices = [
    {"id": 1, "client": "Bristol Bakery", "amount": 2500, "status": "overdue"},
    {"id": 2, "client": "London Tech Ltd", "amount": 8000, "status": "paid"},
    {"id": 3, "client": "Manchester Supplies", "amount": 1200, "status": "pending"},
]

# GET all invoices
@app.route('/api/invoices', methods=['GET'])
def get_invoices():
    return jsonify(invoices)

# GET one invoice by ID
@app.route('/api/invoices/<int:invoice_id>', methods=['GET'])
def get_invoice(invoice_id):
    invoice = next((inv for inv in invoices if inv["id"] == invoice_id), None)
    if invoice:
        return jsonify(invoice)
    return jsonify({"error": "Invoice not found"}), 404

# POST — Create a new invoice
@app.route('/api/invoices', methods=['POST'])
def create_invoice():
    data = request.get_json()
    if not data or not data.get("client") or not data.get("amount"):
        return jsonify({"error": "client and amount are required"}), 400
    
    new_invoice = {
        "id": max(inv["id"] for inv in invoices) + 1 if invoices else 1,
        "client": data["client"],
        "amount": data["amount"],
        "status": data.get("status", "pending"),
    }
    invoices.append(new_invoice)
    return jsonify(new_invoice), 201

if __name__ == '__main__':
    app.run(debug=True)`,
        explanation: `Key concepts:

• **jsonify()** — Converts Python data to proper JSON with correct HTTP headers.
• **request.get_json()** — Reads the JSON body that the client sent with their request.
• **methods=['GET']** — Specifies which HTTP method this endpoint responds to.
• **<int:invoice_id>** — A dynamic URL parameter. /api/invoices/2 captures "2" as invoice_id.
• **Status codes** in the return: 200 = OK, 201 = Created, 400 = Bad Request, 404 = Not Found.`,
      },
      {
        type: 'quiz',
        question: 'What does the @app.route(\'/api/invoices\') decorator do in Flask?',
        options: [
          'It creates a database table called invoices',
          'It tells Flask to run the function below when someone visits /api/invoices',
          'It imports the invoices module',
          'It validates the invoice data',
        ],
        correct: 1,
        explanation: 'The @app.route() decorator maps a URL to a Python function. When someone visits that URL, Flask calls the function and returns whatever it produces.',
      },
      {
        type: 'challenge',
        title: 'Build a Task List API',
        description: 'Build a complete CRUD API for managing tasks (no database yet — use a Python list):',
        steps: [
          'Create `task_api.py` with Flask',
          'Define a list of 3 tasks: each has id, title, description, completed (boolean)',
          'Create GET /api/tasks (return all tasks)',
          'Create GET /api/tasks/<id> (return one task, or 404)',
          'Create POST /api/tasks (add a new task from JSON body)',
          'Test all endpoints with your browser (GET) and curl or Postman (POST)',
        ],
      },
    ],
  },

  // ─── NEW: Postman & API Testing ──────────────────────────────────────
  {
    id: 'testing-apis',
    module: 'Foundation',
    title: 'Testing APIs with Postman & cURL',
    icon: '🧪',
    readingTime: 8,
    content: [
      {
        type: 'analogy',
        title: 'You Need a Test Kitchen',
        text: `You've built a restaurant kitchen (your API). But before opening to customers, you need to taste-test every dish yourself. You need to verify: does the soup come out right? What happens if someone orders something that doesn't exist? What if they order with no ingredients?

**Testing tools** let you send requests to your API and inspect the responses — without needing a frontend. This is how professional developers work: build the API first, test it thoroughly, then connect the frontend later.

There are two main tools:
🖥️ **Postman** — A visual application with buttons, dropdowns, and tabs. Best for beginners and for saving/organising requests.
⌨️ **cURL** — A command-line tool. Faster once you know the syntax, and great for scripts.`,
      },
      {
        type: 'code',
        title: 'Postman Step-by-Step',
        language: 'text',
        code: `STEP 1: Download Postman from https://www.postman.com/downloads/ (free)

STEP 2: Making a GET request
  ┌─────────────────────────────────────────────────┐
  │ [GET ▼]  http://localhost:5000/api/customers     │
  │                                        [Send]   │
  ├─────────────────────────────────────────────────┤
  │ Body │ Headers │ Params │ Auth │               │
  │                                                 │
  │ [Pretty ▼]  [JSON ▼]                           │
  │ {                                               │
  │   "customers": [                                │
  │     {"id": 1, "name": "Bristol Bakery"},        │
  │     {"id": 2, "name": "London Tech Ltd"}        │
  │   ]                                             │
  │ }                                               │
  │                                                 │
  │ Status: 200 OK    Time: 45ms    Size: 256 B    │
  └─────────────────────────────────────────────────┘

STEP 3: Making a POST request
  1. Change the dropdown from GET to POST
  2. Enter URL: http://localhost:5000/api/customers
  3. Click the "Body" tab
  4. Select "raw" and change the dropdown to "JSON"
  5. Type your JSON body:
     {
       "company_name": "Bristol Bakery",
       "email": "info@bristolbakery.co.uk"
     }
  6. Click Send
  7. Check the response: status should be 201 Created

STEP 4: Adding headers
  1. Click the "Headers" tab
  2. Add: Key = "Content-Type", Value = "application/json"
  3. For authenticated endpoints, add: Key = "Authorization", Value = "Bearer your-token-here"

STEP 5: Create a Collection
  1. Click "Collections" in the left sidebar → "New Collection" → name it "My API"
  2. Save each request to this collection
  3. Now you have a reusable test suite!`,
        explanation: `**Pro tips for Postman:**

• **Use environments** — Create a "Local" environment with variable \`base_url = http://localhost:5000\` and a "Production" environment with \`base_url = https://myapi.com\`. Then use \`{{base_url}}/api/customers\` in all your requests. Switch environments with one click.

• **Check the status code** — The green "200 OK" or red "404 Not Found" tells you immediately if the request worked.

• **Check response time** — If an endpoint takes more than 1 second, you might have a database performance issue.

• **Export your collection** — Share it with your team or include it in your project repo for documentation.`,
      },
      {
        type: 'code',
        title: 'cURL — The Command-Line Alternative',
        language: 'bash',
        code: `# GET request (simplest — just the URL)
curl http://localhost:5000/api/customers

# GET with pretty-printed JSON (pipe through python)
curl http://localhost:5000/api/customers | python3 -m json.tool

# GET one resource
curl http://localhost:5000/api/customers/1

# GET with query parameters
curl "http://localhost:5000/api/invoices?status=overdue&page=1"

# POST — Create a new resource
curl -X POST http://localhost:5000/api/customers \
  -H "Content-Type: application/json" \
  -d '{"company_name": "Bristol Bakery", "email": "info@bristol.co.uk"}'

# PUT — Update a resource
curl -X PUT http://localhost:5000/api/customers/1 \
  -H "Content-Type: application/json" \
  -d '{"company_name": "Bristol Bakery Ltd", "email": "info@bristol.co.uk"}'

# DELETE
curl -X DELETE http://localhost:5000/api/customers/1

# With authentication (JWT token)
curl http://localhost:5000/api/customers \
  -H "Authorization: Bearer eyJhbGciOi..."

# See full request/response details (verbose mode)
curl -v http://localhost:5000/api/customers

# See just the status code
curl -o /dev/null -s -w "%{http_code}" http://localhost:5000/api/customers`,
        explanation: `cURL cheatsheet:
• **-X POST** — Set the HTTP method (default is GET)
• **-H** — Add a header
• **-d** — Data/body to send
• **-v** — Verbose: shows headers, status, timing
• **-o /dev/null** — Hide the body output
• **-s** — Silent mode (no progress bar)
• **-w "%{http_code}"** — Print just the status code

The backslash \`\\\` at the end of a line means "this command continues on the next line." It makes long commands readable.

**Windows note:** Use double quotes for JSON and escape inner quotes, or use Git Bash which supports single quotes like Mac/Linux.`,
      },
      {
        type: 'quiz',
        question: 'You want to test a POST endpoint that creates a customer. In Postman, which tab do you use to send the JSON data?',
        options: [
          'The Params tab',
          'The Headers tab',
          'The Body tab (set to raw + JSON)',
          'The Auth tab',
        ],
        correct: 2,
        explanation: 'POST request data goes in the Body tab. Select "raw" format and choose "JSON" from the dropdown. The Params tab is for query parameters (?key=value). Headers is for metadata. Auth is for authentication tokens.',
      },
      {
        type: 'challenge',
        title: 'Test Every Endpoint',
        description: 'Create a complete Postman collection for your API:',
        steps: [
          'Download and install Postman (or use Thunder Client in VS Code)',
          'Start your Flask API locally',
          'Create a GET request for listing all resources — save it to a collection',
          'Create a POST request that creates a new resource — verify the response is 201',
          'Create a POST request with MISSING required fields — verify you get a 400 error',
          'Create a GET request for a resource that doesn\'t exist — verify you get 404',
          'Export your collection as JSON and save it in your project folder',
        ],
      },
    ],
  },

  // ===================================================================
  // MODULE: DATABASE
  // ===================================================================
  {
    id: 'mysql-basics',
    module: 'Database',
    title: 'MySQL — Your Data Warehouse',
    icon: '🗄️',
    readingTime: 10,
    content: [
      { type: 'analogy', title: 'MySQL = A Giant Spreadsheet (But Smarter)', text: `Think of MySQL as Microsoft Excel on steroids:\n\n• A **database** = An Excel workbook\n• A **table** = One sheet/tab\n• A **row** = One record\n• A **column** = One field\n\nBut unlike Excel, MySQL can handle millions of rows, enforce rules (email must be unique), link tables together, and be accessed by your API programmatically.` },
      { type: 'code', title: 'Creating Your First Database and Table', language: 'sql',
        code: `CREATE DATABASE IF NOT EXISTS weorc_db;\nUSE weorc_db;\n\nCREATE TABLE customers (\n    id INT AUTO_INCREMENT PRIMARY KEY,\n    company_name VARCHAR(100) NOT NULL,\n    email VARCHAR(100) UNIQUE NOT NULL,\n    phone VARCHAR(20),\n    outstanding_balance DECIMAL(10,2) DEFAULT 0.00,\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);`,
        explanation: `Data types: **INT** = whole number. **VARCHAR(100)** = text up to 100 chars. **DECIMAL(10,2)** = exact decimal (always use for money!). **AUTO_INCREMENT** = auto-assigns 1,2,3... **PRIMARY KEY** = unique ID. **NOT NULL** = required. **UNIQUE** = no duplicates.` },
      { type: 'code', title: 'CRUD Operations', language: 'sql',
        code: `-- CREATE\nINSERT INTO customers (company_name, email, outstanding_balance)\nVALUES ('Bristol Bakery', 'orders@bristolbakery.co.uk', 2500.00);\n\n-- READ\nSELECT * FROM customers;\nSELECT * FROM customers WHERE outstanding_balance > 1000;\nSELECT * FROM customers ORDER BY outstanding_balance DESC;\n\n-- UPDATE\nUPDATE customers SET outstanding_balance = 0.00 WHERE id = 2;\n\n-- DELETE\nDELETE FROM customers WHERE id = 1;`,
        explanation: `CRUD maps to HTTP: INSERT=POST, SELECT=GET, UPDATE=PUT, DELETE=DELETE.\n\n⚠️ **Always use WHERE with UPDATE and DELETE!** Without it, you affect EVERY row.` },
      { type: 'quiz', question: 'Which data type should you use for invoice amounts?', options: ['FLOAT', 'INT', 'DECIMAL(10,2)', 'VARCHAR(20)'], correct: 2, explanation: 'DECIMAL stores exact values. FLOAT causes rounding errors with money.' },
      { type: 'challenge', title: 'Create a Products Database', description: 'Practice SQL:', steps: ['Create database `shop_db`', 'Create `products` table with: id, name, price (DECIMAL), stock, category', 'Insert 5 products', 'Write SELECT for products under £20', 'UPDATE stock of one product, DELETE another'] },
    ],
  },
  {
    id: 'flask-mysql',
    module: 'Database',
    title: 'Connecting Flask to MySQL',
    icon: '🔗',
    readingTime: 12,
    content: [
      { type: 'analogy', title: 'Building the Bridge', text: `Flask handles web requests but has no data. MySQL has data but can't be accessed from the web. **Flask-MySQLdb** connects them.\n\nThe flow: Flask receives request → opens connection to MySQL → sends SQL query → MySQL returns results → Flask packages as JSON → sends to user.` },
      { type: 'code', title: 'Complete Connected CRUD API', language: 'python',
        code: `from flask import Flask, jsonify, request\nfrom flask_mysqldb import MySQL\n\napp = Flask(__name__)\napp.config['MYSQL_HOST'] = 'localhost'\napp.config['MYSQL_USER'] = 'root'\napp.config['MYSQL_PASSWORD'] = 'yourpassword'\napp.config['MYSQL_DB'] = 'weorc_db'\napp.config['MYSQL_CURSORCLASS'] = 'DictCursor'\nmysql = MySQL(app)\n\n@app.route('/api/customers', methods=['GET'])\ndef get_customers():\n    cur = mysql.connection.cursor()\n    cur.execute("SELECT * FROM customers")\n    customers = cur.fetchall()\n    cur.close()\n    return jsonify(customers)\n\n@app.route('/api/customers', methods=['POST'])\ndef create_customer():\n    data = request.get_json()\n    if not data or not data.get('company_name') or not data.get('email'):\n        return jsonify({"error": "company_name and email required"}), 400\n    try:\n        cur = mysql.connection.cursor()\n        cur.execute(\n            "INSERT INTO customers (company_name, email, phone) VALUES (%s, %s, %s)",\n            (data['company_name'], data['email'], data.get('phone'))\n        )\n        mysql.connection.commit()\n        new_id = cur.lastrowid\n        cur.close()\n        return jsonify({"message": "Created", "id": new_id}), 201\n    except Exception as e:\n        if "Duplicate" in str(e):\n            return jsonify({"error": "Email exists"}), 409\n        return jsonify({"error": "Database error"}), 500`,
        explanation: `**Cursor pattern:** open cursor → execute SQL → fetch results → commit (for writes) → close.\n\n**%s placeholders** prevent SQL injection. NEVER use f-strings in SQL queries.` },
      { type: 'quiz', question: 'Why use %s placeholders instead of f-strings in SQL?', options: ['f-strings are slower', 'To prevent SQL injection attacks', 'MySQL doesn\'t support f-strings', 'Cleaner code'], correct: 1, explanation: 'SQL injection lets hackers execute malicious SQL. %s treats input as data only.' },
      { type: 'challenge', title: 'Connect Your Task API to MySQL', description: 'Upgrade from Python list to real database:', steps: ['Create a tasks table in MySQL', 'Replace Python list with MySQL queries', 'Implement all CRUD endpoints', 'Add try/except error handling', 'Test: verify data persists after server restart'] },
    ],
  },
  {
    id: 'sql-injection',
    module: 'Database',
    title: 'SQL Injection — The #1 Security Threat',
    icon: '💉',
    readingTime: 7,
    content: [
      { type: 'analogy', title: 'Why This Matters', text: `What if someone types this as a customer name:\n\`'; DROP TABLE customers; --\`\n\nIf you paste that directly into SQL, the database executes:\n\`SELECT * FROM customers WHERE name = ''; DROP TABLE customers; --'\`\n\nThat **deletes your entire table**. This is SQL injection — the #1 web vulnerability for over 20 years. The fix is simple: parameterised queries.` },
      { type: 'code', title: 'The Attack vs The Fix', language: 'python',
        code: `# ❌ VULNERABLE — user input pasted into SQL\nquery = f"SELECT * FROM customers WHERE name = '{name}'"\ncur.execute(query)\n# Hacker sends: ' OR '1'='1\n# Becomes: WHERE name = '' OR '1'='1'  ← returns ALL rows!\n# Or: '; DROP TABLE customers; --  ← deletes the table!\n\n# ✅ SAFE — parameterised query\ncur.execute(\n    "SELECT * FROM customers WHERE name = %s",\n    (name,)\n)\n# Hacker sends same thing — database treats it as a literal string\n# Searches for customer named "'; DROP TABLE customers; --"\n# Returns zero results. No damage.`,
        explanation: `With %s, the database driver sends the query structure and data SEPARATELY. The database compiles the SQL first, then plugs in data as literal values — never as code.\n\nThis works in every database. Placeholder syntax varies (%s for MySQL, ? for SQLite) but the principle is universal.` },
      { type: 'quiz', question: 'A user submits: \' OR \'1\'=\'1. With f-strings in SQL, what happens?', options: ['Database rejects it', 'Zero results', 'Returns ALL records (WHERE becomes always true)', 'Database crashes'], correct: 2, explanation: 'The injected OR \'1\'=\'1\' makes WHERE always true, returning every row.' },
      { type: 'challenge', title: 'Test SQL Injection', description: 'Verify your API is safe (on LOCAL database only!):', steps: ['Create a test endpoint using an f-string (unsafe way)', 'Send: ?name=\' OR \'1\'=\'1 — does it return all records?', 'Fix with %s parameterised query', 'Send same injection — verify zero results', 'Delete test endpoint. Audit ALL endpoints for %s usage.'] },
    ],
  },
  {
    id: 'relationships',
    module: 'Database',
    title: 'Database Relationships & JOINs',
    icon: '🔀',
    readingTime: 10,
    content: [
      { type: 'analogy', title: 'Why One Table Isn\'t Enough', text: `Storing everything in one table causes: repetition ("Bristol Bakery" appears 50 times), inconsistency (typos), and deletion disasters.\n\nThe solution: **related tables** linked by foreign keys.\n\n**One-to-many** — One customer has many invoices\n**Many-to-many** — Many products in many orders (needs junction table)\n**One-to-one** — One user has one profile` },
      { type: 'code', title: 'Related Tables & JOINs', language: 'sql',
        code: `CREATE TABLE invoices (\n    id INT AUTO_INCREMENT PRIMARY KEY,\n    customer_id INT NOT NULL,\n    invoice_number VARCHAR(20) UNIQUE NOT NULL,\n    amount DECIMAL(10,2) NOT NULL,\n    status ENUM('pending','paid','overdue','disputed') DEFAULT 'pending',\n    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT\n);\n\n-- INNER JOIN: invoices with customer names\nSELECT i.invoice_number, c.company_name, i.amount, i.status\nFROM invoices i\nINNER JOIN customers c ON i.customer_id = c.id;\n\n-- LEFT JOIN: all customers, even those with no invoices\nSELECT c.company_name, COUNT(i.id) AS invoice_count\nFROM customers c\nLEFT JOIN invoices i ON c.id = i.customer_id\nGROUP BY c.id;`,
        explanation: `**FOREIGN KEY** links tables. customer_id in invoices must match an id in customers.\n**INNER JOIN** = only matching rows. **LEFT JOIN** = all left-table rows, even without matches.\n**ENUM** = column that only allows listed values.\n**ON DELETE RESTRICT** = can't delete customer who has invoices.` },
      { type: 'quiz', question: 'What does a FOREIGN KEY do?', options: ['Encrypts data', 'Auto-increments', 'Links to PRIMARY KEY in another table', 'Allows NULL'], correct: 2, explanation: 'FOREIGN KEY ensures referential integrity — prevents orphan records.' },
      { type: 'challenge', title: 'Build Related Tables', description: 'Add relationships:', steps: ['Create invoices table with FOREIGN KEY to customers', 'Create products and order_items tables (many-to-many)', 'Write JOIN queries combining data from multiple tables', 'Create Flask endpoint using JOINs', 'Add ?status= query parameter filtering'] },
    ],
  },
  {
    id: 'pagination',
    module: 'Database',
    title: 'Pagination, Filtering & Sorting',
    icon: '📄',
    readingTime: 8,
    content: [
      { type: 'analogy', title: 'Don\'t Return 50,000 Records', text: `If your database has 50,000 customers, returning all at once wastes bandwidth, crashes mobile apps, and overloads your database.\n\n**Pagination** returns data in pages (like Google showing 10 results at a time). Combined with **filtering** and **sorting**, these make your API production-ready.` },
      { type: 'code', title: 'Pagination + Filtering + Sorting', language: 'python',
        code: `@app.route('/api/customers', methods=['GET'])\ndef get_customers():\n    page = request.args.get('page', 1, type=int)\n    per_page = min(request.args.get('per_page', 20, type=int), 100)\n    offset = (page - 1) * per_page\n    search = request.args.get('search')\n    sort_by = request.args.get('sort_by', 'created_at')\n    \n    # Whitelist sort columns (prevent SQL injection!)\n    allowed = {'created_at', 'company_name', 'outstanding_balance'}\n    if sort_by not in allowed:\n        sort_by = 'created_at'\n    \n    cur = mysql.connection.cursor()\n    \n    if search:\n        cur.execute(f"SELECT COUNT(*) AS total FROM customers WHERE company_name LIKE %s", (f"%{search}%",))\n        total = cur.fetchone()['total']\n        cur.execute(f"SELECT * FROM customers WHERE company_name LIKE %s ORDER BY {sort_by} LIMIT %s OFFSET %s",\n            (f"%{search}%", per_page, offset))\n    else:\n        cur.execute("SELECT COUNT(*) AS total FROM customers")\n        total = cur.fetchone()['total']\n        cur.execute(f"SELECT * FROM customers ORDER BY {sort_by} LIMIT %s OFFSET %s",\n            (per_page, offset))\n    \n    customers = cur.fetchall()\n    cur.close()\n    \n    return jsonify({\n        "data": customers,\n        "pagination": {\n            "page": page, "per_page": per_page,\n            "total": total,\n            "total_pages": -(-total // per_page),\n            "has_next": page * per_page < total\n        }\n    })`,
        explanation: `**LIMIT** = how many rows. **OFFSET** = how many to skip.\nFormula: offset = (page - 1) × per_page\n\n**Always cap per_page** (max 100). **Always whitelist sort columns** — column names can't use %s, so you MUST validate them to prevent SQL injection.\n\n**Always return pagination metadata** so the frontend can build page navigation.` },
      { type: 'quiz', question: 'Page 3, 25 per page. What OFFSET value?', options: ['25', '50', '75', '100'], correct: 1, explanation: 'OFFSET = (3-1) × 25 = 50. Page 1 skips 0, page 2 skips 25, page 3 skips 50.' },
      { type: 'challenge', title: 'Add Pagination', description: 'Upgrade your API:', steps: ['Add ?page= and ?per_page= to GET endpoints', 'Add ?search= for LIKE filtering', 'Add ?sort_by= with column whitelist', 'Return pagination metadata', 'Insert 50+ test records and verify', 'Test edge cases: page 0, per_page=100000'] },
    ],
  },

  // ===================================================================
  // MODULE: PRODUCTION
  // ===================================================================
  {
    id: 'validation',
    module: 'Production',
    title: 'Error Handling & Response Format',
    icon: '🛡️',
    readingTime: 10,
    content: [
      { type: 'concept', title: 'Consistent Response Envelopes', text: `Every endpoint should return the same structure:\n\n\`{"success": true, "data": [...], "message": "...", "errors": [...]}\`\n\nThis means the frontend always checks \`response.success\` first, then reads \`data\` or \`errors\`. No guessing.` },
      { type: 'code', title: 'Standard Response + Validation', language: 'python',
        code: `import re\n\ndef api_response(data=None, message=None, errors=None, status=200):\n    response = {"success": status < 400}\n    if data is not None: response["data"] = data\n    if message: response["message"] = message\n    if errors: response["errors"] = errors\n    return jsonify(response), status\n\ndef validate_email(email):\n    return re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$', email) is not None\n\ndef validate_customer(data):\n    errors = []\n    if not data: return False, ["Request body must be JSON"]\n    if not data.get('company_name', '').strip():\n        errors.append("company_name is required")\n    if not data.get('email', '').strip():\n        errors.append("email is required")\n    elif not validate_email(data['email']):\n        errors.append("Invalid email format")\n    return len(errors) == 0, errors\n\n@app.errorhandler(404)\ndef not_found(e): return api_response(errors=["Not found"], status=404)\n@app.errorhandler(500)\ndef server_err(e): return api_response(errors=["Server error"], status=500)`,
        explanation: `Principles: validate early, collect ALL errors at once, sanitise inputs (.strip(), .lower()), separate validation into functions.` },
      { type: 'quiz', question: 'User POSTs {"company_name": "", "email": "bad"}. What to return?', options: ['200 success', '400 with both errors', '404', '500'], correct: 1, explanation: 'Return all validation errors at once (400) so user can fix everything in one go.' },
      { type: 'challenge', title: 'Standardise Responses', description: 'Refactor your API:', steps: ['Create api_response() helper', 'Refactor ALL endpoints to use standard envelope', 'Create validators.py', 'Add global error handlers', 'Test with intentionally bad data'] },
    ],
  },
  {
    id: 'password-cors',
    module: 'Production',
    title: 'Password Hashing & CORS',
    icon: '🔒',
    readingTime: 8,
    content: [
      { type: 'analogy', title: 'Never Store Plain-Text Passwords', text: `If your database is breached, plain-text passwords expose every user's accounts. **Hashing** converts passwords into irreversible scrambled strings. When logging in, you hash the input and compare hashes — never the original password.\n\n**CORS** is the other essential: when a React frontend (localhost:3000) calls your Flask API (localhost:5000), the browser blocks it by default. CORS tells the browser "this frontend is allowed."` },
      { type: 'code', title: 'bcrypt + CORS Implementation', language: 'python',
        code: `# pip install bcrypt flask-cors\nimport bcrypt\nfrom flask_cors import CORS\n\n# CORS — allow your frontend\nCORS(app, origins=["http://localhost:3000", "https://myapp.vercel.app"])\n\ndef hash_password(password):\n    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')\n\ndef verify_password(password, stored_hash):\n    return bcrypt.checkpw(password.encode('utf-8'), stored_hash.encode('utf-8'))\n\n@app.route('/api/register', methods=['POST'])\ndef register():\n    data = request.get_json()\n    if len(data.get('password', '')) < 8:\n        return api_response(errors=["Password must be 8+ characters"], status=400)\n    pw_hash = hash_password(data['password'])\n    # Store pw_hash in database, NEVER the plain password\n    cur = mysql.connection.cursor()\n    cur.execute("INSERT INTO users (email, password_hash) VALUES (%s, %s)",\n        (data['email'].lower(), pw_hash))\n    mysql.connection.commit()\n    cur.close()\n    return api_response(message="Account created", status=201)\n\n@app.route('/api/login', methods=['POST'])\ndef login():\n    data = request.get_json()\n    cur = mysql.connection.cursor()\n    cur.execute("SELECT id, password_hash FROM users WHERE email = %s", (data['email'].lower(),))\n    user = cur.fetchone()\n    cur.close()\n    if not user or not verify_password(data['password'], user['password_hash']):\n        return api_response(errors=["Invalid email or password"], status=401)\n    token = generate_token(user['id'])\n    return api_response(data={"token": token})`,
        explanation: `**Salt** (in gensalt()) adds randomness so identical passwords hash differently.\n**Same login error** for wrong email AND wrong password — prevents attackers discovering which emails are registered.\n**CORS in production**: always specify exact origins. Never allow all origins.` },
      { type: 'quiz', question: 'Why return the same error for wrong email AND wrong password?', options: ['Simpler code', 'Prevents attackers discovering registered emails', 'Database can\'t distinguish', 'Saves bandwidth'], correct: 1, explanation: 'Different errors let attackers enumerate which emails exist in your system.' },
      { type: 'challenge', title: 'Secure Your Auth', description: 'Implement bcrypt + CORS:', steps: ['pip install bcrypt flask-cors', 'Create users table with password_hash column', 'Build /api/register with bcrypt', 'Build /api/login with verify', 'Configure CORS for your frontend origin'] },
    ],
  },
  {
    id: 'auth',
    module: 'Production',
    title: 'Authentication with API Keys & JWT',
    icon: '🔐',
    readingTime: 10,
    content: [
      { type: 'concept', title: 'Two Authentication Approaches', text: `🔑 **API Keys** — Simple permanent tokens for server-to-server communication.\n🎫 **JWT** — Signed tokens with user identity and expiry time. For user-facing apps.\n\n**401** = "Who are you?" (no credentials)\n**403** = "I know who you are, but you can't do this" (insufficient permission)` },
      { type: 'code', title: 'JWT Authentication', language: 'python',
        code: `# pip install PyJWT\nimport jwt, datetime\nfrom functools import wraps\n\ndef generate_token(user_id, role="user"):\n    return jwt.encode({\n        "user_id": user_id, "role": role,\n        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)\n    }, app.config['SECRET_KEY'], algorithm="HS256")\n\ndef require_token(f):\n    @wraps(f)\n    def decorated(*args, **kwargs):\n        auth = request.headers.get('Authorization')\n        if not auth or not auth.startswith('Bearer '):\n            return api_response(errors=["Token required"], status=401)\n        try:\n            payload = jwt.decode(auth.split(' ')[1],\n                app.config['SECRET_KEY'], algorithms=["HS256"])\n            request.current_user = payload\n        except jwt.ExpiredSignatureError:\n            return api_response(errors=["Token expired"], status=401)\n        except jwt.InvalidTokenError:\n            return api_response(errors=["Invalid token"], status=401)\n        return f(*args, **kwargs)\n    return decorated\n\n@app.route('/api/customers', methods=['DELETE'])\n@require_token\ndef delete_customer():\n    if request.current_user['role'] != 'admin':\n        return api_response(errors=["Admin required"], status=403)\n    # ... delete logic`,
        explanation: `JWT flow: Login → get token → include \`Authorization: Bearer <token>\` in all requests → server decodes token without database lookup.` },
      { type: 'quiz', question: 'API Keys vs JWT?', options: ['Keys are encrypted, JWT not', 'Keys are permanent/simple; JWT expires and carries user data', 'JWT is faster', 'Keys need HTTPS, JWT doesn\'t'], correct: 1, explanation: 'API Keys are static strings for server auth. JWT tokens are signed, expire, and contain user identity.' },
      { type: 'challenge', title: 'Add JWT Auth', description: 'Protect your API:', steps: ['pip install PyJWT', 'Create @require_token decorator', 'Protect POST, PUT, DELETE endpoints', 'Add role-based access (admin for delete)', 'Test: no token (401), valid token (200), expired (401)'] },
    ],
  },
  {
    id: 'project-structure',
    module: 'Production',
    title: 'Project Structure & Config',
    icon: '📁',
    readingTime: 8,
    content: [
      { type: 'concept', title: 'Professional Organisation', text: `Real projects split code into: routes/ (HTTP handling), models/ (database), utils/ (validation, helpers), middleware/ (auth decorators), config.py (settings).\n\nKey files: **.env** for secrets, **requirements.txt** for packages, **.gitignore** to exclude secrets and venv from Git.` },
      { type: 'code', title: 'Config with Environment Variables', language: 'python',
        code: `# pip install python-dotenv\nimport os\nfrom dotenv import load_dotenv\nload_dotenv()\n\nclass Config:\n    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-fallback')\n    MYSQL_CURSORCLASS = 'DictCursor'\n\nclass DevConfig(Config):\n    DEBUG = True\n    MYSQL_HOST = 'localhost'\n    MYSQL_PASSWORD = os.getenv('DB_PASSWORD', 'password')\n    MYSQL_DB = 'weorc_dev'\n\nclass ProdConfig(Config):\n    DEBUG = False\n    MYSQL_HOST = os.getenv('DB_HOST')\n    MYSQL_PASSWORD = os.getenv('DB_PASSWORD')\n    MYSQL_DB = os.getenv('DB_NAME')`,
        explanation: `os.getenv() reads from .env file. Passwords never in code. Each environment has its own .env.` },
      { type: 'quiz', question: 'Why use .env for passwords?', options: ['Python can\'t read from code', 'Faster', 'Not exposed on GitHub', '.env is encrypted'], correct: 2, explanation: '.env is in .gitignore so secrets are never committed to version control.' },
      { type: 'challenge', title: 'Restructure', description: 'Reorganise into folders:', steps: ['Create app/ with routes/, models/, utils/', 'Move routes into Flask Blueprints', 'Move validation into utils/', 'Create .env and .gitignore', 'Verify everything works'] },
    ],
  },
  {
    id: 'testing',
    module: 'Production',
    title: 'Automated Testing with pytest',
    icon: '✅',
    readingTime: 9,
    content: [
      { type: 'analogy', title: 'Quality Control for Code', text: `Manual testing with Postman works but doesn't scale. With 30 endpoints, every code change means manually testing all 30.\n\n**Automated tests** check everything in seconds. One command: \`pytest\`. Like factory quality control — machines test every product, faster and more thorough than humans.` },
      { type: 'code', title: 'Writing API Tests', language: 'python',
        code: `# pip install pytest\n# tests/test_customers.py\n\nimport pytest\nfrom app import create_app\n\n@pytest.fixture\ndef client():\n    app = create_app('testing')\n    with app.test_client() as client:\n        yield client\n\ndef test_get_customers_200(client):\n    res = client.get('/api/customers')\n    assert res.status_code == 200\n    assert res.get_json()['success'] is True\n\ndef test_create_valid_customer(client):\n    res = client.post('/api/customers', json={\n        'company_name': 'Test Co', 'email': 'test@example.com'\n    })\n    assert res.status_code == 201\n\ndef test_create_missing_email(client):\n    res = client.post('/api/customers', json={'company_name': 'Test'})\n    assert res.status_code == 400\n    assert 'email' in str(res.get_json()['errors']).lower()\n\ndef test_get_nonexistent_404(client):\n    res = client.get('/api/customers/99999')\n    assert res.status_code == 404\n\n# Run: pytest tests/ -v`,
        explanation: `**@pytest.fixture** sets up test prerequisites. **assert** = "this must be true or test fails." **client.get()/.post()** simulates requests without a real server.\n\nTest naming: \`test_\` prefix + what you're testing. Names should read like sentences.` },
      { type: 'quiz', question: 'What does `assert res.status_code == 201` do?', options: ['Sets status to 201', 'Prints it', 'Checks it equals 201 — fails if not', 'Sends request with 201'], correct: 2, explanation: 'assert is a checkpoint: condition must be true or the test fails.' },
      { type: 'challenge', title: 'Write Your Test Suite', description: 'Create automated tests:', steps: ['pip install pytest', 'Create tests/test_customers.py', 'Test GET all (200)', 'Test POST valid (201)', 'Test POST missing fields (400)', 'Test GET nonexistent (404)', 'Run: pytest tests/ -v'] },
    ],
  },
  {
    id: 'deployment',
    module: 'Production',
    title: 'Deploying to the Internet',
    icon: '🚀',
    readingTime: 10,
    content: [
      { type: 'analogy', title: 'From Home Kitchen to Restaurant', text: `Your API runs on localhost — only you can access it. **Deployment** puts it on a public server.\n\nOptions: **Railway** (simple, free tier, Python + MySQL), **Render** (free, auto-deploys), **PythonAnywhere** (beginner-friendly), **AWS/GCP** (enterprise, complex).` },
      { type: 'code', title: 'Prepare for Deployment', language: 'bash',
        code: `# 1. Install production server\npip install gunicorn\npip freeze > requirements.txt\n\n# 2. Create Procfile\necho "web: gunicorn run:app" > Procfile\n\n# 3. Push to GitHub\ngit init\ngit add .\ngit commit -m "Ready for deployment"\ngit remote add origin https://github.com/you/your-api.git\ngit push -u origin main\n\n# 4. On Railway (railway.app):\n#    New Project → Deploy from GitHub → Select repo\n#    Add MySQL database → Connect variables\n#    Your API is live at: https://your-api.up.railway.app`,
        explanation: `**Gunicorn** is a production Python server (Flask's built-in only handles one request at a time). **Procfile** tells the host how to start your app. Railway auto-detects Python, installs packages from requirements.txt, and provides a public URL with HTTPS.` },
      { type: 'code', title: 'Health Check Endpoint', language: 'python',
        code: `@app.route('/api/health')\ndef health():\n    try:\n        cur = mysql.connection.cursor()\n        cur.execute("SELECT 1")\n        cur.close()\n        return api_response(data={"status": "healthy", "database": "connected"})\n    except:\n        return api_response(errors=["Database unreachable"], status=503)`,
        explanation: `A health check endpoint lets monitoring tools verify your API is running. It tests the database connection too. Use this with uptime monitors (e.g., UptimeRobot) to get alerts if your API goes down.` },
      { type: 'quiz', question: 'Why use Gunicorn instead of Flask\'s built-in server?', options: ['It\'s free', 'It handles concurrent requests', 'It provides HTTPS', 'It runs faster SQL'], correct: 1, explanation: 'Flask\'s built-in server handles one request at a time. Gunicorn runs multiple worker processes for concurrent users.' },
      { type: 'challenge', title: 'Deploy Your API', description: 'Get your API live on the internet:', steps: ['Install gunicorn, create Procfile and requirements.txt', 'Push to GitHub', 'Create a Railway account and deploy from your repo', 'Add a MySQL database on Railway', 'Set environment variables (SECRET_KEY, DB credentials)', 'Create database tables on the remote MySQL', 'Test your live API with curl or Postman', 'Share the URL — your API is public!'] },
    ],
  },

  // ===================================================================
  // MODULE: CAPSTONE
  // ===================================================================
  {
    id: 'capstone',
    module: 'Capstone',
    title: 'Build a Complete Invoice API',
    icon: '🏗️',
    readingTime: 5,
    content: [
      { type: 'concept', title: 'Put It All Together', text: `Congratulations — you've learned every building block. Now build a real, complete API from scratch combining:\n\n✅ Python + Flask + MySQL\n✅ Related tables with JOINs\n✅ Pagination, filtering, sorting\n✅ Input validation + consistent responses\n✅ Password hashing with bcrypt\n✅ JWT authentication\n✅ Professional project structure\n✅ Automated tests\n✅ Deployment` },
      { type: 'realworld', title: 'Project Requirements', text: `**Customers**\n  GET /api/customers — List all (paginated, ?search= filter)\n  GET /api/customers/:id — Get one (include invoices)\n  POST /api/customers — Create (validate name, email)\n  DELETE /api/customers/:id — Only if no invoices exist\n\n**Invoices**\n  GET /api/invoices — List (paginated, ?status=, ?customer_id=)\n  GET /api/invoices/:id — Get one (include customer via JOIN)\n  POST /api/invoices — Create (validate customer exists, amount > 0)\n  PUT /api/invoices/:id/status — Update status only\n\n**Auth**\n  POST /api/register — Create account (bcrypt)\n  POST /api/login — Get JWT token\n  All write endpoints require authentication\n\n**Dashboard**\n  GET /api/dashboard — Total customers, invoices, outstanding amount, overdue count` },
      { type: 'code', title: 'Database Schema', language: 'sql',
        code: `CREATE DATABASE IF NOT EXISTS invoice_api;\nUSE invoice_api;\n\nCREATE TABLE users (\n    id INT AUTO_INCREMENT PRIMARY KEY,\n    email VARCHAR(100) UNIQUE NOT NULL,\n    password_hash VARCHAR(255) NOT NULL,\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\nCREATE TABLE customers (\n    id INT AUTO_INCREMENT PRIMARY KEY,\n    company_name VARCHAR(100) NOT NULL,\n    email VARCHAR(100) UNIQUE NOT NULL,\n    phone VARCHAR(20),\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\nCREATE TABLE invoices (\n    id INT AUTO_INCREMENT PRIMARY KEY,\n    customer_id INT NOT NULL,\n    invoice_number VARCHAR(20) UNIQUE NOT NULL,\n    amount DECIMAL(10,2) NOT NULL,\n    due_date DATE NOT NULL,\n    status ENUM('pending','paid','overdue','disputed') DEFAULT 'pending',\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT\n);`,
        explanation: `The users table stores password_hash, never plain passwords. The FOREIGN KEY prevents orphan invoices. ON DELETE RESTRICT prevents deleting customers who have invoices.` },
      { type: 'challenge', title: 'Capstone Checklist', description: 'Build the complete Invoice Management API:', steps: [
          'Set up project structure (folders, config, .env)',
          'Create MySQL database and all 3 tables',
          'Implement /api/register with bcrypt',
          'Implement /api/login with JWT',
          'Build all Customer endpoints with validation + pagination',
          'Build all Invoice endpoints with JOINs + filtering',
          'Build /api/dashboard with aggregate SQL queries',
          'Add @require_token to all write endpoints',
          'Add CORS configuration',
          'Write automated tests for every endpoint',
          'Deploy to Railway with live MySQL',
          'Write a README with setup instructions and endpoint docs',
        ] },
    ],
  },

  // ─── Capstone 2: Task Management API ──────────────────────────────────
  {
    id: 'capstone-tasks',
    module: 'Capstone',
    title: 'Build a Task Management API',
    icon: '📋',
    readingTime: 5,
    content: [
      { type: 'concept', title: 'Project Overview', text: `Build a **project & task management API** — like a simplified Trello or Asana. Users create projects, add tasks to them, assign tasks to team members, and track progress through statuses.

This capstone focuses on:
✅ Multiple related tables (users, projects, tasks, assignments)
✅ Many-to-many relationships (users ↔ projects)
✅ Status workflows (todo → in_progress → review → done)
✅ Role-based access (owner vs member)
✅ Filtering by status, assignee, and due date
✅ Aggregate queries for project dashboards` },
      { type: 'realworld', title: 'Project Requirements', text: `**Auth**
  POST /api/register — Create account
  POST /api/login — Get JWT token

**Projects**
  GET /api/projects — List user's projects (paginated)
  POST /api/projects — Create project (becomes owner)
  GET /api/projects/:id — Project details + member list + task counts
  POST /api/projects/:id/members — Add a member by email
  DELETE /api/projects/:id/members/:user_id — Remove member (owner only)

**Tasks**
  GET /api/projects/:id/tasks — List tasks (?status=, ?assignee=, ?sort_by=due_date)
  POST /api/projects/:id/tasks — Create task (title, description, due_date, priority)
  PUT /api/tasks/:id — Update task details
  PUT /api/tasks/:id/status — Move task (todo → in_progress → review → done)
  PUT /api/tasks/:id/assign — Assign to a project member
  DELETE /api/tasks/:id — Owner or assignee only

**Dashboard**
  GET /api/projects/:id/stats — Tasks by status, overdue count, member workloads` },
      { type: 'code', title: 'Database Schema', language: 'sql',
        code: `CREATE DATABASE IF NOT EXISTS task_api;\nUSE task_api;\n\nCREATE TABLE users (\n    id INT AUTO_INCREMENT PRIMARY KEY,\n    name VARCHAR(100) NOT NULL,\n    email VARCHAR(100) UNIQUE NOT NULL,\n    password_hash VARCHAR(255) NOT NULL,\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\nCREATE TABLE projects (\n    id INT AUTO_INCREMENT PRIMARY KEY,\n    name VARCHAR(150) NOT NULL,\n    description TEXT,\n    owner_id INT NOT NULL,\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n    FOREIGN KEY (owner_id) REFERENCES users(id)\n);\n\nCREATE TABLE project_members (\n    project_id INT NOT NULL,\n    user_id INT NOT NULL,\n    role ENUM('owner','member') DEFAULT 'member',\n    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n    PRIMARY KEY (project_id, user_id),\n    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,\n    FOREIGN KEY (user_id) REFERENCES users(id)\n);\n\nCREATE TABLE tasks (\n    id INT AUTO_INCREMENT PRIMARY KEY,\n    project_id INT NOT NULL,\n    title VARCHAR(200) NOT NULL,\n    description TEXT,\n    status ENUM('todo','in_progress','review','done') DEFAULT 'todo',\n    priority ENUM('low','medium','high','urgent') DEFAULT 'medium',\n    assignee_id INT,\n    due_date DATE,\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,\n    FOREIGN KEY (assignee_id) REFERENCES users(id) ON DELETE SET NULL\n);`,
        explanation: `**project_members** is a junction table for the many-to-many relationship between users and projects. The composite PRIMARY KEY (project_id, user_id) prevents duplicates.\n\n**ON DELETE CASCADE** on tasks means deleting a project deletes its tasks. **ON DELETE SET NULL** on assignee_id means deleting a user sets their tasks to unassigned rather than deleting them.` },
      { type: 'challenge', title: 'Capstone Checklist', description: 'Build the complete Task Management API:', steps: [
          'Set up project structure with .env and config',
          'Create the database and all 4 tables',
          'Implement auth (register + login with JWT)',
          'Build project CRUD — only members can access their projects',
          'Build the member invitation system (add/remove by email)',
          'Build task CRUD with status workflow validation (no skipping statuses)',
          'Add task assignment — validate assignee is a project member',
          'Build project stats endpoint with aggregate queries',
          'Add filtering: ?status=, ?assignee=, ?priority=, ?overdue=true',
          'Write tests for auth, projects, tasks, and permission checks',
          'Deploy and test the live API',
        ] },
    ],
  },

  // ─── Capstone 3: Blog & CMS API ──────────────────────────────────────
  {
    id: 'capstone-blog',
    module: 'Capstone',
    title: 'Build a Blog & CMS API',
    icon: '✍️',
    readingTime: 5,
    content: [
      { type: 'concept', title: 'Project Overview', text: `Build a **content management system API** for a blog platform. Authors write posts, readers leave comments, and admins manage categories and moderate content.

This capstone focuses on:
✅ Role-based access control (admin, author, reader)
✅ Content publishing workflow (draft → published)
✅ Tag/category many-to-many relationships
✅ Nested comments (replies to comments)
✅ Full-text search across posts
✅ Rate limiting and content moderation` },
      { type: 'realworld', title: 'Project Requirements', text: `**Auth**
  POST /api/register — Create reader account
  POST /api/login — Get JWT token (includes role in payload)

**Posts**
  GET /api/posts — Published posts (paginated, ?category=, ?tag=, ?search=)
  GET /api/posts/:slug — Single post with author info + comments
  POST /api/posts — Create draft (authors/admins only)
  PUT /api/posts/:id — Edit post (own posts or admin)
  PUT /api/posts/:id/publish — Publish draft (own posts or admin)
  DELETE /api/posts/:id — Soft delete (admin only)

**Comments**
  GET /api/posts/:id/comments — All comments for a post (threaded)
  POST /api/posts/:id/comments — Add comment (authenticated users)
  POST /api/comments/:id/reply — Reply to a comment
  DELETE /api/comments/:id — Own comment or admin

**Categories & Tags**
  GET /api/categories — List all categories with post counts
  POST /api/categories — Create category (admin only)
  POST /api/posts/:id/tags — Add tags to a post (author/admin)

**Admin**
  GET /api/admin/users — List all users (admin only)
  PUT /api/admin/users/:id/role — Change user role (admin only)` },
      { type: 'code', title: 'Database Schema', language: 'sql',
        code: `CREATE DATABASE IF NOT EXISTS blog_api;\nUSE blog_api;\n\nCREATE TABLE users (\n    id INT AUTO_INCREMENT PRIMARY KEY,\n    username VARCHAR(50) UNIQUE NOT NULL,\n    email VARCHAR(100) UNIQUE NOT NULL,\n    password_hash VARCHAR(255) NOT NULL,\n    role ENUM('reader','author','admin') DEFAULT 'reader',\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\nCREATE TABLE categories (\n    id INT AUTO_INCREMENT PRIMARY KEY,\n    name VARCHAR(50) UNIQUE NOT NULL,\n    slug VARCHAR(60) UNIQUE NOT NULL\n);\n\nCREATE TABLE posts (\n    id INT AUTO_INCREMENT PRIMARY KEY,\n    author_id INT NOT NULL,\n    category_id INT,\n    title VARCHAR(200) NOT NULL,\n    slug VARCHAR(220) UNIQUE NOT NULL,\n    body TEXT NOT NULL,\n    excerpt VARCHAR(300),\n    status ENUM('draft','published','archived') DEFAULT 'draft',\n    published_at TIMESTAMP NULL,\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n    FOREIGN KEY (author_id) REFERENCES users(id),\n    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,\n    FULLTEXT INDEX ft_posts (title, body)\n);\n\nCREATE TABLE tags (\n    id INT AUTO_INCREMENT PRIMARY KEY,\n    name VARCHAR(30) UNIQUE NOT NULL\n);\n\nCREATE TABLE post_tags (\n    post_id INT NOT NULL,\n    tag_id INT NOT NULL,\n    PRIMARY KEY (post_id, tag_id),\n    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,\n    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE\n);\n\nCREATE TABLE comments (\n    id INT AUTO_INCREMENT PRIMARY KEY,\n    post_id INT NOT NULL,\n    user_id INT NOT NULL,\n    parent_id INT NULL,\n    body TEXT NOT NULL,\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,\n    FOREIGN KEY (user_id) REFERENCES users(id),\n    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE\n);`,
        explanation: `**Slug** is a URL-friendly version of the title ("my-first-post"). Use it in URLs instead of IDs for SEO.\n\n**FULLTEXT INDEX** enables MySQL's built-in search: \`WHERE MATCH(title, body) AGAINST('flask tutorial')\`.\n\n**parent_id** on comments creates a tree structure — a comment with parent_id = NULL is top-level, and replies point to their parent. This is called a **self-referencing foreign key**.` },
      { type: 'challenge', title: 'Capstone Checklist', description: 'Build the complete Blog & CMS API:', steps: [
          'Set up project with config, .env, and folder structure',
          'Create the database and all 6 tables',
          'Implement auth with roles (reader, author, admin)',
          'Build post CRUD with slug generation and draft/publish workflow',
          'Implement full-text search with MATCH...AGAINST',
          'Build the comment system with threaded replies',
          'Implement category and tag management (many-to-many)',
          'Add role-based middleware (admin-only routes, author-only editing)',
          'Add pagination, filtering by category/tag, and sorting by date',
          'Write tests covering permissions (reader can\'t create posts, author can\'t delete others)',
          'Deploy and document all endpoints in a README',
        ] },
    ],
  },

  // ─── Capstone 4: E-Commerce Product Catalog API ───────────────────────
  {
    id: 'capstone-ecommerce',
    module: 'Capstone',
    title: 'Build an E-Commerce API',
    icon: '🛒',
    readingTime: 5,
    content: [
      { type: 'concept', title: 'Project Overview', text: `Build a **product catalog and shopping cart API** for an online store. Customers browse products, add items to a cart, place orders, and leave reviews.

This capstone focuses on:
✅ Complex data relationships (products, categories, orders, order items)
✅ Shopping cart management (add, update quantity, remove)
✅ Order processing workflow (cart → placed → shipped → delivered)
✅ Product reviews with aggregate ratings
✅ Stock management and inventory checks
✅ Price calculations with tax and discounts` },
      { type: 'realworld', title: 'Project Requirements', text: `**Auth**
  POST /api/register — Create customer account
  POST /api/login — Get JWT token

**Products**
  GET /api/products — Browse products (paginated, ?category=, ?search=, ?min_price=, ?max_price=, ?sort_by=price)
  GET /api/products/:id — Product detail + reviews + average rating
  POST /api/products — Add product (admin only)
  PUT /api/products/:id — Update product/stock (admin only)

**Categories**
  GET /api/categories — List categories with product counts
  GET /api/categories/:id/products — Products in a category

**Cart**
  GET /api/cart — Current user's cart with item totals
  POST /api/cart — Add item (product_id, quantity) — validate stock
  PUT /api/cart/:item_id — Update quantity — validate stock
  DELETE /api/cart/:item_id — Remove item

**Orders**
  POST /api/orders — Place order from cart (deducts stock, clears cart)
  GET /api/orders — User's order history (paginated)
  GET /api/orders/:id — Order details with items
  PUT /api/orders/:id/status — Update status (admin only)

**Reviews**
  POST /api/products/:id/reviews — Leave a review (1-5 stars + text, one per product)
  GET /api/products/:id/reviews — Reviews for a product (paginated)` },
      { type: 'code', title: 'Database Schema', language: 'sql',
        code: `CREATE DATABASE IF NOT EXISTS shop_api;\nUSE shop_api;\n\nCREATE TABLE users (\n    id INT AUTO_INCREMENT PRIMARY KEY,\n    name VARCHAR(100) NOT NULL,\n    email VARCHAR(100) UNIQUE NOT NULL,\n    password_hash VARCHAR(255) NOT NULL,\n    role ENUM('customer','admin') DEFAULT 'customer',\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\nCREATE TABLE categories (\n    id INT AUTO_INCREMENT PRIMARY KEY,\n    name VARCHAR(80) UNIQUE NOT NULL,\n    slug VARCHAR(90) UNIQUE NOT NULL\n);\n\nCREATE TABLE products (\n    id INT AUTO_INCREMENT PRIMARY KEY,\n    category_id INT,\n    name VARCHAR(200) NOT NULL,\n    description TEXT,\n    price DECIMAL(10,2) NOT NULL,\n    stock INT NOT NULL DEFAULT 0,\n    image_url VARCHAR(500),\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL\n);\n\nCREATE TABLE cart_items (\n    id INT AUTO_INCREMENT PRIMARY KEY,\n    user_id INT NOT NULL,\n    product_id INT NOT NULL,\n    quantity INT NOT NULL DEFAULT 1,\n    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n    UNIQUE KEY unique_cart_item (user_id, product_id),\n    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,\n    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE\n);\n\nCREATE TABLE orders (\n    id INT AUTO_INCREMENT PRIMARY KEY,\n    user_id INT NOT NULL,\n    total DECIMAL(10,2) NOT NULL,\n    status ENUM('placed','confirmed','shipped','delivered','cancelled') DEFAULT 'placed',\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n    FOREIGN KEY (user_id) REFERENCES users(id)\n);\n\nCREATE TABLE order_items (\n    id INT AUTO_INCREMENT PRIMARY KEY,\n    order_id INT NOT NULL,\n    product_id INT NOT NULL,\n    quantity INT NOT NULL,\n    unit_price DECIMAL(10,2) NOT NULL,\n    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,\n    FOREIGN KEY (product_id) REFERENCES products(id)\n);\n\nCREATE TABLE reviews (\n    id INT AUTO_INCREMENT PRIMARY KEY,\n    product_id INT NOT NULL,\n    user_id INT NOT NULL,\n    rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),\n    body TEXT,\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n    UNIQUE KEY one_review_per_user (product_id, user_id),\n    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,\n    FOREIGN KEY (user_id) REFERENCES users(id)\n);`,
        explanation: `**UNIQUE KEY (user_id, product_id)** on cart_items prevents duplicate entries — adding the same product again should update quantity instead.\n\n**order_items stores unit_price** at time of purchase. If the product price changes later, existing orders aren't affected.\n\n**CHECK (rating BETWEEN 1 AND 5)** enforces valid star ratings at the database level. The UNIQUE KEY on reviews ensures one review per user per product.` },
      { type: 'challenge', title: 'Capstone Checklist', description: 'Build the complete E-Commerce API:', steps: [
          'Set up project with config, .env, and folder structure',
          'Create the database and all 7 tables',
          'Implement auth with customer and admin roles',
          'Build product CRUD with category filtering, price range, and search',
          'Build the shopping cart (add, update quantity, remove, get total)',
          'Implement order placement — validate stock, deduct stock, clear cart (use a transaction!)',
          'Build order history and detail endpoints',
          'Implement the review system with average rating aggregation',
          'Add stock validation: prevent adding out-of-stock items to cart',
          'Write tests for the full purchase flow: browse → cart → order',
          'Deploy and test with sample product data',
        ] },
    ],
  },

  // ─── Capstone 5: Expense Tracker API ──────────────────────────────────
  {
    id: 'capstone-expenses',
    module: 'Capstone',
    title: 'Build an Expense Tracker API',
    icon: '💰',
    readingTime: 5,
    content: [
      { type: 'concept', title: 'Project Overview', text: `Build a **personal and team expense tracker API**. Users log expenses, categorise them, set monthly budgets, and view spending reports with breakdowns.

This capstone focuses on:
✅ Financial data handling with DECIMAL precision
✅ Date-range queries and monthly aggregations
✅ Budget tracking with threshold alerts
✅ Category-based spending breakdowns
✅ CSV export for accounting
✅ Aggregate SQL queries (SUM, AVG, GROUP BY, HAVING)` },
      { type: 'realworld', title: 'Project Requirements', text: `**Auth**
  POST /api/register — Create account
  POST /api/login — Get JWT token

**Categories**
  GET /api/categories — List user's categories with monthly spend
  POST /api/categories — Create custom category
  PUT /api/categories/:id — Rename category
  DELETE /api/categories/:id — Only if no expenses exist

**Expenses**
  GET /api/expenses — List expenses (paginated, ?category=, ?from=, ?to=, ?min=, ?max=)
  POST /api/expenses — Log expense (amount, category, description, date)
  PUT /api/expenses/:id — Edit own expense
  DELETE /api/expenses/:id — Delete own expense

**Budgets**
  GET /api/budgets — List monthly budgets by category
  POST /api/budgets — Set budget (category_id, month, limit_amount)
  PUT /api/budgets/:id — Update budget limit
  GET /api/budgets/alerts — Categories where spending exceeds 80% or 100% of budget

**Reports**
  GET /api/reports/monthly?month=2026-02 — Total spend, by-category breakdown, daily averages
  GET /api/reports/trends — Month-over-month comparison (last 6 months)
  GET /api/reports/export?from=&to= — Download expenses as CSV` },
      { type: 'code', title: 'Database Schema', language: 'sql',
        code: `CREATE DATABASE IF NOT EXISTS expense_api;\nUSE expense_api;\n\nCREATE TABLE users (\n    id INT AUTO_INCREMENT PRIMARY KEY,\n    name VARCHAR(100) NOT NULL,\n    email VARCHAR(100) UNIQUE NOT NULL,\n    password_hash VARCHAR(255) NOT NULL,\n    currency VARCHAR(3) DEFAULT 'GBP',\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\nCREATE TABLE categories (\n    id INT AUTO_INCREMENT PRIMARY KEY,\n    user_id INT NOT NULL,\n    name VARCHAR(50) NOT NULL,\n    icon VARCHAR(10),\n    UNIQUE KEY unique_user_category (user_id, name),\n    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE\n);\n\nCREATE TABLE expenses (\n    id INT AUTO_INCREMENT PRIMARY KEY,\n    user_id INT NOT NULL,\n    category_id INT NOT NULL,\n    amount DECIMAL(10,2) NOT NULL,\n    description VARCHAR(255),\n    expense_date DATE NOT NULL,\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,\n    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,\n    INDEX idx_user_date (user_id, expense_date)\n);\n\nCREATE TABLE budgets (\n    id INT AUTO_INCREMENT PRIMARY KEY,\n    user_id INT NOT NULL,\n    category_id INT NOT NULL,\n    month CHAR(7) NOT NULL,\n    limit_amount DECIMAL(10,2) NOT NULL,\n    UNIQUE KEY unique_budget (user_id, category_id, month),\n    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,\n    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE\n);\n\n-- Seed default categories for new users:\n-- Food & Drink, Transport, Housing, Utilities, Entertainment,\n-- Shopping, Health, Education, Subscriptions, Other`,
        explanation: `**INDEX idx_user_date** speeds up the most common query: "show my expenses for this month." Without an index, MySQL scans every row.\n\n**month as CHAR(7)** stores "2026-02" format for easy grouping. The UNIQUE KEY on budgets prevents duplicate budgets for the same category and month.\n\n**Categories are per-user** (user_id in categories table) so each user can customise their own. Seed default categories when a new user registers.` },
      { type: 'challenge', title: 'Capstone Checklist', description: 'Build the complete Expense Tracker API:', steps: [
          'Set up project with config, .env, and folder structure',
          'Create the database and all 4 tables with indexes',
          'Implement auth and seed default categories on registration',
          'Build expense CRUD with date-range and category filtering',
          'Build budget management with per-category monthly limits',
          'Implement budget alerts — query expenses vs limits using SUM and GROUP BY',
          'Build monthly report with category breakdown (SUM, AVG, GROUP BY)',
          'Build trends endpoint comparing month-over-month totals',
          'Implement CSV export using Python\'s csv module',
          'Write tests for financial calculations (ensure DECIMAL precision)',
          'Deploy and seed sample data for a demo',
        ] },
    ],
  },

  // ─── Capstone 6: Booking & Appointment API ────────────────────────────
  {
    id: 'capstone-booking',
    module: 'Capstone',
    title: 'Build a Booking System API',
    icon: '📅',
    readingTime: 5,
    content: [
      { type: 'concept', title: 'Project Overview', text: `Build an **appointment booking API** — like Calendly or a salon booking system. Providers set their availability, clients browse open slots and book appointments.

This capstone focuses on:
✅ Time-slot management and conflict detection
✅ Two user types (provider vs client)
✅ Date/time handling in MySQL and Python
✅ Booking state machine (pending → confirmed → completed/cancelled)
✅ Preventing double-bookings with database constraints
✅ Availability windows and schedule generation` },
      { type: 'realworld', title: 'Project Requirements', text: `**Auth**
  POST /api/register — Create account (choose role: provider or client)
  POST /api/login — Get JWT token

**Services** (Provider)
  GET /api/services — List all services (?provider=, ?category=)
  POST /api/services — Create service (name, duration_minutes, price)
  PUT /api/services/:id — Update service details
  DELETE /api/services/:id — Only if no future bookings exist

**Availability** (Provider)
  GET /api/availability — Provider's weekly schedule
  POST /api/availability — Set available hours (day_of_week, start_time, end_time)
  PUT /api/availability/:id — Update a time window
  DELETE /api/availability/:id — Remove a time window

**Bookings** (Client & Provider)
  GET /api/services/:id/slots?date=2026-03-15 — Available slots for a date
  POST /api/bookings — Book a slot (service_id, date, start_time)
  GET /api/bookings — My bookings (?status=, ?from=, ?to=)
  PUT /api/bookings/:id/confirm — Provider confirms booking
  PUT /api/bookings/:id/cancel — Cancel (client or provider, with reason)
  PUT /api/bookings/:id/complete — Mark as completed (provider only)

**Dashboard**
  GET /api/provider/dashboard — Today's bookings, weekly summary, revenue totals` },
      { type: 'code', title: 'Database Schema', language: 'sql',
        code: `CREATE DATABASE IF NOT EXISTS booking_api;\nUSE booking_api;\n\nCREATE TABLE users (\n    id INT AUTO_INCREMENT PRIMARY KEY,\n    name VARCHAR(100) NOT NULL,\n    email VARCHAR(100) UNIQUE NOT NULL,\n    password_hash VARCHAR(255) NOT NULL,\n    role ENUM('provider','client') NOT NULL,\n    phone VARCHAR(20),\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\nCREATE TABLE services (\n    id INT AUTO_INCREMENT PRIMARY KEY,\n    provider_id INT NOT NULL,\n    name VARCHAR(150) NOT NULL,\n    description TEXT,\n    duration_minutes INT NOT NULL DEFAULT 60,\n    price DECIMAL(8,2) NOT NULL,\n    is_active BOOLEAN DEFAULT TRUE,\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n    FOREIGN KEY (provider_id) REFERENCES users(id)\n);\n\nCREATE TABLE availability (\n    id INT AUTO_INCREMENT PRIMARY KEY,\n    provider_id INT NOT NULL,\n    day_of_week TINYINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),\n    start_time TIME NOT NULL,\n    end_time TIME NOT NULL,\n    FOREIGN KEY (provider_id) REFERENCES users(id) ON DELETE CASCADE\n);\n\nCREATE TABLE bookings (\n    id INT AUTO_INCREMENT PRIMARY KEY,\n    service_id INT NOT NULL,\n    client_id INT NOT NULL,\n    provider_id INT NOT NULL,\n    booking_date DATE NOT NULL,\n    start_time TIME NOT NULL,\n    end_time TIME NOT NULL,\n    status ENUM('pending','confirmed','completed','cancelled') DEFAULT 'pending',\n    cancel_reason VARCHAR(255),\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n    FOREIGN KEY (service_id) REFERENCES services(id),\n    FOREIGN KEY (client_id) REFERENCES users(id),\n    FOREIGN KEY (provider_id) REFERENCES users(id),\n    INDEX idx_provider_date (provider_id, booking_date)\n);\n\n-- Prevent double-bookings: check in application logic that no\n-- confirmed/pending booking overlaps the same provider + date + time range`,
        explanation: `**day_of_week** uses 0=Monday through 6=Sunday. The availability table defines weekly recurring slots (e.g., "available Monday 9:00-17:00").\n\nThe **slots endpoint** generates available time windows by: (1) getting the provider's availability for that day of the week, (2) splitting into service-duration slots, (3) removing slots that overlap existing bookings.\n\n**Double-booking prevention** is the hardest part. Use a SQL query: \`SELECT * FROM bookings WHERE provider_id = %s AND booking_date = %s AND status IN ('pending','confirmed') AND start_time < %s AND end_time > %s\`. If any rows return, the slot is taken.` },
      { type: 'challenge', title: 'Capstone Checklist', description: 'Build the complete Booking System API:', steps: [
          'Set up project with config, .env, and folder structure',
          'Create the database and all 4 tables',
          'Implement auth with provider and client roles',
          'Build service CRUD (providers manage their offerings)',
          'Build availability management (weekly recurring schedule)',
          'Implement the slot generation algorithm (available times for a given date)',
          'Build booking creation with double-booking prevention',
          'Implement booking status workflow (pending → confirmed → completed)',
          'Build cancellation with reason tracking',
          'Build provider dashboard with today\'s schedule and revenue stats',
          'Write tests for the full flow: set availability → book slot → confirm → complete',
          'Test edge cases: overlapping bookings, past dates, unavailable days',
        ] },
    ],
  },
];

export default LESSONS;
