// Load Konva
$("head").append($("<script></script>").attr("src", "/static/konva/konva.min.js"));

// Base class used for create shape
class CreaAnno{
    constructor(AnnoType, Data, Stage, Layer){
        this.AnnoType = AnnoType;
        this.Data = Data;

        this.Stage = Stage;
        this.Layer = Layer;
    }
}

class CreaAnnoRectImage extends CreaAnno{
    constructor(AnnoType, Data, Stage, Layer) {
        super(AnnoType, Data, Stage, Layer);

        this.MouseDown = this.mouseDown.bind(this);
        this.MouseUp = this.mouseUp.bind(this);
        this.MouseMove = this.mouseMove.bind(this);

        this.xStart;
        this.yStart;
        this.xEnd;
        this.yEnd;
        this.rect;

        this.IfMouseDown = false;
    }

    StarCrea(){
        this.rect = new Konva.Rect({
            x: 0,
            y: 0,
            width: 20,
            height: 20,
            fill: "rgba(14, 136, 233, 0.3)",
            name: 'rect',
            draggable: false,
            opacity: 1,
        });
        this.Stage.on('mousedown create', this.MouseDown);
        this.Stage.on('mousemove create', this.MouseMove);
        this.Stage.on('mouseup create', this.MouseUp);
    }

    mouseDown(e){
        this.IfMouseDown = true;
        this.xStart = this.Stage.getPointerPosition().x;
        this.yStart = this.Stage.getPointerPosition().y;
        this.rect.x(this.xStart);
        this.rect.y(this.yStart);
        this.Layer.add(this.rect);
    }

    mouseMove(e){
        if (this.IfMouseDown){
            this.xEnd = this.Stage.getPointerPosition().x;
            this.yEnd = this.Stage.getPointerPosition().y;
            if (this.xEnd - this.xStart > 0){
                if (this.yEnd-this.yStart > 0){
                    this.ReseRectShape(this.rect, this.xStart, this.yStart, this.xEnd-this.xStart, this.yEnd- this.yStart);
                }else{
                    this.ReseRectShape(this.rect, this.xStart, this.yEnd, this.xEnd-this.xStart, -(this.yEnd- this.yStart));
                }
            }else{
                if (this.yEnd-this.yStart > 0){
                    this.ReseRectShape(this.rect, this.xEnd, this.yStart, -(this.xEnd-this.xStart), this.yEnd- this.yStart);
                }else{
                    this.ReseRectShape(this.rect, this.xEnd, this.yEnd, -(this.xEnd-this.xStart), -(this.yEnd- this.yStart));
                }
            }
        }
    }

    mouseUp(e){
        this.IfMouseDown = false;
        this.Stage.off('mousedown create');
        this.Stage.off('mousemove create');
        this.Stage.off('mouseup create');
        const annotationEndEvent = new Event('annotation-end');

        if (this.xStart != this.xEnd && this.yStart != this.yEnd) {
            if (("boxes" in this.Data) == false){
                this.Data["boxes"] = [];
            }

            var xStart = this.rect.x();
            var yStart = this.rect.y();
            var width = this.rect.width();
            var height = this.rect.height();
            var ImageShowW = this.Stage.width();
            var ImageShowH = this.Stage.height();
            this.Data["boxes"]= this.Data["boxes"].concat([[xStart/ImageShowW, yStart/ImageShowH, width/ImageShowW, height/ImageShowH],]);

        }
        this.rect.destroy();
        document.dispatchEvent(annotationEndEvent);
    }

    ReseRectShape(rect,x,y,w,h){
        rect.x(x);
        rect.y(y);
        rect.width(w);
        rect.height(h);
    }
}

// Base class used for visualize the data variable
class Visualizator{
    constructor(AnnoType, Data, Stage, Layer) {
        this.AnnoTypeCSS = AnnoType;
        this.Data = Data;

        this.Stage = Stage;
        this.Layer = Layer;
    }
}

