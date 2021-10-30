import { Draggable } from "./../models/drag-drop-interfaces";
import Component from "./drag-drop-base";
import { DragDropProject } from "../models/drag-drop-project-model";
import { autobind } from "../decorators/autobind";

export class DragDropProjectItem
    extends Component<HTMLUListElement, HTMLLIElement>
    implements Draggable
{
    private project: DragDropProject;

    get persons() {
        return this.project.people == 1
            ? "1 person"
            : `${this.project.people} persons`;
    }
    constructor(hostId: string, project: DragDropProject) {
        super("single-project", hostId, false, project.id);
        this.project = project;
        this.configure();
        this.renderContent();
    }
    @autobind
    dragStartHandler(event: DragEvent): void {
        event.dataTransfer!.setData("text/plain", this.project.id);
        event.dataTransfer!.effectAllowed = "move";
    }

    @autobind
    dragEndHandler(_: DragEvent): void {
        console.log("DragEvent");
    }

    configure() {
        this.element.addEventListener("dragstart", this.dragStartHandler);
        this.element.addEventListener("dragend", this.dragEndHandler);
    }

    renderContent() {
        this.element.draggable = true;
        this.element.querySelector("h2")!.textContent = this.project.title;
        this.element.querySelector("h3")!.textContent =
            this.persons + " assigned";
        this.element.querySelector("p")!.textContent = this.project.description;
    }
}
