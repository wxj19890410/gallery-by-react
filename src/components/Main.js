require('normalize.css/normalize.css');
require('styles/App.scss'); 

import React from 'react';
import ReactDOM from 'react-dom';

//获取图片相关信息
let imageDatas = require('../data/imageDatas.json');


//利用自执行函数，将图片名信息转成图片URL路径信息
imageDatas = (function genImageURL(imageDatasArr) {
	for (var i = 0; i < imageDatasArr.length; i++) {
		var singleImageData = imageDatasArr[i];

		singleImageData.imageURL = require('../images/' + singleImageData.fileName);

		imageDatasArr[i] = singleImageData;  
	}

	return imageDatasArr;
})(imageDatas);

//获取区间的一个随机值
function getrandom(low,high){
	return Math.floor(Math.random()*(high-low)+low);
}

//获取-30到30度的随机值
function get30degrandom(){
	return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
}

//class AppComponent extends React.Component 这是另一种写法
//创建图片组件
var ImageFigure=React.createClass({
  handleClick:function(e){
    if(this.props.arrange.isCenter){
      this.props.inverse();
    }
    else{
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  },
	render:function(){
    var styleObj={};
       // 如果props属性中指定了这张图片的位置，则使用
        if (this.props.arrange.pos) {
            styleObj = this.props.arrange.pos;
        }

        // 如果图片的旋转角度有值并且不为0， 添加旋转角度
        if(this.props.arrange.rotate) {
            
            (['MozT', 'msT', 'WebkitT', 't']).forEach(function (value) {
                styleObj[value + 'ransform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
            }.bind(this));
        }

        // 如果是居中的图片， z-index设为11
        if (this.props.arrange.isCenter) {
          styleObj.zIndex = 11;
        }
        var imgclassname='img-figure';
        imgclassname += this.props.arrange.isInverse ? ' is-inverse' : '';
        
		return (
           <figure className={imgclassname} style={styleObj} onClick={this.handleClick}>
             <img src={this.props.data.imageURL}
                  alt={this.props.data.title}

             />
             <figcaption>
                 <h2 className="img-title">{this.props.data.title}</h2>
                 <div className="img-back" onClick={this.handleClick}>
                   <p>{this.props.data.desc}</p>
                 </div>
             </figcaption>
           </figure>
           
			);
	}
});

//创建控制组件
var ControllUnit=React.createClass({
  //定义点击监听函数
  handleClick:function(e){
    if(this.props.arrange.isCenter){
      this.props.inverse();
    }
    else{
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  },
	render:function(){
    var controllunitclassname='controllunit';
    controllunitclassname+=this.props.arrange.isCenter ? ' is-center' : '';
    controllunitclassname+=this.props.arrange.isInverse ? ' is-inverse' : '';
		return (
           <span className={controllunitclassname} onClick={this.handleClick}></span>
			);
	}
})
  
var AppComponent=React.createClass({
    //定义数值常量来储存照片各区域范围
    Contant:{
    	centerpos:{
    		left:0,
    		top:0
    	},//中心区域范围
    	hpos:{
    		leftx:[0,0],
    		rightx:[0,0],
            y:[0,0]
    	},//水平区域范围
    	vpos:{
    		x:[0,0],
    		y:[0,0]
    	}//垂直区域的范围
    },
	//初始化数据
	getInitialState:function(){
		return {
			imgsArrangeArr:[
		/*	{
				pos:{
					left:0,
					top:0
				}
				ronate:0,//旋转角度
				isInverse:false,//是否翻面
				isCenter:false//是否是中心图片
			}*/
			]
		};
	},
  //组件加载后，计算图片布局的区域，包括左，右，上三个区域
  componentDidMount:function(){
    var stagedom=ReactDOM.findDOMNode(this.refs.stage),
        stagew=stagedom.scrollWidth,
        stageh=stagedom.scrollHeight,
        halfstagew=Math.ceil(stagew/2),
        halfstageh=Math.ceil(stageh/2);
    var imgdom=ReactDOM.findDOMNode(this.refs.img0),
        imgw=imgdom.scrollWidth,
        imgh=imgdom.scrollHeight,
        halfimgw=Math.ceil(imgw/2),
        halfimgh=Math.ceil(imgh/2);
    this.Contant.centerpos={
      left:halfstagew - halfimgw,
      top:halfstageh - halfimgh
    };
    this.Contant.hpos={
      leftx:[-halfimgw,halfstagew - halfimgw*3],
      rightx:[halfstagew + halfimgw,stagew - halfimgw],
      y:[-halfimgh,stageh - halfimgh]
    };
    this.Contant.vpos={
      x:[halfstagew - halfimgw,halfstagew],
      y:[-halfimgh,halfstageh - halfimgh*3]
    };
    this.rearrange(0);
  },

  //定义居中函数
  center:function(index){
    return function(){
       this.rearrange(index);
    }.bind(this)
  },
  //定义翻面函数
  inverse:function(index){
    return function(){
      var imgsArrangeArr=this.state.imgsArrangeArr;
      imgsArrangeArr[index].isInverse=!imgsArrangeArr[index].isInverse;
      this.setState({
        imgsArrangeArr:imgsArrangeArr
      });
    }.bind(this);
  },


  //定义布局函数,index为处于中间图片的索引
  rearrange:function(centerindex){
    var contant=this.Contant,
        imgsArrangeArr=this.state.imgsArrangeArr;
  //取出布局位于中间图片并布局
    var centerimg=imgsArrangeArr.splice(centerindex,1);
    centerimg[0]={
        pos:contant.centerpos,
        rotate:0,
        isInverse:false,
        isCenter:true
    };
  //取出随机一张布局上部区域
    var topimgindex=Math.ceil(Math.random*(imgsArrangeArr.length - 1)),
        topimg=imgsArrangeArr.splice(topimgindex,1);
    /*topimg.pos.left=getrandom(contant.vpos.x[0],contant.vpos.x[1]);
    topimg.pos.top=getrandom(contant.vpos.y[0],contant.vpos.y[1]);
    topimg.ronate=get30degrandom();*/
    topimg[0]={
      pos:{
        left:getrandom(contant.vpos.x[0],contant.vpos.x[1]),
        top:getrandom(contant.vpos.y[0],contant.vpos.y[1])
      },
      rotate:get30degrandom(),
      isInverse:false,
      isCenter:false
    };
  //布局左右区域
    for(var i=0,j=imgsArrangeArr.length,k=j/2;i<j;i++){
      if(i<k){
        /*imgsArrangeArr[i].pos={
          left:getrandom(contant.hpos.leftx[0],contant.hpos.leftx[1]),
          top:getrandom(contant.hpos.y[0],contant.hpos.y[1])
        };
        imgsArrangeArr[i].ronate=get30degrandom();*/
        imgsArrangeArr[i]={
            pos:{
              left:getrandom(contant.hpos.leftx[0],contant.hpos.leftx[1]),
              top:getrandom(contant.hpos.y[0],contant.hpos.y[1])
            },
            rotate:get30degrandom(),
            isInverse:false,
            isCenter:false
        };
      }else{
        /*imgsArrangeArr[i].pos={
          left:getrandom(contant.hpos.rightx[0],contant.hpos.rightx[1]),
          top:getrandom(contant.hpos.y[0],contant.hpos.y[1])
        };
        imgsArrangeArr[i].ronate=get30degrandom();*/
        imgsArrangeArr[i]={
            pos:{
              left:getrandom(contant.hpos.rightx[0],contant.hpos.rightx[1]),
              top:getrandom(contant.hpos.y[0],contant.hpos.y[1])
            },
            rotate:get30degrandom(),
            isInverse:false,
            isCenter:false
        };
      }
    }
  //将中心和上部图片归回数组
  imgsArrangeArr.splice(topimgindex,0,topimg[0]);
  imgsArrangeArr.splice(centerindex,0,centerimg[0]);
  this.setState({
    imgsArrangeArr: imgsArrangeArr
  });

  },
  render:function(){
    	var controllerUnits=[],
    	    imgfigure=[];
//对imageDatas进行遍历，获取数据，传入ImageFigure组件和ControllUnit组件
       imageDatas.forEach(function(value,index){
        if (!this.state.imgsArrangeArr[index]) {
            this.state.imgsArrangeArr[index] = {
                pos: {
                    left: 0,
                    top: 0
                },
                rotate: 0,
                isInverse: false,
                isCenter: false
            };
        }
       	imgfigure.push(<ImageFigure key={index} data={value} ref={'img'+index} arrange={this.state.imgsArrangeArr[index]} center={this.center(index)} inverse={this.inverse(index)}/>);
        controllerUnits.push(<ControllUnit key={index} arrange={this.state.imgsArrangeArr[index]} center={this.center(index)} inverse={this.inverse(index)}/>);
       }.bind(this));

    	return (
      <section className='stage' ref='stage'>
         <section className='img-sec'>
           {imgfigure}
         </section>
         <nav className='controller-nav'>
           {controllerUnits}
         </nav>
      </section>
    );
    }
});

AppComponent.defaultProps = {
};

export default AppComponent;
