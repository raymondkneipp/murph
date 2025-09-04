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

---

## 6️⃣ Optional Enhancements

* [ ] **Murph leaderboard**:

  * Daily/weekly/monthly top times
  * Optional anonymized public leaderboard
* [ ] **Workout notes**:

  * Users can log tips or feelings for each Murph
* [ ] **Export / Share feature**:

  * Share workout stats to social media or as image summary
* [ ] **Theming / Logo**:

  * Implement SVG logos and app branding (we have logo pack ready)

---

## ✅ Suggested Implementation Order

1. Core workout schema + local storage + progress tracking (most important).
2. Workout UI with start/pause/resume + visualization.
3. User accounts/login + optional remote storage.
4. Social features: follow/search + feed + privacy controls.
5. Streaks, milestones, charts, and gamification.
6. Optional enhancements (leaderboards, notes, sharing).
7. Branding, logos, and final theming.

---

## 📱 Core Pages / Views

### 1. **Auth**

* `Login / Signup`
* `Forgot Password` (optional, but nice to have)
* Social login? (Google/Apple) if you want lower friction

---

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

---

### 7. **Settings**

* Edit profile (name, username, profile pic)

---

## 🏗 Suggested Structure (routes-ish)

```
/login
/signup
/feed              // global or segmented tabs (Global | Following)
/workout/new       // start or log a Murph
/workout/:id       // detail view of one logged workout
/profile/me        // my private profile
/profile/:username // public profile
/search            // find friends
/settings
```

---

## 🌟 Optional / Nice-to-Haves

* **Badges page:** achievements (streaks, PRs, volume milestones).

# TODO
- setup better id rather than auto inc
- persist murph when refresh or exiting app
- run murph without account
- user public profile
- click on murph item to view user
- global murphs infinite query
- search for users
- invite users
- badges
