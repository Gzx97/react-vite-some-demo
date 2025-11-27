import { Card, Flex } from "antd";
import CameraPoseVisualizer from "./components/CameraPoseVisualizer";
import { cn } from "@/utils";

export default function CameraPoseVisualizerPage() {
  return (
    <>
      <Flex>
        <div className={cn("w-full h-96")}>
          Three.js Demo Placeholder
          <Card
            style={{ height: 300, marginBottom: 24, padding: 0 }}
            bodyStyle={{ padding: 0, height: "100%" }}
          >
            <CameraPoseVisualizer currentPose={null} history={[]} trajectoryLength={300} />
          </Card>
        </div>
      </Flex>
    </>
  );
}
