# API Documentation

Base URL: `http://localhost:3000` (or your server IP)

## Routes Overview

1. `GET /health` - Health check endpoint
2. `POST /api/policies/ingest` - Ingest policy text and generate rules
3. `POST /api/compliance/check` - Check compliance for a trade

---

## 1. Health Check

### Endpoint
```
GET /health
```

### Request
No body required.

### Response
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Example
```bash
curl http://localhost:3000/health
```

---

## 2. Policy Ingest

### Endpoint
```
POST /api/policies/ingest
```

### Request Body
```typescript
{
  firm_name: string;      // Required: Name of the firm
  policy_text: string;    // Required: Policy text to process
}
```

### Success Response (200)
```json
{
  "status": "SUCCESS",
  "firm_name": "Meridian Capital",
  "rules_deployed": 5,
  "total_iterations": 12,
  "rules": [
    {
      "rule_name": "Restricted Ticker Check",
      "description": "Checks if employee is restricted from trading specific tickers",
      "attempts": 2,
      "validated": true
    }
  ]
}
```

### Error Responses

**400 Bad Request** - Missing required fields
```json
{
  "status": "ERROR",
  "message": "firm_name and policy_text are required."
}
```

**500 Internal Server Error** - Processing failed
```json
{
  "status": "ERROR",
  "message": "Failed to ingest policy.",
  "details": "Error details here"
}
```

### Example Request
```bash
curl -X POST http://localhost:3000/api/policies/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "firm_name": "Meridian Capital",
    "policy_text": "Employees in the Investment Banking division cannot trade stocks of companies they have advised in the past 90 days."
  }'
```

### Example JavaScript/TypeScript
```typescript
const response = await fetch('http://localhost:3000/api/policies/ingest', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    firm_name: 'Meridian Capital',
    policy_text: 'Employees cannot trade restricted tickers...'
  })
});

const data = await response.json();
```

---

## 3. Compliance Check

### Endpoint
```
POST /api/compliance/check
```

### Request Body
```typescript
{
  firm_name: string;      // Required: Name of the firm
  employee_id: string;    // Required: Employee identifier
  query: string;         // Required: Natural language query (e.g., "Can I buy AAPL?")
  trade_date?: string;   // Optional: Trade date in YYYY-MM-DD format (defaults to today)
}
```

### Success Response (200)
```json
{
  "status": "SUCCESS",
  "firm_name": "Meridian Capital",
  "employee_id": "EMP001",
  "parsed_query": {
    "ticker": "AAPL",
    "action": "buy",
    "trade_date": "2024-01-15"
  },
  "compliance": {
    "allowed": true,
    "reasons": [
      "Trade is allowed: Employee has no restrictions on AAPL",
      "Employee role permits this trade type"
    ],
    "policy_refs": [
      "Policy Section 3.2",
      "Policy Section 5.1"
    ],
    "rules_checked": [
      "restricted_ticker_check",
      "role_based_trading_restrictions"
    ]
  }
}
```

**When trade is NOT allowed:**
```json
{
  "status": "SUCCESS",
  "firm_name": "Meridian Capital",
  "employee_id": "EMP001",
  "parsed_query": {
    "ticker": "TSLA",
    "action": "buy",
    "trade_date": "2024-01-15"
  },
  "compliance": {
    "allowed": false,
    "reasons": [
      "Trade denied: Employee is restricted from trading TSLA",
      "Violates firm-wide restricted list"
    ],
    "policy_refs": [
      "Policy Section 2.1",
      "Policy Section 4.3"
    ],
    "rules_checked": [
      "restricted_ticker_check",
      "firm_restricted_list_check"
    ]
  }
}
```

### Error Responses

**400 Bad Request** - Missing required fields
```json
{
  "status": "ERROR",
  "code": "INVALID_REQUEST",
  "message": "firm_name, employee_id, and query are required."
}
```

**400 Bad Request** - Query parsing failed
```json
{
  "status": "ERROR",
  "code": "PARSE_ERROR",
  "message": "Unable to interpret the natural language query.",
  "details": "Could not extract ticker symbol from query"
}
```

