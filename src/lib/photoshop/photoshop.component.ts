import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ComponentRef, ElementRef, EventEmitter, forwardRef, HostListener, Input, NgModule, Output, TemplateRef, ViewChild } from '@angular/core';

import { AlphaModule, ColorWrap, EditableInputModule, HueModule, isValidHex, SaturationModule, SwatchModule } from 'ngx-color';
import { PhotoshopButtonComponent } from './photoshop-button.component';
import { PhotoshopFieldsComponent } from './photoshop-fields.component';
import { PhotoshopPreviewsComponent } from './photoshop-previews.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgbPopover, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { ColorGithubModule, GithubComponent } from '../github/github.component';
import { HSV, RGB, TinyColor } from '@ctrl/tinycolor';

declare let html2canvas: any;

@Component({
  selector: 'color-photoshop',
  template: `
  <button class="d-none"  [ngbPopover]="colorPicker" #rxColorpicker="ngbPopover" triggers="manual" autoClose="outside" [positionTarget]="elPositionTarget" (close)="closePopover" container="body" (hidden)="closePopover()" popoverClass="predefined-popover"></button>

  <ng-template #colorPicker>
  <div class="photoshop-picker {{ className }}" >
    <div class="photoshop-body">
      <div class="swatch-action-button" [hidden]="!appConfiguration.propertyPanel.fix">
        <a class="showmore" href="javascript:void(0);" (click)="setActiveSwatches()">Swatches</a>
        <br>
        <a class="showless" href="javascript:void(0);" (click)="setACtiveColorSelector()">Color Selector</a>
      </div>
      <div *ngIf="swatches && (options.defaultPart.indexOf('swatches') > -1)">
        <color-github-swatch  class="swatchcolorlist"
          (onClick)="handleBlockChange($event)"
          (onSwatchHover)="onSwatchHover.emit($event)"
          ></color-github-swatch>
        <color-github-swatch  class="swatchcolorlist" *ngFor="let color of colors"
          [color]="color"
          (onClick)="handleBlockChange($event)"
          (onSwatchHover)="onSwatchHover.emit($event)"
          ></color-github-swatch>
      </div>

      <div class="photoshop-saturation" *ngIf="colorSelector === true && (options.defaultPart.indexOf('map') > -1)">
        <color-saturation
          [hsl]="hsl" [hsv]="hsv" [circle]="circle"
          (onChange)="handleValueChange($event)"
        ></color-saturation>
      </div>
      <div class="photoshop-hue" *ngIf="colorSelector === true && (options.defaultPart.indexOf('bar') > -1)">
        <color-hue direction="vertical"
          [hsl]="hsl" [hidePointer]="true"
          (onChange)="handleValueChange($event)"
        ></color-hue>
      </div>
      <div class="photoshop-controls">
        <div class="photoshop-middle">
        <div class="cpEyedropColorinfo"><span class="hovercolor" ></span><span class="hovercolorText" ></span></div><div class="cpEyedropOverlay"></div>

        <a class="btn-color-eyedropper" *ngIf="appConfiguration.config.colorPaletteOption.enableEyedropper === true && swatches"  (click)="eyeDropperOpen($event)" >Pick Color</a>

          <color-photoshop-fields
              [rgb]="rgb" [hex]="hex" [hsv]="hsv" [showRGB]="(options.defaultPart.indexOf('rgb') > -1) && colorSelector" [showHex]="(options.defaultPart.indexOf('hex') > -1)"
              (onChange)="handleValueChange($event)"
            ></color-photoshop-fields>

          <!-- <div *ngIf="(options.defaultPart.indexOf('cmyk') > -1) && colorSelector">
           <color-editable-input
            [style]="{input: RGBinput, wrap: RGBwrap, label: RGBlabel}"
            [value]="cmyk.c"
            label="c"
            (onChange)="handleValueChange($event)"
          ></color-editable-input>
          <color-editable-input
            [value]="cmyk.m"
            label="m"
            (onChange)="handleValueChange($event)"
            [style]="{input: RGBinput, wrap: RGBwrap, label: RGBlabel}"
          ></color-editable-input>
          <color-editable-input
            [value]="cmyk.y"
            label="y"
            (onChange)="handleValueChange($event)"
            [style]="{input: RGBinput, wrap: RGBwrap, label: RGBlabel}"
          ></color-editable-input>
          <color-editable-input
            [value]="cmyk.k"
            label="k"
            (onChange)="handleValueChange($event)"
            [style]="{input: RGBinput, wrap: RGBwrap, label: RGBlabel}"
          ></color-editable-input>
          </div> -->

          <div class="colorpicker-used-hex-colosr" *ngIf="swatches && appConfiguration.config.colorPaletteOption.enableUsedColor">
            <div class="cpUsedColors">
              <p class="text-black-50 mb-0 mt-2">Recently Used</p>
                <div class="ui-colorpicker-swatches-container-used-color">
                <color-github-swatch  class="swatchcolorlist" *ngFor="let color of options.usedColorsForColorPicker"
                  [color]="color"
                  (onClick)="handleBlockChange($event)"
                  (onSwatchHover)="onSwatchHover.emit($event)"
                ></color-github-swatch>
              </div>
            </div>
          </div>

        </div>
        <div class="photoshop-top">
          <div class="photoshop-actions">


          <ul class="newcolor ui-colorpicker-preview list-inline mt-1 mb-0 h-auto">
              <li class="list-inline-item">
                <div class="ui-colorpicker-preview-initial">
                  <div class="ui-colorpicker-preview-initial-alpha">
                  </div>
                </div>
              </li>
              <li class="list-inline-item"><i class="fas fa-long-arrow-right fa-lg"></i></li>
              <li class="list-inline-item mr-0">
                <div class="ui-colorpicker-preview-current">
                  <div class="ui-colorpicker-preview-current-alpha">
                  </div>
                </div>
              </li>
              <li>

              </li>
          </ul>

              <div class="photoshop-previews">
                <color-photoshop-previews
                  [rgb]="rgb" [currentColor]="currentColor"
                ></color-photoshop-previews>
              </div>

              <button [hidden]="appConfiguration.propertyPanel.fix" (click)="applyToAllButton($event)" type="button" class="btn btn-dark btn-sm">Apply to all</button>
              <button [hidden]="!appConfiguration.propertyPanel.fix" (click)="applyToAllButton($event)" type="button" class="btn btn-link"><u>Apply to all</u></button>



            <color-photoshop-button label="OK"
              [active]="true" (onClick)="onAccept.emit($event)"
            ></color-photoshop-button>
            <color-photoshop-button label="Cancel"
              (onClick)="onCancel.emit($event)"
            >
            </color-photoshop-button>

          </div>
        </div>
      </div>
    </div>
  </div>
</ng-template>

  `,
  styles: [
    `
    .photoshop-picker {
      background: rgb(220, 220, 220);
      border-radius: 4px;
      box-shadow: rgba(0, 0, 0, 0.25) 0px 0px 0px 1px, rgba(0, 0, 0, 0.15) 0px 8px 16px;
      box-sizing: initial; width: 513px;
    }
    .photoshop-head {
      background-image: linear-gradient(
        -180deg,
        rgb(240, 240, 240) 0%,
        rgb(212, 212, 212) 100%
      );
      border-bottom: 1px solid rgb(177, 177, 177);
      box-shadow: rgba(255, 255, 255, 0.2) 0px 1px 0px 0px inset,
        rgba(0, 0, 0, 0.02) 0px -1px 0px 0px inset;
      height: 23px;
      line-height: 24px;
      border-radius: 4px 4px 0px 0px;
      font-size: 13px;
      color: rgb(77, 77, 77);
      text-align: center;
    }
    .photoshop-body {
      padding: 15px 15px 0px;
      display: flex;
    }
    .photoshop-saturation {
      width: 256px;
      height: 256px;
      position: relative;
      border-width: 2px;
      border-style: solid;
      border-color: rgb(179, 179, 179) rgb(179, 179, 179) rgb(240, 240, 240);
      border-image: initial;
      overflow: hidden;
    }
    .photoshop-hue {
      position: relative;
      height: 256px;
      width: 23px;
      margin-left: 10px;
      border-width: 2px;
      border-style: solid;
      border-color: rgb(179, 179, 179) rgb(179, 179, 179) rgb(240, 240, 240);
      border-image: initial;
    }
    .photoshop-controls {
      width: 180px;
      margin-left: 10px;
    }
    .photoshop-top {
      display: flex;
    }
    .photoshop-previews {
      width: 60px;
    }
    .photoshop-actions {
      -webkit-box-flex: 1;
      flex: 1 1 0%;
      margin-left: 20px;
    }

    .swatchcolorlist {
        margin: 0 0.188rem 0.21rem 0 !important;
        height: 1.22rem !important;
        width: 1.22rem !important;
        padding: 0 !important;
        float: left !important;
        border-color: #a9a9a9 !important;
        font-size: .7rem !important;
        border-radius: 0.175rem !important;
        border-color: red !important;
        border-radius: 0.25rem !important;
      }



  `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhotoshopComponent),
      multi: true,
    },
    {
      provide: ColorWrap,
      useExisting: forwardRef(() => PhotoshopComponent),
    },
  ]
})
export class PhotoshopComponent extends ColorWrap {
  private componentRef!: ComponentRef<PhotoshopComponent>;

