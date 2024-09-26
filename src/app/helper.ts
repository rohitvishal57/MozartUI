import { FormGroup, FormBuilder } from '@angular/forms';

export class Helper {
    public static isNumberValidation(e:any) {

        let allowedKeys = [46, 8, 9, 27, 13, 110, 190];
        if (allowedKeys.some(k => k == e.keyCode) ||
            // Allow: Ctrl/cmd+A
            (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: Ctrl/cmd+C
            (e.keyCode == 67 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: Ctrl/cmd+X
            (e.keyCode == 88 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    }
    public static _normalizeValue(value: string): string {
        if (typeof (value) === 'string') {
            return value.toLowerCase().replace(/\s/g, '');
        } else {
            return value;
        }
    }

}
