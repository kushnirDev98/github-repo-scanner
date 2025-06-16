export class Repository {
    constructor(
        public name: string,
        public size: number,
        public owner: string,
        public isPrivate: boolean,
        public fileCount: number,
        public ymlContent: string | null,
        public activeWebhooks: string[]
    ) {}

    static createListItem(data: { name: string; size: number; owner: string }) {
        return { name: data.name, size: data.size, owner: data.owner };
    }
}
