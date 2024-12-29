import type { Viewer } from "cesium";
import * as Cesium from "cesium";

class Scene {
  viewer: Viewer;

  constructor(wiewer: Viewer) {
    this.viewer = wiewer;
  }
  

  // 飞向位置
  public fitTo(position: number[]) {
    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        position[0],
        position[1] - 0.002,
        position[2] + 400
      ),
      // destination:Cesium.Cartesian3.fromDegrees(position)
      orientation: {
        heading: Cesium.Math.toRadians(0), //水平角
        pitch: Cesium.Math.toRadians(-60), //竖直角
        roll: 0, //翻滚角
      },
      complete: () => {
        // 获取当前相机的角度
        var heading = this.viewer.camera.heading;
        var pitch = this.viewer.camera.pitch;
        var roll = this.viewer.camera.roll;

        // 输出当前的角度
        console.log(`Heading: ${Cesium.Math.toDegrees(heading)}`);
        console.log(`Pitch: ${Cesium.Math.toDegrees(pitch)}`);
        console.log(`Roll: ${Cesium.Math.toDegrees(roll)}`);

      },
    });
  }
}

export default Scene;
