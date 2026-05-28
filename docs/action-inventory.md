# Action Inventory

This inventory maps UI/store actions to reducer domains.

## Time reducer
ADVANCE_TIME, DECAY_NEEDS, PROCESS_WEEKLY_BILLS, PROCESS_MONTHLY_BILLS, CHECK_COLLAPSE, CHECK_EVICTION

## Inventory reducer
BUY_ITEM, PLACE_FURNITURE, STORE_FURNITURE, TAKE_SUPPLEMENTS, UPGRADE_HOUSING, BUY_ASSET, SELL_ASSET, PAY_TAXES

## Social reducer
CHANGE_RELATIONSHIP, SWIPE_NPC, ANSWER_DIALOGUE, GO_ON_DATE, RESOLVE_DATE_EVENT, RESOLVE_STORY_EVENT, PROPOSE_MARRIAGE, ASK_TO_MOVE_IN, COMPLETE_WEDDING, SELECT_PARENTING_CHOICE, REDUCE_CHILD_STRESS, BEGIN_LEGACY, SUBSCRIBE_PREMIUM, CANCEL_PREMIUM, UPDATE_SWIPE_PREFERENCES, INSTANT_MATCH, RESOLVE_NPC_ALERT

## Action reducer
PERFORM_ACTION, SLEEP, COOK_MEAL, DINE_OUT, SHOWER, PAY_BILLS, TOGGLE_HEALTH_INSURANCE, WATCH_TV, VISIT_HOSPITAL, TRAVEL

## Social media reducer
POST_SIMSTAGRAM, ADD_SIMSTAGRAM_BUFF

## Career reducer
START_PROJECT, WORK_ON_PROJECT, RESOLVE_WORK_EVENT, ENROLL_COURSE, STUDY_COURSE, TAKE_GIG, WORK_SIDE_HUSTLE, SWITCH_TRACK, USE_ABILITY

## Notes
- Unknown action types produce a development warning from `gameReducer`.
- Store actions dispatch into mapped reducer cases except deprecated compatibility shims that intentionally return `false` without dispatching.
- `GIVE_GIFT` is intentionally absent from active reducers. The legacy `giveGift` shim may remain only as a no-op compatibility surface and must not change relationships, consume items, or create shopping-based romance progress.
- Inventory can be validated via `npm run audit:actions`.

## Relationship memory rule
dates intentionally does not include a typical visual-novel gift-giving system. Relationship progress should come from shared time, meaningful choices, remembered context, compatibility, dates, routines, conflict/repair, and long-term follow-through. Items may appear as contextual story props, but they must not function as repeatable affection currency.
