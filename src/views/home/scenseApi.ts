// import type { Viewer } from "cesium";
import * as Cesium from "cesium";

class Scene {
  private constructor() {}

  // viewer对象
  // @ts-ignore
  private viewer: Cesium.Viewer;
  // 单例模式
  private static _instance: Scene;
  // 获取单例对象
  public static get instance(): Scene {
    if (!this._instance) {
      this._instance = new Scene();
    }
    return this._instance;
  }

  // 初始化viewer
  public init(viewer: Cesium.Viewer) {
    this.viewer = viewer;
  }

  /**
   * primitives 渲染
   */
  public Cesium3DTileset() {
    //     Cesium3DTileset: 加载 3D Tiles 数据集。
    // viewer.scene.primitives.add: 将 Primitive 添加到场景中。
    const primitive = this.viewer.scene.primitives.add(
      Cesium.Cesium3DTileset.fromUrl("path/to/tileset.json")
    );
    this.viewer.zoomTo(primitive); //缩放到图层
  }

  /**
   * 添加点位
   * @param position [经度，纬度，高度]
   */
  public addPoint(position: number[]) {
    //添加点
    this.viewer.entities.add({
      name: "重庆",
      position: Cesium.Cartesian3.fromDegrees(
        position[0],
        position[1],
        position[2]
      ),
      point: {
        pixelSize: 10,
        color: Cesium.Color.RED,
        // outlineColor: Cesium.Color.WHITE,
        // outlineWidth: 2,
      },
      label: {
        text: "重庆",
        font: "14pt sans-serif",
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: 2,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -15),
      },
      description: "<h3>重庆</h3><p>人口: 30000,000</p>",
    });
    // 定位到点位
    this.viewer.zoomTo(this.viewer.entities);
  }

  /**
   * 添加线
   * @param positions [[经度，纬度，高度], [经度，纬度，高度]]
   */
  public addLine(positions: number[][]) {
    //添加线
    let positionsCartesian3 = positions.map((position) => {
      return Cesium.Cartesian3.fromDegrees(
        position[0],
        position[1],
        position[2]
      );
    });
    this.viewer.entities.add({
      name: "线",
      polyline: {
        positions: positionsCartesian3,
        width: 2,
        arcType: Cesium.ArcType.NONE,
        material: new Cesium.PolylineOutlineMaterialProperty({
          color: Cesium.Color.BLUE,
          outlineWidth: 2,
          outlineColor: Cesium.Color.BLACK,
        }),
      },
    });
  }

  /**
   * 添加面
   * @param positions [[经度，纬度，高度], [经度，纬度，高度]]
   */
  public addPolygon(positions: number[][]) {
    //添加面
    let positionsCartesian3 = positions.map((position) => {
      return Cesium.Cartesian3.fromDegrees(
        position[0],
        position[1],
        position[2]
      );
    });
    this.viewer.entities.add({
      name: "面",
      polygon: {
        hierarchy: new Cesium.PolygonHierarchy(positionsCartesian3),
        material: new Cesium.Color(0, 0, 1, 0.5),
        outline: true,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
      },
    });
  }

  // 飞向点位
  public flyToDot(position: number[]) {
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
        let heading = this.viewer.camera.heading;
        let pitch = this.viewer.camera.pitch;
        let roll = this.viewer.camera.roll;

        // 输出当前的角度
        console.log(`Heading: ${Cesium.Math.toDegrees(heading)}`);
        console.log(`Pitch: ${Cesium.Math.toDegrees(pitch)}`);
        console.log(`Roll: ${Cesium.Math.toDegrees(roll)}`);
      },
    });
  }

  // 飞向物体
  public flyToEntity(entity: Cesium.Entity) {
    this.viewer.camera.flyTo({
      destination:Cesium.Cartesian3.fromDegrees(...entity.position),
      orientation: {
        heading: Cesium.Math.toRadians(0), //水平角
        pitch: Cesium.Math.toRadians(-60), //竖直角
        roll: 0, //翻滚角
      },
      complete: () => {
        // 获取当前相机的角度
        let heading = this.viewer.camera.heading;
        let pitch = this.viewer.camera.pitch;
        let roll = this.viewer.camera.roll;

        // 输出当前的角度
        console.log(`Heading: ${Cesium.Math.toDegrees(heading)}`);
        console.log(`Pitch: ${Cesium.Math.toDegrees(pitch)}`);
        console.log(`Roll: ${Cesium.Math.toDegrees(roll)}`);
      },
    });
  }

  // 飞向区域
  public flyToRegion(region: Cesium.Rectangle) {
    this.viewer.camera.flyTo({
      destination: region,
      orientation: {
        heading: Cesium.Math.toRadians(0), //水平角
        pitch: Cesium.Math.toRadians(-60), //竖直角
        roll: 0, //翻滚角
      },
      complete: () => {
        // 获取当前相机的角度
        let heading = this.viewer.camera.heading;
        let pitch = this.viewer.camera.pitch;
        let roll = this.viewer.camera.roll;
        // 输出当前的角度
        console.log(`Heading: ${Cesium.Math.toDegrees(heading)}`);
        console.log(`Pitch: ${Cesium.Math.toDegrees(pitch)}`);
        console.log(`Roll: ${Cesium.Math.toDegrees(roll)}`);
      },
    });
  }

  // 添加点击事件--读取位置信息
  public addClickEvent() {
    let scene = this.viewer.scene;
    let globe = scene.globe;
    //第 1 步：初始化场景事件
    let leftClickHandle = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    //第 2 步：设置鼠标左键点击事件
    leftClickHandle.setInputAction((click: any) => {
      //第 3 步：获取场景点击位置
      let pickPosition = this.viewer.scene.pickPosition(click.position);
      let cartographic = undefined;
      if (pickPosition) {
        cartographic = Cesium.Cartographic.fromCartesian(pickPosition);
      }
      //如果获取失败，则从地形上获取高度
      if (cartographic!.height < 0) {
        //开启地形测试，在地形上采用
        let depthTest = globe.depthTestAgainstTerrain;
        globe.depthTestAgainstTerrain = !depthTest;
        this.viewer.render();
        let pickPosition2 = this.viewer.scene.pickPosition(click.position);
        if (pickPosition2) {
          pickPosition = pickPosition2;
          cartographic = Cesium.Cartographic.fromCartesian(pickPosition);
        }
        globe.depthTestAgainstTerrain = depthTest;
      }
      if (Cesium.defined(pickPosition)) {
        console.log(
          Cesium.Math.toDegrees(cartographic!.longitude).toFixed(4) +
            "," +
            Cesium.Math.toDegrees(cartographic!.latitude).toFixed(4) +
            "," +
            cartographic!.height
        ); //+ cartographic.height
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  /**
   * 移除点击事件
   * @param position
   */
  public removeClickEvent() {
    let scene = this.viewer.scene;
    let leftClickHandle = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    leftClickHandle.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  // 添加图标
  public addIcon(position: [number, number, number]) {
    //添加图标广告牌
    this.viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(...position),
      billboard: {
        image: "/icon/7cd7bcd9-cc03-4d5b-b830-e093541a4b8a.png",
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        disableDepthTestDistance: 1e9,
      },
    });
  }

  // 电子围栏
  public addEagleFence(positions: [number, number, number][]) {
    let entities = this.viewer.entities;
    let polylinePositions = positions.map((position) => {
      return Cesium.Cartesian3.fromDegrees(...position);
    });
    let polyline = new Cesium.PolylineGraphics({
      positions: polylinePositions,
      width: 2,
      arcType: Cesium.ArcType.NONE,
      material: new Cesium.PolylineOutlineMaterialProperty({
        color: Cesium.Color.BLUE,
        outlineWidth: 2,
        outlineColor: Cesium.Color.BLACK,
      }),
    });
    let eagleFence = entities.add({
      name: "电子围栏",
      polyline: polyline,
    });
    // 电子围栏的点击事件
    (eagleFence.polyline as any).clickEvent = new Cesium.Event();
    (eagleFence.polyline as any).clickEvent.addEventListener(
      Cesium.ScreenSpaceEventType.LEFT_CLICK,
      (click: any) => {
        let pickPosition = this.viewer.scene.pickPosition(click.position);
        if (pickPosition) {
          let cartographic = Cesium.Cartographic.fromCartesian(pickPosition);
          console.log(
            Cesium.Math.toDegrees(cartographic.longitude).toFixed(4) +
              "," +
              Cesium.Math.toDegrees(cartographic.latitude).toFixed(4) +
              "," +
              cartographic.height
          ); //+ cartographic.height
        }
      }
    );
  }

  // 添加弹窗
  public addPopup(position: [number, number, number], text: string) {
    //添加 HTML 页面元素，可以是多个
    let elements = [
      {
        id: "testHtmlEle1",
        element: document.getElementById(text),
        offset: [0, 0],
        flog: true,
        position: Cesium.Cartesian3.fromDegrees(...position),
      },
    ];
    let htmlEles = new Cesium.CreateHtmlElement(this.viewer, elements);
    //激活显示
    htmlEles.active();
  }

  /**
   * 添加文字
   * @param position [经度，纬度，高度]
   * @param text string
   */
  public addLabel(position: [number, number, number], text: string) {
    //添加 文字
    this.viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(...position),
      label: {
        text: text,
        font: "24px Helvetica",
        fillColor: Cesium.Color.RED,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 3,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      },
    });
  }

  /**
   * 移除所有图层 创建新的图层
   */
  public async removeAllimageryLayers() {
    // 移除所有影像图层
    this.viewer.imageryLayers.removeAll();

    // 添加 OpenStreetMap 图层
    this.viewer.imageryLayers.addImageryProvider(
      new Cesium.OpenStreetMapImageryProvider({})
    );

    // 添加 Bing Maps 图层
    this.viewer.imageryLayers.addImageryProvider(
      await Cesium.BingMapsImageryProvider.fromUrl(
        "https://dev.virtualearth.net",
        {
          key: "Your Bing Maps Key",
          mapStyle: Cesium.BingMapsStyle.AERIAL,
        }
      )
    );
  }


  //添加管廊模型
  public addPipeLine() {
    // const { viewer, splitViewer } = clientViewerData;
    const redTube = this.viewer.entities.add({
      name: "红色管道",
      polylineVolume: {
        positions: Cesium.Cartesian3.fromDegreesArray([
          -85.0,
          32.0,
          -85.0,
          36.0,
          -89.0,
          36.0,
          -87.84,
          42.49,
        ]),
        shape: this.computeCircle(60000.0),
        material: Cesium.Color.RED,
        cornerType: Cesium.CornerType.ROUNDED,
      },
    });
    this.viewer.zoomTo(redTube);
  }

  // 计算圆形 -- 添加管廊模型使用
  private computeCircle(radius:any) {
    const positions = [];
    for (let i = 0; i < 360; i++) {
      const radians = Cesium.Math.toRadians(i);
      positions.push(
        new Cesium.Cartesian2(radius * Math.cos(radians), radius * Math.sin(radians))
      );
    }
    return positions;
  }
}

export default Scene;
