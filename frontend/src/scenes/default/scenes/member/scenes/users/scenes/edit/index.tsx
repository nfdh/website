import * as React from "react";
import { EditUserScene as EditUserSceneImpl, EditUserSceneSkeleton } from "./EditUserScene";

export function EditUserScene() {

    return <React.Suspense fallback={<EditUserSceneSkeleton />}>
        <EditUserSceneImpl />
    </React.Suspense>;
}