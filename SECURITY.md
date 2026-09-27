# Security Policy

## Supported demos

North Harbor Studio demos are local-first. No authentication service is bundled. Do not deploy this repository to the public internet as a multi-tenant service without adding auth, rate limits, and data handling controls.

## Cipherlane / secret handling

- Cipherlane performs **client-side** pattern analysis for defensive hygiene demos.
- Use **synthetic** fixtures only in the hosted demo UI.
- If you run Cipherlane against real repositories in a future CI integration, treat findings as sensitive and rotate exposed credentials immediately.

## Reporting a vulnerability

Email the maintainer via GitHub security advisories on the repository (preferred) or open a private security advisory. Please include:

1. Affected product/path  
2. Reproduction steps  
3. Impact assessment  
4. Any suggested fix  

We aim to acknowledge reports within 5 business days.

## Non-goals

This project will not assist with offensive credential harvesting, unauthorized access, or bypassing security controls.