  /** Title text */
  @Input() directiveInstance : any;
  @Input() color!: string;
  @Input() options!: any;

  @Input() elPositionTarget!: HTMLElement;

  // @Input() rgb!: RGB;
  // @Input() hsv!: HSV;
  // @Input() hex!: string;
  // @Output() onChange = new EventEmitter<any>();

  @Output() onAccept = new EventEmitter<Event>();
  @Output() onCancel = new EventEmitter<Event>();
  @Output() applyToAll = new EventEmitter<Event>();

  @ViewChild('rxColorpicker') rxColorpicker!: NgbPopover;
  @ViewChild('component') componentTemp!: ElementRef;

  RGBinput: Record<string, string> = {
    marginLeft: '35%',
    width: '40%',
    height: '22px',
    border: '1px solid rgb(136, 136, 136)',
    boxShadow:
      'rgba(0, 0, 0, 0.1) 0px 1px 1px inset, rgb(236, 236, 236) 0px 1px 0px 0px',
    marginBottom: '2px',
    fontSize: '13px',
    paddingLeft: '3px',
    marginRight: '10px',
  };
  RGBwrap: Record<string, string> = {
    position: 'relative',
  };
  RGBlabel: Record<string, string> = {
    left: '0px',
    width: '34px',
    textTransform: 'uppercase',
    fontSize: '13px',
    height: '24px',
    lineHeight: '24px',
    position: 'absolute',
  };
  HEXinput: Record<string, string> = {
    marginLeft: '20%',
    width: '80%',
    height: '22px',
    border: '1px solid #888888',
    boxShadow: 'inset 0 1px 1px rgba(0,0,0,.1), 0 1px 0 0 #ECECEC',
    marginBottom: '3px',
    fontSize: '13px',
    paddingLeft: '3px',
  };
  HEXwrap: Record<string, string> = {
    position: 'relative',
  };
  HEXlabel: Record<string, string> = {
    position: 'absolute',
    top: '0px',
    left: '0px',
    width: '14px',
    textTransform: 'uppercase',
    fontSize: '13px',
    height: '24px',
    lineHeight: '24px',
  };

