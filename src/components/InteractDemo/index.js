import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  Mesh,
  BoxGeometry,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  AxesHelper,
  SphereGeometry,
  Raycaster,
  Vector2,
  MeshLambertMaterial,
  DirectionalLight,
  Vector3,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "./index.css";

const InteractDemo = () => {
  let interactRef = useRef();

  // 场景节点
  const [scene] = useState(new Scene());
  // 相机节点
  const [camera, setCamera] = useState();
  // 渲染器节点
  const [renderer, setRenderer] = useState();
  // raycast射线
  const [raycaster, setRaycaster] = useState(new Raycaster());
  // 鼠标位置
  const [mouse, setMouse] = useState();
  const [objPos, setObjPos] = useState({
    type: "default",
    left: 0,
    top: 100,
  });
  let INTERSECTED;

  const transMatrix = (pos) => {
    let world_vec = new Vector3(pos.x, pos.y, pos.z);
    let vec = world_vec.project(camera);
    let x = Math.round((vec.x + 1) * renderer.domElement.offsetWidth) / 2;
    let y = Math.round((1 - vec.y) * renderer.domElement.offsetHeight) / 2;
    return { x, y };
  };

  // 鼠标移动事件
  const onMouseMove = useCallback(
    (event) => {
      let px = renderer.domElement.getBoundingClientRect().left;
      let py = renderer.domElement.getBoundingClientRect().top;

      let mouse = new Vector2();
      mouse.x =
        ((event.clientX - px) / renderer.domElement.offsetWidth) * 2 - 1;
      mouse.y =
        -((event.clientY - py) / renderer.domElement.offsetHeight) * 2 + 1;
      // setMouse(mouse);
      // console.log(raycaster, camera, mouse);

      if (raycaster && camera && mouse) {
        raycaster.setFromCamera(mouse, camera);
        let intersects = raycaster.intersectObjects(scene.children, false);

        // if (intersects.length && intersects[0].object.type !== "AxesHelper") {
        //   console.log(intersects[0]);
        //   intersects[0].object.position.x += 0.01;
        // }
        if (
          intersects.length > 0 &&
          intersects[0].object.type !== "AxesHelper"
        ) {
          if (INTERSECTED !== intersects[0].object) {
            if (INTERSECTED)
              INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

            INTERSECTED = intersects[0].object;
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex(0xff0000);
            console.log(INTERSECTED);
            let intersect_pos = INTERSECTED.position;
            let left = transMatrix(intersect_pos).x + px;
            let top = transMatrix(intersect_pos).y + py;
            console.log(left, top);
            setObjPos({
              type: INTERSECTED.geometry.type,
              left,
              top,
            });
            let dom = document.querySelector("#tooltip");
            dom.style.left = left + "px";
            dom.style.top = top + "px";
          }
        } else {
          if (INTERSECTED)
            INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

          INTERSECTED = null;
        }
      }
    },
    [camera]
  );

  // 渲染动画
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  };

  // 创建立方体
  const createBox = (x = 1, y = 1, z = 1) => {
    let box = new BoxGeometry(x, y, z);
    let mat = new MeshLambertMaterial({ color: 0xcc22cc });
    let mesh = new Mesh(box, mat);
    return mesh;
  };

  // 创建球体
  const createSphere = (r = 1) => {
    let sphere = new SphereGeometry(r);
    let mat = new MeshLambertMaterial({ color: 0x22cccc });
    let mesh = new Mesh(sphere, mat);
    return mesh;
  };

  useEffect(() => {
    // console.log(interactRef.current);
    let dom = document.getElementById("interact");
    let width = dom.clientWidth;
    let height = dom.clientHeight;
    let k = width / height; //宽高比
    let s = 20;
    let camera = new PerspectiveCamera(70, width / height, 1, 10000);
    camera.position.set(15, 15, 15);
    camera.lookAt(scene.position);
    setCamera(camera);

    let renderer = new WebGLRenderer();
    renderer.setClearColor(0x00ff00, 0.5);
    renderer.setSize(width, height);
    setRenderer(renderer);

    let box = createBox(4, 4, 4);
    box.position.x = 2;
    scene.add(box);

    let sphere = createSphere(2);
    sphere.position.x = 14;
    scene.add(sphere);
    // scene.add(new AxesHelper(50));

    const light = new DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);
  }, []);

  useEffect(() => {
    if (renderer) {
      interactRef.current.appendChild(renderer.domElement);
    }
    if (renderer && camera && scene) {
      animate();
      window.addEventListener("mousemove", onMouseMove, false);
      new OrbitControls(camera, renderer.domElement);
    }
  }, [animate, camera, onMouseMove, renderer, scene]);

  return (
    <div className="interactDemo" id="interact" ref={interactRef}>
      <div id="tooltip">
        {objPos.type}: {objPos.left} ----- {objPos.top}
      </div>
    </div>
  );
};

export default InteractDemo;