//Subclass used for visualize Rect in Video
class VisualizatorRectImage extends Visualizator{
    constructor(AnnoType, Data, Stage, Layer, ButtCont) {
        super(AnnoType, Data, Stage, Layer);
        this.ButtCont = ButtCont;
        this.SelectedButton;
    }

    ShowData(){
        this.ClearAnno();
        var data = this.Data;
        var ImageShowW = this.Stage.width();
        var ImageShowH = this.Stage.height();
        if ("boxes" in data){
            for (let i = 0; i < data["boxes"].length; i++) {
                this.CreaRect(data["boxes"][i][0]*ImageShowW, data["boxes"][i][1]*ImageShowH, data["boxes"][i][2]*ImageShowW, data["boxes"][i][3]*ImageShowH, i);
                this.ShowButton(i);
            }
        }
    }

    //create rectagle
    CreaRect(x, y, width, height, id){
        var group = new Konva.Group({
            name:"group"+id,
            draggable:true,
        });
        var rect = new Konva.Rect({
                x: x,
                y: y,
                width: width,
                height: height,
                fill: "rgba(14, 136, 233, 0.3)",
                name: "rect"+id,
                draggable: false,
                opacity: 1,
            });
        let rectButton = this.CreateButton("Rect"+(id+1), id, "list-group-item list-group-item-action");
        rect.Button = rectButton;
        this.Layer.add(group.add(rect));
    }

    CreateButton(name, id, style){
        let Button = document.createElement("button");
        Button.setAttribute('class', style);
        Button.textContent = name;
        return Button;
    }

    ShowButton(id){
        let Group = this.Layer.getChildren(function(node){
                return node.getClassName() === 'Group';
              })[id];
        let Div = document.createElement("div");
        let GroupChild = Group.getChildren();
        Div.appendChild(GroupChild[0].Button);
        this.ButtCont.appendChild(Div);
    }

    ClearAnno(){
        if (this.Layer.hasChildren()) {
          this.ButtCont.innerHTML = '';
          //this.Layer.removeChildren();
          var Group = this.Layer.getChildren(function(node){
            return node.getClassName() === 'Group';
          });
          if (Group.length){
            for(let i = 0; i < Group.length; i++){
                Group[i].destroy();
            }
          }
          var Transformer = this.Layer.getChildren(function(node){
            return node.getClassName() === 'Transformer';
          });
          if (Transformer.length){
            Transformer[0].nodes([]);
          }
        }
    }
}

// Base class used for listening user action to change the shape
class Listener{
    constructor(AnnoType, Data, Stage, Layer) {
        this.AnnoTypeCSS = AnnoType;
        this.Data = Data;

        this.Stage = Stage;
        this.Layer = Layer;
    }
}

class ListenerRectImage extends Listener{
    constructor(AnnoType, Data, Stage, Layer, ButtCont, Transformer) {
        super(AnnoType, Data, Stage, Layer);
        this.ButtCont = ButtCont;
        this.Transformer = Transformer
        this.Layer.add(this.Transformer);
        this.SelectedRect;
        this.SelectedKeypoint;
        this.ActiveButton;
        this.SelectedKeypointButton;
    }

