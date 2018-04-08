export default function(element,options){
    var zoom={};
    var defaults={
        speed: 200,
		maxZoom: 2.6,
		minZoom: 1,
    };
    var scale=1,
    currentScale = 1,
	isScaling = false,
	isGesturing = false;
    zoom.options=Object.assign(defaults,options);

    zoom.wrapper = element;
    zoom.wrapper.style.transform="translate3d(0,0,0)";
	zoom.scroller = element.querySelector(".img-scroller");
	zoom.scrollerStyle = zoom.scroller && zoom.scroller.style;
	zoom.zoomer = element.querySelector(".img");
	zoom.zoomerStyle = zoom.zoomer && zoom.zoomer.style;
    zoom._cal = function() {
			wrapperWidth = zoom.wrapper.offsetWidth;
			wrapperHeight = zoom.wrapper.offsetHeight;
			imageWidth = zoom.zoomer.offsetWidth;
			imageHeight = zoom.zoomer.offsetHeight;
			var scaledWidth = imageWidth * scale;
			var scaledHeight = imageHeight * scale;
			imageMinX = Math.min((wrapperWidth / 2 - scaledWidth / 2), 0);
			imageMaxX = -imageMinX;
			imageMinY = Math.min((wrapperHeight / 2 - scaledHeight / 2), 0);
			imageMaxY = -imageMinY;
	};
    zoom.transition = function(style, time) {
        time = time || 0;
		style['webkitTransitionDuration'] = time + 'ms';
		return zoom;
	};
	zoom.translate = function(style, x, y) {
		x = x || 0;
		y = y || 0;
		style['webkitTransform'] = 'translate3d(' + x + 'px,' + y + 'px,0px)';
		return zoom;
	};
	zoom.scrollerTransition = function(time) {
		return zoom.transition(zoom.scrollerStyle, time);
	};
	zoom.scrollerTransform = function(x, y) {
		return zoom.translate(zoom.scrollerStyle, x, y);
	};
	zoom.zoomerTransition = function(time) {
		return zoom.transition(zoom.zoomerStyle, time);
	};
    //
	zoom.zoomerTransform = function(scale) {
		return zoom.scale(zoom.zoomerStyle, scale);
	};
    // 缩放
    zoom.scale = function(style,scale){
        scale = scale || 1;
		style['webkitTransform'] = 'translate3d(0,0,0) scale(' + scale + ')';
		return zoom;
    }
    // 双击事件
    zoom.doubleTapEvent = function(position) {
		zoom.toggleZoom(position);
        return zoom;
	};
    // 双击缩放/恢复
    zoom.toggleZoom = function(position,speed){
        if (typeof position === 'number') {
				speed = position;
				position = undefined;
			}
			speed = typeof speed === 'undefined' ? zoom.options.speed : speed;
			if (scale && scale !== 1) {
				scale = currentScale = 1;
				zoom.scrollerTransition(speed).scrollerTransform(0, 0);
			} else {
				scale = currentScale = zoom.options.maxZoom;
				if (position) {
					var top = zoom.zoomer.offsetTop;
					var left = zoom.zoomer.offsetLeft;;
					var offsetX = (position.x - left) * scale;
					var offsetY = (position.y - top) * scale;
                    zoom._cal();
					if (offsetX >= imageMaxX && offsetX <= (imageMaxX + wrapperWidth)) { //center
						offsetX = imageMaxX - offsetX + wrapperWidth / 2;

					} else if (offsetX < imageMaxX) { //left
						offsetX = imageMaxX - offsetX + wrapperWidth / 2;

					} else if (offsetX > (imageMaxX + wrapperWidth)) { //right
						offsetX = imageMaxX + wrapperWidth - offsetX - wrapperWidth / 2;
					}
					if (offsetY >= imageMaxY && offsetY <= (imageMaxY + wrapperHeight)) { //middle
						offsetY = imageMaxY - offsetY + wrapperHeight / 2;
					} else if (offsetY < imageMaxY) { //top
						offsetY = imageMaxY - offsetY + wrapperHeight / 2;
					} else if (offsetY > (imageMaxY + wrapperHeight)) { //bottom
						offsetY = imageMaxY + wrapperHeight - offsetY - wrapperHeight / 2;
					}
					offsetX = Math.min(Math.max(offsetX, imageMinX), imageMaxX);
					offsetY = Math.min(Math.max(offsetY, imageMinY), imageMaxY);
					zoom.scrollerTransition(speed).scrollerTransform(offsetX, offsetY);
				} else {
					zoom.scrollerTransition(speed).scrollerTransform(0, 0);
				}
			}
			zoom.zoomerTransition(speed).zoomerTransform(scale);
        return zoom;
    };
    zoom.touchstart=function(position){
        imageIsTouched = true;
		imageTouchesStart.x = position.x;
		imageTouchesStart.y = position.y;
    }
    zoom.touchMove=function(position){
        if (!imageIsTouched) return;
        if (!imageIsMoved) {
            wrapperWidth = zoom.wrapper.offsetWidth;
            wrapperHeight = zoom.wrapper.offsetHeight;
            imageWidth = zoom.zoomer.offsetWidth;
            imageHeight = zoom.zoomer.offsetHeight;
            var translate = zoom.scroller.style.transform;
            var arr=translate.substring(12).split(",");
            translate={
                x:parseInt(arr[0]),
                y:parseInt(arr[1]),
                z:parseInt(arr[2])
            };
            imageStartX = translate.x || 0;
            imageStartY = translate.y || 0;
            zoom.scrollerTransition(0);
        }
        var scaledWidth = imageWidth * scale;
        var scaledHeight = imageHeight * scale;

        if (scaledWidth < wrapperWidth && scaledHeight < wrapperHeight) return;

        imageMinX = Math.min((wrapperWidth / 2 - scaledWidth / 2), 0);
        imageMaxX = -imageMinX;
        imageMinY = Math.min((wrapperHeight / 2 - scaledHeight / 2), 0);
        imageMaxY = -imageMinY;
        imageTouchesCurrent.x =position.x;
        imageTouchesCurrent.y = position.y;
        imageIsMoved = true;
        imageCurrentX = imageTouchesCurrent.x - imageTouchesStart.x + imageStartX;
        imageCurrentY = imageTouchesCurrent.y - imageTouchesStart.y + imageStartY;
        if (imageCurrentX < imageMinX) {
            imageCurrentX = imageMinX + 1 - Math.pow((imageMinX - imageCurrentX + 1), 0.8);
        }
        if (imageCurrentX > imageMaxX) {
            imageCurrentX = imageMaxX - 1 + Math.pow((imageCurrentX - imageMaxX + 1), 0.8);
        }

        if (imageCurrentY < imageMinY) {
            imageCurrentY = imageMinY + 1 - Math.pow((imageMinY - imageCurrentY + 1), 0.8);
        }
        if (imageCurrentY > imageMaxY) {
            imageCurrentY = imageMaxY - 1 + Math.pow((imageCurrentY - imageMaxY + 1), 0.8);
        }
        //Velocity
        if (!velocityPrevPositionX) velocityPrevPositionX = imageTouchesCurrent.x;
        if (!velocityPrevPositionY) velocityPrevPositionY = imageTouchesCurrent.y;
        if (!velocityPrevTime) velocityPrevTime = new Date().getTime();
        velocityX = (imageTouchesCurrent.x - velocityPrevPositionX) / (new Date().getTime() - velocityPrevTime) / 2;
        velocityY = (imageTouchesCurrent.y - velocityPrevPositionY) / (new Date().getTime() - velocityPrevTime) / 2;
        if (Math.abs(imageTouchesCurrent.x - velocityPrevPositionX) < 2) velocityX = 0;
        if (Math.abs(imageTouchesCurrent.y - velocityPrevPositionY) < 2) velocityY = 0;
        velocityPrevPositionX = imageTouchesCurrent.x;
        velocityPrevPositionY = imageTouchesCurrent.y;
        velocityPrevTime = new Date().getTime();
        zoom.scrollerTransform(imageCurrentX, imageCurrentY);
    }
    zoom.touchEnd=function(){
        // if (!e.touches.length) {
		// 	isGesturing = false;
		// }
        if (!imageIsTouched || !imageIsMoved) {
            imageIsTouched = false;
            imageIsMoved = false;
            return;
        }
        imageIsTouched = false;
        imageIsMoved = false;
        var momentumDurationX = 300;
        var momentumDurationY = 300;
        var momentumDistanceX = velocityX * momentumDurationX;
        var newPositionX = imageCurrentX + momentumDistanceX;
        var momentumDistanceY = velocityY * momentumDurationY;
        var newPositionY = imageCurrentY + momentumDistanceY;

        if (velocityX !== 0) momentumDurationX = Math.abs((newPositionX - imageCurrentX) / velocityX);
        if (velocityY !== 0) momentumDurationY = Math.abs((newPositionY - imageCurrentY) / velocityY);
        var momentumDuration = Math.max(momentumDurationX, momentumDurationY);

        imageCurrentX = newPositionX;
        imageCurrentY = newPositionY;

        var scaledWidth = imageWidth * scale;
        var scaledHeight = imageHeight * scale;
        imageMinX = Math.min((wrapperWidth / 2 - scaledWidth / 2), 0);
        imageMaxX = -imageMinX;
        imageMinY = Math.min((wrapperHeight / 2 - scaledHeight / 2), 0);
        imageMaxY = -imageMinY;
        imageCurrentX = Math.max(Math.min(imageCurrentX, imageMaxX), imageMinX);
        imageCurrentY = Math.max(Math.min(imageCurrentY, imageMaxY), imageMinY);

        zoom.scrollerTransition(momentumDuration).scrollerTransform(imageCurrentX, imageCurrentY);
    };
    zoom.pinchStart=function(event){
        isGesturing = true;
    };
    zoom.pinchMove=function(e){
        if (!isScaling) {
			zoom.zoomerTransition(0);
			isScaling = true;
		}
		scale = (e.detail ? e.detail.scale : e.scale) * currentScale;
		if (scale > zoom.options.maxZoom) {
			scale = zoom.options.maxZoom - 1 + Math.pow((scale - zoom.options.maxZoom + 1), 0.5);
		}
		if (scale < zoom.options.minZoom) {
			scale = zoom.options.minZoom + 1 - Math.pow((zoom.options.minZoom - scale + 1), 0.5);
		}
		zoom.zoomerTransform(scale);
    }
    zoom.pichEnd=function(){
        scale = Math.max(Math.min(scale, zoom.options.maxZoom), zoom.options.minZoom);
		zoom.zoomerTransition(zoom.options.speed).zoomerTransform(scale);
		currentScale = scale;
		isScaling = false;
    };
    // 手势
    var hammer=new Hammer(element);
    hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });
    hammer.get('pinch').set({ enable: true });
    // var hammer1=new Hammer.Manager(zoom.zoomer);
    // hammer.add( new Hammer.Tap({ event: 'doubletap', taps: 2 }) );
    // hammer.add( new Hammer.Tap({ event: 'singletap' }) );
    // hammer.get('doubletap').recognizeWith('singletap');
    // hammer.get('singletap').requireFailure('doubletap');
    hammer.on("doubletap",function(event){
        zoom.doubleTapEvent(event.center);
    })
    hammer.on("panstart",function(event){
        event.preventDefault();
        console.log(event);
        zoom.touchstart(event.center);
    });
    hammer.on("panmove",function(event){
        // event.preventDefault();
        zoom.touchMove(event.center)
    });
    hammer.on("panend",function(event){
        zoom.touchEnd(event.center)
    });
    hammer.on("pinch",function(event){
        zoom.pinchStart(event)
    });
    hammer.on("pinchstart",function(event){
        zoom.pinchStart(event)
    });
    hammer.on("pinchmove",function(event){
        zoom.pinchMove(event)
    });
    hammer.on("pinchend",function(event){
        zoom.pinchEnd(event)
    });
    var wrapperWidth, wrapperHeight, imageIsTouched, imageIsMoved, imageCurrentX, imageCurrentY, imageMinX, imageMinY, imageMaxX, imageMaxY, imageWidth, imageHeight, imageTouchesStart = {},imageTouchesCurrent = {},imageStartX, imageStartY, velocityPrevPositionX, velocityPrevTime, velocityX, velocityPrevPositionY, pandown,velocityY;
};
