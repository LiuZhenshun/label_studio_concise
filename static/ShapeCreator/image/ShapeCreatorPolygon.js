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

class CreaAnnoPolygon extends CreaAnno{
    constructor(AnnoType, Data, Stage, Layer) {
        super(AnnoType, Data, Stage, Layer);

        this.stageClick = this.StageClick.bind(this);
        this.startPointClick = this.StartPointClick.bind(this);

        this.classes = {"face": 0}

        this.startPoint;
        this.poly;
        this.line;
        this.polyVector = [];

        this.stageClickCounter = 0;
    }

    StarCrea(){
        this.poly = new Konva.Group();
        this.line = new Konva.Line({
            points: this.polyVector,
            fill: "rgba(14, 136, 233, 0.3)",
            stroke: "rgba(0, 0, 0, 0.3)",
            strokeWidth: 2,
            closed: true,
            draggable: false
        });
        this.Stage.on('click', this.stageClick);
        this.Layer.add(this.poly);
        this.poly.add(this.line);
    }

    StageClick(e){
        this.stageClickCounter = this.stageClickCounter + 1;
        this.polyVector.push(this.Stage.getPointerPosition().x);
        this.polyVector.push(this.Stage.getPointerPosition().y);
        let circle = new Konva.Circle({
            x: this.Stage.getPointerPosition().x,
            y: this.Stage.getPointerPosition().y,
            radius: 3,
            fill: "rgba(255, 0, 0, 1)",
            draggable: false,
            opacity: 1,
        });
        if (this.stageClickCounter == 1){
            this.xStart = this.Stage.getPointerPosition().x;
            this.yStart = this.Stage.getPointerPosition().y;
            circle.fill("rgba(0, 255, 0, 1)");
            circle.radius(5);
            this.startPoint = circle;
            this.startPoint.on('click', this.startPointClick);
        }
        this.poly.add(circle);
        this.line.points(this.polyVector);
    }

