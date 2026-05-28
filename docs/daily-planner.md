# Daily Planner & Routines

The Daily Planner represents how the player manages their passive time throughout the week. It shifts the game away from micro-managing every hour and towards macro-level lifestyle design.

## 1. Routine Slots
The player's week is divided into 7 days, with 3 main slots per day (Morning, Afternoon, Evening). 
Instead of manually choosing what to do in every slot every day in real-time, the player can assign **Routines** to these slots.

## 2. Routine Tracking
The `tracker` inside `routineReducer` counts how many times a routine was successfully executed during the current week:
```json
{
  "routineId": "gym_workout",
  "count": 3
}
```

## 3. Stat & Need Generation
Routines automatically consume Time and Energy while generating Stats and Mood.
- **Gym Workout**: -15 Energy, +2 Fitness, +5 Mood.
- **Office Job**: -25 Energy, +$50, -10 Mood.

If the player does not have enough Energy to complete a scheduled routine, the routine is skipped, preventing soft-locks but sacrificing the expected gains for that day.

## 4. Synergy with Social Systems
Routines indirectly affect relationship potential:
1. **Financial Pressure:** You need money for dates and housing. Routines are the primary source of steady income.
2. **Stat Requirements:** Many dialogue and date choices require specific stat thresholds (e.g., `charisma >= 30`). Routines build these stats passively over time.
3. **Availability:** If you are at work all evening, you cannot schedule an evening date without overriding your routine and losing that income.
