A modular and extensible asset loading system for web applications.  
Supports **textures, audio, JSON, and custom resources**, with caching, progress tracking, and error handling.

---

## ✨ Features
- 🔄 **Unified API** – Load textures, audio, and JSON via a single interface.
- 📦 **Caching with WeakRefs** – Prevents memory leaks while retaining frequently used assets.
- 📊 **Progress Tracking** – Monitor loading status (`loaded`, `failed`, `total`).
- 🛠️ **Error Handling** – Retrieve specific errors for failed assets.
- ⚡ **Extensible** – Create custom loaders by extending `AbstractLoader`.

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

### Loading Assets

```ts
import AssetLoader from "@ludeschersoftware/assetloader";
import ContentLoadType from "@ludeschersoftware/assetloader/Enums/ContentLoadType";

const loader = new AssetLoader();

// Load texture
const textureId = loader.LoadTexture("/assets/sprite.png", ContentLoadType.Cache);

// Load audio
const audioId = loader.LoadAudio("/assets/sound.ogg");

// Load JSON
const jsonId = loader.LoadJson("/assets/config.json");
```

---

### Tracking Progress

```ts
const progress = loader.GetProgress();
console.log(progress); 
// { loaded: 2, failed: 0, total: 3 }
```

---

### Accessing Results

```ts
const texture = loader.GetResult(textureId);  // TextureResource | undefined
const audio = loader.GetResult(audioId);      // AudioResource | undefined
const config = loader.GetResult(jsonId);      // JsonResource<any> | undefined
```

---

### Error Handling

```ts
const error = loader.GetError(audioId);
if (error) {
  console.error("Audio failed:", error);
}
```

---

### Resource Queries

```ts
const allResources = loader.GetAllResources();       // All results (may include undefined)
const loadedResources = loader.GetLoadedResources(); // Only successfully loaded resources

if (loader.IsReady()) {
  console.log("All tasks resolved!");
}
```

---

### Clearing

```ts
loader.Clear(); // Removes tracked tasks
```

---

## 🛠️ Creating a Custom Loader

```ts
import AbstractLoader from "@ludeschersoftware/assetloader/Abstracts/AbstractLoader";

class TextLoader extends AbstractLoader<string> {
  protected async fetchResource(src: string): Promise<string> {
    const response = await fetch(src);
    return await response.text();
  }

  public LoadText(src: string) {
    const { id, promise } = this.Load(src);
    return [id, promise.then(text => new TextResource(id, src, text))];
  }
}
```

---

## ⚠️ Notes & Caveats

* `WeakRef` is used for caching. Assets may be garbage-collected if not strongly referenced elsewhere.
* `AudioLoader` uses a **shared AudioContext**. Ensure it’s resumed on user interaction if needed.
* `Clear()` removes tasks but does not cancel ongoing requests.

---

## 📄 License

MIT © Johannes Ludescher