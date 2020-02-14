import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'textSearch'
})
export class TextSearchPipe implements PipeTransform {

    transform(items: any[], text?: any): any {
        if (!text) {
            return items;
        }
        return items.filter((item) => {
            if (item.text && typeof item.text === 'string') {
                return item.text.toLowerCase().indexOf(text.toLowerCase()) > -1;
            }
            return false;
        });
    }

}