**404 Not Found** - Employee not found
```json
{
  "status": "ERROR",
  "code": "EMPLOYEE_NOT_FOUND",
  "message": "Employee EMP001 was not found in demo_data_simple.json."
}
```

**500 Internal Server Error** - Unexpected error
```json
{
  "status": "ERROR",
  "code": "UNEXPECTED_ERROR",
  "message": "Failed to perform compliance check.",
  "details": "Error details here"
}
```

### Example Request
```bash
curl -X POST http://localhost:3000/api/compliance/check \
  -H "Content-Type: application/json" \
  -d '{
    "firm_name": "Meridian Capital",
    "employee_id": "EMP001",
    "query": "Can I buy 100 shares of AAPL?",
    "trade_date": "2024-01-15"
  }'
```

### Example JavaScript/TypeScript
```typescript
const response = await fetch('http://localhost:3000/api/compliance/check', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    firm_name: 'Meridian Capital',
    employee_id: 'EMP001',
    query: 'Can I buy 100 shares of AAPL?',
    trade_date: '2024-01-15' // Optional
  })
});

const data = await response.json();

if (data.status === 'SUCCESS') {
  console.log('Trade allowed:', data.compliance.allowed);
  console.log('Reasons:', data.compliance.reasons);
} else {
  console.error('Error:', data.message);
}
```

---

## TypeScript Interfaces (for reference)

```typescript
// Policy Ingest Request
interface PolicyIngestRequest {
  firm_name: string;
  policy_text: string;
}

// Policy Ingest Response
interface PolicyIngestResponse {
  status: "SUCCESS" | "ERROR";
  firm_name?: string;
  rules_deployed?: number;
  total_iterations?: number;
  rules?: Array<{
    rule_name: string;
    description: string;
    attempts: number;
    validated: boolean;
  }>;
  message?: string;
  details?: string;
}

// Compliance Check Request
interface ComplianceCheckRequest {
  firm_name: string;
  employee_id: string;
  query: string;
  trade_date?: string; // YYYY-MM-DD format
}

// Compliance Check Response
interface ComplianceCheckResponse {
  status: "SUCCESS" | "ERROR";
  firm_name?: string;
  employee_id?: string;
  parsed_query?: {
    ticker: string;
    action: string;
    trade_date: string;
  };
  compliance?: {
    allowed: boolean;
    reasons: string[];
    policy_refs: string[];
    rules_checked: string[];
  };
  code?: string;
  message?: string;
  details?: string;
}

// Health Check Response
interface HealthCheckResponse {
  status: "ok";
  timestamp: string;
}
```

---

## Query Examples

The `query` field in compliance check accepts natural language. Examples:

- `"Can I buy AAPL?"`
- `"I want to sell 50 shares of TSLA"`
- `"Is it allowed to purchase MSFT stock?"`
- `"Can employee EMP001 trade GOOGL?"`
- `"Buy 100 shares of NVDA"`

The system will parse:
- **Ticker symbol** (AAPL, TSLA, MSFT, etc.)
- **Action** (buy, sell, purchase, etc.)
- **Trade date** (if mentioned, otherwise uses current date)

---

## Error Handling Best Practices

1. **Always check the `status` field** first:
   ```typescript
   if (data.status === 'ERROR') {
     // Handle error
     console.error(data.message);
     if (data.code) {
       // Handle specific error codes
     }
   }
   ```

2. **Common error codes**:
   - `INVALID_REQUEST` - Missing required fields
   - `PARSE_ERROR` - Query parsing failed
   - `EMPLOYEE_NOT_FOUND` - Employee doesn't exist
   - `UNEXPECTED_ERROR` - Server error

3. **Network errors**: Handle fetch errors separately:
   ```typescript
   try {
     const response = await fetch(...);
     const data = await response.json();
     // Process data
   } catch (error) {
     // Network or JSON parsing error
     console.error('Request failed:', error);
   }
   ```