    StartStageListener(){
        var Stage = this.Stage;
        var Data = this.Data;

        var RelatedButton = this.ActiveButton;

        var ImageShowW = this.Stage.width();
        var ImageShowH = this.Stage.height();

        //Add buttonListener
        this.LabelButtonListener();
        // clicks should select/deselect shapes
        this.Stage.on('click tap', (e) => {
        // if click on empty area - remove all selections
            if (e.target === this.Stage) {
                this.Transformer.nodes([]);
                if (this.SelectedRect){
                    this.SelectedRect.draggable(false);
                    this.SelectedRect = undefined;
                }
                if(this.ActiveButton){
                    this.ActiveButton.setAttribute('class',"list-group-item list-group-item-action");
                }
                if (this.SelectedKeypoint){
                    this.SelectedKeypoint.radius(3);
                    this.SelectedKeypoint.draggable(false);
                    this.SelectedKeypoint = undefined;
                    this.SelectedKeypointButton.style["backgroundColor"] = "";
                    this.SelectedKeypointButton = undefined;
                }
                return;
            }
            // do nothing if clicked NOT on our rectangles
            if (e.target.getClassName() === 'Rect') {
                if (this.SelectedRect === e.target){
                    return;
                }
                if(this.ActiveButton){
                    this.ActiveButton.setAttribute('class',"list-group-item list-group-item-action");
                }
                this.ActiveButton = e.target.Button;
                this.ActiveButton.setAttribute('class',"list-group-item list-group-item-action active");

                if(this.SelectedRect){
                    this.Transformer.nodes([]);
                    this.SelectedRect.draggable(false);
                }
                this.SelectedRect = e.target;
                this.Transformer.nodes([e.target]);
                this.SelectedRect.draggable(true);
                return;
            }
        });
    }

    LabelButtonListener(){
        let Groups = this.Layer.getChildren(function(node){
                    return node.getClassName() === 'Group';
                  });
        for (let i=0; i<Groups.length; i++){
            let rectButton = Groups[i].getChildren()[0].Button;
            rectButton.addEventListener("click", (e) => {
                if(this.ActiveButton === e.target){
                    this.ActiveButton.setAttribute('class',"list-group-item list-group-item-action");
                    this.ActiveButton = undefined;
                    this.Transformer.nodes([]);
                    return;
                }
                if (this.ActiveButton){
                    this.ActiveButton.setAttribute('class',"list-group-item list-group-item-action");
                }
                this.ActiveButton = e.target;
                e.target.setAttribute('class',"list-group-item list-group-item-action active");
                let Rect = Groups[i].getChildren()[0];
                this.Transformer.nodes([Rect]);
            });
        }
    }

    StopStageListener(){
        //stop shape listening
        this.Stage.off('click tap');
    }

}

class ShapeDeletor{
    constructor(AnnoType, Data, Stage, Layer, Transformer) {
        this.AnnoTypeCSS = AnnoType;
        this.Data = Data;

        this.Stage = Stage;
        this.Layer = Layer;
        this.Transformer = Transformer;
    }
}

class ShapeDeletorRectImage extends ShapeDeletor{
    constructor(AnnoType, Data, Stage, Layer, Transformer) {
        super(AnnoType, Data, Stage, Layer, Transformer);
        this.Transformer = Transformer;
    }

    DeleteShape(){
        let SelectedShape = this.Transformer.nodes();
        if(SelectedShape.length){
            let group = SelectedShape[0].getParent();
            let id = group.getAttr('name').replace("group","");
            this.Data["boxes"].splice(id, 1);

            group.destroy();
        }
    }
}

class SaveData{
    constructor(AnnoType, Data) {
        this.AnnoTypeCSS = AnnoType;
        this.Data = Data;
    }
}

class SaveDataRectImage extends ShapeDeletor{
    constructor(AnnoType, Data, Stage) {
        super(AnnoType, Data);
        this.Stage = Stage;
        this.Layer = Stage.getChildren()[0];
    }

    SaveData(){
        let Groups = this.Layer.getChildren(function(node){
            return node.getClassName() === 'Group';
          });
        let Rect;
        for (let i = 0; i < Groups.length; i++){
            Rect = Groups[i].getChildren(function(node){
                return node.getClassName() === 'Rect';
            })[0];
            let width = Rect.width() * Rect.scaleX() / this.Stage.width();
            let height = Rect.height() * Rect.scaleY() / this.Stage.height();
            let xStart = (Rect.x()+Groups[i].x())/ this.Stage.width();
            let yStart = (Rect.y()+Groups[i].y()) / this.Stage.height();
            this.Data["boxes"][i]= [xStart, yStart, width, height];
        }
    }
}