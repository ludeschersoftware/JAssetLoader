A flexible, promise-tracked asset loading and caching system for web applications.  
Supports **textures**, **audio**, and **JSON** resources out of the box, with extensibility for custom resource types.

---

## ✨ Features

- **Centralized Asset Management** via `AssetLoader`
- **Promise Tracking** with progress monitoring (`loaded`, `failed`, `total`)
- **Automatic Caching**
  - **Weak cache** (GC-friendly, 2+ loads)
  - **Strong cache** (persistent, 4+ loads)
  - Explicit `Cache` mode via `ContentLoadType`
- **Resource Wrappers**
  - `TextureResource` (`ImageBitmap`)
  - `AudioResource` (`AudioBuffer`)
  - `JsonResource<T>` (parsed JSON data)
- **Error Handling** with retrieval via `GetError(id)`
- **Progress & Ready Checks**
- **Memory-Safe Clear** (`Clear()` releases references)

---

## 📦 Installation

```bash
npm install @ludeschersoftware/assetloader
````

Dependencies:

* [`@ludeschersoftware/promise`](https://www.npmjs.com/package/@ludeschersoftware/promise)
* [`@ludeschersoftware/ref`](https://www.npmjs.com/package/@ludeschersoftware/ref)
* [`@ludeschersoftware/utils`](https://www.npmjs.com/package/@ludeschersoftware/utils)

---

## 🚀 Usage

### Initialize

```ts
import AssetLoader from "@ludeschersoftware/asset-loader";

const loader = new AssetLoader();
```

### Load Assets

```ts
// Texture
const texId = loader.LoadTexture("/assets/sprites/hero.png");

// Audio
const sndId = loader.LoadAudio("/assets/sounds/jump.wav");

// JSON
const jsonId = loader.LoadJson("/assets/config/settings.json");
```

### Track Progress

```ts
const { loaded, failed, total } = loader.GetProgress();
console.log(`Progress: ${loaded}/${total}, Failed: ${failed}`);
```

### Retrieve Results

```ts
const texture = loader.GetResource(texId);  // TextureResource
const sound   = loader.GetResource(sndId);  // AudioResource
const config  = loader.GetResource(jsonId); // JsonResource<any>
```

### Handle Errors

```ts
const error = loader.GetError(jsonId);
if (error) console.error("Failed to load JSON:", error);
```

### Clear Resources

```ts
loader.Clear(); // drops references for GC
```

---

## ⚙️ API Reference

### **AssetLoader**

* `Load<T>(id: string, promise: Promise<T>): string`
* `LoadTexture(src: string, type?: ContentLoadType): string`
* `LoadAudio(src: string, type?: ContentLoadType): string`
* `LoadJson<T>(src: string, type?: ContentLoadType): string`
* `GetProgress(): { loaded, failed, total }`
* `GetResult<T>(id: string): T | undefined`
* `GetResource(id: string): AbstractResource<any> | undefined`
* `GetError(id: string): any`
* `GetAllResources(): AbstractResource<any>[]`
* `GetLoadedResources(): AbstractResource<any>[]`
* `IsReady(): boolean`
* `Clear(): void`

### **Loaders**

* `TextureLoader.LoadTexture(src, type)`
* `AudioLoader.LoadAudio(src, type)`
* `JsonLoader.LoadJson(src, type)`

### **Enums**

* `ContentLoadType.Cache` → always weak-cache
* `ContentLoadType.Default` → adaptive caching strategy

---

## ⚠️ Caveats

* **Audio**: some browsers require a user interaction before audio can be decoded (`AudioContext` restriction).
* **GetAllResources**: may include `undefined` for failed loads.
* **Caching**: resources are cached based on `src` hash; different query strings may be treated as unique.

---

## 🔧 Extending

To support a new resource type:

1. Create a subclass of `AbstractLoader<TResource>`.
2. Implement `fetchResource(src: string): Promise<TResource>`.
3. Wrap the result into a custom `Resource` class.
4. Add a `Load<Type>` convenience method.

---

## 📜 License

MIT © Johannes Ludescher