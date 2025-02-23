import { Color } from "@/libs/base-types/color";
import { WebGLRenderer } from "../webgl-renderer";
import { GLTexture } from "@/libs/base-types/webgl-types";
import { BufferUniform } from "../webgl/uniform";

export class Texture {
  // TODO: Review this note, might be a better way to improve it
  // Note: After the initial use of a texture, its dimensions, format, and type cannot be changed.

  // This is internal and really should not be changed outside of texture or texture loader
  private static idAutoIncrement: number = 0;
  public readonly id: number;
  public registeredRenderers: Map<WebGLRenderer, BufferUniform> = new Map<
    WebGLRenderer,
    BufferUniform
  >();
  // public glTexture: BufferUniform | undefined;

  public image?: HTMLImageElement;
  public name: string = "";
  public wrapS: GLenum = WebGLRenderingContext.CLAMP_TO_EDGE;
  public wrapT: GLenum = WebGLRenderingContext.CLAMP_TO_EDGE;
  public magFilter: GLenum = WebGLRenderingContext.LINEAR;
  public minFilter: GLenum = WebGLRenderingContext.LINEAR_MIPMAP_LINEAR;
  public format: GLenum = WebGLRenderingContext.RGBA;
  public image_path: string = "";
  public repeatS: number = 1;
  public repeatT: number = 1;
  public generateMipmaps: boolean = false;

  constructor(options?: {
    image?: HTMLImageElement;
    wrapS?: GLenum;
    wrapT?: GLenum;
    magFilter?: GLenum;
    minFilter?: GLenum;
    format?: GLenum;
    repeatS?: number;
    repeatT?: number;
    generateMipmaps?: boolean;
  }) {
    this.id = Texture.idAutoIncrement++;
    this.wrapS = options?.wrapS || WebGLRenderingContext.CLAMP_TO_EDGE;
    this.wrapT = options?.wrapT || WebGLRenderingContext.CLAMP_TO_EDGE;
    this.magFilter = options?.magFilter || WebGLRenderingContext.NEAREST;
    this.minFilter = options?.minFilter || WebGLRenderingContext.NEAREST;
    this.format = options?.format || WebGLRenderingContext.RGBA;
    this.repeatS = options?.repeatS || 1;
    this.repeatT = options?.repeatT || 1;
    this.image = options?.image;
    this.generateMipmaps = options?.generateMipmaps || false;
  }

  public unregister(renderer: WebGLRenderer) {
    const data = this.registeredRenderers.get(renderer);
    if (!data) return;
    renderer.gl.deleteTexture((data.data as GLTexture).webGLTexture);
  }
  public setRepeatT(t: number): Texture {
    this.wrapT = WebGLRenderingContext.REPEAT;
    this.repeatT = t;
    return this;
  }

  public setRepeatS(s: number): Texture {
    this.wrapS = WebGLRenderingContext.REPEAT;
    this.repeatT = s;
    return this;
  }

  public setOptions(options: {
    image?: HTMLImageElement;
    wrapS?: GLenum;
    wrapT?: GLenum;
    magFilter?: GLenum;
    minFilter?: GLenum;
  }): Texture {
    this.wrapS = options.wrapS || this.wrapS;
    this.wrapT = options.wrapT || this.wrapT;
    this.magFilter = options.magFilter || this.magFilter;
    this.minFilter = options.minFilter || this.minFilter;
    this.image = options.image || this.image;
    return this;
  }

  public get(renderer: WebGLRenderer) {
    return this.registeredRenderers.get(renderer);
  }

  public load(renderer: WebGLRenderer, unit: number) {
    // if (this.glTexture != null)
    //   renderer.gl.deleteTexture(
    //     (this.glTexture.data as GLTexture).webGLTexture
    //   );

    // const glTexture = new GLTexture(unit, renderer.gl.createTexture()!);
    // this.glTexture = new BufferUniform(glTexture, 1);
    // renderer.gl.bindTexture(
    //   renderer.gl.TEXTURE_2D,
    //   (this.glTexture!.data as GLTexture).webGLTexture
    // );

    let textureData = this.registeredRenderers.get(renderer);
    if (this.registeredRenderers.get(renderer) == null) {
      const glTexture = new GLTexture(unit, renderer.gl.createTexture()!);
      this.registeredRenderers.set(renderer, new BufferUniform(glTexture, 1));
      textureData = this.registeredRenderers.get(renderer);
    }

    renderer.gl.bindTexture(
      renderer.gl.TEXTURE_2D,
      (textureData!.data as GLTexture).webGLTexture
    );

    if (this.image != null) {
      renderer.gl.texParameteri(
        renderer.gl.TEXTURE_2D,
        renderer.gl.TEXTURE_WRAP_S,
        this.wrapS
      );
      renderer.gl.texParameteri(
        renderer.gl.TEXTURE_2D,
        renderer.gl.TEXTURE_WRAP_T,
        this.wrapT
      );
      renderer.gl.texParameteri(
        renderer.gl.TEXTURE_2D,
        renderer.gl.TEXTURE_MIN_FILTER,
        this.minFilter
      );
      renderer.gl.texParameteri(
        renderer.gl.TEXTURE_2D,
        renderer.gl.TEXTURE_MAG_FILTER,
        this.magFilter
      );

      renderer.gl.texImage2D(
        renderer.gl.TEXTURE_2D,
        0,
        this.format,
        this.format,
        renderer.gl.UNSIGNED_BYTE,
        this?.image
      );
    } else {
      renderer.gl.texImage2D(
        renderer.gl.TEXTURE_2D,
        0,
        renderer.gl.RGBA,
        1,
        1,
        0,
        renderer.gl.RGBA,
        renderer.gl.UNSIGNED_BYTE,
        new Uint8Array(Color.WHITE.get())
      );
    }
  }

  //TODO: Implement
  public toJson(): string {
    return JSON.stringify({
      name: this.name,
      wrapS: this.wrapS,
      wrapT: this.wrapT,
      magFilter: this.magFilter,
      minFilter: this.minFilter,
      format: this.format,
      image: this.image,
      repeatS: this.repeatS,
      repeatT: this.repeatT,
    });
  }

  public static fromJson(json: string): Texture {
    const texture = JSON.parse(json);
    return new Texture({
      image: texture?.image,
      wrapS: texture?.wrapS,
      wrapT: texture?.wrapT,
      magFilter: texture?.magFilter,
      minFilter: texture?.minFilter,
      format: texture?.format,
      repeatS: texture?.repeatS,
      repeatT: texture?.repeatT,
    });
  }
}
