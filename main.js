window.addEventListener("load", function() {

var Q = window.Q = Quintus({audioSupported: ['mp3','ogg','wav']})
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX, Audio, Objects")
        .setup({ development: true, width:window.innerWidth,height:window.innerHeight});
Q.controls(true).touch(Q.SPRITE_UI)
.enableSound();

Q.createList=function(stage){
    
    var smallBox = stage.insert(new Q.UI.Container({
        cx:0,cy:0,
        x:100,y:300,
        w:200,h:500,
        fill:'#01A9DB',
        radius:0,
        
        //Positioning stuff
        listItemStartY:14,
        listItemSpacingY:118,
        startY:8,
        spacingY:18,
        
        //The height of each list item
        itemH:100,
        //Track the list items
        items:[],
        //Which list item is at the top of the list
        //This auto-moves the scrollbar
        //Right now it does't really work as it just moves the scrollbar down startAt*itemH instead of by a percentage based on the scrollbar.
        //See the bottom of objects.js
        startAt:1,
        //An array of text taken from the game state
        list:Q.state.get("smallBoxList")
    }));
    //Max items on the container at a time 
    smallBox.p.maxItems=Math.floor(smallBox.p.h/(smallBox.p.itemH+smallBox.p.spacingY));
    //Set the collision points so that we can click it properly
    smallBox.p.points=[[0,0],[smallBox.p.w,0],[smallBox.p.w,smallBox.p.h],[0,smallBox.p.h]];
    //Where the bottom of the list is so we know when to stop
    smallBox.p.maxScrollH=(smallBox.p.startY-smallBox.p.h)+(smallBox.p.list.length*(smallBox.p.spacingY+smallBox.p.itemH));
    //Add the scrollingList component
    smallBox.add("scrollingList");
    
    var notEnoughBox = stage.insert(new Q.UI.Container({
        cx:0,cy:0,
        x:350,y:100,
        w:400,h:800,
        fill:'#01A9DB',
        radius:0,
        startAt:0,
        
        listItemStartY:14,
        listItemSpacingY:118,
        
        startY:8,
        spacingY:18,
        itemH:100,
        
        items:[],
        
        list:Q.state.get("notEnoughItemsList")
    }));
    notEnoughBox.p.maxItems=Math.floor(notEnoughBox.p.h/(notEnoughBox.p.itemH+notEnoughBox.p.spacingY));
    notEnoughBox.p.points=[[0,0],[notEnoughBox.p.w,0],[notEnoughBox.p.w,notEnoughBox.p.h],[0,notEnoughBox.p.h]];
    notEnoughBox.p.maxScrollH=(notEnoughBox.p.startY-notEnoughBox.p.h)+(notEnoughBox.p.list.length*(notEnoughBox.p.spacingY+notEnoughBox.p.itemH));
    notEnoughBox.add("scrollingList");
    
    //List Box
    var listBox = stage.insert(new Q.UI.Container({
        cx:0,cy:0,
        x:800,y:0,
        w:612,h:Q.height-100,
        fill:'#01A9DB',
        radius:0,
        startAt:0,
        
        listItemStartY:14,
        listItemSpacingY:118,
        
        startY:8,
        spacingY:18,
        itemH:100,
        
        items:[],
        
        list:Q.state.get("list")
    }));
    listBox.p.maxItems=Math.floor(listBox.p.h/(listBox.p.itemH+listBox.p.spacingY));
    listBox.p.points=[[0,0],[listBox.p.w,0],[listBox.p.w,listBox.p.h],[0,listBox.p.h]];
    listBox.p.maxScrollH=(listBox.p.startY-listBox.p.h)+(listBox.p.list.length*(listBox.p.spacingY+listBox.p.itemH));
    listBox.add("scrollingList");
    
};
Q.scene('scrollbar',function(stage){
    Q.createList(stage,Q.state.get("list"));
});
Q.state.set({
    list:["I am a list","You can add more items to the list in game state.","There are still a few things that need to be done","such as making items not 'overflow' outside the top","and the bottom of the list boxes","This can probably be done by editing the list item's draw function","fillerbox","auskdaushdaksd","asduhaisdhasd","awiofhawfoiaw"],
    smallBoxList:['Number1','Number2','Number3','Number4','Number5','Number6','Number7','Number8','Number9'],
    notEnoughItemsList:["I'm the only item, so no scrollbar!"]
});
Q.stageScene('scrollbar', 0);
//Q.debug=true;
});
