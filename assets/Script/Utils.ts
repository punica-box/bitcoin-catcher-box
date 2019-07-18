export class utils {
    static hexstring2ab(str: string): number[] {
        const result = [];
    
        while (str.length >= 2) {
            result.push(parseInt(str.substring(0, 2), 16));
            str = str.substring(2, str.length);
        }
    
        return result;
    }
    
    static ab2str(buf: ArrayBuffer | number[]): string {
        return String.fromCharCode.apply(null, new Uint8Array(buf));
    }
    
    static toUtf8(str: string) {
        return this.ab2str(this.hexstring2ab(str));
    }
}
