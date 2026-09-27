export const BASELINE_OPENAPI = `{
  "openapi": "3.0.3",
  "info": { "title": "Billing API", "version": "1.2.0" },
  "paths": {
    "/v1/invoices": {
      "get": {
        "parameters": [
          { "name": "limit", "in": "query", "required": false }
        ],
        "responses": { "200": { "description": "ok" }, "401": { "description": "auth" } }
      },
      "post": {
        "requestBody": { "required": true },
        "responses": { "201": { "description": "created" }, "400": { "description": "bad" } }
      }
    },
    "/v1/invoices/{id}": {
      "get": {
        "parameters": [
          { "name": "id", "in": "path", "required": true }
        ],
        "responses": { "200": { "description": "ok" }, "404": { "description": "missing" } }
      },
      "delete": {
        "parameters": [
          { "name": "id", "in": "path", "required": true }
        ],
        "responses": { "204": { "description": "deleted" } }
      }
    },
    "/v1/customers": {
      "get": {
        "responses": { "200": { "description": "ok" } }
      }
    }
  }
}`;

export const CANDIDATE_OPENAPI = `{
  "openapi": "3.0.3",
  "info": { "title": "Billing API", "version": "2.0.0" },
  "paths": {
    "/v1/invoices": {
      "get": {
        "parameters": [
          { "name": "limit", "in": "query", "required": false },
          { "name": "cursor", "in": "query", "required": true }
        ],
        "responses": { "200": { "description": "ok" } }
      },
      "post": {
        "requestBody": { "required": true },
        "responses": { "201": { "description": "created" }, "400": { "description": "bad" } }
      }
    },
    "/v1/invoices/{id}": {
      "get": {
        "parameters": [
          { "name": "id", "in": "path", "required": true }
        ],
        "responses": { "200": { "description": "ok" }, "404": { "description": "missing" } }
      }
    },
    "/v1/customers": {
      "get": {
        "responses": { "200": { "description": "ok" } }
      }
    },
    "/v1/refunds": {
      "post": {
        "requestBody": { "required": true },
        "responses": { "202": { "description": "accepted" } }
      }
    }
  }
}`;
