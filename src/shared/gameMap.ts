import {Position} from '@/shared/position';
import {Thing} from '@/shared/Thing';

export class GameMap {
	things: any[];
	creatures: any;
	centralPosition: Position | null;

	constructor() {
		this.things = [];
		this.creatures = {};
		this.centralPosition = null;
	}

	removeTile(position: Position) {
		if (this.things[position.z] && this.things[position.z][position.y]) {
			delete this.things[position.z][position.y][position.x];
		}
	}

	addThing(thing: Thing, position: any, stackPos: number): void {
		if (!this.things[position.z]) {
			this.things[position.z] = {};
		}

		if (!this.things[position.z][position.y]) {
			this.things[position.z][position.y] = {};
		}

		if (!this.things[position.z][position.y][position.x]) {
			this.things[position.z][position.y][position.x] = [];
		}

		const size = this.things[position.z][position.y][position.x].length;

		// priority                                    854
		// 0 - ground,                        -->      -->
		// 1 - ground borders                 -->      -->
		// 2 - bottom (walls),                -->      -->
		// 3 - on top (doors)                 -->      -->
		// 4 - creatures, from top to bottom  <--      -->
		// 5 - items, from top to bottom      <--      <--
		if (stackPos < 0 || stackPos == 255) {
			const priority = this.getStackPriority(thing);

			// -1 or 255 => auto detect position
			// -2        => append

			let append;

			if (stackPos == -2) {
				append = true;
			} else {
				append = priority <= 3;

				// newer protocols does not store creatures in reverse order
				if (priority == 4) {
					append = !append;
				}
			}

			for (stackPos = 0; stackPos < size; ++stackPos) {
				const otherPriority = this.getStackPriority(this.things[position.z][position.y][position.x][stackPos]);
				if ((append && otherPriority > priority) || (!append && otherPriority >= priority)) {
					break;
				}
			}
		} else if (stackPos > size) {
			stackPos = size;
		}

		thing.position = position;
		thing.stackPos = stackPos;

		if (thing.type === 'creature') {
			this.creatures[thing.data.id] = thing;
		}

		this.things[position.z][position.y][position.x].splice(stackPos, 0, thing);
	}

	getThing(position: Position, stackPos: number): Thing | null {
		if (!this.things[position.z] || !this.things[position.z][position.y] || !this.things[position.z][position.y][position.x]) {
			return null;
		}

		return this.things[position.z][position.y][position.x][stackPos];
	}

	getCreatureById(id: number): Thing {
		return this.creatures[id];
	}

	removeThing(position: Position, stackPos: number) {
		if (this.things[position.z] && this.things[position.z][position.y] && this.things[position.z][position.y][position.x]) {
			this.things[position.z][position.y][position.x].splice(stackPos, 1);
		}
	}

	getStackPriority(thing: Thing): number {
		if (thing.type === 'item' && thing.data.attributes[0]) {
			return 0;
		}

		if (thing.type === 'item' && thing.data.attributes[1]) {
			return 1;
		}

		if (thing.type === 'item' && thing.data.attributes[2]) {
			return 2;
		}

		if (thing.type === 'item' && thing.data.attributes[3]) {
			return 3;
		}

		if (thing.type === 'creature') {
			return 4;
		}

		return 5;
	}
}
