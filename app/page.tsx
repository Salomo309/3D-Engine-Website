"use client";

import Button from "@/components/ui/Button";
import RenderComponent from "@/components/render/RenderComponent";
import TreeView from "@/components/ui/TreeView";
import { TreeViewBaseItem } from "@mui/x-tree-view";
import Controller from "@/components/ui/Controller";
import { useState } from "react";
import CameraController from "@/components/camera/CameraController";
import { SelectChangeEvent } from "@mui/material";
import { NodeSchema, SceneSchema } from "@/types/ui";
import { convertGLTFToTreeView, findMeshById } from "@/libs/helper";

export default function Home() {
  // gltf dummy
  const GLTFTree: SceneSchema = {
    id: "scene-root",
    name: "Scene Name",
    children: [
      {
        id: "mesh-1",
        name: "Mesh 1",
        position: {
          x: 1,
          y: 2,
          z: 3,
        },
        rotation: {
          x: 0,
          y: 0,
          z: 0,
        },
        scale: {
          x: 0,
          y: 0,
          z: 0,
        },
      },
      {
        id: "mesh-2",
        name: "Mesh 2",
        position: {
          x: 0,
          y: 0,
          z: 0,
        },
        rotation: {
          x: 0,
          y: 0,
          z: 0,
        },
        scale: {
          x: 0,
          y: 0,
          z: 0,
        },
        children: [
          {
            id: "mesh-3",
            name: "Mesh 3",
            position: {
              x: 0,
              y: 0,
              z: 0,
            },
            rotation: {
              x: 0,
              y: 0,
              z: 0,
            },
            scale: {
              x: 0,
              y: 0,
              z: 0,
            },
          },
        ],
      },
    ],
  };

  const treeItems: TreeViewBaseItem[] = [convertGLTFToTreeView(GLTFTree)];

  const [isComponentExpanded, setIsComponentExpanded] = useState<boolean>(true);
  const [isCameraExpanded, setIsCameraExpanded] = useState<boolean>(true);
  const [camera, setCamera] = useState<string>("perspectiveCamera");
  const [distance, setDistance] = useState<number>(3);
  const [isReset, setIsReset] = useState<boolean>(false);
  const [component, setComponent] = useState<NodeSchema | null>(null); // change this too

  const handleComponentExpanded = () => {
    setIsComponentExpanded(!isComponentExpanded);
  };

  const handleCameraExpanded = () => {
    setIsCameraExpanded(!isCameraExpanded);
  };

  const handleCameraChange = (event: SelectChangeEvent) => {
    setCamera(event.target.value);
  };

  const handleDistanceChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setDistance(+event.target.value);
  };

  const handleResetChange = () => {
    setIsReset(true);
    setDistance(3);
  };
  
  const handleItemSelection = (
    event: React.SyntheticEvent,
    itemId: string,
    isSelected: boolean
  ) => {
    if (isSelected) {
      if (!GLTFTree.children) return;
      const selectedComponent = findMeshById(GLTFTree.children, itemId);
      setComponent(selectedComponent);
      console.log(itemId, selectedComponent);
    } else {
      setComponent(null);
    }
  };

  return (
    <div className="flex w-full h-screen bg-main-black text-white">
      <div className="w-1/2 py-5 px-7 flex flex-col">
        <div className="pb-6">
          <div className=" text-2xl font-bold bg-gray-900">Camera View</div>
        </div>
        <div className="bg-white text-black flex-grow">
          <RenderComponent
            cameraType={camera}
            distance={distance}
            isReset={isReset}
            handleReset={setIsReset}
          />
        </div>
      </div>
      <div className="w-1/4 flex flex-col border-x-2">
        <div className="h-1/2 border-b-2 py-5 px-7 flex flex-col">
          <div className="pb-6">
            <div className="text-2xl font-bold bg-gray-900">Scene Graph</div>
          </div>
          <div className="bg-gray-900 flex-grow overflow-y-auto p-5">
            <TreeView
              treeItems={treeItems}
              handleItemSelection={handleItemSelection}
            />
          </div>
        </div>
        <div className="py-5 px-7 flex flex-col h-1/2">
          <div className="">
            <div className="text-2xl font-bold bg-gray-900">Animation</div>
          </div>
          <div className="flex gap-5 items-strech w-full py-3 overflow-x-auto">
            <Button
              id="play-button"
              handleClick={() => {}}
              text="Play"
              className="bg-white text-black px-4"
            />
            <Button
              id="pause-button"
              handleClick={() => {}}
              text="Pause"
              className="bg-white text-black px-4"
            />
            <Button
              id="reverse-button"
              handleClick={() => {}}
              text="Reverse"
              className="bg-white text-black px-4"
            />
            <Button
              id="auto-replay-button"
              handleClick={() => {}}
              text="Auto Replay"
              className="bg-white text-black px-4"
            />
          </div>
          <div className="bg-gray-900 flex-grow">
            This is the place for animation
          </div>
        </div>
      </div>
      <div className="w-1/4 py-5 px-7 flex flex-col">
        <div className="pb-6">
          <div className="text-2xl font-bold bg-gray-900">Inspector</div>
        </div>
        <div className="bg-gray-900 flex-grow p-5">
          <Controller
            id="component-controller"
            isExpanded={isComponentExpanded}
            handleClick={handleComponentExpanded}
            title="Component Controller"
            component={component!!}
          />
          <CameraController
            id="camera-controller"
            isExpanded={isCameraExpanded}
            handleClick={handleCameraExpanded}
            title="Camera Controller"
            camera={camera}
            handleCameraChange={handleCameraChange}
            distance={distance}
            handleDistanceChange={handleDistanceChange}
            handleResetChange={handleResetChange}
          />
        </div>
      </div>
    </div>
  );
}
