# Ilha Carbon model

This one-page static ERW screening site is built for deployment on Vercel with no build step.

## Status

This is an initial working static model for early-stage screening. It uses a simplified carbon credit model and aims to remain easy to review, test and publish.

## Run locally

```bash
npm install
npm run test
npm run test:e2e
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173`.

## Assumptions

| Item | Default value | Source |
| --- | ---: | --- |
| Creditable tonnes CO2 per tonne rock | 0.20 | user assumption, to be replaced with verified ERW dataset |
| Discount | 20% | user assumption |
| Rock cost | €23/t | user assumption |
| MRV cost | €480/ha | user assumption |
| Fixed MRV cost | €30,000 | user assumption |

## Notes

This project keeps the model math in `model.js` and the content and assumptions in `data.js`.
