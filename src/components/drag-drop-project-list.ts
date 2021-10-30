import Component from "./drag-drop-base";
import { DragTarget } from "../models/drag-drop-interfaces";
import { DragDropProject } from "../models/drag-drop-project-model";
import { autobind } from "../decorators/autobind";
import { state } from "../state/drag-drop-project-state";
import { DragDropProjectStatus } from "../models/drag-drop-project-model";
import { DragDropProjectItem } from "./drag-drop-project-item";

export class DragDropListFragment
    extends Component<HTMLDivElement, HTMLElement>
    implements DragTarget
{
    assignedProjects: DragDropProject[];
    constructor(
        templateId: string,
        mountId: string,
        insertAtStart: boolean,
        private readonly type: "active" | "finished",
        elementId?: string
    ) {
        super(templateId, mountId, insertAtStart, elementId);
        this.element.id = `${this.type}-projects`;
        this.assignedProjects = [];
        this.configure();
    }
    configure() {
        this.element.addEventListener("dragover", this.dragOverHandler);
        this.element.addEventListener("dragleave", this.dragLeaveHandler);
        this.element.addEventListener("drop", this.dropHandler);

        state.addListener((projects: DragDropProject[]) => {
            const relevantProject = projects.filter((project) => {
                if (this.type === "active")
                    return project.status === DragDropProjectStatus.Active;
                return project.status === DragDropProjectStatus.Finished;
            });
            this.assignedProjects = relevantProject;
            this.renderList();
        });
        this.renderContent();
    }

    @autobind
    dragOverHandler(event: DragEvent): void {
        if (
            event.dataTransfer &&
            event.dataTransfer.types[0] === "text/plain"
        ) {
            event.preventDefault();
            this.element.querySelector("ul")!.classList.add("droppable");
        }
    }

    @autobind
    dropHandler(event: DragEvent): void {
        const projectID = event.dataTransfer!.getData("text/plain");
        state.moveProject(
            projectID,
            this.type === "active"
                ? DragDropProjectStatus.Active
                : DragDropProjectStatus.Finished
        );
    }

    @autobind
    dragLeaveHandler(_: DragEvent): void {
        this.element.querySelector("ul")!.classList.remove("droppable");
    }

    private renderList() {
        const listID = `${this.type}-projects-list`;
        const listElement = document.getElementById(
            listID
        )! as HTMLUListElement;
        listElement.innerHTML = "";
        for (let item of this.assignedProjects) {
            new DragDropProjectItem(this.element.querySelector("ul")!.id, item);
        }
    }

    renderContent() {
        const listID = `${this.type}-projects-list`;
        this.element.querySelector("ul")!.id = listID;
        this.element.querySelector("h2")!.textContent =
            this.type.toUpperCase() + " PROJECTS";
    }
}
