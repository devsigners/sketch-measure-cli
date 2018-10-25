var I18N = {},
    lang = navigator.language.toLocaleLowerCase(),
    timestamp = new Date().getTime();
I18N['zh-cn'] = {
    "Design resolution": "设计分辨率",
    "NOTES": "备注",
    "PROPERTIES": "属性",
    "FILLS": "填充",
    "TYPEFACE": "字体",
    "TEXTSTYLE": "名称",
    "BORDERS": "边框",
    "SHADOWS": "阴影",
    "CSS STYLE": "CSS 样式",
    "CODE TEMPLATE": "代码模板",
    "EXPORTABLE": "导出",
    "Gradient": "渐变",
    "Color": "颜色",
  	"Layer Name": "图层名称",
    "Weight": "粗细",
    "Style name": "样式名称",
    "Custom": "自定义",
    "Standard": "标准像素",
    "iOS Devices": "iOS 设备",
    "Points": "标准点",
    "Retina": "视网膜",
    "Retina HD": "高清视网膜",
    "Android Devices": "安卓设备",
    "Other Devices": "其他设备",
    "Ubuntu Grid": "Ubuntu 网格",
    "Web View": "网页",
    "Scale": "倍率",
    "Unit": "单位",
    "Color format": "颜色格式",
    "Color hex": "色值",
    "ARGB hex": "安卓色值",
    "Save": "保存",
    "Width": "宽度",
    "Height": "高度",
    "Top": "上面",
    "Right": "右侧",
    "Bottom": "下面",
    "Left": "左侧",
    "Fill / Color": "填充 / 颜色",
    "Border": "边框",
    "Opacity": "不透明度",
    "Radius": "圆角",
    "Shadow": "外(内)阴影",
    "Style": "样式名称",
    "Font size": "字号",
    "Line": "行高",
    "Typeface": "字体",
    "Character": "字间距",
    "Paragraph": "段落间距",
    "Percentage of artboard": "基于画板百分比单位",
    "Mark": "标注",
    "All": "全选",
    "None": "不全选",
    "Select filtered": "选中过滤的",
    "Selection of Sketch": "Sketch 选中的画板",
    "Current of Sketch": "Sketch 当前的画板",
    "Filter": " 过滤",
    "Export": "导出",
    "Position": "位置",
    "Size": "大小",
    "Family": "字体",
    "Spacing": "空间",
    "Content": "内容",
    "All artboards": "全部画板",
    "No slices added!": "未添加切图",
    "No color names added!": "未添加颜色名称",
    "Select 1 or 2 layers to make marks!": "请选中 1 至 2 个图层!",
    "Select a text layer to make marks!": "请选中 1 个文本图层!",
    "Select a layer to make marks!": "请选中 1 个图层!",
    "Export spec": "导出规范",
    "Export to:": "导出到:",
    "Export": "导出",
    "Exporting...": "导出中...",
    "Export complete!": "导出完成!",
    "The slice not in current artboard.": "切图不在当前画板",
    "Inside Border": "内边框",
    "Outside Border": "外边框",
    "Center Border": "中心边框",
    "Inner Shadow": "内阴影",
    "Outer Shadow": "外阴影",
    "No artboards!": "没有画板",
    "You need add some artboards.": "您需要添加一些画板",
    "No slices added!": "没有添加切图",
    "No colors added!": "没有添加颜色",
    "Import": "导入",
    "Choose a &quot;colors.json&quot;": "选择一个 &quot;colors.json&quot;",
    "Choose": "选择",
    "Select a layer to add exportable!": "请选中 1 个图层!",
    "Import complete!": "导入完成!",
    "Processing layer %@ of %@": "图层处理中... %@ \/ %@",
    "Advanced mode": "高级模式",
    "Export layer influence rect": "导出图层的影响尺寸",
    "Set Name...": "设置名称...",
    "Import Colors": "导入颜色",
    "Export Colors": "导出颜色",
    "You can select shape layer to add colors or import colors": "您可以选中矢量图层添加颜色或导入颜色",
    "New Version!": "新的版本!",
    "Just checked Sketch Measure has a new version (%@)": "刚刚检测到 Sketch Measure 有新版 (%@)",
    "Download": "下载",
    "Cancel": "取消",
    "Donate": "捐赠"
};

