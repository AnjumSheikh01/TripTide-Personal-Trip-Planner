# TripTide — Interview Preparation

## Explain the project in 30–45 seconds
TripTide is a responsive trip-planning dashboard built with React. Users can create trips, set dates and budgets, add timed activities to a day-by-day itinerary, mark plans complete, search saved trips, and export a JSON backup. Trip data persists in LocalStorage, so the app works without a backend. The project gave me practice with React state, derived UI, form validation, date handling, browser storage, and responsive CSS.

## Technical questions

### 1. Why React?
React makes it easier to split a complex interface into reusable components and update the UI from state. This version keeps components in one file for a compact starter project; a next refactor could extract `TripCard`, `Itinerary`, `ActivityRow`, and `BudgetPanel`.

### 2. What is the difference between state and derived data?
State stores source values that can change, such as trips and the selected trip. Derived data, such as total planned costs or filtered trips, is calculated from source state. Avoiding duplicate state reduces synchronization bugs.

### 3. How does LocalStorage persistence work?
On initialization, the app attempts to parse saved JSON from `localStorage`. A `useEffect` writes the current trips back whenever the trip array changes. LocalStorage stores strings, so `JSON.stringify` and `JSON.parse` are used.

### 4. What are the limitations of LocalStorage?
It is browser-specific, synchronous, limited in size, and not appropriate for secrets or sensitive data. It does not provide accounts, cross-device sync, or server backups.

### 5. How is the budget percentage calculated?
`spent / budget * 100`, clamped to 100 for the progress bar. The displayed remaining amount is `max(0, budget - spent)`. A production app might also display the over-budget amount separately instead of showing negative remaining funds.

### 6. How do you calculate trip duration?
The code parses date-only strings at midday, subtracts the timestamps, converts milliseconds to days, rounds, and adds one because both start and end dates count as trip days.

### 7. Why use `useMemo`?
The filtered trips list depends on trips, search query, and filter. `useMemo` avoids recalculating it on renders where those dependencies have not changed. For a small list this is not essential, but it demonstrates derived state.

### 8. How is form validation handled?
Required fields use HTML validation. The app also checks that the end date is not before the start date. More complex validation could be moved into a dedicated schema or validation function.

### 9. How does JSON export work?
The app serializes trip state into JSON, creates a Blob, creates a temporary object URL, triggers a download through an anchor, and revokes the object URL afterward.

### 10. What would you improve next?
Split the UI into smaller components, add edit/import flows, test date and budget helpers, use a date library if date rules grow, add automated tests, and eventually introduce an API/database if accounts and multi-device sync are required.

## Non-technical questions

### Why did you build it?
I wanted to build a practical interface that solves a familiar planning problem and lets me practise more than static page design.

### What was challenging?
Keeping trip data, selected trip/day, activity forms, and derived budget values consistent. The approach is to keep a clear source-of-truth state and calculate totals from it.

### What would you do differently?
I would define the data model and component boundaries first, then implement the core flows and write tests around date validation and cost calculations before polishing the interface.

### How did you make it responsive?
The layout uses CSS Grid and Flexbox with breakpoints that adapt the sidebar, trip cards, statistics, itinerary, and modal forms to smaller screens.

## Before the interview
Run through the code yourself. Be able to explain the `useEffect` LocalStorage sync, `addTrip`, `addActivity`, `toggleActivity`, date helpers, and budget calculations without reading the answers word-for-word.
