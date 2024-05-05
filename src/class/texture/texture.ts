export class Texture{
  // TODO: Review this note, might be a better way to improve it
  // Note: After the initial use of a texture, its dimensions, format, and type cannot be changed.

  // This is internal and really should not be changed outside of texture or texture loader
  private static idAutoIncrement: number = 0;
  public readonly id: number;
  
  // TODO: Review whether this is necessary or not
  public glTexture: WebGLTexture | null = null;
  public isActive: boolean;
  
  public name: string="";
  public wrapS: GLenum = WebGLRenderingContext.CLAMP_TO_EDGE;
  public wrapT: GLenum = WebGLRenderingContext.CLAMP_TO_EDGE;
  public magFilter: GLenum = WebGLRenderingContext.LINEAR;
  public minFilter: GLenum = WebGLRenderingContext.LINEAR_MIPMAP_LINEAR;
  public format: GLenum = WebGLRenderingContext.RGBA;
  public image: HTMLImageElement | null = null;
  public repeatS: number = 1;
  public repeatT: number = 1;

  constructor(options?: {
    image?: HTMLImageElement, 
    wrapS?: GLenum, 
    wrapT?: GLenum
    magFilter?: GLenum
    minFilter?: GLenum
  }){
    this.isActive = false;

    this.id = Texture.idAutoIncrement++;
    this.wrapS = options?.wrapS || WebGLRenderingContext.CLAMP_TO_EDGE;
    this.wrapT = options?.wrapT || WebGLRenderingContext.CLAMP_TO_EDGE;
    this.magFilter = options?.magFilter || WebGLRenderingContext.NEAREST;
    this.minFilter = options?.minFilter || WebGLRenderingContext.NEAREST;
    this.image = options?.image || null
  }

  public activate() {
    this.isActive = true;
  }

  public setRepeatT(t: number) : Texture{
    if(this.isActive == true){
      console.error("Texture already been used");
      return this;
    }

    this.wrapT = WebGLRenderingContext.REPEAT;
    this.repeatT = t;
    return this;
  }

  public setRepeatS(s: number) : Texture{
    if(this.isActive == true){
      console.error("Texture already been used");
      return this;
    }

    this.wrapS = WebGLRenderingContext.REPEAT;
    this.repeatT = s;
    return this;
  }

  public setOptions(options: {
    image?: HTMLImageElement, 
    wrapS?: GLenum, 
    wrapT?: GLenum
    magFilter?: GLenum
    minFilter?: GLenum
  }) : Texture{
    if(this.isActive == true){
      console.error("Texture already been used");
      return this;
    }
    
    this.wrapS = options.wrapS || this.wrapS;
    this.wrapT = options.wrapT || this.wrapT;
    this.magFilter = options.magFilter || this.magFilter;
    this.minFilter = options.minFilter || this.minFilter;
    this.image = options.image || this.image
    return this;
  }

  //TODO: Implement
  public toJson(){
      throw new Error("not Implemented");
  }
}