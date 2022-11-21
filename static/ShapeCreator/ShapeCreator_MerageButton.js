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

class CreaAnnoKeypointImage extends CreaAnno{
    constructor(AnnoType, Data, Stage, Layer, ShowClass, ListenerClass) {
        super(AnnoType, Data, Stage, Layer);
        this.ShowClass = ShowClass;
        this.ListenerClass = ListenerClass;

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

        if (this.xStart != this.xEnd && this.yStart != this.yEnd) {
            if (("boxes" in this.Data) == false){
                this.Data["boxes"] = [];
            }
            if (("keypoint" in this.Data) == false){
                this.Data["keypoint"] = {};
            }
            var xStart = this.rect.x();
            var yStart = this.rect.y();
            var width = this.rect.width();
            var height = this.rect.height();
            //var {VideoShowW,VideoShowH, add} = this.ShowClass.GetVideoShowPar(this.ShowClass.VideW, this.ShowClass.VideH);
            var ImageShowW = this.Stage.width();
            var ImageShowH = this.Stage.height();
            this.Data["boxes"]= this.Data["boxes"].concat([[xStart/ImageShowW, yStart/ImageShowH, width/ImageShowW, height/ImageShowH],]);

            let x = new Array(17);
            for (let i = 0; i < x.length; i++) {
                x[i] = [0,0,0];
            }

            this.Data["keypoint"][this.Data["boxes"].length-1] = x;
        }
        this.rect.destroy();
        this.ShowClass.ShowData();
        this.ListenerClass.LabelButtonListener();
    }

    ReseRectShape(rect,x,y,w,h){
        rect.x(x);
        rect.y(y);
        rect.width(w);
        rect.height(h);
    }
}

