class Texture2D<TextureType = ImageBitmap | undefined> {
    private m_id: string;
    private m_src: string;
    private m_img: TextureType;

    public constructor(id: string, src: string) {
        this.m_id = id;
        this.m_src = src;
        this.m_img = undefined as TextureType;
    }

    public get Id(): string {
        return this.m_id;
    }

    public get Src(): string {
        return this.m_src;
    }

    public get TextureBitmap(): TextureType {
        return this.m_img;
    }

    public ContentLoaded(img: TextureType): void {
        this.m_img = img;
    }
}

export default Texture2D;