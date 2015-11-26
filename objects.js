Quintus.Objects = function(Q){
    Q.component('scrollingList', {
        added:function(){
            var entity=this.entity;
            for(i=0;i<entity.p.list.length;i++){
                //The list item is your own custom object
                var item = entity.insert(new Q.ListItem({x:6,y:entity.p.listItemStartY+i*entity.p.listItemSpacingY,w:entity.p.w-42,h:entity.p.itemH,num:i}));
                entity.p.items.push(item);
                item.insert(new Q.UI.Text({x:0,y:entity.p.startY,align:'left',size:12,label:entity.p.list[i]}));
            }

            //Insert the scrollbar if there are enough items in the list
            if(entity.p.list.length>entity.p.maxItems){
                var underScrollBar = entity.insert(new Q.UnderScrollBar({x:entity.p.w-20,y:entity.p.h/2,w:16,h:entity.p.h-40}));

                var scrollbarH = underScrollBar.p.h/(entity.p.items.length/entity.p.maxItems);
                if(scrollbarH<16){scrollbarH=16;};
                var scrollbar = entity.insert(new Q.ScrollBar({x:entity.p.w-20,y:underScrollBar.p.y-underScrollBar.p.h/2,box:entity,bar:underScrollBar,h:scrollbarH}));
                underScrollBar.p.scrollbar = scrollbar;

                var upArrow = entity.insert(new Q.CycleArrow({x:entity.p.w-20,y:0,pos:'up',box:entity,bar:scrollbar}));
                upArrow.p.y+=upArrow.p.h/2;
                var downArrow = entity.insert(new Q.CycleArrow({x:entity.p.w-20,y:underScrollBar.p.h,pos:'down',box:entity,bar:scrollbar}));
                downArrow.p.y+=downArrow.p.h*1.5;
                var topScrollBarJumper = entity.insert(new Q.ScrollBarJumper({x:entity.p.w-20,y:underScrollBar.p.y-underScrollBar.p.h/2,bar:underScrollBar,w:16,scrollbar:scrollbar}));
                topScrollBarJumper.setH((scrollbar.p.y-scrollbar.p.h/2)-(underScrollBar.p.y-underScrollBar.p.h/2));
                topScrollBarJumper.p.cy=0;
                topScrollBarJumper.p.points=[[-topScrollBarJumper.p.w/2,0],[topScrollBarJumper.p.w/2,0],[topScrollBarJumper.p.w/2,topScrollBarJumper.p.h],[-topScrollBarJumper.p.w/2,topScrollBarJumper.p.h]];
                var bottomScrollBarJumper = entity.insert(new Q.ScrollBarJumper({x:entity.p.w-20,y:scrollbar.p.y+scrollbar.p.h/2,bar:underScrollBar,w:16,scrollbar:scrollbar,bottom:true}));
                bottomScrollBarJumper.setH((underScrollBar.p.h)-(scrollbar.p.y+scrollbar.p.h/2)+(underScrollBar.p.y-underScrollBar.p.h/2));
                bottomScrollBarJumper.setY(scrollbar.p.y+scrollbar.p.h/2);
                bottomScrollBarJumper.p.cy=0;
                bottomScrollBarJumper.p.points=[[-bottomScrollBarJumper.p.w/2,0],[bottomScrollBarJumper.p.w/2,0],[bottomScrollBarJumper.p.w/2,bottomScrollBarJumper.p.h],[-bottomScrollBarJumper.p.w/2,bottomScrollBarJumper.p.h]];

                scrollbar.p.topScrollBarJumper = topScrollBarJumper;
                scrollbar.p.bottomScrollBarJumper = bottomScrollBarJumper;
                scrollbar.startAt(entity.p.startAt*entity.p.itemH); 
            }
        }
    });
    //Custom list item goes here
    Q.UI.Container.extend('ListItem',{
        init:function(p){
            this._super(p,{
                cx:0,cy:0,
                fill:'white',
                type:Q.SPRITE_UI
            });
            this.p.points=[[0,0],[this.p.w,0],[this.p.w,this.p.h],[0,this.p.h]];
            this.on("touch");
        },
        touch:function(e){
            console.log("Touched "+this.p.num+" at "+e.x+","+e.y)
        }
    });
    
    //This is the arrow at the top and bottom
    Q.UI.Container.extend('CycleArrow',{
        init:function(p){
            this._super(p,{
                type:Q.SPRITE_UI,
                points:[[16,8],[-16,8],[-16,-8],[16,-8]],
                color:"black",
                w:20,h:20
            });
            this.on("touch",this,"clicked");
        },
        draw: function(ctx) {
            ctx.fillStyle = this.p.color;
            //This part should be taken out and coordinates for the triangle should be passed to moveTo and lineTo
            if(this.p.pos==="down"){
                ctx.rotate(Math.PI);
            }
            ctx.beginPath();
            ctx.moveTo(-this.p.w/2,this.p.h/2);
            ctx.lineTo(0,-this.p.h/2);
            ctx.lineTo(this.p.w/2,this.p.h/2);
            ctx.fill();
        },
        clicked:function(e){
            var bar = this.p.bar;
            if(this.p.pos==='down'){
                bar.move(-25);
            } else {
                bar.move(25);
            }
            bar.touchEnd();
        }
    });
    //This is the 'bar' sprite that the scroll bar sits on
    Q.UI.Container.extend('UnderScrollBar',{
        init:function(p){
            this._super(p,{
                fill:'grey',
                type:Q.SPRITE_NONE
            });
        }
    });
    
    //This is the invinsible jumper that you can push to cycle the list one full page
    //There is one above and one below the scroll bar
    Q.UI.Container.extend('ScrollBarJumper',{
        init:function(p){
            this._super(p,{
                //fill:'red',
                type:Q.SPRITE_UI
            });
            this.on("touch",this,"clicked");
        },
        setH:function(h){
            this.p.h = h;
            this.p.points=[[-this.p.w/2,0],[this.p.w/2,0],[this.p.w/2,this.p.h],[-this.p.w/2,this.p.h]];
        },
        setY:function(y){
            this.p.y=y;
        },
        clicked:function(e){
            var bar = this.p.scrollbar;
            if(this.p.bottom){
                bar.p.y+=bar.p.h;
            } else {
                bar.p.y-=bar.p.h;
            }
            bar.p.y=bar.checkBounds(bar.p.y);
            bar.touchEnd();
        }
    });
    
    //This is the scroll bar that you can drag
    Q.UI.Container.extend('ScrollBar',{
        init:function(p){
            this._super(p,{
                fill:"black",
                w:16,
                type:Q.SPRITE_UI,
                shadow:0
            });
            this.p.points=[[-this.p.w/2,-this.p.h/2],[this.p.w/2,-this.p.h/2],[this.p.w/2,this.p.h/2],[-this.p.w/2,this.p.h/2]];
            this.on("drag");
            this.on("touchEnd");
            this.p.y+=this.p.h/2;
            this.p.startY=this.p.y;
            this.p.origY = this.p.y;
            this.p.minScroll=this.p.y;
            this.p.maxScroll=this.p.bar.p.h+(this.p.y-this.p.h);
        },
        checkBounds:function(check){
            var min = this.p.minScroll;
            var max = this.p.maxScroll;
            if(check>=min&&check<=max){
                return check;
            } else if(check<min){
                return min;
            } else if(check>max){
                return max;
            }
        },
        touchEnd:function(e){
            this.p.startY=this.p.y;
            var percent = Math.round((this.p.y-this.p.origY)/((this.p.maxScroll-this.p.minScroll)/100));
            //var boxPercent = Math.round()
            var box = this.p.box;
            var items = box.p.items;
            for(i=0;i<items.length;i++){
                items[i].p.y=box.p.listItemStartY+i*box.p.listItemSpacingY-((this.p.box.p.maxScrollH/100)*percent);
            }
            this.p.topScrollBarJumper.setH((this.p.y-this.p.h/2)-(this.p.bar.p.y-this.p.bar.p.h/2));
            this.p.bottomScrollBarJumper.setH((this.p.bar.p.h)-(this.p.y+this.p.h/2)+(this.p.bar.p.y-this.p.bar.p.h/2));
            this.p.bottomScrollBarJumper.setY(this.p.y+this.p.h/2);
        },
        drag:function(e){
            var dif = e.y+this.p.startY;
            var orig = e.sy;
            var percent = Math.round((this.p.y-this.p.origY)/((this.p.maxScroll-this.p.minScroll)/100));
            var box = this.p.box;
            this.p.y = this.checkBounds(dif-orig);
            var items = box.p.items;
            for(i=0;i<items.length;i++){
                items[i].p.y=box.p.listItemStartY+i*box.p.listItemSpacingY-((this.p.box.p.maxScrollH/100)*percent);
            }
        },
        move:function(amount){
            this.p.y = this.checkBounds(this.p.y-amount);
            this.p.startY=this.p.y;
            var box = this.p.box;
            var items = box.p.items;
            var percent = Math.round((this.p.y-this.p.origY)/((this.p.maxScroll-this.p.minScroll)/100));
            
            for(i=0;i<items.length;i++){
                items[i].p.y=box.p.listItemStartY+i*box.p.listItemSpacingY-((this.p.box.p.maxScrollH/100)*percent);
            }
        },
        startAt:function(at){
            //Need to figure out how to use the 'at' number to move the list up by that number and also set the scrollbar to have moved by that same percentage. I'm not good with math :'(
            var box = this.p.box;
            var items = box.p.items;
            this.p.y = this.checkBounds(this.p.y+at);
            this.p.startY=this.p.y;
            var percent = Math.round((this.p.y-this.p.origY)/((this.p.maxScroll-this.p.minScroll)/100));
            
            for(i=0;i<items.length;i++){
                items[i].p.y=box.p.listItemStartY+i*box.p.listItemSpacingY-((box.p.maxScrollH/100)*percent);
            }
        }
    });
    
};