# Current behavior

Application code described here is `main` at `0e281e1` (2025-08-12), "chore: add aces.json metadata". This file was written from that source, the npm scripts, the workflow, and a GitHub Pages API read on 2026-10-14. The app was not started and the test script was not run for this note.

## Screens

`src/App.tsx` keeps one `activeTab`: `chores`, `rewards`, `progress`, or `settings`. Tab buttons are in `src/components/TabNavigation.tsx`.

Fresh state, when `localStorage` has no `choreChartState`:

- Child user `Esmé` and parent user `Jordan`. `currentUser` is `Esmé`. `isParentMode` is `false`.
- One chore per child for each template in `DEFAULT_CHORES`. With the default users that is eight chores, all `category: 'daily'` and `requiresApproval: true`.
- Rewards copied from `DEFAULT_REWARDS` (13 items), `isActive: true`, `currentUses: 0`.

Default chores (`src/data/constants.ts`): Tidy Bedroom (5), Clear the Dinner Table (3), Take out Rubbish (4), Pack Own School Bag (3), Get Self Dressed (2), Make Bed (3), Unload the Dishwasher (4), Feed the Pets (3). Points are `defaultOwlPoints`.

Default rewards: Cinema (50, `Cinemagicus!`), Pizza Night (30, `Pizzario!`), Stay Up Late (25, `Nocturnus Extendus!`), Extra Screen Time (20, `Pixelis Maxim!`), Playdate (40, `Amicus Summonum!`), Golf Trip (60, `Golfaricus Driveus!`), Swimming (35, `Aqua Splashium!`), Baking (25, `Bakerus Delicious!`), Soft Play (45, `Bounceus Maximus!`), Pudding (15, `Puddi Yum-Yum!`), Chocolate/Sweets (10, `Chocoluxia Treatum!`), Toy Shop (80, `Toyboxium Acquirus!`), Trampoline Park (55, `Bouncicus Elevatum!`). Costs are `defaultOwlCost`.

## Chores

The chores screen lists chores whose `userId` equals `currentUser.id`. The heading is "Daily Chores". Category is a label on the card. The list is not split by `daily`, `weekly`, or `custom`. Filters are All, Pending (`isCompleted === false`), and Completed.

**Complete Chore** is rendered when `currentUser.role` is `child`, the chore is not completed, and there is no unapproved `choreCompletions` row for that chore and user. **Cancel Pending** removes that unapproved row. A separate "Waiting for approval" label renders only when `requiresApproval` is true, `isCompleted` is true, and `isApproved` is false. The child submit path leaves `isCompleted` false, so that label is not shown for a newly submitted chore.

`completeChore` in `src/App.tsx`:

- Returns a warning when `lastCompletedDate` is the same calendar day.
- If the last completion date is yesterday, awarded owls are `max(1, floor(owlPoints * 0.7))`. The card copy for that case is "70% owls (recently completed)".
- If `requiresApproval` is true and `currentUser.role` is `child`, it appends a `choreCompletions` row with `isApproved: false` and leaves the chore incomplete. `lastCompletedDate` is set later, on approval or on the auto-approve path.
- Otherwise it marks the chore completed, sets `streak` to `chore.streak + 1` when the last completion was yesterday and to `1` otherwise, and adds the owls to that user. `currentStreak` and `longestStreak` become `max` of the previous user value and the chore streak.

The add-chore form defaults `requiresApproval` to `false`. Seeded chores set it to `true`. Saving a new chore creates one copy per user with `role: 'child'`, each with a new id. Adding a child later does not backfill chores for that child.

Parent mode shows add, edit, delete, and **Reset Daily**. Edit updates one chore id (name, description, owl points, `requiresApproval`). Delete removes that id after `window.confirm`. **Reset Daily** clears `isCompleted`, `completedAt`, `completedBy`, `isApproved`, and `lastCompletedDate` on every chore in state.

## Rewards

The rewards screen is titled "Owl Store". Inactive rewards are omitted. Filters are All, Affordable, Expensive, plus a category select: `all`, `entertainment`, `food`, `activities`, `privileges`, `custom`.

