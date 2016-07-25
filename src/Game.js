/*
 Work task:
 1：生成游戏场景，地图层，加入蛋子；
 2：移动蛋子；
 3：地图层加入障碍物，碰撞检测；
 4：蛋和蛋的碰撞，引入全局环境变量，友火，墙损，高级低级模式；
 5：细化操作来移动蛋子；
 6：加入能力的设计：风，土，火，水；
 7：回合，玩家所属判定；
 8：信息层，HUD（可有可无）；
 9：超屏地图移动
10：粒子效果，能力的表现细化；
11：地图,蛋子的精致@1x,@2x,@3x，图标；
12：任意符合规格的png转地图（实在不行就标准化地图文件.mmp/是Tilemap）；
13：游戏前菜单：本地游戏(Ai/Hi)，在线游戏（建立/加入）（样子货），说明，设置，GameCenter(样子货)；
14：音效，音乐（尝试用GarageBand原创）；
15：GameCenter玩家对战；
16：丰富地图；
17：AI，关卡；
18：丰富球材质，IAP；
19：发布。
*/
BasicGame.Game = function (game) {

	//	When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;		//	a reference to the currently running game
    this.add;		//	used to add sprites, text, groups, etc
    this.camera;	//	a reference to the game camera
    this.cache;		//	the game cache
    this.input;		//	the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;		//	for preloading assets
    this.math;		//	lots of useful common math operations
    this.sound;		//	the sound manager - add a sound, play one, set-up markers, etc
    this.stage;		//	the game stage
    this.time;		//	the clock
    this.tweens;	//	the tween manager
    this.world;		//	the game world
    this.particles;	//	the particle manager
    this.physics;	//	the physics manager
    this.rnd;		//	the repeatable random number generator

    //	You can use any of these from any function within this State.
    //	But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

    //user define
    Map= new Object();
        Map.Width=9;
        Map.Height=9;
        Map.Pixel=new Array();
        Map.Pixel=[];
        Map.Spawn=new Array();
        Map.Element=new Array();
        Map.Block=new Array();
    Marble= new Array();
    MarbleCG=null;//collision group
    BlockCG=null;
    Setting= new Object();
        Setting.mode=0;
        Setting.friendFire=true; // lose layer
        Setting.friendE=false; //use element
        Setting.NPlayer=2;//numbers of players
        Setting.NMarble=1;//numbers of balls  of each player
    Ready=new Object();//ready of global
        Ready.Set=false;
        Ready.Map=false;
        Ready.Marble=false;
        Ready.Element=false;
    N=new Object();//Number of global
        N.Marble=0;//Number of Marbles in total.
        N.Element=0;//Number of element in total.
        N.Friction=0.5;
        N.WindPower=-0.7
    Play=new Object();
        Play.curPlayer=0;
        Play.round=0;
        Play.marble=new Array();
            Play.marble[0]=1;
            Play.marble[1]=1;
        Play.score=new Array();
            Play.score[0]=0;
            Play.score[1]=0;
    Temp=new Object();
        Temp.state=0;
        Temp.against=0;
    FX=null;//audio
    BB=50;//Block Size
    BBA=64;//Block Size Actually

};

