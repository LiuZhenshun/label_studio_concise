// Baseclass is uesd for create shape and write the shape'data into data variable
class CreaAnno{
    constructor(AnnoTypeCSS, Canvas, Data) {
        this.Canvas = Canvas;
        this.AnnoTypeCSS = AnnoTypeCSS;
        this.Data = Data;
        // because addeventlistener's function could not call this (it would become a html element)
        this.mouseDown = this.mouseDown.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
        this.mouseMove = this.mouseMove.bind(this);

        //Canvas's height and width
        this.CanShowH = Canvas.scrollHeight;
        this.CanShowW = Canvas.scrollWidth;
      }

    StarCrea(){ }

    mouseDown(e){ }

    mouseMove(e){ }

    mouseUp(e){ }
}


//Subclass used to create rectangle in videos extended from CreaAnno
class CreaRectVideo extends CreaAnno{
    constructor(AnnoTypeCSS, Canvas, Data, CurrentFrame = 0) {
        super( AnnoTypeCSS, Canvas, Data );
        this.CurrentFrame = CurrentFrame;
    }

    xStart;
    yStart;
    xEnd;
    yEnd;
    rect;

    StarCrea(){
        this.Canvas.addEventListener("mousedown", this.mouseDown, false);
        this.Canvas.addEventListener("mouseup", this.mouseUp, false);
        console.log("start create Anno");
        console.log("Current Data",this.Data);
        console.log(this.Canvas.scrollWidth);
        console.log(this.Canvas.scrollHeight)
      }

    mouseDown(e) {
        this.xStart = e.offsetX;
        this.yStart = e.offsetY;
        var rect = this.CreaRect(this.xStart, this.yStart, 5, 5);
        this.rect = rect;
        console.log(this.xStart, this.yStart);
        this.Canvas.addEventListener('mousemove', this.mouseMove, false);
    }

    mouseMove(e){
        this.xEnd = e.offsetX;
        this.yEnd = e.offsetY;
        if (this.xEnd-this.xStart > 0){
            if (this.yEnd-this.yStart > 0){
                this.ReseRectShape(this.rect, this.xStart, this.yStart, this.xEnd-this.xStart, this.yEnd-this.yStart);
            }else{
                this.ReseRectShape(this.rect, this.xStart, this.yEnd, this.xEnd-this.xStart, -(this.yEnd-this.yStart));
            }
        }else{
            if (this.yEnd-this.yStart > 0){
                this.ReseRectShape(this.rect, this.xEnd, this.yStart, -(this.xEnd-this.xStart), this.yEnd-this.yStart);
            }else{
                this.ReseRectShape(this.rect, this.xEnd, this.yEnd, -(this.xEnd-this.xStart), -(this.yEnd-this.yStart));
            }
        }
    }

    mouseUp(e) {
        this.Canvas.removeEventListener("mousemove", this.mouseMove);
        this.Canvas.removeEventListener("mousedown", this.mouseDown);
        this.Canvas.removeEventListener("mouseup", this.mouseUp);

        if (this.xStart != this.xEnd && this.yStart != this.yEnd) {
            var FrameName = "frame_" + this.CurrentFrame
            if ((FrameName in (this.Data)) == false){
                    this.Data[FrameName] = [];
                }
            var xStart = this.rect.getAttribute('x');
            var yStart = this.rect.getAttribute('y');
            var width = this.rect.getAttribute('width');
            var height = this.rect.getAttribute('height');
            this.rect.setAttribute('id', 'LabeRect_' +  this.Data[FrameName].length);
            this.Data[FrameName]= this.Data[FrameName].concat([[xStart/this.CanShowW, yStart/this.CanShowH, width/this.CanShowW, height/this.CanShowH],]);
        }
        console.log("end of the create");
    }

    CreaRect(x, y, width, height){
        //create rectagle
        var rect = document.createElementNS(svgNS,'rect');
        rect.setAttribute('x',x);
        rect.setAttribute('y',y);
        rect.setAttribute('width',width);
        rect.setAttribute('height',height);
        rect.setAttribute('class',this.AnnoTypeCSS);
        svg.appendChild(rect);

        return rect;
    }

    ReseRectShape(rect,x,y,w,h){
        rect.setAttribute('x',x);
        rect.setAttribute('y',y);
        rect.setAttribute('width',w);
        rect.setAttribute('height',h);
    }

}


// Base class used for visualize the data variable
class Visualizator{
    constructor(AnnoTypeCSS, Canvas, Data) {
        this.AnnoTypeCSS = AnnoTypeCSS;
        this.Canvas = Canvas
        this.Data = Data;

        //Canvas's height and width
        this.CanShowH = Canvas.scrollHeight;
        this.CanShowW = Canvas.scrollWidth;
    }
}

//Subclass used for visualize Rect in Video
class VisualizatorRectVideo extends Visualizator{
    constructor(AnnoTypeCSS, Canvas, Data, CurrentFrame = 0, VideW = 0, VideH = 0, ButtCont) {
        super(AnnoTypeCSS, Canvas, Data);
        this.CurrentFrame = CurrentFrame;
        this.VideW = VideW;
        this.VideH = VideH;
        this.ButtCont = ButtCont;
    }

    ShowData(){
        this.ClearAnno();
        var FrameName = "frame_" + this.CurrentFrame;
        var data = this.Data;
        var {VideoShowW,VideoShowH,add} = this.GetVideoShowPar(this.VideW, this.VideH);

        if (FrameName in data){
            for (let i = 0; i < data[frame_name].length; i++) {
                this.CreaRect(data[FrameName][i][0]*VideoShowW, data[FrameName][i][1]*VideoShowH+add , data[frame_name][i][2]*VideoShowW, data[frame_name][i][3]*VideoShowH, i);
            }
        }
    }

    GetVideoShowPar(VideW, VideH){
        if(VideW>VideH){
            var VideoShowW = this.CanShowW;
            var VideoShowH = VideH/VideW*VideoShowW;
            var add = (this.CanShowH - VideoShowH)/2;
        }
        return {VideoShowW,VideoShowH,add};
    }

    //create rectagle
    CreaRect(x, y, width, height, id){
        var rect = document.createElementNS(svgNS,'rect');
        rect.setAttribute('x',x);
        rect.setAttribute('y',y);
        rect.setAttribute('width',width);
        rect.setAttribute('height',height);
        rect.setAttribute('class',this.AnnoTypeCSS);
        rect.setAttribute('id', "LabeRect_" + id);
        svg.appendChild(rect);

        return rect;
    }

    ClearAnno(){
        if (ButtCont.hasChildNodes()) {
          ButtCont.innerHTML = '';
          this.Canvas.childNodes[3].innerHTML = '';
        }
    }
}

