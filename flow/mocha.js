/* eslint no-unused-vars: 0 */
type BlockFn = (done?: (err?: Error) => void) => Promise|void;
declare function describe(description: string, block: BlockFn): void;
declare function it(description: string, block: BlockFn): void;
declare function before(block: BlockFn): void;
declare function after(block: BlockFn): void;
