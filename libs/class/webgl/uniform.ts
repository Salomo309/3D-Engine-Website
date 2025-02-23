import { GLTexture, TypedArray } from "../../base-types/webgl-types";

class BufferUniform {
  private _data: TypedArray | GLfloat | GLint | GLTexture | boolean;
  private _size: number;
  private _dtype: number;

  private _isDirty = true;

  /**
   * Creates an instance of BufferUniform.
   * @param {TypedArray} data Typed array data.
   * @param {number} size Size of each element in the buffer.
   * @param {dtype} dtype Type of for uniform.
   * @memberof BufferUniform
   */
  constructor(
    data: TypedArray | GLfloat | GLint | GLTexture | boolean,
    size: number,
    dtype?: number
  ) {
    this._data = data;
    this._size = size;
    this._dtype = dtype || WebGLRenderingContext.FLOAT;
  }

  // Public get accessor to private properties.
  get data() {
    return this._data;
  }
  get size() {
    return this._size;
  }
  get dtype() {
    return this._dtype;
  }
  get isDirty() {
    return this._isDirty;
  }
  // Public set accessor to private properties.
  // Should toggle isDirty flag to true.
  set data(data: TypedArray | GLfloat | GLint | GLTexture | boolean) {
    this._data = data;
    this._isDirty = true;
  }
  set size(size: number) {
    this._size = size;
    this._isDirty = true;
  }
  set dtype(dtype: number) {
    this._dtype = dtype;
    this._isDirty = true;
  }

  /**
   * Tandai buffer sebagai bersih
   * (tidak perlu di-copy kembali ke GPU)
   *
   * Hanya dipanggil pada attribute setter.
   */
  consume() {
    this._isDirty = false;
  }

  /**
   * Jumlah elemen dalam buffer (elemen = data.length / size).
   */
  get count() {
    if (
      typeof this._data === "number" ||
      this._data instanceof GLTexture ||
      typeof this._data === "boolean"
    ) {
      return 1;
    } else {
      return this._data.length / this._size;
    }
  }

  /**
   * Panjang dari buffer (data.length = elemen * size).
   */
  get length() {
    if (
      typeof this._data === "number" ||
      this._data instanceof GLTexture ||
      typeof this._data === "boolean"
    ) {
      return 1;
    } else {
      return this._data.length;
    }
  }

  set(index: number, data: number[] = []) {
    if (
      typeof this._data === "number" ||
      this._data instanceof GLTexture ||
      typeof this._data === "boolean"
    ) {
      this._data = index;
    } else {
      this._isDirty = true;
      // Set elemen[index] dengan data (data.length == this._size)
      // Jangan lupa untuk menyesuaikan dengan offset dan stride.
      index *= this._size;
      for (let i = 0; i < this._size; i++) {
        this._data[index + i] = data[i];
      }
    }
  }

  get(index: number = 0, size?: number) {
    if (typeof this.data === "number") {
      return this._data;
    } else {
      index *= this._size;
      if (!size) size = this._size;
      const data: number[] = [];

      // Ambil elemen[index] ke data (data.length == size)
      // Jangan lupa untuk menyesuaikan dengan offset dan stride.
      for (let i = 0; i < size; i++) {
        data.push((this._data as TypedArray)[index + i]);
      }
      return data;
    }
  }
}

export { BufferUniform };
