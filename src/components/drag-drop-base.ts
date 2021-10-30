export default abstract class Component<
    T extends HTMLElement,
    U extends HTMLElement
> {
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