(function(window) {

    String.prototype.firstUpperCase = function(){
        return this.replace(/\b(\w)(\w*)/g, function($0, $1, $2) {
            return $1.toUpperCase() + $2.toLowerCase();
        });
    }
    var _ = function(str){
        return (I18N[lang] && I18N[lang][str])? I18N[lang][str]: str;
    }
    var SMApp = function(project) {
        return new SMApp.fn.init(project);
    }
    SMApp.fn = SMApp.prototype = {
        constructor:SMApp,
        artboardID: undefined,
        selectedID: undefined,
        targetID: undefined,
        zoomSize: function(size) {
            return (size * this.configs.zoom);
        },
        percentageSize: function(size, size2){
            return (Math.round( size / size2 * 1000 ) / 10) + "%";
        },
        unitSize: function(length, isText){
            var length = Math.round( length / this.configs.scale * 100 ) / 100,
                units = this.configs.unit.split("/"),
                unit = units[0];
            if( units.length > 1 && isText){
                unit = units[1];
            }
            return length + unit;
        },
        scaleSize: function (length){
            return Math.round( length / this.configs.scale * 10 ) / 10;
        },
        positive: function(number) {
            return number < 0 ? -number :number;
        },
        isIntersect: function(selectedRect, targetRect){
            return !(
                selectedRect.maxX <= targetRect.x ||
                selectedRect.x >= targetRect.maxX ||
                selectedRect.y >= targetRect.maxY ||
                selectedRect.maxY <= targetRect.y
            );
        },
        getID: function(element){
            return '#' + $(element).attr('id');
        },
        getIndex: function(element){
            return $(element).attr('data-index');
        },
        getRect: function( index ){
            var layer = this.current.layers[index];
            return {
                x: layer.rect.x,
                y: layer.rect.y,
                width: layer.rect.width,
                height: layer.rect.height,
                maxX: layer.rect.x + layer.rect.width,
                maxY: layer.rect.y + layer.rect.height
            }
        },
        getDistance: function(selected, target){
            return {
                top: (selected.y - target.y),
                right: (target.maxX - selected.maxX),
                bottom: (target.maxY - selected.maxY),
                left: (selected.x - target.x)
            }
        },
        message: function(msg){
            var $message = $('#message').text(msg);
            $message.hide().fadeIn().delay( 1000 ).fadeOut('fast');
        },
        locationHash: function(options){
            if(options){
                var objHash = {},
                    arrHash = [];
                $.each(options, function(key, value){
                    if( /[a-z]+/.test(key) && !isNaN(value) ){
                        objHash[key] = parseInt(value);
                        arrHash.push(key + value);
                    }
                });
                window.history.replaceState(undefined, undefined, '#' + arrHash.join('-'));
                return objHash;
            }
            else{
                var objHash = {},
                    hash = window.location.hash.replace(/[\#\-]([a-z]+)([\d]+)/ig, function(match, key, value){
                        objHash[key] = parseInt(value);
                    });
                return objHash;
            }
        },
        render: function() {
            $('#app').html([
                '<header>',
                    '<div class="header-left">',
                        '<ul class="tab">',
                            '<li class="icon-artboards current" data-id="artboards"></li>',
                            '<li class="icon-slices" data-id="slices"></li>',
                            '<li class="icon-colors" data-id="colors"></li>',
                        '</ul>',
                    '</div>',
                    '<div class="header-center">',
                        '<div id="zoom" class="zoom-widget"></div>',
                        '<h1></h1>',
                        '<div class="show-notes">',
                            '<label for="show-notes">' + _('NOTES') + '</label>',
                            '<div class="slidebox">',
                                '<input id="show-notes" type="checkbox" name="show-notes" checked="checked">',
                                '<label for="show-notes"></label>',
                            '</div>',
                        '</div>',
                    '</div>',
                    '<div class="header-right"><div id="unit" class="unit-box" tabindex="0">XHDPI @2x (dp/sp)</div></div>',
                '</header>',
                '<main>',
                    '<aside class="navbar on">',
                        '<section id="artboards"></section>',
                        '<section id="slices" style="display: none;"><div class="empty">' + _('No slices added!') + '</div></section>',
                        '<section id="colors" style="display: none;"><div class="empty">' + _('No colors added!') + '</div></section>',
                    '</aside>',
                    '<section class="screen-viewer">',
                        '<div class="screen-viewer-inner">',
                            '<div id="screen" class="screen">',
                                '<div id="rulers" style="display:none;">',
                                    '<div id="rv" class="ruler v"></div>',
                                    '<div id="rh" class="ruler h"></div>',
                                '</div>',
                                '<div id="layers"></div>',
                                '<div id="notes"></div>',
                                '<div id="td" class="distance v" style="display:none;"><div data-height="3"></div></div>',
                                '<div id="rd" class="distance h" style="display:none;"><div data-width=""></div></div>',
                                '<div id="bd" class="distance v" style="display:none;"><div data-height=""></div></div>',
                                '<div id="ld" class="distance h" style="display:none;"><div data-width=""></div></div>',
                            '</div>',
                        '</div>',
                        '<div class="overlay"></div>',
                    '</section>',
                    '<aside id="inspector" class="inspector"></aside>',
                '</main>',
                '<div id="message" class="message"></div>',
                '<div id="cursor" class="cursor"></div>'
            ].join(''));
            this.zoom();
            this.unit();
            this.artboards();
            this.slices();
            this.colors();
            this.screen();
            this.layers();
            this.notes();
            this.events();
        },
        screen: function() {
            var imageData = (this.current.imageBase64)? this.current.imageBase64: this.current.imagePath + '?' + timestamp;

            if(!this.maxSize){
                var screenSize = (this.current.width > this.current.height)? this.current.width: this.current.height,
                    artboardSize = ($('.screen-viewer').outerWidth() > $('.screen-viewer').outerHeight())? $('.screen-viewer').outerWidth(): $('.screen-viewer').outerHeight();
                this.maxSize = (screenSize > artboardSize)? screenSize * 5: artboardSize * 5;

                $('#screen').parent().css({
                    width: this.maxSize,
                    height: this.maxSize
                });

                var scrollMaxX = this.maxSize - $('.screen-viewer').outerWidth(),
                    scrollMaxY = this.maxSize - $('.screen-viewer').outerHeight(),
                    scrollLeft = .5 * scrollMaxX,
                    scrollTop = .5 * scrollMaxY;

                $('.screen-viewer').scrollLeft(scrollLeft);
                $('.screen-viewer').scrollTop(scrollTop);
            }

            $('#screen').css({
                width: this.zoomSize( this.current.width ),
                height: this.zoomSize( this.current.height ),
                background: '#FFF url(' + imageData + ') no-repeat',
                backgroundSize: this.zoomSize( this.current.width ) + 'px ' + this.zoomSize( this.current.height ) + 'px'
            });

            $('.screen').css({
                marginLeft: -  parseInt( this.zoomSize( this.current.width / 2 ) ),
                marginTop: - parseInt( this.zoomSize( this.current.height / 2 ) )
            });

        },
        zoom: function(){
            var zoomText = this.configs.zoom * 100 + '%',
                inDisabled = (this.configs.zoom <= .25)? ' disabled="disabled"': '',
                outDisabled = (this.configs.zoom >= 4)? ' disabled="disabled"': '';
            $('#zoom').html([
                '<button class="zoom-in"' + inDisabled + '></button>',
                '<label class="zoom-text">' + zoomText + '</label>',
                '<button class="zoom-out"' + outDisabled + '></button>'
            ].join(''));
        },
        unit: function(){
            var self = this,
                unitsData = [
                    {
                        units: [
                            {
                                name: _('Standard'),
                                unit: 'px',
                                scale: 1
                            }
                        ]
                    },
                    {
                        name: _('iOS Devices'),
                        units: [
                            {
                                name: _('Points') + ' @1x',
                                unit: 'pt',
                                scale: 1
                            },
                            {
                                name: _('Retina') + ' @2x',
                                unit: 'pt',
                                scale: 2
                            },
                            {
                                name: _('Retina HD') + ' @3x',
                                unit: 'pt',
                                scale: 3
                            }
                        ]
                    },
                    {
                        name: _('Android Devices'),
                        units: [
                            {
                                name: 'LDPI @0.75x',
                                unit: 'dp/sp',
                                scale: .75
                            },
                            {
                                name: 'MDPI @1x',
                                unit: 'dp/sp',
                                scale: 1
                            },
                            {
                                name: 'HDPI @1.5x',
                                unit: 'dp/sp',
                                scale: 1.5
                            },
                            {
                                name: 'XHDPI @2x',
                                unit: 'dp/sp',
                                scale: 2
                            },
                            {
                                name: 'XXHDPI @3x',
                                unit: 'dp/sp',
                                scale: 3
                            },
                            {
                                name: 'XXXHDPI @4x',
                                unit: 'dp/sp',
                                scale: 4
                            }
                        ]
                    },
                    {
                        name: _('Web View'),
                        units: [
                            {
                                name: 'CSS Rem 12px',
                                unit: 'rem',
                                scale: 12
                            },
                            {
                                name: 'CSS Rem 14px',
                                unit: 'rem',
                                scale: 14
                            },
                            {
                                name: 'CSS Rem 16px',
                                unit: 'rem',
                                scale: 16
                            }
                        ]
                    }
                ],
                unitHtml = [],
                unitList = [],
                unitCurrent = '',
                hasCurrent = '';
                $.each(unitsData, function(index, data){
                    if(data.name) unitList.push('<li class="sub-title">' + _(data.name) + '</li>');
                    $.each(data.units, function(index, unit){
                        var checked = '';
                        // if(unit.scale == self.configs.scale){
                            if( unit.unit == self.configs.unit && unit.scale == self.configs.scale ){
                                checked = ' checked="checked"';
                                hasCurrent = _(unit.name);
                            }
                            unitList.push('<li><label><input type="radio" name="resolution" data-name="' + _(unit.name) + '" data-unit="' + unit.unit + '" data-scale="' + unit.scale + '"' + checked + '><span>' + _(unit.name) + '</span></label></li>');
                        // }
                    });
                });
                if(!hasCurrent){
                    unitCurrent = '<li><label><input type="radio" name="resolution" data-name="' + _('Custom') + ' (' + self.configs.scale + ', ' + self.configs.unit + ')" data-unit="' + self.configs.unit + '" data-scale="' + self.configs.scale + '" checked="checked"><span>' + _('Custom') + ' (' + self.configs.scale + ', ' + self.configs.unit + ')</span></label></li>';
                    hasCurrent = _('Custom') + ' (' + self.configs.scale + ', ' + self.configs.unit + ')';
                }
                unitHtml.push(
                    '<div class="overlay"></div>',
                    '<h3>' + _('Design resolution') + '</h3>',
                    '<p>' + hasCurrent + '</p>',
                    '<ul>',
                        unitCurrent,
                        unitList.join(''),
                    '</ul>'
                );
            $('#unit').html(unitHtml.join(''));
        },
        artboards: function(){
            var self = this,
                artboardListHTML = [],
                pagesSelect = [],
                pagesData = {};
            artboardListHTML.push('<ul class="artboard-list">');
            $.each(this.project.artboards, function(index, artboard){
                if(!pagesData[artboard.pageObjectID]){
                    pagesData[artboard.pageObjectID] = {
                        name: artboard.pageName,
                        objectID: artboard.pageObjectID,
                        count: 0
                    };
                }
                pagesData[artboard.pageObjectID].count++;
                var classNames = (self.artboardIndex == index && !artboard.fileName)? ' active': '',
                    fileName = (artboard.fileName)? ' data-file="' + artboard.fileName + '"': '',
                    imageData = (artboard.imageBase64)? artboard.imageBase64: artboard.imagePath + '?' + timestamp;
                artboardListHTML.push(
                        '<li id="artboard-' + index + '"' + fileName + ' class="artboard' + classNames + '" data-page-id="' + artboard.pageObjectID + '" data-id="' + artboard.objectID + '" data-index="' + index + '" >',
                            '<picture class="preview-img" data-name="' + artboard.name + '">',
                                '<img alt="' + artboard.name + '" src="' + imageData + '">',
                            '</picture>',
                            '<div>',
                            '<h3>' + artboard.name + '</h3>',
                            '<small>' + artboard.pageName + '</small>',
                            '</div>',
                        '</li>'
                    );
            });
            artboardListHTML.push('</ul>');
            pagesSelect.push('<div class="pages-select" tabindex="0">');
            pagesSelect.push('<h3>' + _('All artboards') + ' <em>(' + this.project.artboards.length + ')</em></h3>');
            pagesSelect.push('<ul class="page-list">');
            pagesSelect.push('<li><label><input type="radio" name="page" value="all" checked="checked"><span>' + _('All artboards') + ' <em>(' + this.project.artboards.length + ')</em></span></label></li>');
            $.each(pagesData, function(objectID, artboard){
                pagesSelect.push('<li><label><input type="radio" name="page" value="' + artboard.objectID + '"><span>' + artboard.name  + ' <em>(' + artboard.count + ')</em></span></label></li>');
            })
            pagesSelect.push('</ul>');
            pagesSelect.push('</div>');

            $('#artboards')
                .html([pagesSelect.join(''), artboardListHTML.join('')].join(''));
            return this;
        },
        layers: function() {
            var self = this,
                layersHTML = [];
            $.each(this.current.layers, function(index, layer) {
                var x = self.zoomSize( layer.rect.x ),
                    y = self.zoomSize( layer.rect.y ),
                    width = self.zoomSize( layer.rect.width ),
                    height = self.zoomSize( layer.rect.height ),
                    classNames = ['layer'];

                classNames.push('layer-' + layer.objectID);
                if(self.selectedIndex == index) classNames.push('selected');
                layersHTML.push([
                    '<div id="layer-' + index + '" class="' + classNames.join(' ') + '" data-index="' + index + '" percentage-width="' + self.percentageSize(layer.rect.width, self.current.width) + '" percentage-height="' + self.percentageSize(layer.rect.height, self.current.height) + '" data-width="' + self.unitSize(layer.rect.width) + '" data-height="' + self.unitSize(layer.rect.height) + '" style="left: ' + x + 'px; top: ' + y + 'px; width: ' + width + 'px; height: ' + height + 'px;">',
                        '<i class="tl"></i><i class="tr"></i><i class="bl"></i><i class="br"></i>',
                        '<b class="et h"></b><b class="er v"></b><b class="eb h"></b><b class="el v"></b>',
                    '</div>'
                ].join(''));
            });
            $('#layers').html(layersHTML.join(''));
        },
        slices: function(){
            if(!this.project.slices){
                return false;
            }
            var self = this,
                sliceListHTML = [];
            sliceListHTML.push('<ul class="asset-list">');
            $.each(this.project.slices, function( index, sliceLayer ){
                if(sliceLayer.exportable.length > 0){
                    var asset = JSON.parse( JSON.stringify( sliceLayer.exportable ) ).pop();
                    sliceListHTML.push(
                        '<li id="slice-' + sliceLayer.objectID + '" class="slice-layer" data-objectId="' + sliceLayer.objectID + '">',
                            '<picture><img src="' +  'assets/' + asset.path + '?' + timestamp + '" alt=""></picture>',
                            '<div>',
                                '<h3>' + sliceLayer.name + '</h3>',
                                '<small>' + self.unitSize(sliceLayer.rect.width) + ' × ' + self.unitSize(sliceLayer.rect.height) + '</small>',
                            '</div>',
                        '</li>');
                }
            });
            sliceListHTML.push('</ul>');
            if(this.project.slices.length > 0){
                $('#slices').html(sliceListHTML.join(''));
            }
            return this;
        },
        colors: function(colors){
            if(!this.project.colors){
                return false;
            }
            var self = this,
                colorListHTML = [];
            this.project.colorNames = {};
            colorListHTML.push('<ul class="color-list">');
            $.each(this.project.colors, function( index, color ){
                self.project.colorNames[color.color['argb-hex']] = color.name;
                colorListHTML.push(
                    '<li id="color-' + index + '" data-color="' + encodeURI(JSON.stringify(color.color)) + '">',
                        '<em><i style="background:' + color.color['css-rgba'] + '"></i></em>',
                        '<div>',
                            '<h3>' + color.name + '</h3>',
                            '<small>' + color.color[self.configs.colorFormat] + '</small>',
                        '</div>',
                    '</li>');
            });
            colorListHTML.push('</ul>');
            if(this.project.colors.length > 0){
                $('#colors').html(colorListHTML.join(''));
            }
            return this;
        },
        notes: function(){
            var self = this,
                notesHTML = [];
            $.each(this.current.notes, function(index, note){
                notesHTML.push('<div class="note" data-index="' + (index + 1) +'" style="left: ' + self.zoomSize(note.rect.x) + 'px; top: ' + self.zoomSize(note.rect.y) + 'px;"><div style="white-space:nowrap;display:none;">' + note.note + '</div></div>');
            })
            $('#notes').html(notesHTML.join(''));
        },
        getEdgeRect: function( event ){
            var offset = $('#screen').offset();
            var x = (event.pageX - offset.left) / this.configs.zoom,
                y = (event.pageY - offset.top) / this.configs.zoom,
                width = 10,
                height = 10,
                xScope = ( x >= 0 && x <= this.current.width ),
                yScope = ( y >= 0 && y <= this.current.height );
            // left and top
            if( x <= 0 && y <= 0 ){
                x = -10;
                y = -10;
            }
            // right and top
            else if( x >= this.current.width && y <= 0 ){
                x = this.current.width;
                y = -10;
            }
            // right and bottom
            else if( x >= this.current.width && y >= this.current.height ){
                x = this.current.width;
                y = this.current.height;
            }
            // left and bottom
            else if( x <= 0 && y >= this.current.height ){
                x = -10;
                y = this.current.height;
            }
            // top
            else if( y <= 0 && xScope ){
                x = 0;
                y = -10;
                width = this.current.width;
            }
            // right
            else if( x >= this.current.width && yScope ){
                x = this.current.width;
                y = 0;
                height = this.current.height;
            }
            // bottom
            else if( y >= this.current.height && xScope ){
                x = 0;
                y = this.current.height;
                width = this.current.width;
            }
            // left
            else if( x <= 0 && yScope ){
                x = -10;
                y = 0;
                height = this.current.height;
            }
            if( xScope && yScope ){
                x = 0;
                y = 0;
                width = this.current.width;
                height = this.current.height;
            }
            return {
                x: x,
                y: y,
                width: width,
                height: height,
                maxX: x + width,
                maxY: y + height
            }
        },
        distance: function(){
            if( ( this.selectedIndex && this.targetIndex && this.selectedIndex != this.targetIndex ) || ( this.selectedIndex && this.tempTargetRect ) ){
                var selectedRect = this.getRect(this.selectedIndex),
                    targetRect = this.tempTargetRect || this.getRect(this.targetIndex),
                    topData, rightData, bottomData, leftData,
                    x = this.zoomSize(selectedRect.x + selectedRect.width / 2),
                    y = this.zoomSize(selectedRect.y + selectedRect.height / 2);
                if(!this.isIntersect(selectedRect, targetRect)){
                    if(selectedRect.y > targetRect.maxY){ //top
                        topData = {
                            x: x,
                            y: this.zoomSize(targetRect.maxY),
                            h: this.zoomSize(selectedRect.y - targetRect.maxY),
                            distance: this.unitSize(selectedRect.y - targetRect.maxY),
                            percentageDistance: this.percentageSize((selectedRect.y - targetRect.maxY), this.current.height)
                        };
                    }
                    if(selectedRect.maxX < targetRect.x){ //right
                        rightData = {
                            x: this.zoomSize(selectedRect.maxX),
                            y: y,
                            w: this.zoomSize(targetRect.x - selectedRect.maxX),
                            distance: this.unitSize(targetRect.x - selectedRect.maxX),
                            percentageDistance: this.percentageSize((targetRect.x - selectedRect.maxX), this.current.width)
                        }
                    }
                    if(selectedRect.maxY < targetRect.y){ //bottom
                        bottomData = {
                            x: x,
                            y: this.zoomSize(selectedRect.maxY),
                            h: this.zoomSize(targetRect.y - selectedRect.maxY),
                            distance: this.unitSize(targetRect.y - selectedRect.maxY),
                            percentageDistance: this.percentageSize((targetRect.y - selectedRect.maxY), this.current.height)
                        }
                    }
                    if(selectedRect.x > targetRect.maxX){ //left
                        leftData = {
                            x: this.zoomSize(targetRect.maxX),
                            y: y,
                            w: this.zoomSize(selectedRect.x - targetRect.maxX),
                            distance: this.unitSize(selectedRect.x - targetRect.maxX),
                            percentageDistance: this.percentageSize((selectedRect.x - targetRect.maxX), this.current.width)
                        }
                    }
                }
                else{
                    var distance = this.getDistance(selectedRect, targetRect);
                    if (distance.top != 0) { //top
                        topData = {
                            x: x,
                            y: (distance.top > 0)? this.zoomSize(targetRect.y): this.zoomSize(selectedRect.y),
                            h: this.zoomSize(this.positive(distance.top)),
                            distance: this.unitSize(this.positive(distance.top)),
                            percentageDistance: this.percentageSize(this.positive(distance.top), this.current.height)
                        };
                    }
                    if (distance.right != 0) { //right
                        rightData = {
                            x: (distance.right > 0)? this.zoomSize(selectedRect.maxX): this.zoomSize(targetRect.maxX),
                            y: y,
                            w: this.zoomSize(this.positive(distance.right)),
                            distance: this.unitSize(this.positive(distance.right)),
                            percentageDistance: this.percentageSize(this.positive(distance.right), this.current.width)
                        };
                    }
                    if (distance.bottom != 0) { //bottom
                        bottomData = {
                            x: x,
                            y: (distance.bottom > 0)? this.zoomSize(selectedRect.maxY): this.zoomSize(targetRect.maxY),
                            h: this.zoomSize(this.positive(distance.bottom)),
                            distance: this.unitSize(this.positive(distance.bottom)),
                            percentageDistance: this.percentageSize(this.positive(distance.bottom), this.current.height)
                        };
                    }
                    if (distance.left != 0) { //left
                        leftData = {
                            x: (distance.left > 0)? this.zoomSize(targetRect.x): this.zoomSize(selectedRect.x),
                            y: y,
                            w: this.zoomSize(this.positive(distance.left)),
                            distance: this.unitSize(this.positive(distance.left)),
                            percentageDistance: this.percentageSize(this.positive(distance.left), this.current.width)
                        };
                    }
                }
                if (topData) {
                    $('#td')
                        .css({
                            left: topData.x,
                            top: topData.y,
                            height: topData.h,
                        })
                        .show();
                    $('#td div')
                        .attr('data-height', topData.distance)
                        .attr('percentage-height', topData.percentageDistance);
                }
                if (rightData) {
                     $('#rd')
                        .css({
                            left: rightData.x,
                            top: rightData.y,
                            width: rightData.w
                        })
                        .show();
                    $('#rd div')
                        .attr('data-width', rightData.distance )
                        .attr('percentage-width', rightData.percentageDistance);
                }
                if (bottomData) {
                    $('#bd')
                        .css({
                            left: bottomData.x,
                            top: bottomData.y,
                            height: bottomData.h,
                        })
                        .show();
                    $('#bd div')
                        .attr('data-height', bottomData.distance )
                        .attr('percentage-height', bottomData.percentageDistance);
                }
                if (leftData) {
                     $('#ld')
                        .css({
                            left: leftData.x,
                            top: leftData.y,
                            width: leftData.w
                        })
                        .show();
                    $('#ld div')
                        .attr('data-width', leftData.distance )
                        .attr('percentage-width', leftData.percentageDistance);
                }
                $('.selected').addClass('hidden');
            }
        },
        inspector: function(){
            if(!this.selectedIndex || (!this.current && !this.current.layers && !this.current.layers[this.selectedIndex])) return false;
            var self = this,
                layerData = this.current.layers[this.selectedIndex],
                html = [];
            html.push('<h2>' + layerData.name + '</h2>');
            // fix 0 [opacity]
            // PROPERTIES
            var position = [
                        '<div class="item" data-label="' +_('Position') + ':">',
                            '<label data-label="' +_('X') + '"><input id="position-x" type="text" value="' + this.unitSize(layerData.rect.x) + '" readonly="readonly"></label>',
                            '<label data-label="' +_('Y') + '"><input id="position-y" type="text" value="' + this.unitSize(layerData.rect.y) + '" readonly="readonly"></label>',
                        '</div>'
                    ].join(''),
                size = [
                        '<div class="item" data-label="' +_('Size') + ':">',
                            '<label data-label="' +_('Width') + '"><input id="size-width" type="text" value="' + this.unitSize(layerData.rect.width) + '" readonly="readonly"></label>',
                            '<label data-label="' +_('Height') + '"><input id="size-height" type="text" value="' + this.unitSize(layerData.rect.height) + '" readonly="readonly"></label>',
                        '</div>'
                    ].join(''),
                opacity = (typeof layerData.opacity == 'number')? [
                        '<div class="item" data-label="' +_('Opacity') + ':">',
                            '<label><input id="opacity" type="text" value="' + Math.round( layerData.opacity * 10000 ) / 100  + '%" readonly="readonly"></label>',
                            '<label></label>',
                        '</div>'
                    ].join(''): '',
                radius = (layerData.radius)? [
                        '<div class="item" data-label="' +_('Radius') + ':">',
                            '<label><input id="radius" type="text" value="' + this.unitSize(layerData.radius) + '" readonly="readonly"></label>',
                            '<label></label>',
                        '</div>'
                    ].join(''): '',
                styleName = (layerData.styleName)? [
                        '<div class="item" data-label="' +_('Style') + ':">',
                            '<label><input id="styleName" type="text" value="' + layerData.styleName + '" readonly="readonly"></label>',
                        '</div>'
                    ].join(''): '';
            html.push(this.propertyType('PROPERTIES', [ position, size, opacity, radius, styleName ].join('')));
            // FILLS
            if(layerData.fills && layerData.fills.length > 0){
                var fills = [],
                    fillsData = $.extend(true, [], layerData.fills);
                $.each(fillsData.reverse(), function(index, fill){
                    fills.push('<div class="item items-group" data-label="' +_(fill.fillType.firstUpperCase()) + ':">');
                    if (fill.fillType == "color") {
                        fills.push( self.colorItem(fill.color) );
                    }
                    else{
                        fills.push('<div class="gradient">');
                        $.each(fill.gradient.colorStops, function(index, gradient) {
                            fills.push(self.colorItem(gradient.color));
                        });
                        fills.push('</div>');
                    }
                    fills.push('</div>');
                });
                html.push(this.propertyType('FILLS', fills.join('')));
            }
            // TYPEFACE
            if(layerData.type == 'text'){
                var fontFamily = [
                            '<div class="item" data-label="' +_('Family') + ':">',
                                '<label><input id="font-family" type="text" value="' + layerData.fontFace + '" readonly="readonly"></label>',
                            '</div>'
                        ].join(''),
                    textColor = [
                            '<div class="item" data-label="' +_('Color') + ':">',
                                '<div class="color">',
                                    self.colorItem(layerData.color),
                                '</div>',
                            '</div>'
                        ].join(''),
                    fontSize = (layerData.fontSize)? [
                            '<div class="item" data-label="' +_('Size') + ':">',
                                '<label><input id="opacity" type="text" value="' + this.unitSize(layerData.fontSize, true) + '" readonly="readonly"></label>',
                                '<label></label>',
                            '</div>'
                        ].join(''): '',
                    spacing = [
                            '<div class="item" data-label="' +_('Spacing') + ':">',
                                '<label data-label="' +_('Character') + '"><input id="letter-spacing" type="text" value="' + this.unitSize(layerData.letterSpacing, true) + '" readonly="readonly"></label>',
                                '<label data-label="' +_('Line') + '"><input id="line-height" type="text" value="' + this.unitSize(layerData.lineHeight, true) + '" readonly="readonly"></label>',
                            '</div>'
                        ].join(''),
                    textStyle = (layerData.textStyle) ? [
                            '<div class="item" data-label="' +_('TEXTSTYLE') + ':">',
                                '<label><input id="textstyle" type="text" value="' + (layerData.textStyle) + '" readonly="readonly"></label>',
                            '</div>'
                        ].join(''): '',
                    content = [
                            '<div class="item">',
                                '<label data-label="' + _('Content') + '"><textarea id="content" rows="2" readonly="readonly">' + layerData.content + '</textarea></label>',
                            '</div>'
                        ].join('');
                html.push(this.propertyType('TYPEFACE', [ textStyle, fontFamily, textColor, fontSize, spacing, content ].join('')));
            }
            // BORDERS
            if(layerData.borders && layerData.borders.length > 0){
                var borders = [],
                    bordersData = $.extend(true, [], layerData.borders);
                $.each(bordersData.reverse(), function(index, border) {
                    borders.push(
                        '<div class="items-group">',
                            '<h4>' + _(border.position.firstUpperCase() + ' Border') + '</h4>',
                            '<div class="item" data-label="' +_('Weight') + ':">',
                                '<label><input id="font-family" type="text" value="' + self.unitSize(border.thickness) + '" readonly="readonly"></label>',
                                '<label></label>',
                            '</div>');
                    borders.push('<div class="item" data-label="' +_(border.fillType.firstUpperCase()) + ':">');
                    if (border.fillType == "color") {
                        borders.push(self.colorItem(border.color));
                    }
                    else{
                        borders.push('<div class="colors gradient">');
                        $.each(border.gradient.colorStops, function(index, gradient) {
                            borders.push(self.colorItem(gradient.color));
                        });
                        borders.push('</div>');
                    }
                    borders.push('</div>');
                    borders.push('</div>');
                });
                html.push(this.propertyType('BORDERS', borders.join('')));
            }
            // SHADOWS
            if(layerData.shadows && layerData.shadows.length > 0){
                var shadows = [],
                    shadowsData = $.extend(true, [], layerData.shadows);
                $.each(shadowsData.reverse(), function(index, shadow) {
                    shadows.push(
                        '<div class="items-group">',
                            '<h4>' + _(shadow.type.firstUpperCase() + ' Shadow') + '</h4>',
                            '<div class="item" data-label="' + _('Offset') + ':">',
                                '<label data-label="' +_('X') + '"><input id="offset-x" type="text" value="' + self.unitSize(shadow.offsetX) + '" readonly="readonly"></label>',
                                '<label data-label="' +_('Y') + '"><input id="offset-y" type="text" value="' + self.unitSize(shadow.offsetY) + '" readonly="readonly"></label>',
                            '</div>',
                            '<div class="item" data-label="' + _('Effect') + ':">',
                                '<label data-label="' +_('Blur') + '"><input id="offset-x" type="text" value="' + self.unitSize(shadow.blurRadius) + '" readonly="readonly"></label>',
                                '<label data-label="' +_('Spread') + '"><input id="offset-y" type="text" value="' + self.unitSize(shadow.spread) + '" readonly="readonly"></label>',
                            '</div>',
                            '<div class="item" data-label="' + _('Color') + ':">',
                                self.colorItem(shadow.color),
                            '</div>',
                        '</div>'
                    );
                });
                html.push(this.propertyType('SHADOWS', shadows.join('')));
            }
            // CODE TEMPLATE
            var tab = [
                '<ul class="tab" id="code-tab" >',
                '<li class="icon-rncss-panel" data-id="rncss-panel" data-codeType="rncss" ></li>',
                '<li class="icon-css-panel" data-id="css-panel" data-codeType="css" ></li>',
                '<li class="icon-android-panel" data-id="android-panel" data-codeType="android" ></li>',
                '<li class="icon-ios-panel" data-id="ios-panel" data-codeType="ios" ></li>',
                '</ul>'].join('')
            
            var css = [];
            var css = [
                '<div id="css-panel" class="code-item item">',
                '<label><textarea id="css" rows="' + (layerData.css.length + 1) + '" readonly="readonly">' + layerData.css.join("\r\n") + '</textarea></label>',
                '</div>'].join('')

            var rncss = [];
            var rncss = [
                '<div id="rncss-panel" class="code-item item">',
                '<label><textarea id="rncss" rows="' + (layerData.rncss.length + 1) + '" readonly="readonly">' + layerData.rncss.join("\r\n") + '</textarea></label>',
                '</div>'].join('')

            var android = [];
            if(layerData.type == "text"){
                android.push(
                        '<div id="android-panel"  class="code-item item">',
                        '<label><textarea id="css" rows="6" readonly="readonly">'
                        + "&lt;TextView\r\n" + this.getAndroidWithHeight(layerData)
                        + "android:text=\"" + layerData.content + "\"\r\n" + "android:textColor=\"" + layerData.color["argb-hex"] + "\"\r\n"
                        + "android:textSize=\"" + this.unitSize(layerData.fontSize, true) + "\"\r\n" + "/&gt;" + '</textarea></label>',
                        '</div>'
                );
            }else if (layerData.type == "shape"){
                android.push(
                        '<div id="android-panel" class="code-item item">',
                        '<label><textarea id="css" rows="6" readonly="readonly">'
                        + "&lt;View\r\n" + this.getAndroidWithHeight(layerData)
                        + this.getAndroidShapeBackground(layerData)
                        + "/&gt;" + '</textarea></label>',
                        '</div>'
                );
            } else if (layerData.type = "slice"){
                android.push(
                        '<div id="android-panel" class="code-item item">',
                        '<label><textarea id="css" rows="6" readonly="readonly">'
                        + "&lt;ImageView\r\n" + this.getAndroidWithHeight(layerData)
                        + this.getAndroidImageSrc(layerData) + "/&gt;"
                        + '</textarea></label>',
                        '</div>'
                );
            }

            var ios = [];
            if(layerData.type == "text"){
                ios.push(
                        '<div id="ios-panel"  class="code-item item">',
                        '<label><textarea id="css" rows="6" readonly="readonly">'
                        + "UILabel *label = [[UILabel alloc] init];\r\n"
                        + "label.frame = CGRectMake(" + this.scaleSize(layerData.rect.x) + "\, " + this.scaleSize(layerData.rect.y) + "\, "
                        + this.scaleSize(layerData.rect.width) + "\, " + this.scaleSize(layerData.rect.height) + ");\r\n"
                        + "label.text = \@\"" + layerData.content + "\";\r\n"
                        + "label.font = [UIFont fontWithName:\@\"" + layerData.fontFace + "\" size:" + this.scaleSize(layerData.fontSize) + "];\r\n"
                        + "label.textColor = [UIColor colorWithRed:" + layerData.color.r + "/255.0 green:" + layerData.color.g + "/255.0 blue:" + layerData.color.b + "/255.0 alpha:" + layerData.color.a + "/1.0];\r\n"
                        + '</textarea></label>',
                        '</div>'
                );
            }else if (layerData.type == "shape"){
                ios.push(
                        '<div id="ios-panel" class="code-item item">',
                        '<label><textarea id="css" rows="6" readonly="readonly">'
                        + "UIView *view = [[UIView alloc] init];\r\n"
                        + "view.frame = CGRectMake(" + this.scaleSize(layerData.rect.x) + "\, " + this.scaleSize(layerData.rect.y) + "\, "
                        + this.scaleSize(layerData.rect.width) + "\, " + this.scaleSize(layerData.rect.height) + ");\r\n"
                        + this.getIOSShapeBackground(layerData)
                        + '</textarea></label>',
                        '</div>'
                );
            } else if (layerData.type = "slice"){
                ios.push(
                        '<div id="ios-panel" class="code-item item">',
                        '<label><textarea id="css" rows="6" readonly="readonly">'
                        + "UIImageView *imageView = [[UIImageView alloc] init];\r\n"
                        + "imageView.frame = CGRectMake(" + this.scaleSize(layerData.rect.x) + "\, " + this.scaleSize(layerData.rect.y) + "\, "
                        + this.scaleSize(layerData.rect.width) + "\, " + this.scaleSize(layerData.rect.height) + ");\r\n"
                        + this.getIOSImageSrc(layerData)
                        + '</textarea></label>',
                        '</div>'
                );
            }
            html.push(this.propertyType('CODE TEMPLATE', [ tab, rncss, css, android.join(''), ios.join('') ].join(''), true));
            
            //  EXPORTABLE
            if(layerData.exportable && layerData.exportable.length > 0){
                var expHTML = [],
                    path = 'assets/'
                expHTML.push('<ul class="exportable">')
                $.each(layerData.exportable, function(index, exportable) {
                    var filePath = path + exportable.path;
                    expHTML.push(
                        '<li>',
                            '<a href="' + filePath + '" data-format="' + exportable.format.toUpperCase() + '"><img src="' + filePath + '" alt="' + exportable.path + '">' + exportable.path.replace('drawable-', '') + '</a>',
                        '</li>');
                });
                expHTML.push('</ul>')
                html.push(this.propertyType('EXPORTABLE', expHTML.join('')));
            }
            self.renderInspector(html);
        },
        getAndroidWithHeight: function (layerData) {
            return "android:layout_width=\"" + this.unitSize(layerData.rect.width, false) + "\"\r\n" + "android:layout_height=\"" + this.unitSize(layerData.rect.height, false) + "\"\r\n";
        },
        getAndroidShapeBackground: function (layerData) {
            var colorCode = "";
            if (layerData.type != "shape" || typeof(layerData.fills) == 'undefined' || layerData.fills.length == 0) return colorCode;
            var f;
            for (f in layerData.fills) {
                if(layerData.fills[f].fillType == "color"){
                    return "android:background=\"" + layerData.fills[f].color["argb-hex"] + "\"\r\n";
                }
            }
            return colorCode;
        },
        getAndroidImageSrc: function (layerData) {
            if (layerData.type != "slice" || typeof(layerData.exportable) == 'undefined' || layerData.exportable == 0) return "";
            return "android:src=\"\@mipmap/" + layerData.exportable[0].name + "." + layerData.exportable[0].format + "\"\r\n";
        },
        getIOSShapeBackground: function (layerData) {
            var colorCode = "";
            if (layerData.type != "shape" || typeof(layerData.fills) == 'undefined' || layerData.fills.length == 0) return colorCode;
            var f;
            for (f in layerData.fills) {
                if(layerData.fills[f].fillType == "color"){
                    return "view.backgroundColor = [UIColor colorWithRed:" + layerData.fills[f].color.r + "/255.0 green:" + layerData.fills[f].color.g  + "/255.0 blue:" + layerData.fills[f].color.b + "/255.0 alpha:" + layerData.fills[f].color.a + "/1.0]\;\r\n";
                }
            }
            return colorCode;
        },
        getIOSImageSrc: function (layerData) {
            if (layerData.type != "slice" || typeof(layerData.exportable) == 'undefined' || layerData.exportable == 0) return "";
            return "imageView.image = [UIImage imageNamed:\@\"" + layerData.exportable[0].name + "." + layerData.exportable[0].format + "\"];\r\n";
        },
        renderInspector: function (html) {
            var self = this;
            $('#inspector').addClass('active').html(html.join(''));
            $('#inspector').find('[data-codeType=' + self.configs.codeType +']').addClass('select');
            $('#code-tab').unbind('click')
                    .on('click', 'li', function(){
                        var $this = $(this), id = $this.attr('data-id');
                        self.configs.codeType = $(this).attr('data-codeType')
                        $this.parent().find('li.select').removeClass('select')
                        $this.addClass('select')
                        $("#inspector").find('div.item.select').removeClass('select');
                        $("#inspector").find("#"+id).addClass('select');
                    });
            $('#code-tab').find('li.select').trigger('click');
        },
        propertyType: function(title, content, isCode){
            var nopadding = isCode? ' style="padding:0"': '';
            return ['<section>',
                    '<h3>' + _(title) + '</h3>',
                    '<div class="context"' + nopadding + '>',
                        content,
                    '</div>',
                '</section>'].join('');
        },
        colorItem: function(color){
            var colorName = (this.project.colorNames)? this.project.colorNames[color['argb-hex']]: '';
            colorName = (colorName)? ' data-name="' + colorName + '"': '';
            return [
                '<div class="color"' + colorName + '>',
                    '<label><em><i style="background-color:' + color['css-rgba'] + ';"></i></em></label><input data-color="' + encodeURI(JSON.stringify(color)) + '" type="text" value="' + color[this.configs.colorFormat] + '" readonly="readonly">',
                '</div>'].join('');
        },
        changeColorFormat: function(){
            var self = this;
            $('.color input').each(function(){
                var $this = $(this),
                    colors = JSON.parse( decodeURI( $this.attr('data-color') ) );
                $this.val(colors[self.configs.colorFormat]);
            });
            this.colors();
        },
        selectedLayer: function(){
            if( this.selectedIndex == undefined ) return false;
            $('.selected').removeClass('selected');
            $('#layer-' + this.selectedIndex).addClass('selected');
            $('#rulers').hide();
        },
        removeSelected: function(){
            if(!this.selectedIndex) return false;
            $('#layer-' + this.selectedIndex).removeClass('selected');
            $('#rulers').hide();
        },
        mouseoverLayer: function(){
            if( this.targetIndex && this.selectedIndex == this.targetIndex ) return false;
            var $target = $('#layer-' + this.targetIndex);
            $target.addClass('hover');
            $('#rv').css({
                left: $target.position().left,
                width: $target.outerWidth()
            });
            $('#rh').css({
                top: $target.position().top,
                height: $target.outerHeight()
            });
            $('#rulers').show();
        },
        mouseoutLayer: function(){
            $('.hover').removeClass('hover');
            $('#rulers').hide();
        },
        hideDistance: function(){
            $('#td').hide();
            $('#rd').hide();
            $('#bd').hide();
            $('#ld').hide();
            $('.selected').removeClass('hidden');
        },
        zoomRender: function(){
            var self = this;
            this.targetIndex = undefined;
            $('#rulers').hide();
            this.hideDistance();
            this.zoom();
            this.screen();
            $('#layers, #notes').html('');
            setTimeout(function(){ self.layers(); self.notes(); }, 150);
        },
        events: function() {
            var self = this;
            $('body')
                .on({
                        click: function( event ){
                            if(!$('.screen-viewer').hasClass('moving-screen')){
                                if( $(event.target).hasClass('layer') || $(event.target).hasClass('slice-layer')){
                                    var selected = (!$(event.target).hasClass('slice-layer'))? event.target: $('.layer-' + $(event.target).attr('data-objectid')).first();
                                    self.selectedIndex = self.getIndex(selected);
                                    self.hideDistance();
                                    self.mouseoutLayer();
                                    self.selectedLayer();
                                    self.inspector();
                                }
                                else{
                                    self.removeSelected();
                                    self.hideDistance();
                                    $('#inspector').removeClass('active');
                                    self.selectedIndex = undefined;
                                    self.tempTargetRect = undefined;
                                }
                            }
                        },
                        mousemove: function( event ){
                            if(!$('.screen-viewer').hasClass('moving-screen')){
                                self.mouseoutLayer();
                                self.hideDistance();
                                if( $(event.target).hasClass('screen-viewer') || $(event.target).hasClass('screen-viewer-inner') ){
                                    self.tempTargetRect = self.getEdgeRect( event );
                                    self.targetIndex = undefined;
                                    self.distance();
                                }
                                else if($(event.target).hasClass('layer')){
                                    self.targetIndex = self.getIndex(event.target);
                                    self.tempTargetRect = undefined;
                                    self.mouseoverLayer();
                                    self.distance();
                                }
                                else{
                                    self.tempTargetRect = undefined;
                                }

                            }
                        }
                    })
                .on('click', 'header, #inspector, .navbar', function( event ){
                     event.stopPropagation();
                })
                .on("dragstart", ".exportable img", function(event){
                    var jQThis = $(this),
                        offset = jQThis.offset();
                    jQThis.css({width: "auto", height: "auto"});
                    var left = event.originalEvent.pageX - offset.left - jQThis.width() / 2,
                        top = event.originalEvent.pageY - offset.top - jQThis.height() / 2;
                    jQThis.css({left: left, top: top});
                })
                .on("dragend", ".exportable img", function(event){
                    var jQThis = $(this);
                    jQThis.css({left: 0, top: 0, width: "100%", height: "100%"});
                });
            // zoom
            $('#zoom')
                .on('click', '.zoom-in:not(disabled)',function( event ){
                    self.configs.zoom -= .25;
                    self.zoomRender();
                    event.stopPropagation();
                })
                .on('click', '.zoom-out:not(disabled)',function( event ){
                    self.configs.zoom += .25;
                    self.zoomRender();
                    event.stopPropagation();
                });
            $(window)
                .keydown(function(event){
                    if((event.ctrlKey || event.metaKey) && (event.which == 187 || event.which == 189 || event.which == 48)) {
                        if(event.which == 187 && self.configs.zoom < 4){
                            $('.zoom-out').click();
                        }
                        else if(event.which == 189 && self.configs.zoom > .25){
                            $('.zoom-in').click();
                        }
                        else if(event.which == 48){
                            self.maxSize = undefined;
                            self.configs.zoom = 1;
                            self.zoomRender();
                        }
                        event.preventDefault();
                        return false;
                    }
                    else if(event.which == 32 ){
                        $('#cursor').show();
                        $('.screen-viewer').addClass('moving-screen');
                        self.mouseoutLayer();
                        self.hideDistance();
                        event.preventDefault();
                    }
                    else if(event.which == 18){
                        $('#screen').addClass('percentage-mode');
                    }
                })
                .keyup(function(event){
                    if(event.which == 32 ){
                        $('#cursor').hide();
                        $('.screen-viewer').removeClass('moving-screen');
                        $('#cursor').removeClass('moving');
                        event.preventDefault();
                    }
                    else if(event.which == 18){
                        $('#screen').removeClass('percentage-mode');
                        event.preventDefault();
                    }
                })
                .mousemove(function(event){
                    $('#cursor')
                        .css({
                            left: event.clientX,
                            top: event.clientY
                        });
                    var $target = $(event.target);
                    if(
                        $('.screen-viewer').hasClass('moving-screen') &&
                        $('#cursor').hasClass('moving')
                    ){
                        $('.screen-viewer').scrollLeft((self.moveData.x - event.clientX) + self.moveData.scrollLeft);
                        $('.screen-viewer').scrollTop((self.moveData.y - event.clientY) + self.moveData.scrollTop);
                        event.preventDefault();
                    }
                })
                .mousedown(function(event){
                    var $target = $(event.target);
                    if(
                        $('.screen-viewer').hasClass('moving-screen') &&
                        (
                            $target.hasClass('cursor') ||
                            $target.hasClass('overlay')
                        )
                    ){
                        self.moveData = {
                            x: event.clientX,
                            y: event.clientY,
                            scrollLeft: $('.screen-viewer').scrollLeft(),
                            scrollTop: $('.screen-viewer').scrollTop()
                        }
                        $('#cursor').addClass('moving');
                        event.preventDefault();
                    }
                })
                .mouseup(function(event){
                    var $target = $(event.target);
                    if(
                        $('.screen-viewer').hasClass('moving-screen')
                    ){
                        $('#cursor').removeClass('moving');
                        event.preventDefault();
                    }
                })

            // unit
            $('#unit')
                .on('change', 'input[name=resolution]', function(){
                    var $checked = $('input[name=resolution]:checked');
                    self.configs.unit = $checked.attr('data-unit');
                    self.configs.scale = Number( $checked.attr('data-scale') );
                    self.targetID = undefined;
                    self.layers();
                    self.inspector();
                    $('#unit')
                        .blur()
                        .find('p')
                        .text(
                            $checked.attr('data-name')
                            );
                    self.slices();
                })
                .on('click', 'h3, .overlay', function(){
                    $('#unit').blur();
                });
            $('#inspector').on('dblclick', 'input, textarea', function(){
                $(this).select();
            });
            $('#show-notes').change(function(){
                if( this.checked ){
                    $('#notes').fadeIn('fast');
                }
                else{
                    $('#notes').fadeOut('fast');
                }
            });
            $('#artboards')
                .on('click', '.artboard', function( event ){
                    if(self.artboardIndex == self.getIndex(this)) return;
                    self.maxSize = undefined;
                    self.artboardIndex = self.getIndex(this);
                    self.selectedIndex = undefined;
                    self.current = self.project.artboards[self.artboardIndex];
                    self.hideDistance();
                    self.screen();
                    self.layers();
                    self.notes();
                    $('.active').removeClass('active');
                    $(this).addClass('active');
                    self.locationHash({
                        artboard: self.artboardIndex
                    });
                })
                .on('click', '.pages-select', function( event ){
                    event.stopPropagation();
                })
                .on('change', 'input[name=page]', function(event){
                    var pObjectID = $('.page-list input[name=page]:checked').val();
                    $('.pages-select h3').html($(this).parent().find('span').html());
                    $('.artboard-list li').show();
                    if(pObjectID != 'all'){
                        $('.artboard-list li').each(function(){
                            var pageObjectID = $( this ).attr('data-page-id');
                            if(pObjectID != pageObjectID){
                                $( this ).hide();
                            }
                        });
                    }
                    $('.pages-select').blur();
                    event.stopPropagation();
                });
            $('#slices')
                .on('mouseover', 'li', function(){
                    var id = $(this).attr('data-objectid');
                    $('.layer-' + id).addClass('has-slice');
                })
                .on('mouseout', 'li', function(){
                    $('.has-slice').removeClass('has-slice');
                })
                .on('click', 'li', function(){
                    var id = $(this).attr('data-objectid');
                    if($('.layer-' + id).length > 0){
                        var offsets = $('.layer-' + id).offset(),
                            scrolls = {
                                left: $('.screen-viewer').scrollLeft(),
                                top: $('.screen-viewer').scrollTop()
                            },
                            sizes = {
                                width: $('.layer-' + id).outerWidth(),
                                height: $('.layer-' + id).outerHeight()
                            },
                            viewerSizes = {
                                width: $('.screen-viewer').outerWidth(),
                                height: $('.screen-viewer').outerHeight()
                            };
                            $('.screen-viewer').animate({
                                scrollLeft: ( offsets.left + scrolls.left) - ( ( viewerSizes.width - sizes.width ) / 2 ),
                                scrollTop: ( offsets.top + scrolls.top - 60) - ( ( viewerSizes.height - sizes.height ) / 2 )
                            }, 150);
                        $('.layer-' + id).click();
                    }
                    else{
                        self.message(_('The slice not in current artboard.'));
                    }

                });
            // color format
            $('#inspector')
                .on('click', '.color label', function(){
                    self.configs.colorFormat =
                        ( self.configs.colorFormat == 'color-hex')? 'argb-hex':
                        ( self.configs.colorFormat == 'argb-hex')? 'css-rgba':
                        ( self.configs.colorFormat == 'css-rgba')? 'ui-color':
                        'color-hex';
                    self.changeColorFormat();
                });
            // tab
            $('.tab')
                .on('click', 'li', function(){
                    var $this = $(this),
                        id = $this.attr('data-id');

                    if($this.hasClass('current')){
                        $('.current').removeClass('current');
                        $('.navbar').removeClass('on');
                    }
                    else{
                        $('.current').removeClass('current');
                        $('.navbar section').hide();
                        $this.addClass('current');
                        $('#' + id).show();
                        $('.navbar').addClass('on');
                    }

                });
            $('#notes')
                .on('mousemove', '.note', function(event){
                    event.stopPropagation();
                    self.mouseoutLayer();
                    self.hideDistance();
                    $(this).find('div').show();
                    var width = $(this).find('div').outerWidth();
                    if(width > 160){
                        $(this).find('div').css({
                            width: 160,
                            'white-space': 'normal'
                        })
                    }
                })
                .on('mouseout', '.note', function(){
                    $(this).find('div').hide();
                });

        }
    }
    var init = SMApp.fn.init = function(project) {
        var path = this.locationHash();
        this.project = project;
        this.configs = {
                scale: this.project.scale,
                unit: this.project.unit,
                colorFormat: this.project.colorFormat,
                codeType: 'css'
            };
        this.artboardIndex = (!isNaN(path.artboard))? path.artboard: 0;
        this.current = this.project.artboards[this.artboardIndex];
        var proportion = $(document).height() / this.current.height;
        if (proportion >= .8) {
            this.configs.zoom = 1;
        } else if (proportion >= .7) {
            this.configs.zoom = .75;
        } else {
            this.configs.zoom = .5;
        }
        this.render();
        if(!isNaN(path.artboard)){
            $('.current').removeClass('current');
            $('.navbar').removeClass('on');
        }
        if(this.current.imageBase64){
            $('.tab').remove();
            $('.navbar').remove();
        }
        return this;
    };
    init.prototype = SMApp.fn;
    window.SMApp = SMApp;
})(window);