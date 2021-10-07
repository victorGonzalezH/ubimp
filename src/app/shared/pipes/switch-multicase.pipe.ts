import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'switchMulticase'
})
export class SwitchMulticasePipe implements PipeTransform {

  transform(values: number[], arg: number): unknown {
    const argNumber : number = parseInt(String(arg));
    const result = values.includes(argNumber) ? arg : !arg;
    return result;
  }

}
