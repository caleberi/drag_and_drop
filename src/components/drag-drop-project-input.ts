import { Validateable, Validate } from "./../utils/drag-drop-validation";
import Component from "./drag-drop-base";
import { autobind } from "../decorators/autobind";
import { state } from "../state/drag-drop-project-state";

type FormInputData = [string, string, number];

export class DragDropInputFragment extends Component<
    HTMLFormElement,
    HTMLDivElement
> {
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
