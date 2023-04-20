import { ComponentRef, Directive, ElementRef, NgModule, Renderer2, ViewContainerRef, ApplicationRef, EmbeddedViewRef, HostListener, Input, ViewChild, TemplateRef, Output, EventEmitter, HostBinding } from '@angular/core';
import { PhotoshopComponent } from '../lib/photoshop/photoshop.component';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap/popover/popover';
import { ColorEvent } from 'ngx-color';
import { SafeStyle } from '@angular/platform-browser';

@Directive({
  selector: '[rx-colorpicker]',
  standalone: true,
  providers: []
})
export class RxColorpickerDirective {
  private componentRef!: ComponentRef<PhotoshopComponent>;
  @Input('selected-cmyk-color') selectedCmykColor!: string;
  @Input('ngModel') rxColor!: any;
  @Input('selected-specific-color') selectedSpecificColor!: any;

  @Output('ngModelChange') rxColorChange = new EventEmitter();

  @Output('on-color-change') onColorChange = new EventEmitter();
  @Output('on-color-select') onColorSelect = new EventEmitter();
  @Output('on-color-picker-cancel') onColorPickerCancel = new EventEmitter();
  @Output('on-color-picker-open') onColorPickerOpen = new EventEmitter();
  @Output('apply-to-all') applyToAll = new EventEmitter();

  lastSelectedColor : Record<string, any> = {
    color: '',
    cmyk: ''
  };
  primaryColor!: string;
  state!: any;
  hexColor!: string;
  rgbaColor!: any;
  color: any;
  private rxColorPickerInput : any;
  options: { [key: string]: any } = {};
  defaultPart : any;
  fixPropertyPanel!: boolean;
  appConfiguration : any = {
    studioType: 'normal',
    propertyPanel : {
      fix : true,
    },
    config: {
      blockColor: {
        colorspace: 'Lab'
      },
      colorPaletteOption: {
        labels: '',
        displayStyle: 1,
        advanceColorPalette: '',
        bindColors: '',
        enableEyedropper: true,
        enableUsedColor: true
      }
    }

  }

  constructor(private viewContainerRef: ViewContainerRef, private appRef: ApplicationRef, private renderer: Renderer2,private el: ElementRef) {
    this.defaultPart = [  'swatches', 'map', 'bar', 'rgb', 'hex', 'cmyk', 'preview'] ;
    if(this.appConfiguration.studioType === 'block') {
      var colorspace = this.appConfiguration.config.blockColor.colorspace;
      if(this.appConfiguration.config.blockColor != undefined && colorspace == 'Lab'){
        this.defaultPart = [  'swatches', 'map', 'bar', 'lab', 'preview'];//, 'lab'
      } else if(this.appConfiguration.config.blockColor != undefined && colorspace == 'DeviceCMYK') {
        this.defaultPart =[  'swatches', 'map', 'bar', 'hex', 'cmyk', 'preview'];
      } else if(this.appConfiguration.config.blockColor != undefined && colorspace == 'DeviceRGB') {
        this.defaultPart =[  'swatches', 'map', 'bar', 'rgb', 'hex' , 'preview'] ;
      }
    }

    this.options.defaultPart = this.defaultPart;
    this.options.appConfiguration = this.appConfiguration;
    //  this.fixPropertyPanel = (this.appConfiguration.propertyPanel.fix === true && rx.util.device.isMobileScreen() === false ? true : false);
    this.options.showCancelButton = true;
    this.options.usedColorsForColorPicker =  ['#f58634', '#485354', '#f05f9c', '#0098da', '#ff0000', '#000000', '#00ffff', '#815aa4', '#a8cf45', '#dc4949', '#d17131', '#cce7d4', '#6e4d8b', '#c75ea3', '#aba994', '#faa954', '#a53692', '#37dee2', '#e61919', '#040404'];

  }

  ngOnInit() {
    // this.lastSelectedColor.color = this.rxColor;
    this.el.nativeElement.style.background = this.rxColor;
  }



  @HostListener('click', ['$event, $event.target'])
  onClick() {
    this.openColorPicker();
  }

  openColorPicker() {
    this.lastSelectedColor.color = this.rxColor;
    this.el.nativeElement.style.background = this.rxColor;

    this.componentRef = this.viewContainerRef.createComponent(PhotoshopComponent);
    this.rxColorPickerInput = this.componentRef.instance;

    this.componentRef.instance.color = this.rxColor;
    //this.componentRef.instance.cmyk = { c:0,m:0,y:0,k:0};
    this.componentRef.instance.options = this.options;
    this.componentRef.instance.elPositionTarget = this.el.nativeElement;

    // On Change ColorPicker
    this.componentRef.instance.onChange.subscribe(($event) => {
      this.el.nativeElement.style.background = ($event.color.hex === 'transparent') ? "" : $event.color.hex;
      this.rxColorChange.emit(($event.color.hex === 'transparent') ? "" : $event.color.hex);
      this.onColorChange.emit($event);
    });
    // On Change Complete ColorPicker
    this.componentRef.instance.onChangeComplete.subscribe(($event) => {
      // this.onColorChange.emit($event);
      this.onColorSelect.emit($event);
    });
    // On Ok ColorPicker
    this.componentRef.instance.onAccept.subscribe(($event) => {
      this.componentRef.destroy();
    });
    // On Cancel ColorPicker
    this.componentRef.instance.onCancel.subscribe(($event) => {
      this.rxColor = this.lastSelectedColor.color;
      this.el.nativeElement.style.background = this.lastSelectedColor.color;
      this.rxColorChange.emit(this.lastSelectedColor.color);
      this.componentRef.destroy();
    });
    // On Apply To all ColorPicker
    this.componentRef.instance.applyToAll.subscribe(($event) => {
      console.log('Apply to all');
      this.componentRef.destroy();
    });
    this.componentRef.changeDetectorRef.detectChanges();
  }
}
