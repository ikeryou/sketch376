import vt from '../glsl/face.vert';
import fg from '../glsl/face.frag';
import { Mesh } from 'three/src/objects/Mesh';
import { Color } from 'three/src/math/Color';
import { Vector2 } from 'three/src/math/Vector2';
import { DoubleSide } from 'three/src/constants';
import { MyObject3D } from "../webgl/myObject3D";
import { SphereGeometry } from 'three/src/geometries/SphereGeometry';
import { RawShaderMaterial } from 'three/src/materials/RawShaderMaterial';
import { UniformsUtils } from 'three/src/renderers/shaders/UniformsUtils';
import { UniformsLib } from 'three/src/renderers/shaders/UniformsLib';
import { Util } from '../libs/util';
import { Conf } from '../core/conf';

export class Face extends MyObject3D {

  private _id: number
  private _mesh: Mesh;

  constructor(id: number, geo: SphereGeometry) {
    super();

    this._id = id;
    console.log(this._id);

    const uni = {
      color:{value: new Color(0x000000)},
      light:{value: Util.instance.randomArr(Conf.instance.COLOR).clone()},
      glossiness:{value: 400},
      weight:{value: 0.1},
      colorA:{value: new Color(0x333333)},
      colorB:{value: Util.instance.randomArr(Conf.instance.COLOR).clone()},
      pA:{value: new Vector2(0, 0)},
      pB:{value: new Vector2(0, 0)},
      pC:{value: new Vector2(0, 0)},
    }

    this._mesh = new Mesh(
      geo,
      new RawShaderMaterial({
        vertexShader:vt,
        fragmentShader:fg,
        transparent: true,
        depthTest: false,
        side: DoubleSide,
        lights:true,
        uniforms:UniformsUtils.merge([
          UniformsLib.lights,
          uni,
        ])
      })
    );
    this.add(this._mesh);
    // this._mesh.position.y = 0.5;
  }

  public setOneColor(color: Color):void {
    const uni = this._getUni(this._mesh);
    uni.colorA.value = color;
    uni.colorB.value = color;
  }

  protected _update():void {
    super._update();

    // const p = Util.instance.map(Math.sin(this._id * 0.01 + this._c * 0.05), 0, 1, -1, 1);
    const p = 1;

    const uni = this._getUni(this._mesh);
    uni.pA.value.set(0, p);
    uni.pB.value.set(1, 1 - p);
    uni.pC.value.set(0, p);
    // uni.weight.value = Util.instance.map(Param.instance.scrollRate, 0.01, 0.3, 0, 1);
    uni.weight.value = 0.015;
  }
}