    StartPointClick(e){
        // the last number is represented as class
        this.polyVector.push(this.classes["face"]);
        if (("polygon" in this.Data) == false){
            this.Data["polygon"] = {};
        }
        // Determine the number of keys
        const nextKey = Object.keys(this.Data["polygon"]).length;
        for (let i=0; i<this.polyVector.length-1; i=i+2){
            this.polyVector[i] = this.polyVector[i] / this.Stage.width();
            this.polyVector[i+1] = this.polyVector[i+1] / this.Stage.height();
        }

        this.Data["polygon"][nextKey] = this.polyVector;
        this.startPoint.off("click");
        this.Stage.off("click");
        this.poly.destroy();
        this.line.destroy();
        this.polyVector = [];
        this.stageClickCounter = 0;
        this.poly = undefined;
        this.line = undefined;
        document.dispatchEvent(new Event('annotation-end'));
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
class VisualizatorPolygon extends Visualizator{
    constructor(AnnoType, Data, Stage, Layer, ButtCont) {
        super(AnnoType, Data, Stage, Layer);
        this.ButtCont = ButtCont;
        this.SelectedButton;
    }

    ShowData(){
        this.ClearAnno();
        var data = this.Data;
        if ("polygon" in data){
            for (let i = 0; i < Object.keys(data["polygon"]).length; i++){
                this.CreaPolygon(data["polygon"][i], i);
                this.ShowButton(i);
            }
        }
    }

    //create rectagle
    CreaPolygon(data, id){
        var group = new Konva.Group({
            name:"group"+id,
            draggable:false,
        });

        let Data = data.slice(0,-1);
        for (let i=0; i<Data.length-1; i=i+2){
            Data[i] = Math.floor(Data[i] * this.Stage.width());
            Data[i+1] = Math.floor(Data[i+1] * this.Stage.height());
        }

        var line = new Konva.Line({
            points: Data,
            fill: "rgba(14, 136, 233, 0.3)",
            stroke: "rgba(0, 0, 0, 0.3)",
            strokeWidth: 2,
            closed: true,
            draggable: false
        });
        
        let polygonButton = this.CreateButton("Polygon"+(id+1), id, "list-group-item list-group-item-action");
        line.Button = polygonButton;
        this.Layer.add(group);
        group.add(line);

        for (let j = 0; j < data.length-1; j=j+2) {
            let circle = new Konva.Circle({
                x: Math.floor(data[j] * this.Stage.width()),
                y: Math.floor(data[j+1] * this.Stage.height()),
                radius: 3,
                fill: "rgba(255, 0, 0, 1)",
                name: "keypoint"+ j/2,
                draggable: false,
                opacity: 1,
            });
            group.add(circle);
        }
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

class ListenerPolygon extends Listener{
    constructor(AnnoType, Data, Stage, Layer, ButtCont, Transformer) {
        super(AnnoType, Data, Stage, Layer);
        this.ButtCont = ButtCont;
        this.Transformer = Transformer;
        this.Layer.add(this.Transformer);
        this.SelectedLine;
        this.SelectedKeypoint;
        this.ActiveButton;
    }

    StartStageListener(){
        var Stage = this.Stage;
        var Data = this.Data;

        var RelatedButton = this.ActiveButton;

        var ImageShowW = this.Stage.width();
        var ImageShowH = this.Stage.height();

        // clicks should select/deselect shapes
        this.Stage.on('click', (e) => {
        // if click on empty area - remove all selections
            if (e.target === this.Stage) {
                this.Transformer.nodes([]);
                if (this.SelectedLine){
                    this.SelectedLine.draggable(false);
                    this.SelectedLine = undefined;
                }
                if(this.ActiveButton){
                    this.ActiveButton.setAttribute('class',"list-group-item list-group-item-action");
                }
                if (this.SelectedKeypoint){
                    this.SelectedKeypoint.radius(3);
                    this.SelectedKeypoint.draggable(false);
                    this.SelectedKeypoint = undefined;
                }
                return;
            }
            // do nothing if clicked NOT on our rectangles
            if (e.target.getClassName() === 'Line') {
                if (this.SelectedLine === e.target){
                    let group = this.SelectedLine.getParent();
                    let boxId = group.getAttr('name').replace("group","");
                    let keypointId;
                    let keypointData = this.Data["polygon"][boxId];

                    for (let i = 0; i < keypointData.length-1; i=i+2) {
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
                      //console.log(circle);
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

                if(this.SelectedLine){
                    this.Transformer.nodes([]);
                    this.SelectedLine.draggable(false);
                }
                this.SelectedLine = e.target;
                this.Transformer.nodes([e.target.getParent()]);
                // this.SelectedLine.draggable(true);
                return;
            }
            
            if (e.target.getClassName() === 'Circle'){
                if (this.SelectedKeypoint === e.target){
                    this.SelectedKeypoint.radius(3);
                    this.SelectedKeypoint.draggable(false);
                    this.SelectedKeypoint.off("dragmove");
                    this.SelectedKeypoint = undefined;
                    return;
                }
                if (this.SelectedKeypoint){
                    this.SelectedKeypoint.radius(3);
                    this.SelectedKeypoint.draggable(false);
                }
                this.SelectedKeypoint = e.target;
                e.target.radius(5);
                e.target.draggable(true);
                e.target.on("dragmove", (e1) =>{
                    let keypointId = e1.target.getAttr('name').replace("keypoint","");
                    let groupId = e1.target.getParent().getAttr('name').replace("group","");
                    let line = e1.target.getParent().getChildren()[0];
                    let dataLength = this.Data["polygon"][groupId].length;
                    let points = this.Data["polygon"][groupId].slice(0,dataLength-1).map(element => {
                        if (Array.isArray(element)) {
                          return element.slice();
                        } else {
                          return element;
                        }
                      });
                    for (let j = 0; j < dataLength-1; j=j+2) {
                        points[j] = Math.floor(points[j] * this.Stage.width());
                        points[j+1] = Math.floor(points[j+1] * this.Stage.height());
                    }
                    points[2*keypointId] = e1.target.x();
                    points[2*keypointId + 1] = e1.target.y();
                    this.Data["polygon"][groupId][2*keypointId] = e1.target.x() / this.Stage.width();
                    this.Data["polygon"][groupId][2*keypointId + 1] = e1.target.y() / this.Stage.height();
                    line.points(points);
                });
                return;
            }
        });
    }

    StopStageListener(){
        //stop shape listening
        this.Stage.off('click');
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

class ShapeDeletorPolygon extends ShapeDeletor{
    constructor(AnnoType, Data, Stage, Layer, Transformer) {
        super(AnnoType, Data, Stage, Layer, Transformer);
        this.Transformer = Transformer;
    }

    DeleteShape(){
        let SelectedShape = this.Transformer.nodes();
        if(SelectedShape.length){
            let group = SelectedShape[0];
            let id = group.getAttr('name').replace("group","");
            this.Data["polygon"] = this.removeObjectAtIndex(this.Data["polygon"], id);
            group.destroy();
            document.dispatchEvent(new Event('showlabel'));
        }
    }

    removeObjectAtIndex(obj, indexToRemove) {
        const result = {};
        let newIndex = 0;     
        for (const key in obj) {
          if (parseInt(key) !== parseInt(indexToRemove)){
            result[newIndex] = obj[key];
            newIndex++;
          }
        }    
        return result;
    }
}

class SaveData{
    constructor(AnnoType, Data) {
        this.AnnoTypeCSS = AnnoType;
        this.Data = Data;
    }
}

class SaveDataPolygon extends ShapeDeletor{
    constructor(AnnoType, Data, Stage) {
        super(AnnoType, Data);
        this.Stage = Stage;
        this.Layer = Stage.getChildren()[0];
    }

    SaveData(){
        let Groups = this.Layer.getChildren(function(node){
            return node.getClassName() === 'Group';
        });
        let Line;
        for (let i = 0; i < Groups.length; i++){
            Line = Groups[i].getChildren(function(node){
                return node.getClassName() === 'Line';
            })[0];
            let points = Line.points();           
            for (let j=0; j<points.length-1; j=j+2){
                this.Data["polygon"][i][j] = points[j] / this.Stage.width();
                this.Data["polygon"][i][j+1] = points[j+1] / this.Stage.height();
            }
        }
    }
}

