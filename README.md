# TripTide — Personal Trip Planner

TripTide is a responsive travel-planning dashboard built with React, JavaScript, and CSS. It helps you organize trips, create day-by-day itineraries, and keep an eye on estimated activity costs.

## Features
- Create trips with destinations, dates, budgets, and notes
- Add activities with date, time, location, and estimated cost
- Mark itinerary activities complete or remove them
- Search trips and filter by upcoming/past status
- Track activity estimates against each trip budget
- Persist trip data in browser LocalStorage
- Export a JSON backup of your saved trips
- Responsive layout with accessible labels and keyboard focus styles

## Tech stack
- React and React Hooks (`useState`, `useEffect`, `useMemo`)
- JavaScript (ES modules)
- Vite
- CSS
- Browser LocalStorage and Blob download API
- Lucide React icons

## Run locally
Requires a recent Node.js LTS release.

```bash
npm.cmd install
npm.cmd run dev
```

Open the local URL printed by Vite. In PowerShell, `npm.cmd` avoids common execution-policy issues with `npm.ps1`.

## Production build

```bash
npm.cmd run build
npm.cmd run preview
```

## Data and privacy
Trip data is stored in this browser's LocalStorage. It is not sent to a backend. Clearing browser storage removes locally saved trips, so use the JSON export for a backup. Sample trips are included for demonstration.

## Future improvements
- Edit existing trip details
- Import a previously exported JSON backup
- Currency preferences and expense categories
- Map integration and weather forecasts
- Automated unit tests for date, budget, and persistence logic

## Portfolio note
This project is a frontend application with local persistence; it does not currently have a server-side API or account system. Describe the implementation accurately in your portfolio.