class CreaAnnoRectVideo extends CreaAnno{
    constructor(AnnoType, Data, Stage, Layer, CurrentFrame=0, ShowClass) {
        super(AnnoType, Data, Stage, Layer);
        this.ShowClass = ShowClass;

        this.CurrentFrame = CurrentFrame;

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
            width: 5,
            height: 5,
            fill: "rgba(255, 0, 0, 0.3)",
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

        if (this.xStart != this.xEnd && this.yStart != this.yEnd) {
            var FrameName = "frame_" + this.CurrentFrame;
            if ((FrameName in (this.Data)) == false){
                    this.Data[FrameName] = [];
                }
            var xStart = this.rect.x();
            var yStart = this.rect.y();
            var width = this.rect.width();
            var height = this.rect.height();
            //var {VideoShowW,VideoShowH, add} = this.ShowClass.GetVideoShowPar(this.ShowClass.VideW, this.ShowClass.VideH);
            var VideoShowW = this.ShowClass.VideoShowW;
            var VideoShowH = this.ShowClass.VideoShowH;
            var add = this.ShowClass.Add;
            if(add[0]){
                this.Data[FrameName]= this.Data[FrameName].concat([[xStart/VideoShowW, (yStart-add[0])/VideoShowH, width/VideoShowW, height/VideoShowH],]);
            }else{
                this.Data[FrameName]= this.Data[FrameName].concat([[(xStart-add[1])/VideoShowW, yStart/VideoShowH, width/VideoShowW, height/VideoShowH],]);
            }
        }
        this.rect.destroy();
        this.ShowClass.ShowData();
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
class VisualizatorKeypointImage extends Visualizator{
    constructor(AnnoType, Data, Stage, Layer, ButtCont) {
        super(AnnoType, Data, Stage, Layer);
        this.ButtCont = ButtCont;
        this.ColorSet = {"0": 'red', "1": 'red', "2": 'red', "3": 'red', "4": 'red', "5": 'blue', "6": 'green', "7": 'blue', "8": 'green',
                        "9": 'blue', "10": 'green', "11": 'yellow', "12": 'black', "13": 'yellow', "14": 'black', "15": 'yellow', "16": 'black'};
        this.KeypointNameSet = {"0": 'Nose', "1": 'LeftEye', "2": 'RightEye', "3": 'LeftEar', "4": 'RightEar', "5": 'LShoulder', "6": 'RShoulder',
                    "7": 'LElbow', "8": 'RElbow', "9": 'LWrist', "10": 'RWrist', "11": 'LHip', "12": 'RHip', "13": 'LKnee', "14": 'RKnee',
                    "15": 'LAnkle', "16": 'RAnkle'};
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
        if ("keypoint" in this.Data) {
            if (this.Data["keypoint"][id]){
                let value = this.Data["keypoint"][id];
                for (let j = 0; j < value.length; j++) {
                    this.CreaKeypoint(group, value[j][0]*this.Stage.width(), value[j][1]*this.Stage.height(), 3, this.ColorSet[j], id, j);
                }
            }
        }
    }

    //Create Keypoint
    CreaKeypoint(group, x, y, radius, color, boxesId, id){
        let circle = new Konva.Circle({
                x: x,
                y: y,
                radius: radius,
                fill: color,
                name: "keypoint"+id,
                draggable: false,
                opacity: 1,
            });
        let CircleButton = this.CreateButton(this.KeypointNameSet[id], id, "");
        if (this.Data["keypoint"][boxesId][id][2] == 0){
            CircleButton.style["color"] = 'red';
            circle.visible(false);
        } else if(this.Data["keypoint"][boxesId][id][2] == 2){
            CircleButton.style["color"] = 'black';
        } else if(this.Data["keypoint"][boxesId][id][2] == 3){
            CircleButton.style["color"] = 'rgb(236,140,7)'; // yellow
            circle.visible(false);
        } else {
            CircleButton.style["color"] = 'rgb(89,212,7)'; // green
        }
        circle.Button = CircleButton;
        group.add(circle);
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
        for (let i=1; i<18; i++){
            if(GroupChild[i].Button){
                Div.appendChild(GroupChild[i].Button);
            }else{
                Div.appendChild(GroupChild[i].Button);
            }

        }
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

//Subclass used for visualize Rect in Video
class VisualizatorRectVideo extends Visualizator{
    constructor(AnnoType, Data, Stage, Layer, CurrentFrame = 0, VideW = 0, VideH = 0, ButtCont) {
        super(AnnoType, Data, Stage, Layer);
        this.CurrentFrame = CurrentFrame;
        this.VideW = VideW;
        this.VideH = VideH;
        this.ButtCont = ButtCont;

        this.VideoShowW;
        this.VideoShowH;
        this.Add;
    }

    ShowData(){
        this.ClearAnno();

        var FrameName = "frame_" + this.CurrentFrame;
        if (FrameName==="frame_0"){
            this.GetVideoShowPar(this.VideW, this.VideH)
        }
        var data = this.Data;
        var VideoShowW = this.VideoShowW;
        var VideoShowH = this.VideoShowH;
        var add = this.Add;

        if (FrameName in data){
            if(add[0]){
                for (let i = 0; i < data[FrameName].length; i++) {
                        this.CreaRect(data[FrameName][i][0]*VideoShowW, data[FrameName][i][1]*VideoShowH+add[0] , data[FrameName][i][2]*VideoShowW, data[FrameName][i][3]*VideoShowH, i);
                        this.CreateButton(i);
                }
            }else{
                for (let i = 0; i < data[FrameName].length; i++) {
                        this.CreaRect(data[FrameName][i][0]*VideoShowW+add[1], data[FrameName][i][1]*VideoShowH , data[FrameName][i][2]*VideoShowW, data[FrameName][i][3]*VideoShowH, i);
                        this.CreateButton(i);
                }
            }
        }
    }

    GetVideoShowPar(VideW, VideH){
        if(VideW>VideH){
            this.VideoShowW = this.Layer.width();
            this.VideoShowH = VideH/VideW * this.VideoShowW;
            this.Add = [(this.Layer.height() - this.VideoShowH)/2,0];
        }else{
            this.VideoShowH = this.Layer.height();
            this.VideoShowW = VideW/VideH* this.VideoShowH;
            this.Add = [0,(this.Layer.height() - this.VideoShowH)/2];
        }
    }

    //create rectagle
    CreaRect(x, y, width, height, id){
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
        this.Layer.add(rect);
    }

    CreateButton(id){
        var label_button = document.createElement("button");
        label_button.setAttribute('class',"list-group-item list-group-item-action");
        label_button.textContent = "Rect" + (id+1);
        label_button.setAttribute('name', "rect"+id);

        this.ButtCont.appendChild(label_button);
    }

    ClearAnno(){
        if (this.Layer.hasChildren()) {
          this.ButtCont.innerHTML = '';
          //this.Layer.removeChildren();
          var Rect = this.Layer.getChildren(function(node){
            return node.getClassName() === 'Rect';
          });
          if (Rect.length){
            for(let i = 0; i < Rect.length; i++){
                Rect[i].destroy();
            }
          }
          var Transformer = this.Layer.getChildren(function(node){
            return node.getClassName() === 'Transformer';
          });
          if (Rect.length){
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

class ListenerKeypointImage extends Listener{
    constructor(AnnoType, Data, Stage, Layer, ButtCont, ShowClass, SkipButton, InvisibleButton, DeleteKeypointButton) {
        super(AnnoType, Data, Stage, Layer);
        this.ButtCont = ButtCont;
        this.ShowClass = ShowClass;
        this.SkipButton = SkipButton;
        this.InvisibleButton = InvisibleButton;
        this.DeleteKeypointButton = DeleteKeypointButton;
        this.Transformer = new Konva.Transformer({
                                    rotateEnabled:false,
                                    centeredScaling: false,
                                    resizeEnabled: true,
                                    keepRatio: false,
                                    enabledAnchors: [
                                      'top-left',
                                      'top-right',
                                      'bottom-left',
                                      'bottom-right',
                                    ],
                                    ignoreStroke: true,
                                    borderDash: [3, 3],
                                });
        this.Layer.add(this.Transformer);
        this.SelectedRect;
        this.SelectedKeypoint;
        this.ActiveButton;
        this.SelectedKeypointButton;
        this.SkipButtonListener();
        this.InvisibleButtonListener();
        this.DeleteKeypointButtonListenser();
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
                    let group = this.SelectedRect.getParent();
                    let boxId = group.getAttr('name').replace("group","");
                    let keypointId;
                    let keypointData = this.Data["keypoint"][boxId];

                    for (let i = 0; i < keypointData.length; i++) {
                        if (keypointData[i][2] == 0) {
                            keypointId = i;
                            break;
                        }
                    }
                    if (keypointId == undefined){
                        return;
                    }
                    let xCoordinate = this.Stage.getPointerPosition().x;
                    let yCoordinate = this.Stage.getPointerPosition().y;

                    let circle = group.getChildren(function(node){
                        return node.getClassName() === 'Circle';
                      })[keypointId];
                      console.log(circle);
                    circle.visible(true);
                    circle.x(xCoordinate);
                    circle.y(yCoordinate);

                    this.Data["keypoint"][boxId][keypointId][0] = xCoordinate/ImageShowW;
                    this.Data["keypoint"][boxId][keypointId][1] = yCoordinate/ImageShowH;
                    this.Data["keypoint"][boxId][keypointId][2] = 1;

                    circle.Button.style["color"] = "rgb(89,212,7)";
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
            if (e.target.getClassName() === 'Circle') {

                if (this.SelectedKeypoint === e.target){
                    this.SelectedKeypoint.radius(3);
                    this.SelectedKeypoint.draggable(false);
                    this.SelectedKeypoint = undefined;
                    this.SelectedKeypointButton.style["backgroundColor"] = "";
                    this.SelectedKeypointButton = undefined;
                    return;
                }
                if (this.SelectedKeypoint){
                    this.SelectedKeypoint.radius(3);
                    this.SelectedKeypoint.draggable(false);
                    this.SelectedKeypointButton.style["backgroundColor"] = "";
                }
                this.SelectedKeypoint = e.target;

                this.SelectedKeypointButton = e.target.Button;
                e.target.radius(5);
                e.target.draggable(true);
                this.SelectedKeypointButton.style["backgroundColor"] = "rgb(34,133,226)";
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

    SkipButtonListener(){
        this.SkipButton.addEventListener("click", (e) => {
            if (this.Transformer.nodes().length){
                let Rect = this.Transformer.nodes()[0];
                let boxId = Rect.getAttr('name').replace("rect","");
                let keypointData = this.Data["keypoint"][boxId];
                let keypointId = this.GetKeypointIdBasedOnData(boxId, keypointData);
                if (keypointId == undefined){
                    return;
                }
                this.Data["keypoint"][boxId][keypointId][2] = 3;
                let keypointButton = Rect.getParent().getChildren()[keypointId+1].Button;
                keypointButton.style["color"] = "rgb(236,140,7)";
            }
        });
    }

    InvisibleButtonListener(){
        this.InvisibleButton.addEventListener("click", (e) => {
            if (this.SelectedKeypoint){
                let Group = this.SelectedKeypoint.getParent();
                let boxId = Group.getAttr('name').replace("group","");
                let keypointId = this.SelectedKeypoint.getAttr('name').replace("keypoint","");
                let keypointButton = this.SelectedKeypoint.Button;

                if (this.Data["keypoint"][boxId][keypointId][2] == 2){
                    this.Data["keypoint"][boxId][keypointId][2] = 1;
                    keypointButton.style["color"] = "rgb(89,212,7)";
                }else{
                    this.Data["keypoint"][boxId][keypointId][2] = 2;
                    keypointButton.style["color"] = "black";
                }
            }
        });
    }

    DeleteKeypointButtonListenser(){
        this.DeleteKeypointButton.addEventListener("click", (e) => {
            console.log("1");
            if (this.SelectedKeypoint){
                let Group = this.SelectedKeypoint.getParent();
                let boxId = Group.getAttr('name').replace("group","");
                let keypointId = this.SelectedKeypoint.getAttr('name').replace("keypoint","");

                this.Data["keypoint"][boxId][keypointId][2] = 3;
                this.SelectedKeypointButton.style["color"] = "rgb(236,140,7)";
                this.SelectedKeypoint.visible(false);
                this.SelectedKeypointButton.style["backgroundColor"] = ""
                this.SelectedKeypointButton = undefined;
                this.SelectedKeypoint = undefined;
            }
        });
    }

    GetKeypointIdBasedOnData(boxId, keypointData){
        let keypointId;
        for (let i = 0; i < keypointData.length; i++) {
            if (keypointData[i][2] == 0) {
                keypointId = i;
                break;
            }
        }
        return keypointId;
    }

    StopStageListener(){
        //stop shape listening
        this.Stage.off('click tap');
    }

    ReturnTransformer(){
        return this.Transformer;
    }
}

class ListenerRectVideo extends Listener{
    constructor(AnnoType, Data, Stage, Layer, CurrentFrame = 0, ButtCont, ShowClass) {
        super(AnnoType, Data, Stage, Layer);
        this.CurrentFrame = CurrentFrame;
        this.ButtCont = ButtCont;
        this.ShowClass = ShowClass;
        this.Transformer = new Konva.Transformer({
                                    rotateEnabled:false,
                                    centeredScaling: false,
                                    resizeEnabled: true,
                                    keepRatio: false,
                                    enabledAnchors: [
                                      'top-left',
                                      'top-right',
                                      'bottom-left',
                                      'bottom-right',
                                    ],
                                    ignoreStroke: true,
                                    borderDash: [3, 3],
                                });
        this.Layer.add(this.Transformer);
        this.ActiveButton;
    }

    StartStageListener(){
        var transformer = this.Transformer;
        var Stage = this.Stage;
        var Data = this.Data;
        var FrameName = "frame_" + this.CurrentFrame;

        var RelatedButton = this.ActiveButton;

        this.DragListener(Stage, Data, FrameName);

        var VideoShowW = this.ShowClass.VideoShowW;
        var VideoShowH = this.ShowClass.VideoShowH;
        var add = this.ShowClass.Add;

        // clicks should select/deselect shapes
        this.Stage.on('click tap', function (e) {
        // if click on empty area - remove all selections
            if (e.target === Stage) {
                transformer.nodes([]);
                var Rect = transformer.nodes();
                if (Rect.length){
                    Rect[0].off('transformend');
                }
                return;
            }
            // do nothing if clicked NOT on our rectangles
            if (e.target.getClassName() === 'Rect') {
                transformer.nodes([]);
                transformer.nodes([e.target]);

                var Rect = e.target;
                Rect.draggable(true);

                if(RelatedButton){
                    RelatedButton.setAttribute('class',"list-group-item list-group-item-action");
                }
                RelatedButton = document.getElementsByName(Rect.getAttr('name'))[0];
                RelatedButton.setAttribute('class',"list-group-item list-group-item-action active");

                Rect.on('transformend', function () {
                    var id = Rect.getAttr('name').replace("rect","");
                    var width = Rect.width() * Rect.scaleX() / Stage.width();
                    var height = Rect.height() * Rect.scaleY() / Stage.height();
                    if(add[0]){
                        var xStart = Rect.x() / VideoShowW;
                        var yStart = (Rect.y() - add[0]) / VideoShowH;
                        Data[FrameName][id]= [xStart, yStart, width, height];
                    }else{
                        var xStart = (Rect.x() - add[1]) / VideoShowW;
                        var yStart = Rect.y() / VideoShowH;
                        Data[FrameName][id]= [xStart, yStart, width, height];
                    }
                });
            }
        });
    }

    StopStageListener(){
        //stop shape listening
        this.Stage.off('click tap');
    }

    DragListener(Stage, Data, FrameName){
        // Add drag listener
        var Rect = this.Layer.getChildren(function(node){
            return node.getClassName() === 'Rect';
          });
        if (Rect.length){
            var VideoShowW = this.ShowClass.VideoShowW;
            var VideoShowH = this.ShowClass.VideoShowH;
            var add = this.ShowClass.Add;
            for(let i = 0; i < Rect.length; i++){
                Rect[i].on('dragend', function (e) {
                    var id = e.target.getAttr('name').replace("rect","");
                    var width = e.target.width() * e.target.scaleX() / VideoShowW;
                    var height = e.target.height() * e.target.scaleY() / VideoShowH;
                    if(add[0]){
                        var xStart = e.target.x() / VideoShowW;
                        var yStart = (e.target.y() - add[0]) / VideoShowH;
                        Data[FrameName][id]= [xStart, yStart, width, height];
                    }else{
                        var xStart = (e.target.x() - add[1]) / VideoShowW;
                        var yStart = e.target.y() / VideoShowH;
                        Data[FrameName][id]= [xStart, yStart, width, height];
                    }
                });
            }
        }
    }

    ReturnTransformer(){
    return this.Transformer;
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

class ShapeDeletorKeypointImage extends ShapeDeletor{
    constructor(AnnoType, Data, Stage, Layer, Transformer, ShowClass) {
        super(AnnoType, Data, Stage, Layer, Transformer);
        this.ShowClass = ShowClass;
        this.Transformer = Transformer;
    }

    DeleteShape(){
        let SelectedShape = this.Transformer.nodes();
        if(SelectedShape.length){
            let group = SelectedShape[0].getParent();
            let id = group.getAttr('name').replace("group","");
            this.Data["boxes"].splice(id, 1);

            delete this.Data["keypoint"][id];
            for (const [key, value] of Object.entries(this.Data["keypoint"])) {
                if (key > id){
                    this.Data["keypoint"][key-1] = value;
                    if (((key + 1) in this.Data["keypoint"]) == false ){
                        if (key != id) {
                            delete data["keypoint"][key];
                        }
                    }
                }
            }
            group.destroy();
            this.ShowClass.ShowData();
        }
    }
}

class ShapeDeletorRectVideo extends ShapeDeletor{
    constructor(AnnoType, Data, Stage, Layer, Transformer, CurrentFrame = 0, ButtCont, ShowClass) {
        super(AnnoType, Data, Stage, Layer, Transformer);
        this.CurrentFrame = CurrentFrame;
        this.ButtCont = ButtCont;
        this.ShowClass = ShowClass;
    }

    DeleteShape(){
        var SelectedShape = this.Transformer.nodes();
        if(SelectedShape.length){
            var FrameName = "frame_" + this.CurrentFrame;
            var id = SelectedShape[0].getAttr('name').replace("rect","");
            this.Data[FrameName].splice(id, 1);
            SelectedShape[0].destroy();
            this.ShowClass.ShowData();
        }
    }
}

class SaveData{
    constructor(AnnoType, Data) {
        this.AnnoTypeCSS = AnnoType;
        this.Data = Data;
    }
}

class SaveDataKeypointImage extends ShapeDeletor{
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
        let Keypoints;
        for (let i = 0; i < Groups.length; i++){
            Rect = Groups[i].getChildren(function(node){
                return node.getClassName() === 'Rect';
            })[0];
            let width = Rect.width() * Rect.scaleX() / this.Stage.width();
            let height = Rect.height() * Rect.scaleY() / this.Stage.height();
            let xStart = (Rect.x()+Groups[i].x())/ this.Stage.width();
            let yStart = (Rect.y()+Groups[i].y()) / this.Stage.height();
            this.Data["boxes"][i]= [xStart, yStart, width, height];

            Keypoints = Groups[i].getChildren(function(node){
                return node.getClassName() === 'Circle';
            });
            for (let j = 0; j < Keypoints.length; j++){
                let keypointId = Keypoints[j].getAttr("name").replace("keypoint","");
                this.Data["keypoint"][i][keypointId][0] = (Keypoints[j].x()+Groups[i].x()) / this.Stage.width();
                this.Data["keypoint"][i][keypointId][1] = (Keypoints[j].y()+Groups[i].y()) / this.Stage.height();
            }
        }
    }
}
