# 🏋️ Murph Workout App – Actionable Checklist

## 1️⃣ Core Workout Tracking

**Objective:** Let users log their Murph workouts and resume if interrupted.

* [ ] Implement **state persistence**:

  * Local storage (for immediate save & resume)
  * Optionally, remote database for logged-in users.
* [ ] Auto-save workout progress every few reps or seconds.
* [ ] Restore saved workout if user reloads or navigates away.

## 4️⃣ Social Features

**Objective:** Encourage community and engagement.

* [ ] Implement **search and follow** system.
* [ ] Design **user feed**:

  * Followers’ recent Murphs
  * Optional global feed (top performers)
* [ ] Privacy controls:

  * Public / followers-only / private workouts
* [ ] Implement **comments/encouragements** on workouts.
* [ ] Optional: notifications when a followed user completes a workout.

---

## 5️⃣ Progress & Gamification

* [ ] Visualize progress:

  * Charts/graphs for reps over time
  * Personal best leaderboard
* [ ] Badges/avatars/gear for achievements (weighted vest milestones, streaks).

### 2. **Feed**

* **Global Feed** 🌍 (all users’ Murph logs; can be disabled if traffic is huge)
* **Following Feed** 👥 (only workouts from people I follow)

💡 You can A/B test **“Follow system” vs “Mutual Friends”**:

* **Follow model (like Twitter/Strava):** One-way, lower friction, better for scale.
* **Friend confirm (like FB):** Two-way, better for small close-knit communities.
  👉 I’d start with **Follow-based**, easier to implement, and fits fitness apps.

---

### 3. **Profile**

* **My Profile (private view)**

  * History chart (timeline graph of Murph times)
* **Other User Profile (public view)**

  * Show their Murph logs (or at least summary)
  * Option to follow/unfollow

---

### 5. **Search & Discovery**

* Search users by name/username
* See suggested athletes (most active, near your location, etc.)
* Quick action: Follow from search results

---

### 6. **Analytics / Insights**

* Charts:

  * Murph completion times over time 📈
* Maybe achievements/badges (e.g., “10 Murphs Club”)

## 🌟 Optional / Nice-to-Haves

* **Badges page:** achievements (streaks, PRs, volume milestones).

# TODO
- run murph without account
- user public profile
    - click on murph item to view user
- global murphs infinite query
- search for users
- invite users
- badges
