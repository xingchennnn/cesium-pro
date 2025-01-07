import Scene from "./scenseApi"


class SceneControl { 
    private constructor() {
  }
  
  public static get api(): Scene {
        return Scene.instance;
  }

}
export default SceneControl;