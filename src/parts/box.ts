import { Util } from "../libs/util";
import { MyObject3D } from "../webgl/myObject3D";
import { Face } from './face';
import { Vector3 } from 'three/src/math/Vector3';
import { SphereGeometry } from 'three/src/geometries/SphereGeometry';

export class Box extends MyObject3D {

  private _id: number;
  private _face: Array<Face> = [];
  private _size: Vector3 = new Vector3();
  private _allSize: Vector3 = new Vector3();

  get allSize(): Vector3 {
    return this._allSize;
  }

  constructor(id: number, geo: SphereGeometry) {
    super();

    this._id = id;
    console.log(this._id);

    for(let i = 0; i < 2; i++){
      const f = new Face(i, geo);
      this.add(f);
      this._face.push(f);
    }
  }

  public setBoxSize(w: number, h: number, d: number):void {
    this._size.set(w, h, d);
  }

  protected _update():void {
    super._update();

    // this.rotation.y += 0.05;
    // this.rotation.y = Util.instance.radian(90);

    const w = this._size.x;
    const h = this._size.y;
    const d = this._size.z;

    const ang = Math.sin(this._id * 0.01 + this._c * 0.01) * 40;
    // const ang = 20;

    this._face.forEach((val,i) => {
      val.scale.set(w, h, d);

      val.rotation.x = Util.instance.radian(ang * (i % 2 == 0 ? 1 : -1));

      const offset = 1
      // val.position.y = (h * offset) * Math.cos(Util.instance.radian(ang)) * i;
      val.position.z = (h * offset) * Math.sin(Util.instance.radian(ang)) * (i % 2 != 0 ? 1 : 0);

      if(i == this._face.length - 1) {
        this._allSize.y = val.position.y + (h * Math.cos(Util.instance.radian(ang)) * (i + 1))
      }
    });
  }
}