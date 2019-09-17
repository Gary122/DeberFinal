export class Ticket {
    gambleNumber: number;
    owner: string;

    public constructor(init?:Partial<Ticket>) {
        Object.assign(this, init);
    }

    public static compare(a: Ticket, b: Ticket) {
        if (a.gambleNumber < b.gambleNumber)
            return -1;
        if (a.gambleNumber > b.gambleNumber)
            return 1;
        return 0;
    }
}
