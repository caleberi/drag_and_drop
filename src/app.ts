type FormInputData = [string, string, number];

interface Validateable {
    value: string | number;
    required?: boolean;
    minlength?: number;
    maxlength?: number;
    min?: number;
    max?: number;
}

function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
    const originalMethod: Function = descriptor.value;
    const adjustedDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            return originalMethod.bind(this);
        },
    };
    return adjustedDescriptor;
}

function Validate(input: Validateable) {
    let isValid = true;
    if (input.required) {
        isValid = isValid && input.value.toString().trim().length !== 0;
    }

    if (input.minlength != null && typeof input.minlength === "string") {
        isValid = isValid && (input.value as string).length > input.minlength;
    }

    if (input.maxlength != null && typeof input.maxlength === "string") {
        isValid = isValid && (input.value as string).length < input.maxlength;
    }

    if (input.min != null && typeof input.min === "number") {
        isValid = isValid && (input.value as number) > input.min;
    }

    if (input.max != null && typeof input.max === "number") {
        isValid = isValid && (input.value as number) < input.max;
    }
    return isValid;
}

interface Draggable {
    dragStartHandler(event: DragEvent): void;
    dragEndHandler(event: DragEvent): void;
}

interface DragTarget {
    dragOverHandler(event: DragEvent): void;
    dropHandler(event: DragEvent): void;
    dragLeaveHandler(event: DragEvent): void;
}

enum DragDropProjectStatus {
    Active,
    Finished,
}

class DragDropProject {
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public people: number,
        public status: DragDropProjectStatus
    ) {}
}

type Listener<T> = (items: T[]) => void;

class State<T> {
    protected listeners: Listener<T>[] = [];
    addListener(listener: Listener<T>) {
        this.listeners.push(listener);
    }
}

class DragDropProjectState extends State<DragDropProject> {
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

const state = DragDropProjectState.getInstance();

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templateElement: HTMLTemplateElement;
    rootElement: T;
    element: U;

    constructor(
        templateId: string,
        mountId: string,
        insertAtStart: boolean,
        elementId?: string
    ) {
        this.templateElement = document.getElementById(
            templateId
        )! as HTMLTemplateElement;
        this.rootElement = document.getElementById(mountId) as T;
        const node = document.importNode(this.templateElement.content, true);
        this.element = node.firstElementChild as U;
        if (elementId) {
            this.element.id = elementId;
        }
        this.attachToRootElement(insertAtStart);
    }

    private attachToRootElement(insertAtStart: boolean) {
        this.rootElement.insertAdjacentElement(
            insertAtStart ? "afterbegin" : "beforeend",
            this.element
        );
    }

    configure?(): void;
    renderContent?(): void;
}

class DragDropProjectItem
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

class DragDropInputFragment extends Component<HTMLFormElement, HTMLDivElement> {
    descriptionElement: HTMLTextAreaElement;
    titleElement: HTMLInputElement;
    peopleElement: HTMLInputElement;

    constructor(
        templateId: string,
        mountId: string,
        insertAtStart: boolean,
        elementId?: string
    ) {
        super(templateId, mountId, insertAtStart, elementId);
        this.descriptionElement = this.element.querySelector(
            "#description"
        ) as HTMLTextAreaElement;
        this.titleElement = this.element.querySelector(
            "#title"
        ) as HTMLInputElement;
        this.peopleElement = this.element.querySelector(
            "#people"
        ) as HTMLInputElement;
        this.configure();
    }

    private retrieveAllFormInformation(): FormInputData | void {
        const title: string = this.titleElement.value;
        const description: string = this.descriptionElement.value;
        const people: string = this.peopleElement.value;

        const titleValidateable: Validateable = {
            value: title,
            required: true,
            minlength: 5,
        };

        const descriptionValidateable: Validateable = {
            value: description,
            required: true,
            minlength: 5,
        };

        const peopleValidateable: Validateable = {
            value: people,
            required: true,
            min: 1,
            max: 5,
        };

        if (
            !Validate(titleValidateable) ||
            !Validate(descriptionValidateable) ||
            !Validate(peopleValidateable)
        ) {
            alert("Invalid Input ....😜");
            return;
        }
        return [title, description, parseInt(people)];
    }

    private clearInput() {
        this.descriptionElement.value = "";
        this.peopleElement.value = "";
        this.titleElement.value = "";
    }
    @autobind
    private formSubmitHandler(event: Event) {
        event.preventDefault();
        const userInput = this.retrieveAllFormInformation();
        if (Array.isArray(userInput)) {
            const [title, description, people] = userInput;
            state.addProject(title, description, people);
            this.clearInput();
        }
    }

    configure() {
        this.element.addEventListener("submit", this.formSubmitHandler);
    }
}

class DragDropListFragment
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

(function main() {
    const pdg = new DragDropInputFragment(
        "project-input",
        "app",
        true,
        "user-input"
    );
    const activeProject = new DragDropListFragment(
        "project-list",
        "app",
        false,
        "active"
    );
    const finishedProject = new DragDropListFragment(
        "project-list",
        "app",
        false,
        "finished"
    );
})();
