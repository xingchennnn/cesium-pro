/**
 * 模块名: rem定义
 * 代码描述: 设置rem单位换算,以屏幕宽度为10rem的动态换算(即1rem=1/10设计图尺寸px),会影响默认字体大小
 * 作者:余洲
 * 创建时间:2024-01-05
 */
(function () {
  const docEl: HTMLElement = document.documentElement;
  function setRemUnit(): void {
    const rem: number = docEl.clientWidth / 100;
    docEl.style.fontSize = `${rem}px`;
  }
  setRemUnit();
  window.addEventListener("resize", setRemUnit);
})();
