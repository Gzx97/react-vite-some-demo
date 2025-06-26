import { FC, useEffect, useRef } from "react";
import * as THREE from "three";
import BoxHelperWrap from "../modules/BoxHelperWrap";
import Floors from "../modules/Floors";
import Viewer from "../modules/Viewer";
import styles from "./index.module.less";
const PAGE_ID = "ThreeDemo1";

const ThreeDemo1: FC = () => {
  const mountRef = useRef(null);
  let boxHelperWrap: BoxHelperWrap;

  // 初始化场景
  const viewerRef = useRef<Viewer>();
  const init = () => {
    viewerRef.current = new Viewer(PAGE_ID);
    const viewer = viewerRef.current;
    viewer.addAxis();
    // viewer.addStats();
    // 缩放限制
    viewer.controls.maxDistance = 12;
    const floors = new Floors(viewer);
    // floors.addGird(8, 25, 0x004444, 0x004444);
    boxHelperWrap = new BoxHelperWrap(viewer);

    // 创建带折叠效果的旗帜
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load("/img1.jpg", (texture) => {
      // 增加几何体分段数以获得更平滑的变形
      const geometry = new THREE.PlaneGeometry(2, 1, 20, 10);

      // 手动修改顶点位置创建更平滑的折叠效果
      const position = geometry.attributes.position;
      for (let i = 0; i < position.count; i++) {
        const x = position.getX(i);
        const z = position.getZ(i);
        // 使用更平滑的变形函数
        position.setZ(i, Math.sin(x * Math.PI) * 0.15 + Math.sin(x * Math.PI * 2) * 0.05);
      }
      position.needsUpdate = true;
      geometry.computeVertexNormals();

      const material = new THREE.MeshPhongMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        shininess: 30,
      });

      const flag = new THREE.Mesh(geometry, material);
      flag.position.set(0, 0, 0);

      // 添加光源以增强3D效果
      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(1, 1, 1);
      viewer.scene.add(light);
      viewer.scene.add(flag);
    });
  };
  useEffect(() => {
    init();
    return () => {
      const viewer = viewerRef.current;
      viewer?.destroy();
    };
  }, []);
  return (
    <div className={styles.wrapper}>
      <div ref={mountRef} id={PAGE_ID} style={{ width: 1000, height: 800, border: "1px solid red" }} />
    </div>
  );
};
export default ThreeDemo1;
