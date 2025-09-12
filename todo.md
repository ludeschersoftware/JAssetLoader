### ⚠️ Issues & Improvements

1. **Return types in `GetAllResources()` & `GetLoadedResources()`**

   * They are typed as `AbstractResource<any>[]`, but `entry.Result` is not guaranteed to be an `AbstractResource` (e.g., could be raw `ImageBitmap`).
   * Suggestion: enforce wrapping *all results* into `AbstractResource` subclasses (as you already do in loaders) — otherwise type mismatch risk.

2. **`GetResource<TResource>()` unsafe cast**

   ```ts
   return this.m_tasks.get(id) as TResource | undefined;
   ```

   * This bypasses type safety — `TrackedPromise` is not the same as `AbstractResource`.
   * Suggestion: unwrap only when `Status === Fulfilled` and ensure `Result` is an `AbstractResource`.

3. **`WeakRef` usage edge case**

   * GC may clear cached resources unpredictably. If a resource is needed frequently, it could disappear between loads.
   * Suggestion: maybe provide a **“strong cache” mode** for critical assets.

4. **AudioLoader lifecycle**

   * `AudioContext` is a static singleton. This is fine for most cases, but in some browsers it can only be resumed from a user action. If multiple `AudioLoader` instances exist, they’ll share one context — might be good or problematic depending on use case.

5. **Clear behavior**

   * `Clear()` wipes `m_tasks`, but doesn’t reset `m_pool`. This means pending promises are still being tracked in `m_pool`.
   * Suggestion: add `this.m_pool.Clear()` (if supported) to fully reset.

6. **Naming**

   * `Load()` is overloaded with different semantics (`Load`, `LoadTexture`, etc.). It’s intuitive but a bit misleading because `Load()` takes an ID + promise, while specialized ones construct both.
   * Suggestion: rename `Load()` → `TrackPromise()` or similar.