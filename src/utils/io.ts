import {createWriteStream} from 'fs';
import {stdout} from 'process';
import {createInterface} from 'readline';

export function createInputStream(stream: any) {
  return createInterface({
    input: stream,
    crlfDelay: Infinity,
  }) as any as Iterable<string>;
}

export function createOutputStream(stream: string) {
  if (stream === 'STDOUT') {
    const outStream: any = stdout;
    outStream._handle.setBlocking(true);
    return outStream;
  }
  return createWriteStream(stream);
}
