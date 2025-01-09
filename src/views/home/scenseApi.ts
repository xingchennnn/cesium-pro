// import type { Viewer } from "cesium";
import * as Cesium from "cesium";
// import fire from "@/assets/icons/fire.png";
import GlobalUtils from "@/utils/GlobalUtil";

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
   * 开启地形模式
   */
  public async enableTerrain() {
    const scene = this.viewer.scene;
    scene.globe.depthTestAgainstTerrain = true;

    let worldTerrain;
    try {
      worldTerrain = await Cesium.createWorldTerrainAsync();
      this.viewer.scene.terrainProvider = worldTerrain;
      scene.globe.show = false;
    } catch (error) {
      window.alert(`创建世界地形时出错: ${error}`);
    }

    let worldTileset: Cesium.Cesium3DTileset;
    try {
      worldTileset = await Cesium.createGooglePhotorealistic3DTileset({
        // Only the Google Geocoder can be used with Google Photorealistic 3D Tiles.  Set the `geocode` property of the viewer constructor options to IonGeocodeProviderType.GOOGLE.
        onlyUsingWithGoogleGeocoder: true,
      });
      this.viewer.scene.primitives.add(worldTileset);
      // 3D Tiles
      // scene.globe.show = false;
      // worldTileset.show = true;
      // 真实感3D瓷砖平铺集
      scene.globe.show = true;
      worldTileset.show = false;
    } catch (error) {
      console.log(`加载真实感3D瓷砖平铺集时出错: ${error}`);
    }

    // Sandcastle.addToolbarMenu([
    //   {
    //     text: "3D Tiles",
    //     onselect: () => {

    //   },
    // },
    // {
    //   text: "Terrain",
    //   onselect: () => {
    //     scene.globe.show = true;
    //     worldTileset.show = false;
    //     },
    //   },
    // ]);
  }

  /**
   * primitives 渲染 --未完成
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

  /**
   * 添加模型 --未完成
   * @param url 模型地址
   * @param position [经度，纬度，高度]
   */
  public addModel() {
    //添加模型
    // 定义立方体几何体
    var boxGeometry = new Cesium.BoxGeometry({
      vertexFormat: Cesium.VertexFormat.POSITION_AND_NORMAL,
      maximum: new Cesium.Cartesian3(250000.0, 250000.0, 250000.0),
      minimum: new Cesium.Cartesian3(-250000.0, -250000.0, -250000.0),
    });

    // 定义外观（材质）
    var material = Cesium.Color.fromBytes(255, 0, 0, 255); // 红色
    var appearance = new Cesium.PerInstanceColorAppearance({
      flat: true,
      // color: material,
    });

    // 创建Primitive
    var primitive = new Cesium.Primitive({
      geometryInstances: new Cesium.GeometryInstance({
        geometry: boxGeometry,
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(material),
        },
      }),
      appearance: appearance,
    });

    // 添加到场景
    this.viewer.scene.primitives.add(primitive);

  }

  /**
   * 移除所有实体
   * */
  public removeAllEntities() {
    this.viewer.entities.removeAll();
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
      destination: Cesium.Cartesian3.fromDegrees(...entity.position),
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
   * 移除所有影像图层 创建新的图层
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

  /**
   * 添加管廊模型
   */
  public addPipeLine() {
    // const { viewer, splitViewer } = clientViewerData;
    const redTube = this.viewer.entities.add({
      name: "蓝色管道",
      polylineVolume: {
        positions: Cesium.Cartesian3.fromDegreesArray([
          -85.0, 32.0, -85.0, 36.0, -89.0, 36.0, -87.84, 42.49,
        ]),
        shape: this.computeCircle(600.0),
        material: Cesium.Color.BLUE,
        cornerType: Cesium.CornerType.ROUNDED,
      },
    });
    this.viewer.zoomTo(redTube);
  }

  // 计算圆形 -- 添加管廊模型使用
  private computeCircle(radius: any) {
    const positions = [];
    for (let i = 0; i < 360; i++) {
      const radians = Cesium.Math.toRadians(i);
      positions.push(
        new Cesium.Cartesian2(
          radius * Math.cos(radians),
          radius * Math.sin(radians)
        )
      );
    }
    return positions;
  }

  /**
   * 添加火焰
   */
  public addFire(positions: [number, number, number]) {
    // vue3 导入图片
    const fire = GlobalUtils.getImageUrl("@/assets/image/fire.png");
    console.log("fire", fire);

    // 确保图像路径有效
    if (!fire) {
      console.error("火焰图像加载失败！请检查图像路径。");
      return;
    }

    // 创建粒子系统
    const particleSystem = new Cesium.ParticleSystem({
      image: fire,
      startColor: Cesium.Color.WHITE.withAlpha(0.7), // 使用红色以增加可见性
      endColor: Cesium.Color.WHITE.withAlpha(0.0), // 逐渐消失
      startScale: 2.0,
      endScale: 8.0, // 缩放范围增大
      minimumParticleLife: 1.0, // 更短的粒子生命
      maximumParticleLife: 5.0, // 确保粒子有较短的生命周期
      minimumSpeed: 1.0,
      maximumSpeed: 2.0, // 调整速度范围
      imageSize: new Cesium.Cartesian2(30, 30), // 增大图像尺寸以提高可见性
      emissionRate: 100, // 增加发射率
      lifetime: 10.0, // 增加粒子系统的生命周期
      //系统的粒子发射器
      emitter: new Cesium.ConeEmitter(Cesium.Math.toRadians(45.0)), //BoxEmitter 盒形发射器，ConeEmitter 锥形发射器，SphereEmitter 球形发射器，CircleEmitter圆形发射器
      modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(
        Cesium.Cartesian3.fromDegrees(positions[0], positions[1], positions[2])
      ),
    });

    // 添加到场景中
    this.viewer.scene.primitives.add(particleSystem);

    // 使用相机聚焦粒子系统位置
    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        positions[0],
        positions[1],
        positions[2] + 200
      ),
      duration: 2.0, // 平滑过渡，持续1秒
    });
  }

  /**
   * 添加雨
   */
  public addRain(positions: [number, number, number]) {
    // vue3 导入图片
    const rain = GlobalUtils.getImageUrl("@/assets/image/boom.png");
    console.log("rain", rain);

    // 确保图像路径有效
    if (!rain) {
      console.error("雨图像加载失败！请检查图像路径。");
      return;
    }

    // 创建粒子系统
    const particleSystem = new Cesium.ParticleSystem({
      image: rain,
      startColor: Cesium.Color.BLUE.withAlpha(0.7), // 使用蓝色以增加可见性
      endColor: Cesium.Color.BLUE.withAlpha(0.0), // 逐渐消失
      startScale: 1.0,
      endScale: 2.0, // 缩放范围增大
      minimumParticleLife: 1.0, // 更短的粒子生命
      maximumParticleLife: 5.0, // 确保粒子有较短的生命周期
      minimumSpeed: 1.0,
      maximumSpeed: 2.0, // 调整速度范围
      imageSize: new Cesium.Cartesian2(30, 30), // 增大图像尺寸以提高可见性
      emissionRate: 100, // 增加发射率
      lifetime: 10.0, // 增加粒子系统的生命周期
      //系统的粒子发射器
      emitter: new Cesium.ConeEmitter(Cesium.Math.toRadians(45.0)), //BoxEmitter 盒形发射器，ConeEmitter 锥形发射器，SphereEmitter 球形发射器，CircleEmitter圆形发射器
      modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(
        Cesium.Cartesian3.fromDegrees(positions[0], positions[1], positions[2])
      ),
    });

    // 添加到场景中
    this.viewer.scene.primitives.add(particleSystem);

    // 使用相机聚焦粒子系统位置
    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        positions[0],
        positions[1],
        positions[2] + 200
      ),
      duration: 2.0, // 平滑过渡，持续1秒
    });
  }

  /**
   * 添加雪
   */
  public addSnow(positions: [number, number, number]) {
    // vue3 导入图片
    const snow = GlobalUtils.getImageUrl("@/assets/image/snow.png");
    console.log("snow", snow);

    // 确保图像路径有效
    if (!snow) {
      console.error("雪图像加载失败！请检查图像路径。");
      return;
    }

    // 创建粒子系统
    const particleSystem = new Cesium.ParticleSystem({
      image: snow,
      startColor: Cesium.Color.WHITE.withAlpha(0.7), // 使用红色以增加可见性
      endColor: Cesium.Color.WHITE.withAlpha(0.0), // 逐渐消失
      startScale: 1.0,
      endScale: 2.0, // 缩放范围增大
      minimumParticleLife: 1.0, // 更短的粒子生命
      maximumParticleLife: 5.0, // 确保粒子有较短的生命周期
      minimumSpeed: 1.0,
      maximumSpeed: 2.0, // 调整速度范围
      imageSize: new Cesium.Cartesian2(30, 30), // 增大图像尺寸以提高可见性
      emissionRate: 100, // 增加发射率
      lifetime: 10.0, // 增加粒子系统的生命周期
      //系统的粒子发射器
      emitter: new Cesium.ConeEmitter(Cesium.Math.toRadians(45.0)), //BoxEmitter 盒形发射器，ConeEmitter 锥形发射器，SphereEmitter 球形发射器，CircleEmitter圆形发射器
      modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(
        Cesium.Cartesian3.fromDegrees(positions[0], positions[1], positions[2])
      ),
    });

    // 添加到场景中
    this.viewer.scene.primitives.add(particleSystem);

    // 使用相机聚焦粒子系统位置
    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        positions[0],
        positions[1],
        positions[2] + 200
      ),
      duration: 2.0, // 平滑过渡，持续1秒
    });
  }

  /**
   * 添加雾
   */
  public addFog() {
    // 启用雾效果
    this.viewer.scene.fog.enabled = true;
    // 设置雾的颜色
    // this.viewer.scene.fog.color = Cesium.Color.WHITE.withAlpha(0.5);
    // 设置雾的最小高度
    // this.viewer.scene.fog.minimumHeight = 1000.0;
    // 设置雾的最大高度
    this.viewer.scene.fog.maxHeight = 2000.0;
  }

  /**
   * 移除雾
   */
  public removeFog() {
    // 禁用雾效果
    this.viewer.scene.fog.enabled = false;
  }

  /**
   * 添加天空盒
   */
  public addSkyBox() {
    // 加载天空盒
    const skyBox = new Cesium.SkyBox({
      sources: {},
    });
    // 设置天空盒
    this.viewer.scene.skyBox = skyBox;
  }

  /**
   * 移除天空盒
   */
  public removeSkyBox() {
    // 移除天空盒
    this.viewer.scene.skyBox = undefined;
  }

  /**
   * 移除模型
   */
  public removeModel(model: Cesium.Model) {
    // 移除模型
    this.viewer.scene.primitives.remove(model);
  }
}

export default Scene;