  @Input() colors = [
    '#B80000',
    '#DB3E00',
    '#FCCB00',
    '#008B02',
    '#006B76',
    '#1273DE',
    '#004DCF',
    '#5300EB',
    '#EB9694',
    '#FAD0C3',
    '#FEF3BD',
    '#C1E1C5',
    '#BEDADC',
    '#C4DEF6',
    '#BED3F3',
    '#D4C4FB',
  ];
  circle = {
    width: '12px',
    height: '12px',
    borderRadius: '6px',
    boxShadow: 'rgb(255, 255, 255) 0px 0px 0px 1px inset',
    transform: 'translate(-6px, -10px)',
  };

  // cmyk : any = {
  //   c: 0,
  //   m: 0,
  //   y: 0,
  //   k: 0,
  // }


  swatches!: boolean;
  colorSelector!: boolean;
  defaultPart: any;
  appConfiguration: any;
  pickColorObject: any = false;
  isActive!: boolean;

  constructor(private elementRef: ElementRef) {
    super();
  }

  ngAfterViewInit(){
    this.defaultPart = this.options.defaultPart;
    this.appConfiguration = this.options.appConfiguration;
    if (this.appConfiguration.propertyPanel.fix === true) {
      this.swatches = true;
      this.colorSelector = false;
    } else {
      this.colorSelector = true;
    }
    this.rxColorpicker.open();
  }

  // Close Popover destroy Element
  closePopover(){
    this.elementRef.nativeElement.remove();
  }

  applyToAllButton($event) {
    this.applyToAll.emit($event);
  }

  setActiveSwatches() {
    this.swatches = true;
    this.colorSelector = false;
  }

  setACtiveColorSelector(){
    this.colorSelector = true;
    this.swatches = false;
  }

  handleBlockChange({ hex, $event }: { hex: string, $event: Event }) {
    if (isValidHex(hex)) {
      this.handleChange({ hex, source: 'hex' }, $event);
    } else {
      this.handleChange({ hex, source: 'hex', a : 0 }, $event);
    }
  }

  handleValueChange({ data, $event }) {
    this.handleChange(data, $event);
  }


