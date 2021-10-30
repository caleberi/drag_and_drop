import { DragDropListFragment } from "./components/drag-drop-project-list";
import { DragDropInputFragment } from "./components/drag-drop-project-input";

(function main() {
    new DragDropInputFragment("project-input", "app", true, "user-input");
    new DragDropListFragment("project-list", "app", false, "active");
    new DragDropListFragment("project-list", "app", false, "finished");
})();
