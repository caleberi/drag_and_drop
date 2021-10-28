 

type FormInputData = [string,string,number];


interface Validateable{
    value:string|number,
    required?:boolean,
    minlength?:number,
    maxlength?:number,
    min?:number,
    max?:number
}


function AutoBind(_:any,_2:string,descriptor:PropertyDescriptor){
    const originalMethod :Function = descriptor.value ;
    const adjustedDescriptor : PropertyDescriptor = {
        configurable:true,
        get(){
            return originalMethod.bind(this);
        }
    }
    return adjustedDescriptor;
}


function Validate(input:Validateable){
    let isValid = true;
    if (input.required){
        isValid = isValid && input.value.toString().trim().length!==0
    }

    if (input.minlength != null && typeof input.minlength === "string" ){
        isValid = isValid && (input.value as string).length  > input.minlength;
    }

    if (input.maxlength != null && typeof input.maxlength === "string" ){
        isValid = isValid && (input.value as string).length  < input.maxlength;
    }

    if (input.min != null && typeof input.min === "number" ){
        isValid = isValid && (input.value as number)  > input.min;
    }

    if (input.max != null && typeof input.max === "number" ){
        isValid = isValid && (input.value as number)  < input.max;
    }
    return isValid;
}

class DragDropInputFragment{
    templateElement:HTMLTemplateElement;
    rootElement:HTMLDivElement;
    formElement:HTMLElement;
    descriptionElement:HTMLTextAreaElement;
    titleElement:HTMLInputElement;
    peopleElement:HTMLInputElement;

    constructor(){
        this.templateElement =  document.getElementById("project-input")! as HTMLTemplateElement;
        this.rootElement =  document.getElementById("app") as HTMLDivElement;
        const node = document.importNode(this.templateElement.content,true);
        this.formElement = node.firstElementChild as HTMLFormElement;
        this.formElement.id = "user-input";
        this.descriptionElement =  this.formElement.querySelector("#description") as HTMLTextAreaElement;
        this.titleElement =  this.formElement.querySelector("#title") as HTMLInputElement;
        this.peopleElement = this.formElement.querySelector("#people") as HTMLInputElement;
        this.configure();
        this.attachToRootElement();
    }

    private attachToRootElement(){
        this.rootElement.insertAdjacentElement("afterbegin",this.formElement);
    }

    private retrieveAllFormInformation():FormInputData|void{
        const title:string = this.titleElement.value;
        const description:string = this.descriptionElement.value;
        const people:string =  this.peopleElement.value;

        const titleValidateable: Validateable = {
            value:title,
            required:true,
            minlength:5
        }

        const  descriptionValidateable: Validateable = {
            value:description,
            required:true,
            minlength:5
        }

        const peopleValidateable:Validateable = {
            value:people,
            required:true,
            min:1,
            max:5
        }

        if(
            !Validate(titleValidateable)|| 
            !Validate(descriptionValidateable) ||
            !Validate(peopleValidateable)
        ){
            alert("Invalid Input ....😜");
            return;
        }
        return [title,description,parseInt(people)];
    }
    
    // private validateInputLength( title: string, description: string, people: string) {
    //     return title.trim().length === 0 ||
    //         description.trim().length === 0 ||
    //         people.trim().length === 0;
    // }

    private clearInput(){
        this.descriptionElement.value="";
        this.peopleElement.value = "";
        this.titleElement.value = "";

    }
    @AutoBind
    private formSubmitHandler(event:Event){
        event.preventDefault();
        const userInput = this.retrieveAllFormInformation();
        if(Array.isArray(userInput)){
            const [title,description,people] = userInput;
            console.log([title,description,people]);
            
            this.clearInput();
        }
    }

    private configure(){
        this.formElement.addEventListener("submit",this.formSubmitHandler);
    }
}


class DragDropListFragment{
    templateElement:HTMLTemplateElement;
    rootElement:HTMLDivElement;
    sectionElement:HTMLElement;

    constructor(private readonly type:'active'|'finished'){
        this.templateElement = document.getElementById("project-list") as HTMLTemplateElement ;
        this.rootElement =  document.getElementById("app") as HTMLDivElement;
        const importedNode:DocumentFragment =  document.importNode(this.templateElement.content,true);
        this.sectionElement =  importedNode.firstElementChild as HTMLElement;
        this.sectionElement.id = `${this.type}-projects`;
        this.attachToRootElement();
        this.renderContent();
    }

    
    private renderContent(){
        const listID = `${this.type}-projects-list`;
        this.sectionElement.querySelector("ul")!.id=listID;
        this.sectionElement.querySelector("h2")!.textContent = this.type.toUpperCase() + ' PROJECTS';
    }
    private attachToRootElement(){
        this.rootElement.insertAdjacentElement("beforeend",this.sectionElement);
    }
}
const pdg = new DragDropInputFragment();
const activeProject =  new DragDropListFragment("active");
const finishedProject = new DragDropListFragment("finished");