  // handleValueChange({ data, $event }) {
  //   //debugger
  //   if (data['#']) {
  //     if (isValidHex(data['#'])) {
  //       this.onChange.emit({
  //         data: {
  //           hex: data['#'],
  //           source: 'hex',
  //         },
  //         $event,
  //       });
  //     }
  //   } else if (data.r || data.g || data.b) {
  //     this.onChange.emit({
  //       data: {
  //         r: data.r || this.rgb.r,
  //         g: data.g || this.rgb.g,
  //         b: data.b || this.rgb.b,
  //         source: 'rgb',
  //       },
  //       $event,
  //     });
  //   } else if (data.h || data.s || data.v) {
  //     this.onChange.emit({
  //       data: {
  //         h: data.h || this.hsv.h,
  //         s: data.s || this.hsv.s,
  //         v: data.v || this.hsv.v,
  //         source: 'hsv',
  //       },
  //       $event,
  //     });
  //   }
  // }

  eyeDropperOpen($event) {
    var documentBody = document.body;
    html2canvas( [ documentBody ], {
      useCORS: true,
      onrendered: (canvas) => {
        this.pickColorObject = canvas.getContext('2d');
        const cpEyedropColorinfo = document.getElementsByClassName('cpEyedropColorinfo')  as HTMLCollectionOf<HTMLElement>;
        const cpEyedropOverlay = document.getElementsByClassName('cpEyedropOverlay')  as HTMLCollectionOf<HTMLElement>;
        cpEyedropColorinfo[0].style.display = 'inline-block';
        cpEyedropOverlay[0].classList.add('active');
        this.setEyeDropper($event);
      }
    });
  }

  setEyeDropper( $event ) {
    var clientYDiff = 21; // bug: 158197 added condition for IE
    var p = this.pickColorObject.getImageData($event.clientX, $event.clientY + clientYDiff, 1, 1).data;
    const color = new TinyColor("rgb ("+p[0]+", "+p[1]+", "+p[2]+")");
    var colorCode = color.toHex();

    var infoLeft = $event.clientX - ((($event.clientX + 80)  >= document.documentElement.clientWidth ) ? 70 : -5 );
    var infoTop = $event.clientY - ((($event.clientY - 15)  <= 0 ) ? -20 : 25 );
    const cpEyedropColorinfo = document.getElementsByClassName('cpEyedropColorinfo')  as HTMLCollectionOf<HTMLElement>;
        cpEyedropColorinfo[0].style.display = 'inline-block';
        cpEyedropColorinfo[0].style.left = infoLeft.toString();
        cpEyedropColorinfo[0].style.top = infoTop.toString();

       const hovercolor = document.getElementsByClassName('hovercolor') as HTMLCollectionOf<HTMLElement>;
       hovercolor[0].style.background = '#'+colorCode;

       const hovercolorText = document.getElementsByClassName('hovercolorText') as HTMLCollectionOf<HTMLElement>;
       hovercolorText[0].innerHTML = colorCode.toUpperCase();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove($event) {
    if (this.pickColorObject !== false) {
      this.setEyeDropper($event);
    }
  }

  @HostListener('document:mousedown', ['$event'])
  onMouseDown($event) {
    if (this.pickColorObject !== false) {
      const cpEyedropColorinfo = document.getElementsByClassName('cpEyedropColorinfo')  as HTMLCollectionOf<HTMLElement>;
      const cpEyedropOverlay = document.getElementsByClassName('cpEyedropOverlay')  as HTMLCollectionOf<HTMLElement>;
      cpEyedropColorinfo[0].style.display = 'none';
      cpEyedropOverlay[0].classList.remove('active');
      var p = this.pickColorObject.getImageData($event.clientX, $event.clientY + 21, 1, 1).data;
      const color = new TinyColor("rgb ("+p[0]+", "+p[1]+", "+p[2]+")");
      this.color = '#'+color.toHex();
      this.handleChange(this.color, $event);
      this.pickColorObject = false;
    }
  }
}

@NgModule({
  declarations: [
    PhotoshopComponent,
    PhotoshopPreviewsComponent,
    PhotoshopButtonComponent,
    PhotoshopFieldsComponent,
  ],
  exports: [
    PhotoshopComponent,
    PhotoshopPreviewsComponent,
    PhotoshopButtonComponent,
    PhotoshopFieldsComponent,
  ],
  imports: [
    CommonModule,
    EditableInputModule,
    HueModule,
    AlphaModule,
    SwatchModule,
    SaturationModule,
    NgbPopoverModule,
    ColorGithubModule,
  ],
})
export class ColorPhotoshopModule {}
