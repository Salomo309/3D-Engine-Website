import Vector3 from "@/libs/base-types/vector3";
import { BufferAttribute } from "../webgl/attribute";

class BufferGeometry {
  public type: number = 0;
  public position: BufferAttribute | undefined;
  public normal: BufferAttribute | undefined;
  public texCoords: BufferAttribute | undefined;
  public width: number = 0;
  public height: number = 0;
  public length: number = 0;
  public smoothShade: boolean = false;

  calculateNormals(forceNewAttribute = false) {
    if (!this.smoothShade) {
      this.calculateNormalsFlat(forceNewAttribute);
    } else {
      console.log("Calculating Smooth shading normals");
      this.calculateNormalsSmooth(forceNewAttribute);
    }
  }

  calculateNormalsFlat(forceNewAttribute = false) {
    const position = this.position;
    if (!position) {
      return;
    }

    let normal = this.normal;
    if (forceNewAttribute || !normal) {
      normal = new BufferAttribute(
        new Float32Array(position.length),
        position.size
      );
    }

    // Triangles, might need to refactor if we implement it the other way
    if (position.length < position.size * 3) {
      throw new Error(
        "Geometry vertices is less than 3, needs at least 3 vertices to calculate the normal of a surface"
      );
    }

    for (let index = 0; index < position.count; index += 3) {
      const vertex1 = new Vector3(position.get(index));
      const vertex2 = new Vector3(position.get(index + 1));
      const vertex3 = new Vector3(position.get(index + 2));

      const vector1 = vertex2.substract(vertex1);
      const vector2 = vertex3.substract(vertex1);

      const vectorN = vector1.cross(vector2);

      normal.set(index, vectorN.getVector());
      normal.set(index + 1, vectorN.getVector());
      normal.set(index + 2, vectorN.getVector());
    }

    this.normal = normal;
  }

  calculateNormalsSmooth(forceNewAttribute = false) {
    const position = this.position;
    if (!position) {
      return;
    }

    let normal = this.normal;
    if (forceNewAttribute || !normal) {
      normal = new BufferAttribute(
        new Float32Array(position.length),
        position.size
      );
    }

    this.calculateNormalsFlat();

    const vertices: Map<number, number[]> = new Map<number, number[]>();
    const vertexList: Vector3[] = [];
    const getIdx = (vector: Vector3) => {
      for (let i = 0; i < vertexList.length; i++) {
        const element = vertexList[i];
        if (element.equals(vector)) {
          return i;
        }
      }
      return -1;
    };

    for (let index = 0; index < position.count; index += 1) {
      const vertex = new Vector3(position.get(index));
      let idx = getIdx(vertex);
      if (idx == -1) {
        idx = vertexList.length;
        vertexList.push(vertex);
      }

      if (!vertices.has(idx)) {
        vertices.set(idx, []);
      }

      // console.log(idx);
      // console.log(vertices);
      // console.log(vertices.get(idx));

      vertices.get(idx)!.push(index);
    }

    vertices.forEach((val, key) => {
      let sum = new Vector3();

      val.forEach((vertNormal) => {
        sum.add(new Vector3(this.normal!.get(vertNormal)));
      });

      sum = sum.multiplyScalar(1 / sum.length());

      val.forEach((vertNormal) => {
        this.normal!.set(vertNormal, sum.getVector());
      });
    });
  }
}

export { BufferGeometry };
