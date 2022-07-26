import {Position} from '@/shared/position';

export class Thing {
	id: number;
	type: string | null;
	data: any | null;
	position: Position;
	stackPos: number;

	constructor() {
		this.id = 0;
		this.type = null;
		this.data = null;
		this.position = new Position(0, 0, 7);
		this.stackPos = 0;
	}
}
