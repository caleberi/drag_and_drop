import {
    DragDropProject,
    DragDropProjectStatus,
} from "../models/drag-drop-project-model";

export type Listener<T> = (items: T[]) => void;

export class State<T> {
    protected listeners: Listener<T>[] = [];
    addListener(listener: Listener<T>) {
        this.listeners.push(listener);
    }
}

export class DragDropProjectState extends State<DragDropProject> {
    private projects: any[] = [];
    private static instance: DragDropProjectState | null = null;
    private constructor() {
        super();
    }

    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new DragDropProjectState();
        return this.instance;
    }

    addProject(title: string, description: string, people: number) {
        const newProject = new DragDropProject(
            Math.random().toString(),
            title,
            description,
            people,
            DragDropProjectStatus.Active
        );
        this.projects.push(newProject);
        this.updateListeners();
    }

    moveProject(projectId: string, newStatus: DragDropProjectStatus) {
        const project = this.projects.find((prj) => prj.id == projectId);
        if (project && project.status !== newStatus) {
            project.status = newStatus;
        }
        this.updateListeners();
    }

    private updateListeners() {
        for (let listenFn of this.listeners) {
            listenFn(this.projects.slice());
        }
    }
}

export const state = DragDropProjectState.getInstance();
