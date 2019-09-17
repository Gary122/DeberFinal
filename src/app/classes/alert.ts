import { AlertLevel } from './alert-level.enum';

export class Alert {
    level: AlertLevel;
    message: string;

    public constructor(init?:Partial<Alert>) {
        Object.assign(this, init);
    }
}