**Cast Spell** is shown for a child when the reward is active. It is disabled when `totalOwlPoints` is below `owlCost`. `redeemReward` subtracts the cost, increments `currentUses`, appends a redemption, and shows `SpellAnimation` for 3 seconds. The spell object it passes always uses `animation: 'sparkle'`. Each reward has its own `spell` and `spellDescription` strings.

`Reward.maxUses` is optional. The card shows a usage bar when it is set. `redeemReward` does not read `maxUses`. The add-reward form does not set `maxUses`. The edit form can set it.

Parent mode can add, edit, delete, and toggle `isActive`. A blank spell becomes `` `${name}us!` ``.

## Parent mode and approvals

The header button toggles `isParentMode`. It does not change `currentUser`. Settings, chore edits, and reward edits check `isParentMode`.

The header user switcher renders when there is more than one child, and its options are the child users. `parentUsers` is computed in `src/components/Header.tsx` and is not rendered. Default data has one child, so the switcher is not rendered.

Settings, including the approvals list, render when `isParentMode` is true. `approveChoreCompletion` returns immediately unless `currentUser.role` is `parent`. On approve it marks the completion and chore approved, sets `lastCompletedDate`, and adds owls and `completedChores` on the child user record. It does not update `currentStreak` or `longestStreak`. On reject it removes the completion row.

The Settings user **Edit** button calls `setEditingUser`. That state is never read, and no user-edit form is rendered. Users can be added (child or parent) and deleted while more than one user remains. If the deleted user is current, `currentUser` is set to `prev.users[0]` from the list before the filter.

## Progress

The progress screen uses the current user. The week starts Monday (`weekStartsOn: 1`) and shows completion count, owls earned, and owls spent, plus a seven-day grid.

Overall statistics display `currentUser.completedChores`, `currentUser.currentStreak`, `currentUser.longestStreak`, and earned owls divided by that user's completion count. `ProgressTracker` also computes a streak from completion dates and stores it on `stats.currentStreak`. The overall card does not read `stats.currentStreak`.

Achievements shown from user fields:

| Name | Condition |
| --- | --- |
| Getting Started | `completedChores >= 10` |
| Chore Champion | `completedChores >= 50` |
| Master Helper | `completedChores >= 100` |
| Week Warrior | `currentStreak >= 7` |
| Streak Master | `currentStreak >= 30` |
| Owl Collector | `totalOwlPoints >= 100` |

The owl summary shows `earnedOwlPoints`, `spentOwlPoints`, and `totalOwlPoints`.

## Settings that do not change app state

Appearance says "Theme customization coming soon!" and renders checkboxes with `defaultChecked`. Those inputs are not stored.

Notification and sound checkboxes are the same: uncontrolled, and not read by `addNotification`. Notices in the app are `NotificationToast` records created in `src/App.tsx`. `react-hot-toast`'s `Toaster` is mounted, and `toast()` is not called.

`SOUND_EFFECTS` in `src/data/constants.ts` names mp3 files. Those files are not in the repo. `use-sound` is not imported under `src/`.

General settings can export `appState` as `chore-chart-backup-YYYY-MM-DD.json`, replace state from a chosen JSON file, or remove `choreChartState` and reload. Import uses `JSON.parse` and `setAppState` with no further shape check. The version line on that screen is the literal `1.0.0`, matching `package.json`.

## Persistence

Every `appState` change is `JSON.stringify`'d into `localStorage` key `choreChartState`. Load is `JSON.parse` with no conversion of date strings back into `Date` objects. `date-fns` `format` and date comparisons in `src/App.tsx`, `ChoreCard.tsx`, and `ProgressTracker.tsx` receive those values after a reload. This note does not record a runtime result for that round trip.

## Other files

- `public/index.html` loads Fredoka from `fonts.googleapis.com` and references `logo192.png`, which is not in `public/`.
- `public/favicon.ico` is 0 bytes. `public/manifest.json` lists that icon.
- `aces.json` is `{ "status": "Idea", "progress": 0, "previewUrl": "https://github.com/Jordan-Ryan/magical-chore-tracker" }`. The app does not import it.
- There is no `LICENSE` file.
