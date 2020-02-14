import { Component, ElementRef, forwardRef, HostListener, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject, fromEvent, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

const KEY_CODE = {
  enter: 13,
  arrowUp: 38,
  arrowDown: 40,
  esc: 27,
};

const CSS_CLASS_NAMES = {
  highLight: 'dd-highlight-item',
};

@Component({
  selector: 'app-select-dropdown',
  templateUrl: './select-dropdown.component.html',
  styleUrls: ['./select-dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectDropdownComponent),
      multi: true
    }
  ]
})
export class SelectDropdownComponent implements OnInit, ControlValueAccessor {
  @Input()
  set list(list: any[]) {
    this._list.next(list);
  }

  set items(list) {
    this._items = list;
  }
  get items(): Array<{ id: number, text: string }> {
    return this._items;
  }
  get value() {
    return this._value;
  }

  set value(val) {
    this._value = val;
  }

  get text() {
    return this._text;
  }
  set text(value) {
    this._text = value;
  }
  constructor(private elemRef: ElementRef) {
    this.pressEnterKey = this.keyDowns.pipe(filter((e: KeyboardEvent) => e.keyCode === KEY_CODE.enter));
  }
  @ViewChild('filterInput', { static: false }) filterInput: ElementRef;
  @ViewChild('textLabel', { static: false }) textLabel: ElementRef;
  @ViewChildren('listItems') listItems: QueryList<ElementRef>;
  _items = [];

  _list = new BehaviorSubject<any[]>([]);
  @Input() placeholder = 'Select';
  @Input() classIcon = '';
  _value: string;
  _text = 'Select';

  isListHide = true;

  searchText = '';

  keyDowns: Observable<KeyboardEvent> = fromEvent(this.elemRef.nativeElement, 'keydown');

  pressEnterKey: Observable<KeyboardEvent>;

  onChange: any = () => { };
  onTouched: any = () => { };

  ngOnInit() {
    setTimeout(() => {

      this._list.subscribe((list) => {
        this.items = list;
        this.setItem(this.findItem(this.value));
      });
    }, 100);

    this.pressEnterKey.pipe(filter(() => !this.isListHide)).subscribe(() => {
      const hightLightItem = this.listItems.find((elem) => elem.nativeElement.classList.contains(CSS_CLASS_NAMES.highLight));
      if (hightLightItem) {
        const item = JSON.parse(hightLightItem.nativeElement.getAttribute('data-dd-value'));
        this.setItem(item);
        this.onChange(item.id);
      }
    });

    this.pressEnterKey.subscribe((e) => {
      this.toggle();
    });

    this.keyDowns.pipe(filter((e) => e.keyCode === KEY_CODE.esc)).subscribe(() => {
      this.isListHide = true;
      this.focus();
    });

    this.keyDowns.pipe(filter((e) => ((e.keyCode === KEY_CODE.arrowDown || e.keyCode === KEY_CODE.arrowUp) && !this.isListHide))).subscribe((e) => {
      this.moveUpAndDown(e.keyCode);
    });
  }

  scrollToView(elem?: HTMLElement) {
    if (elem) {
      setTimeout(() => { elem.scrollIntoView(false); }, 0);
    } else {
      const selectedItem = this.listItems.find((item) => JSON.parse(item.nativeElement.getAttribute('data-dd-value')).id === this.value);
      if (selectedItem) {
        setTimeout(() => selectedItem.nativeElement.scrollIntoView(false), 0);
      }
    }
  }

  toggle() {
    this.isListHide = !this.isListHide;
    this.searchText = '';
    if (!this.isListHide) {
      setTimeout(() => this.filterInput.nativeElement.focus(), 0);
      this.listItems.forEach((item) => {
        if (JSON.parse(item.nativeElement.getAttribute('data-dd-value')).id === this.value) {
          this.addHightLightClass(item.nativeElement);
          this.scrollToView(item.nativeElement);
        } else {
          this.removeHightLightClass(item.nativeElement);
        }
      });
    }
  }

  focus() {
    setTimeout(() => this.textLabel.nativeElement.focus(), 0);
  }

  onItemSelect(item: { id: any; }) {
    this.setItem(item);
    this.toggle();
    if (item !== undefined) {
      this.onChange(item.id);
    } else {
      this.onChange('');
    }
    this.focus();
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  findItem(value: string) {
    return this.items.find((item) => +item.id === +value);
  }

  writeValue(value: string) {
    const item = this.findItem(value);
    this.value = value;
    this.text = item ? item.text : '';
  }

  setItem(item: { id: any; text?: any; }) {
    if (item) {
      if (item.id) {
        this.value = item.id;
      }
      if (item.text) {
        this.text = item.text;
      }
    } else {
      this.value = '';
      this.text = this.placeholder;
    }
  }

  onKeyPress(e: KeyboardEvent) {
    if (e.keyCode === KEY_CODE.enter) {
      this.focus();
      return false;
    }
  }

  addHightLightClass(elem: HTMLElement) {
    elem.classList.add(CSS_CLASS_NAMES.highLight);
  }

  removeHightLightClass(elem: HTMLElement) {
    elem.classList.remove(CSS_CLASS_NAMES.highLight);
  }

  moveUpAndDown(key: number) {
    const selectedItem = this.listItems.find((li) => li.nativeElement.classList.contains(CSS_CLASS_NAMES.highLight));
    if (selectedItem) {
      let hightLightedItem: HTMLElement;
      if (key === KEY_CODE.arrowUp) {
        // Check for first element
        if (selectedItem !== this.listItems.first) {
          hightLightedItem = selectedItem.nativeElement.previousSibling;
        }
      } else if (key === KEY_CODE.arrowDown) {
        // Check for last element
        if (selectedItem !== this.listItems.last) {
          hightLightedItem = selectedItem.nativeElement.nextSibling;
        }
      }
      if (hightLightedItem) {
        this.clearHightClass();
        this.removeHightLightClass(selectedItem.nativeElement);
        this.addHightLightClass(hightLightedItem);
        this.scrollToView(hightLightedItem);
      }
    } else {
      let highLightedItem: ElementRef;
      if (key === KEY_CODE.arrowUp) {
        highLightedItem = this.listItems.last;
      } else if (key === KEY_CODE.arrowDown) {
        highLightedItem = this.listItems.first;
      }
      if (highLightedItem) {
        this.addHightLightClass(highLightedItem.nativeElement);
        this.scrollToView(highLightedItem.nativeElement);
      }
    }
  }

  isSelected(item: { id: number, text: string }) {
    return +item.id === +this.value;
  }

  stringify(item: any) {
    return JSON.stringify(item);
  }

  onHover(event: MouseEvent) {
    this.clearHightClass();
    const target = event.target as HTMLElement;
    if (event.type === 'mouseover') {
      target.classList.add(CSS_CLASS_NAMES.highLight);
    } else {
      target.classList.remove(CSS_CLASS_NAMES.highLight);
    }
  }

  clearHightClass() {
    this.listItems.forEach((item) => {
      this.removeHightLightClass(item.nativeElement);
    });
  }

  @HostListener('document:touchend', ['$event'])
  @HostListener('document:click', ['$event'])
  onClick(ev: MouseEvent) {
    const clickInside = this.elemRef.nativeElement.contains(ev.target);
    if (!clickInside) {
      this.isListHide = true;
    }
  }
}
