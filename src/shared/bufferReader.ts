export class BufferReader {
	arr: Uint8Array;
	buffer: DataView;
	position: number;

	constructor(arr: Uint8Array) {
		this.arr = arr;
		this.buffer = new DataView(this.arr);
		this.position = 0;
	}

	getPosition(): number {
		return this.position;
	}

	skipBytes(number: number): void {
		this.position += number;
	}

	getByte(): number {
		return this.buffer.getUint8(this.position++);
	}

	getUInt16(): number {
		const uint16 = this.buffer.getUint16(this.position, true);
		this.position += 2;
		return uint16;
	}

	peekUInt16(): number {
		return this.buffer.getUint16(this.position, true);
	}

	getUInt16BE(): number {
		const uint16 = this.buffer.getUint16(this.position, false);
		this.position += 2;
		return uint16;
	}

	getUInt32(): number {
		const uint32 = this.buffer.getUint32(this.position, true);
		this.position += 4;
		return uint32;
	}

	getUInt32BE(): number {
		const uint32 = this.buffer.getUint32(this.position, false);
		this.position += 4;
		return uint32;
	}

	getString() {
		const stringLength = this.getUInt16();
		const arr = new Uint8Array(this.arr, this.getPosition(), stringLength);
		this.skipBytes(stringLength);
		return new TextDecoder().decode(arr);
	}

	getBuffer(length: number): Uint8Array {
		const buffer = this.arr.slice(this.position, this.position + length);
		this.position += length;
		return buffer;
	}

	getSomeBuffer(length: number): DataView {
		return new DataView(this.arr.slice(this.position, this.position + length));
	}
}
