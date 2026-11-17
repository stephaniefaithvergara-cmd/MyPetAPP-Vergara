# My Pet App

A responsive dog-breed explorer built with **React, TypeScript, and Vite**. Choose a breed and fetch a random dog photo using the public [Dog CEO API](https://dog.ceo/dog-api/).

## Features
- Loads the available dog breeds from `https://dog.ceo/api/breeds/list/all`.
- Includes breed and sub-breed choices in one searchable-style native dropdown list.
- Starts with **Shih Tzu** selected when the API provides it.
- Fetches a random photo for the selected breed with `https://dog.ceo/api/breed/{breed}/images/random`.
- Fetches another photo using the refresh button.
- Loading states, API error messages, accessible labels, and responsive layout.

## Requirements
- Node.js 18 or newer
- npm
- Internet connection (the app retrieves live breed data and photos from Dog CEO API)

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

## Verify before submission

```bash
npm run typecheck
npm run build
```

The production files are generated in `dist/`.

## API endpoints used
- All breeds: `GET https://dog.ceo/api/breeds/list/all`
- Random image by breed: `GET https://dog.ceo/api/breed/shih-tzu/images/random`
- Random image by any selected breed: `GET https://dog.ceo/api/breed/{breed}/images/random`

Sub-breeds use the API's two-part route format (for example, `hound/afghan`); the selector displays them as `Hound Afghan`.

## Individual GitHub contribution

This copy is prepared for **stephaniefaithvergara-cmd** (`faithvergara16@gmail.com`). The five suggested commit messages and Git configuration commands are in `docs/CONTRIBUTOR-COMMIT-PLAN.md`. The ZIP contains the project source, not pre-created GitHub commits. Each commit should be made by the contributor after completing the corresponding change.

## Notes
- Dog photos are served by Dog CEO API; an internet connection is required.
- The project does not require a backend, database, API key, or environment variables.
