import { Component, ViewChild } from '@angular/core';

import { ColorEvent } from 'ngx-color';
import { RxColorpickerDirective } from './rx-colorpicker.directive';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild(RxColorpickerDirective) vc!: RxColorpickerDirective;
  title = 'app';
  rxColor!: string;
  rxColor1!: string;
  state = {
    h: 150,
    s: 0.50,
    l: 0.20,
    a: 1,
  };

  ngOnInit(){
    this.rxColor = '#194D33';
    this.rxColor1 = '#194D33';
  }

  changeComplete($event: ColorEvent): void {
    this.state = $event.color.hsl;
    //this.rxColor = $event.color.hex;
    //console.log('changeComplete', $event);
  }

  textColor($event: ColorEvent, bypass?: boolean) {
    console.log('select',bypass, $event);
  }

  colorPickerCancel() {
    console.log('colorPickerCancel function call');
  }

  applyColorToAll() {
    console.log('applyColorToAll function call');
  }
}