BasicGame.Game.prototype = {
    initSet : function()
    {
        Setting.mode=1;//0 & 1;
        Setting.NPlayer=2;
        Setting.NMarble=2;
        for(var i=0;i<Setting.NPlayer;i++)
        {
            Play.marble[i]=Setting.NMarble;
            Play.score[i]=0;
        }
        N.Marble=Setting.NPlayer*Setting.NMarble;
        Map.Width=16;
        Map.Height=16;
        Map.Pixel=
        [
                    1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,
                    1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,
                    1,  0, 80,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 70,  0,  1,
                    1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,
                    1,  0,  0,  0, -1,  0,  0,  0,  0,  0,  0, -1,  0,  0,  0,  1,
                    1,  0,  0,  0,  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  1,
                    1,  0,  0,  0,  0,  0,  0,  1,  0, 90,  0,  0,  0,  0,  0,  1,
                    1,  0,  0,  0,  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  1,
                    1,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,  1,
                    1,  0,  0,  0,  0,  0, 90,  0,  1,  0,  0,  0,  0,  0,  0,  1,
                    1,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,  1,
                    1,  0,  0,  0, -1,  0,  0,  0,  0,  0,  0, -1,  0,  0,  0,  1,
                    1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,
                    1,  0, 81,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 71,  0,  1,
                    1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,
                    1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,
        ];
        var BG=this.add.sprite(0,0,"BG");
        return Ready.Set=true;
    },
    createBlock : function(x,y,typ)
    {
        if(typ===0)
            return;
        Block=this.add.sprite(BB/2+x*BB,BB/2+y*BB,"M"+typ);
        Block.anchor.setTo(0.5, 0.5);
        // this.physics.enable(Block, Phaser.Physics.ARCADE);
        // Block.body.collideWorldBounds = true;
        // Block.body.immovable = true;
        this.physics.p2.enable(Block);
        Block.body.static = true;
        // Block.body.setCollisionGroup(BlockCG);
        // Block.body.collides(MarbleCG);
        Block.typ=typ;
        // var shit=-30;
        switch(typ)
        {
            case 2:
                Block.body.clearShapes();
                ////////////////////////why??
                Block.body.addPolygon([false,true,5],[[0,0],[BB,0],[0,BB]]);

                // Block.body.loadPolygon('mask', 'tetrisblock2');

                // Block.body.x-=BB/3;
                // Block.body.y-=BB/3;

                // Block.body.adjustCenterOfMass();
                break;
            case 3:
                Block.body.clearShapes();
                ////////////////////////why??
                // Block.body.x-=BBA/1.5;
                // Block.body.y-=BBA/3;
                Block.body.addPolygon([false,true,5],[[0,0],[BB,0],[BB,BB]]);
                break;
            case 4:
                Block.body.clearShapes();
                Block.body.addPolygon([false,true,5],[[BB,0],[BB,BB],[0,BB],]);
                break;
            case 5:
                Block.body.clearShapes();
                Block.body.addPolygon([false,true,5],[[BB,BB],[0,BB],[0,0]]);
                break;
            case 6:
                Block.body.clearShapes();
                Block.body.setCircle(BB/2);
                break;


            case -2:
                Block.body.clearShapes();
                Block.body.addPolygon([false,true,5],[[0,0],[0,BB],[BB,0]]);
                break;
            case -3:
                Block.body.clearShapes();
                Block.body.addPolygon([false,true,5],[[0,0],[BB,0],[BB,BB]]);
                break;
            case -4:
                Block.body.clearShapes();
                Block.body.addPolygon([false,true,5],[[BB,BB],[0,BB],[BB,0]]);
                break;
            case -5:
                Block.body.clearShapes();
                Block.body.addPolygon([false,true,5],[[BB,BB],[0,BB],[0,0]]);
                break;
            case -6:
                Block.body.clearShapes();
                Block.body.setCircle(BB/2);
                break;
            default:
                Block.body.clearShapes();
                Block.body.setRectangle(BB,BB);
                break;
        }
        Block.scale.set(BB/BBA);
        if(typ<0)
        {
            // Block.body.collides(Marble, fall, this);
            Block.body.onBeginContact.add(this.fall,this);
        }
        else
        {
            Block.body.onBeginContact.add(this.reflect,this);
        }
        return Block;
    },

    initMap : function()
    {
        var i = 0;
        var j = 0;
        for(var y=0;y<Map.Height;y++)
        {
            Map.Block[y]=new Array();
            for(var x=0;x<Map.Width;x++)
            {
                var ii=y*Map.Width+x;
                Map.Block[y][x]=new Object();
                if(Map.Pixel[ii]>89)
                {
                    // element symbol
                    Map.Element[j]=this.add.sprite(BB/2+x*BB,BB/2+y*BB,"E"+(Map.Pixel[ii]-90));
                    Map.Element[j].anchor.setTo(0.5,0.5);
                    Map.Element[j].BG=this.add.sprite(BB/2+x*BB,BB/2+2+y*BB,"EE");
                    Map.Element[j].BG.anchor.setTo(0.5,0.5)
                    this.physics.arcade.enable(Map.Element[j].BG);
                    Map.Element[j].BG.body.angularVelocity=10;
                    Map.Element[j].BG.scale.set(BB/BBA);
                    Map.Element[j].bringToTop();
                    Map.Element[j].health=0;
                    Map.Element[j].typ=Map.Pixel[ii]-90;
                    Map.Element[j].hold=0;
                    Map.Element[j].scale.set(BB/BBA);
                    j++;
                }
                else if(Map.Pixel[ii]>79)
                {
                    //spawn type 1
                    Map.Spawn[i]=new Object();
                    Map.Spawn[i].x=x*BB;
                    Map.Spawn[i].y=y*BB;
                    i++;
                    // Map.Block[y][x]=this.createBlock(x,y,0);
                }
                else if(Map.Pixel[ii]>69)
                {
                    //spawn type 2
                    Map.Spawn[i]=new Object();
                    Map.Spawn[i].x=x*BB;
                    Map.Spawn[i].y=y*BB;
                    i++;
                    // Map.Block[y][x]=this.createBlock(x,y,0);
                }
                else Map.Block[y][x]=this.createBlock(x,y,Map.Pixel[ii]);

            }
        }
        N.Element=j;
        if(i!=N.Marble)// # Spawn point != # Marbles
            return false;
        else
            return Ready.Map=true;
    },

    initMarble : function()
    {
        var MID=0;//marble ID
        if(Ready.Map===true)
        {
            for(var i=0;i<Setting.NPlayer;i++)
            {
                for(var j=0;j<Setting.NMarble;j++)
                {
                    Marble[MID]= this.add.sprite(BB/2+Map.Spawn[MID].x,BB/2+Map.Spawn[MID].y,"B"+i);
                    this.physics.p2.enable(Marble[MID]);
                    Marble[MID].own=i;
                    Marble[MID].health=1;
                    // Marble[MID].Vo=0;// velocity original
                    // Marble[MID].Vt=0;// velocity temp
                    // Marble[MID].Xo=Marble[MID].x;
                    // Marble[MID].Yo=Marble[MID].y;
                    // Marble[MID].Xt=Marble[MID].x;
                    // Marble[MID].Yt=Marble[MID].y;
                    Marble[MID].water=0;
                    Marble[MID].fire=0;
                    Marble[MID].earth=0;
                    Marble[MID].wind=0;
                    Marble[MID].waterE=this.add.emitter(Marble[MID].body.x,Marble[MID].body.y,600);
                    Marble[MID].waterE.makeParticles(['Water']);
                    Marble[MID].waterE.minParticleScale = 0.6;
                    Marble[MID].waterE.maxParticleScale = 1.2;
                    Marble[MID].waterE.start(false, 400, 0);
                    Marble[MID].waterE.on=false;
                    Marble[MID].fireE=this.add.sprite(Marble[MID].body.x,Marble[MID].body.y, 'Fire');
                    Marble[MID].fireE.anchor.setTo(0.55,0.62);
                    Marble[MID].fireE.animations.add('run');
                    Marble[MID].fireE.animations.play('run', 20, true);
                    Marble[MID].fireE.scale.set(1.3);
                    Marble[MID].fireE.visible=false;
                    Marble[MID].earthE=this.add.sprite(Marble[MID].body.x,Marble[MID].body.y,"Earth");
                    Marble[MID].earthE.anchor.setTo(0.5,0.5)
                    this.physics.arcade.enable(Marble[MID].earthE);
                    Marble[MID].earthE.body.angularVelocity=10;
                    Marble[MID].earthE.visible=false;
                    // Marble[MID].earthE.scale.set(BB/BBA);
                    Marble[MID].windE=this.add.sprite(Marble[MID].body.x,Marble[MID].body.y,"Wind");
                    Marble[MID].windE.anchor.setTo(0.5,0.5)
                    Marble[MID].windE.scale.set(1.2,0.85);
                    Marble[MID].windE.visible=false;
                    Marble[MID].EE=0;//total
                    Marble[MID].body.setCircle(BB/2);
                    Marble[MID].scale.set(BB/64);
                    Marble[MID].body.damping=N.Friction;
                    Marble[MID].body.angularDamping=N.Friction;
                    // Marble[MID].body.setCollisionGroup(MarbleCG);
                    Marble[MID].bringToTop();
                    Marble[MID].fireE.bringToTop();
                    Marble[MID].windE.bringToTop();
                    // Marble[MID].body.collides(BlockCG);
                    // Marble[MID].body.collideWorldBounds = true;
                    // Marble[MID].body.velocity.x=1000;
                    // Marble[MID].body.velocity.y=400;
                    // Marble[MID].inputEnabled = true;
                    // Marble[MID].input.enableDrag();
                    // Marble[MID].events.onDragStart.add(this.onDragStart, this);
                    // Marble[MID].events.onDragStop.add(this.onDragStop, this);
                    MID++;
                }
            }
            for(var i=0;i<N.Marble;i++)
                for(var j=i+1;j<N.Marble;j++)
                {
                    Marble[i].body.createBodyCallback(Marble[j], this.against, this);
                }
            return Ready.Marble=true;
        }
        else
            return false;
    },
    roundEnd :function()
    {
        Play.curPlayer=(Play.curPlayer+1)%Setting.NPlayer;
        Play.round++;
        Temp.state=0;
        for(var i=0;i<Setting.NPlayer;i++)
            {
                if(Play.marble[i]===0)
                {
                    Temp.wininfo.text="Player"+i+" lose!";
                    var tween = this.add.tween(Temp.wininfo.scale).to( { x: 2, y: 2 }, 2300, Phaser.Easing.Elastic.Out, true);
                }
            }
        ////generate element
        for(var i=0;i<N.Element;i++)
        {
            for(var j=0;j<N.Marble;j++)
            {
                if(Map.Element[i].hold>0&&Math.sqrt(Math.pow(Map.Element[i].x-Marble[j].body.x,2)+Math.pow(Map.Element[i].y-Marble[j].body.y,2))<60)
                {
                    this.getE(Marble[j],Map.Element[i]);
                }
            }
            Map.Element[i].health--;
            if(Map.Element[i].health<0&&Map.Element[i].hold===0)
            {
                switch(Map.Element[i].typ)
                {
                    default:
                        Map.Element[i].hold=this.rnd.integerInRange(1,4);
                }
                Map.Element[i].loadTexture('E'+Map.Element[i].hold);
            }
        }
    },
    // onDragStart : function(sprite,pointer)
    // {
    //     sprite.Xo=sprite.x;
    //     sprite.Yo=sprite.y;

    // },
    // onDragStop : function(sprite,pointer)
    // {
    //     sprite.Xt=sprite.x;
    //     sprite.Yt=sprite.y;
    //     // sprite.body.velocity.setTo(100*(sprite.Xt-sprite.Xo),100*(sprite.Yt-sprite.Yo));
    //     sprite.body.velocity.x=10*(sprite.Xt-sprite.Xo);
    //     sprite.body.velocity.y=10*(sprite.Yt-sprite.Yo);
    // },

    tapdown : function(pointer)
    {
        if(Temp.state===0)
        {
            var ownMarbleBody = Array();
            for(var i=0,j=0;i<N.Marble;i++)
            {
                if(Marble[i].own===Play.curPlayer)
                {
                    ownMarbleBody[j++]=Marble[i].body;
                }
            }
          // var bodies = this.physics.p2.hitTest(pointer.position, [ Marble[0].body, Marble[1].body, Marble[2].body,Marble[3].body ]);

            var bodies = this.physics.p2.hitTest(pointer.position, ownMarbleBody);
            // p2 uses different coordinate system, so convert the pointer position to p2's coordinate system
            var physicsPos = [this.physics.p2.pxmi(pointer.position.x), this.physics.p2.pxmi(pointer.position.y)];

            if (bodies.length)
            {
                var clickedBody = bodies[0];
                Temp.dragging=true;
                Temp.state=1;//dragging
                Temp.clickedBody=clickedBody.parent;
                Temp.x0=Temp.clickedBody.x;
                Temp.y0=Temp.clickedBody.y;
                // Temp.test.text=clickedBody.x+"  "+clickedBody.y+" "+Temp.x0+"  "+Temp.y0+" "+Marble[0].x+" "+Marble[0].y;
                var localPointInBody = [0, 0];
                // this function takes physicsPos and coverts it to the body's local coordinate system
                clickedBody.toLocalFrame(localPointInBody, physicsPos);

                // use a revoluteContraint to attach mouseBody to the clicked body
                mouseConstraint = this.physics.p2.createRevoluteConstraint(mouseBody, [0, 0], clickedBody, [this.physics.p2.mpxi(localPointInBody[0]), this.physics.p2.mpxi(localPointInBody[1]) ]);
            }
        }
    },

    release : function()
    {

        // remove constraint from object's body
        if(Temp.dragging)
        {
            Temp.clickedBody.velocity.x*=3;
            Temp.clickedBody.velocity.y*=3;
            this.physics.p2.removeConstraint(mouseConstraint);
        }
        if(Temp.state===1)
        {
            Temp.clickedBody=null;
            Temp.dragging=false;
            Temp.state=2;// moving;
        }
    },

    move : function(pointer)
    {

        // p2 uses different coordinate system, so convert the pointer position to p2's coordinate system
        mouseBody.position[0] = this.physics.p2.pxmi(pointer.position.x);
        mouseBody.position[1] = this.physics.p2.pxmi(pointer.position.y);

    },

    getE : function(M,E)
    {
        FX.play("ping");
        if(Setting.mode===0)
        {
            M.earth=0;
            M.wind=0;
            M.water=0;
            M.fire=0;
        }
        switch(E.hold)
        {
            case 1:
                M.fire+=1+Math.floor((E.hold-1)/4);
                M.fireE.x=M.body.x;
                M.fireE.y=M.body.y;
                M.fireE.visible=true;
                break;
            case 2:
                M.water+=2+Math.floor((E.hold-1)/4);
                M.waterE.x=M.body.x;
                M.waterE.y=M.body.y;
                M.waterE.on=true;
                break;
            case 3:
                M.wind+=3+Math.floor((E.hold-1)/4);
                M.body.damping=N.WindPower;
                M.windE.x=M.body.x;
                M.windE.y=M.body.y;
                break;
            case 4:
                M.earth+=4+Math.floor((E.hold-1)/4);
                M.earthE.x=M.body.x;
                M.earthE.y=M.body.y;
                M.earthE.visible=true;
                break;
        }
        M.EE=M.fire+M.water+M.wind+M.earth;
        E.hold=0;
        E.health=3;
        E.loadTexture('E'+E.hold);

    },
    gainE : function(M,E,Ti)//Marble, Element_type, times of layer
    {
        if(Setting.mode===0)
        {
            M.earth=0;
            M.wind=0;
            M.water=0;
            M.fire=0;
        }
        switch(E)
        {
            case 1:
                M.fire+=Ti;
                M.fireE.x=M.body.x;
                M.fireE.y=M.body.y;
                M.fireE.visible=true;
                break;
            case 2:
                M.water+=Ti;
                M.waterE.x=M.body.x;
                M.waterE.y=M.body.y;
                M.waterE.on=true;
                break;
            case 3:
                M.wind+=Ti;
                M.windE.x=M.body.x;
                M.windE.y=M.body.y;
                M.body.damping=N.WindPower;
                break;
            case 4:
                M.earth+=Ti;
                M.earthE.x=M.body.x;
                M.earthE.y=M.body.y;
                M.earthE.visible=true;
                break;
        }
        M.EE=M.fire+M.water+M.wind+M.earth;

    },
    loseE :function(M,fall)
    {
        if(M.earth>0)
        {
            M.earth--;
            if(M.earth===0)
                M.earthE.visible=false;
        }
        else if(M.wind>0)
        {
            M.wind--;
            if(M.wind===0)
            {
                M.windE.visible=false;
                M.body.damping=N.Friction;
            }
        }
        else if(fall)
        {
            this.die(M);
        }
        else if(M.water>0)
        {
            M.water--;
            if(M.water===0)
                M.waterE.on=false;
        }
        else if(M.fire>0)
        {
            M.fire--;
            if(M.fire===0)
                M.fireE.visible=false;
        }
        else
            return false;// no enough element to against the hit
        M.EE=M.fire+M.water+M.wind+M.earth;
        return true;
    },

    useE : function(M,M2)
    {
        if(M.fire>0)
        {
            M.fire--;
            if(M.fire===0)
                M.fireE.visible=false;
            this.die(M2);
            M.EE=M.fire+M.water+M.wind+M.earth;
            return 1;
        }
        else if(M.water>0)
        {
            M.water--;
            if(M.water===0)
                M.waterE.on=false;
            M.EE=M.fire+M.water+M.wind+M.earth;
            return 2;
        }
        else if(M.wind>0)
        {
            M.wind--;
            if(M.wind===0)
            {
                M.windE.visible=false;
                M.body.damping=N.Friction;
            }
            M.EE=M.fire+M.water+M.wind+M.earth;
            return 3;
        }
        else if(M.earth>0)
        {
            M.earth--;
            if(M.earth===0)
                M.earthE.visible=false;
            M.EE=M.fire+M.water+M.wind+M.earth;
            return 4;
        }
        else
            return false;// no enough element to against the hit
    },

    giveE : function(M2,M1)
    {
        FX.play("squit");
        if(M2.earth>0)
        {
            this.gainE(M1,4,M2.earth);
            M2.earth=0;
            M2.earthE.visible=false;
        }
        else if(M2.wind>0)
        {
            this.gainE(M1,3,M2.wind);
            M2.wind=0;
            M2.windE.visible=false;
            M2.body.damping=N.Friction;
        }
        else if(M2.water>0)
        {
            this.gainE(M1,2,M2.water);
            M2.water=0
            M2.waterE.on=false;
        }
        else if(M2.fire>0)
        {
            this.gainE(M1,1,M2.fire);
            M2.fire=0;
            M2.fireE.visible=false;
        }
        else
            return false;// no enough element to against the hit
        M1.EE=M1.fire+M1.water+M1.wind+M1.earth;
        M2.EE=M2.fire+M2.water+M2.wind+M2.earth;
        return true;

    },

    fall : function(M)
    {
        this.loseE(M.sprite,true);
        FX.play("alien death");
    },
    reflect : function(M)
    {
        this.loseE(M.sprite,false);
        FX.play("numkey");
    },
    against : function(MB1,MB2)
    {
        Temp.against++;
        FX.play("numkey");
        var M1=MB1.sprite,M2=MB2.sprite;
        if(M2.own===Play.curPlayer)// Make sure M1 is curplayer's
        {
            var TM=M1;
            M1=M2;
            M2=TM;
        }
        if(M1.own===M2.own||(M1.own!=Play.curPlayer&&M2.own!=Play.curPlayer))
        {
            if(Setting.friendE)
            {//very complicated.

            }
            else
            {
                if(Setting.friendFire)
                {
                    this.loseE(M1,false);
                    this.loseE(M2,false);
                }
            }

        }
        else
        {
            if(this.useE(M1,M2)===2)
            {
                this.giveE(M2,M1);
            }
            else
            {
                this.loseE(M2,false);
            }
        }


    },
    die : function(M)
    {
        // M.kill();
        FX.play("shot");
        M.body.clearShapes();
        M.body.velocity.x=0;
        M.body.velocity.y=0;
        var tween = this.add.tween(M.scale).to( { x: 0, y: 0 }, 2300, Phaser.Easing.Elastic.Out, true);
        // this.Timer.add(2000,M.kill,this);
        M.fireE.visible=false;
        M.waterE.on=false;
        M.windE.visible=false;
        M.earthE.visible=false;
        Play.marble[M.own]--;
        Play.score[Play.curPlayer]++;


    },
    // hit : function(body, shapeA, shapeB, equation)
    // {

    //     // body.sprite.destroy();
    //     Temp.test2.text = 'You last hit: ' + this.x;

    // },

    // getHit : function(M)
    // {

    // },

    // hitWithE : function(M1,M2)
    // {

    // },

    // clickEvent : function()
    // {
        

    // },


















	create: function () {

		//	Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.physics.startSystem(Phaser.Physics.P2JS);
        this.physics.p2.setImpactEvents(true);
        this.physics.p2.restitution = 0.6;
        // MarbleCG = this.physics.p2.createCollisionGroup();//CollisionGroup
        // BlockCG = this.physics.p2.createCollisionGroup();//CollisionGroup
        // this.physics.p2.updateBoundsCollisionGroup();
        // this.world.width=800;
        // this.world.height=400;
        //  Make things a bit more bouncey
        // this.physics.p2.defaultRestitution = 0.7;///////////????????????
        // this.physics.p2.friction = N.Friction;
        this.initSet();
        this.initMap();
        this.world.setBounds(0, 0, Map.Width*BB, Map.Height*BB);
        this.initMarble();
        Ready.init=Ready.Set&&Ready.Map&&Ready.Marble;


        mouseBody = new p2.Body();
        this.physics.p2.world.addBody(mouseBody);


    // this.camera.follow(mouseBody);
        // attach pointer events
        this.input.onDown.add(this.tapdown, this);
        this.input.onUp.add(this.release, this);
        this.input.addMoveCallback(this.move, this);
        // this.input.onTap.add(this.clickEvent,this);
        // this.gainE(Marble[0],2,3);
        // this.gainE(Marble[2],1,2);
        // this.gainE(Marble[2],2,2);
        // this.gainE(Marble[2],3,3);
        // this.gainE(Marble[2],4,4);
        // this.gainE(Marble[2],1,3);
        // Marble[0].body.velocity.y=450;
        var backButton = this.add.button(775, BB/2, 'Back', this.quitGame, this);
        backButton.anchor.setTo(0.5);
        // backButton.scale.set(0.8);
        backButton.bringToTop();
        Temp.wininfo=this.add.text(400,600,"Zero",0x000000);
        Temp.wininfo.anchor.setTo(0.5,0.5);
        Temp.wininfo.scale.set(0);
        //audio
        FX = this.add.audio('sfx');
        FX.allowMultiple = true;

        //  And this defines the markers.

        //  They consist of a key (for replaying), the time the sound starts and the duration, both given in seconds.
        //  You can also set the volume and loop state, although we don't use them in this example (see the docs)

        FX.addMarker('alien death', 1, 1.0);
        FX.addMarker('boss hit', 3, 0.5);
        FX.addMarker('escape', 4, 3.2);
        FX.addMarker('meow', 8, 0.5);
        FX.addMarker('numkey', 9, 0.1);
        FX.addMarker('ping', 10, 1.0);
        FX.addMarker('death', 12, 4.2);
        FX.addMarker('shot', 17, 1.0);
        FX.addMarker('squit', 19, 0.3);
        Temp.test=this.add.text(20,10,"Zero",0x000000);
        Temp.test2=this.add.text(0,100,"Zero",0x000000);

	},

	update: function ()
    {
        // console.log(this);
		//	Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
        Temp.test.text="";// "+Temp.against+"\n"+Marble[0].fire+" "+Marble[0].water+" "+Marble[0].wind+" "+Marble[0].earth+"\n"+Marble[1].fire+" "+Marble[1].water+" "+Marble[1].wind+" "+Marble[1].earth+"\n"+Marble[2].fire+" "+Marble[2].water+" "+Marble[2].wind+" "+Marble[2].earth+"\n"+Marble[3].fire+" "+Marble[3].water+" "+Marble[3].wind+" "+Marble[3].earth+"\n";
        Temp.test2.text="";//\n\ncurPlayer:"+Play.curPlayer+"  state"+Temp.state;
        if(Ready.init)
        {
            if(Temp.dragging)
            {
                Temp.stable=false;
                // Temp.test.text=Temp.x0+"  "+Temp.y0+" "+Marble[0].x+" "+Marble[0].y;
                if(Math.pow(this.input.activePointer.x-Temp.x0,2)+Math.pow(this.input.activePointer.y-Temp.y0,2)>300)
                {
                    this.release();
                }
            }
            else //check all marbles moves end
            {
                Temp.stable=true;
                for(var i=0;i<N.Marble;i++)
                {
                    if(Marble[i].alive===false)
                        continue;
                    if(Math.abs(Marble[i].body.velocity.x)>2 || Math.abs(Marble[i].body.velocity.y)>2)
                    {
                        Temp.stable=false;
                        break;
                    }
                }

            }
            if(Temp.state===2&&Temp.stable)
            {
                // Temp.state=3;//RoundEnd;
                this.roundEnd();
            }


            for(var i=0;i<N.Marble;i++)
            {
                if(Math.abs(Marble[i].body.velocity.x)<4)
                    Marble[i].body.velocity.x=0;
                if(Math.abs(Marble[i].body.velocity.y)<4)
                    Marble[i].body.velocity.y=0;
                if(Marble[i].fire!=0)
                {
                    Marble[i].fireE.x=Marble[i].body.x;
                    Marble[i].fireE.y=Marble[i].body.y;
                }
                if(Marble[i].water!=0)
                {
                    Marble[i].waterE.x=Marble[i].body.x;
                    Marble[i].waterE.y=Marble[i].body.y;
                }
                if(Marble[i].wind!=0)
                {
                    if(Math.abs(Marble[i].body.velocity.x)<5&&Math.abs(Marble[i].body.velocity.y)<5)
                        Marble[i].windE.visible=false;
                    else
                    {
                        Marble[i].windE.visible=true;
                        Marble[i].windE.x=Marble[i].body.x;
                        Marble[i].windE.y=Marble[i].body.y;
                        if(Marble[i].body.velocity.x===0)
                        {
                            Marble[i].windE.rotation=3.1415926535897932384626/2;
                            Marble[i].windE.rotation*= Marble[i].body.velocity.y>0? 1: -1;
                        }
                        else
                        {
                            Marble[i].windE.rotation=Math.atan(Marble[i].body.velocity.y/Marble[i].body.velocity.x);
                            if(Marble[i].body.velocity.x<0)
                                Marble[i].windE.rotation+=3.1415926535897932384626;
                        }
                    }
                }
                if(Marble[i].earth!=0)
                {
                    Marble[i].earthE.x=Marble[i].body.x;
                    Marble[i].earthE.y=Marble[i].body.y;
                }
            }

            ///////////////////////////////////
            //how about something else?
            ///////////////////////////////////
            // if(Temp.state===3)
            // {
            //     this.roundEnd();
            // }
            // this.physics.arcade.collide(Marble[0], Marble[1]);
            //friction velocity has individual problem. mark
            /*
            for(var i=0;i<N.Marble;i++)
            {
                if(Marble[i].body.velocity.x>N.Friction)
                    Marble[i].body.velocity.x-=N.Friction;
                else if(Marble[i].body.velocity.x<-N.Friction)
                    Marble[i].body.velocity.x+=N.Friction;
                else
                    Marble[i].body.velocity.x=0;
                if(Marble[i].body.velocity.y>N.Friction)
                    Marble[i].body.velocity.y-=N.Friction;
                else if(Marble[i].body.velocity.y<-N.Friction)
                    Marble[i].body.velocity.y+=N.Friction;
                else
                    Marble[i].body.velocity.y=0;
            }
            */
        }

	},

	quitGame: function (pointer) {

		//	Here you should destroy anything you no longer need.
		//	Stop music, delete sprites, purge caches, free resources, all that good stuff.

		//	Then let's go back to the main menu.
		this.state.start('MainMenu');

	}

};
