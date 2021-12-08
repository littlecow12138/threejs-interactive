import React, { useRef, useState, useEffect, useCallback } from "react";
import "./index.css";
import {
  AxesHelper,
  BoxGeometry,
  DirectionalLight,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  MeshBasicMaterial,
  CylinderGeometry,
  CatmullRomCurve3,
  Vector3,
  BufferGeometry,
  Color,
  LineBasicMaterial,
  Line,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const PathDemo = () => {
  const pathRef = useRef();

  let pos = 0;

  // 场景
  const [scene, setScene] = useState();
  // 相机
  const [camera, setCamera] = useState();
  // 渲染器
  const [renderer, setRenderer] = useState();
  // 容器宽
  const [width, setWidth] = useState();
  // 容器高
  const [height, setHeight] = useState();
  // 移动目标
  const [target, setTarget] = useState();
  // 路径曲线
  const [curve, setCurve] = useState();
  const [curveMesh, setCurveMesh] = useState();

  const createPlane = () => {
    let plane = new BoxGeometry(2, 2, 2);
    let mat = new MeshLambertMaterial({ color: 0xaa22ff });
    let mesh = new Mesh(plane, mat);
    mesh.position.y = 1;
    return mesh;
  };

  const initTarget = () => {
    let plane = new CylinderGeometry(0, 1, 2);
    let mat = new MeshLambertMaterial({ color: 0xff22aa });
    let mesh = new Mesh(plane, mat);
    mesh.position.y = 1;
    mesh.position.x = -5;
    setTarget(mesh);
  };

  const initCurve = () => {
    let curve = new CatmullRomCurve3([
      // 起点
      new Vector3(-5, 1, 0),
      // 中间节点
      new Vector3(0, 1, 5),
      new Vector3(3, 1, 0),
      new Vector3(6, 1, -5),
      // 终点
      new Vector3(9, 1, 0),
    ]);
    const geo = new BufferGeometry();
    let vertices = curve.getPoints(100);
    geo.setFromPoints(vertices);
    let mat = new LineBasicMaterial({
      color: new Color().setHSL(Math.random(), 0.5, 0.5),
    });
    let mesh = new Line(geo, mat);
    setCurve(curve);
    setCurveMesh(mesh);
  };

  // 初始化场景
  const initScene = () => {
    // 容器宽高获取
    let width = pathRef.current.clientWidth;
    let height = pathRef.current.clientHeight;

    // 场景设置
    let scene = new Scene();
    scene.add(new AxesHelper(10));
    let light = new DirectionalLight(0xffffff, 10);
    light.position.set(1, 1, -1).normalize();
    scene.add(light);

    let mesh = createPlane();
    scene.add(mesh);
    for (let i = 0; i < 5; i++) {
      let meshClone = mesh.clone();
      meshClone.position.x += 5 * i;
      scene.add(meshClone);
    }
    let planeGeo = new BoxGeometry(50, 2, 50);
    let planeMat = new MeshBasicMaterial({ color: 0xaaaaaa });
    let planeMesh = new Mesh(planeGeo, planeMat);
    planeMesh.position.y = -1;
    scene.add(planeMesh);

    // 摄像机设置
    let camera = new PerspectiveCamera(70, width / height, 1, 10000);
    camera.position.set(20, 20, 20);
    camera.lookAt(scene.position);

    // 渲染器设置
    let renderer = new WebGLRenderer();
    renderer.setClearColor(0x66aa55, 0.5);
    renderer.setSize(width, height);
    pathRef.current.appendChild(renderer.domElement);

    setWidth(width);
    setHeight(height);
    setScene(scene);
    setCamera(camera);
    setRenderer(renderer);
  };

  // 渲染动画
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const render = () => {
    requestAnimationFrame(render);
    if (curve && target) {
      if (pos < 1) {
        // target.position.y += 0.001;
        console.log(curve.getPointAt(pos));
        target.position.x = curve.getPointAt(pos).x;
        // target.position.x = curve.getPointAt(pos).x;
        target.position.z = curve.getPointAt(pos).z;
        pos += 0.001;
      } else {
        pos = 0;
      }
    }
    renderer.render(scene, camera);
  };

  useEffect(() => {
    initScene();
    initTarget();
    initCurve();
  }, []);

  useEffect(() => {
    if (target) {
      scene.add(target);
    }
    if (curveMesh) {
      scene.add(curveMesh);
    }
  }, [scene, target, curveMesh]);

  useEffect(() => {
    if (renderer && camera && scene) {
      render();
    }
  }, [camera, render, renderer, scene]);

  return <div className="pathDemo" ref={pathRef}></div>;
};

export default PathDemo;
