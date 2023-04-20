import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { GhButtonModule } from '@ctrl/ngx-github-buttons';

import { ColorAlphaModule } from '../lib/alpha/alpha-picker.component';
import { ColorBlockModule } from '../lib/block/block.component';
import { ColorChromeModule } from '../lib/chrome/chrome.component';
import { ColorCircleModule } from '../lib/circle/circle.component';
import { ColorCompactModule } from '../lib/compact/compact.component';
import { ColorHueModule } from '../lib/hue/hue-picker.component';
import { ColorMaterialModule } from '../lib/material/material.component';
import { ColorPhotoshopModule } from '../lib/photoshop/photoshop.component';
import { ColorSketchModule } from '../lib/sketch/sketch.component';
import { ColorSliderModule } from '../lib/slider/slider.component';
import { ColorSwatchesModule } from '../lib/swatches/swatches.component';
import { ColorTwitterModule } from '../lib/twitter/twitter.component';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer.component';
import { ColorShadeModule } from '../lib/shade/shade-picker.component';
import { RxColorpickerDirective } from '../app/rx-colorpicker.directive';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, FooterComponent],
  imports: [
    BrowserModule,

    GhButtonModule,

    ColorAlphaModule,
    ColorBlockModule,
    ColorChromeModule,
    ColorCircleModule,
    ColorCompactModule,
    ColorHueModule,
    ColorMaterialModule,
    ColorPhotoshopModule,
    ColorSketchModule,
    ColorSliderModule,
    ColorSwatchesModule,
    ColorTwitterModule,
    ColorShadeModule,
    RxColorpickerDirective,
    NgbPopover,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
