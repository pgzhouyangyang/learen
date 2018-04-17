const imgbindclick = function(el,that) {
    var imgs = el.querySelectorAll("img");
    var _this = that;
    if(imgs.length) {
        for (var i = 0; i < imgs.length; i++) {
            ;(function(i) {
                imgs[i].onclick=function(event){
                    event.stopPropagation();
                    var p = imgs[i].clientWidth/imgs[i].clientHeight
                    var h = 800/p
                    _this.previewerList= [(
                        {
                            src: this.src,
                            h: h,
                            w: 800,
                        }
                    )];
                    _this.imgIndex = i;
                    setTimeout( () => {
                        _this.$refs.previewer.show(0)
                    })

                }

            })(i)
        }
    }

}
export {
    imgbindclick
}
