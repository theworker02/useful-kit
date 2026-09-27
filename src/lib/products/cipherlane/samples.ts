export const CIPHERLANE_SAMPLE = `# application.yaml — demo fixture (synthetic values only)
server:
  port: 8080
  debug: true

database:
  url: http://db.internal.example:5432/app
  username: admin
  password: admin

security:
  jwt_secret: "supersecretvalue12345"
  cors:
    origin: "*"

aws:
  access_key_id: AKIAIOSFODNN7EXAMPLE
  secret_access_key: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"

tls:
  rejectUnauthorized: false

# Placeholder that should NOT alert:
# api_key: "\${API_KEY}"
`;
