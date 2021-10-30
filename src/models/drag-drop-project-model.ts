export enum DragDropProjectStatus {
    Active,
    Finished,
}

export class DragDropProject {
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public people: number,
        public status: DragDropProjectStatus
    ) {}
}
