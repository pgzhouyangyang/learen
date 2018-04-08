var filterData=function(data){
    var data=data;
    var content="";
    for (var i = 0; i < data.body.length; i++) {
        var item=data.body[i].options||[]
        content=data.body[i].content.replace("<p>","").replace("</p>","");
        data.body[i].content=content;
        var options=[];
        if(item.length){
            for (var j = 0; j < item.length; j++) {
                var _document=new DOMParser().parseFromString(item[j],"text/html");
                var letter=_document.getElementsByClassName("letter")[0].innerHTML;
                var text=_document.getElementsByClassName("options_content")[0].children[0].innerHTML;
                var obj={"letter":letter,"text":text};
                options.push(obj);
            };
        }
        data.body[i].options=options
    };
    return data;
}
// var classQues=function(dataList){
//     var dataList=dataList||[];
//     var datalist=[];
//     datalist.push(...dataList);
//     var arr=[],obj={},obj1={},obj2={},obj3={},obj4={},data=[],
//     data1=[],data2=[],data3=[],data4=[];
//     datalist.map((item,index)=>{
//         switch (item.questionType) {
//             case "单选题":
//                 item.index=index;
//                 data.push(item);
//                 break;
//             case "多选题":
//                 item.index=index;
//                 data1.push(item);
//                 break;
//             case "判断题":
//                 item.index=index;
//                 data2.push(item);
//                 break;
//             case "识图题":
//                 item.index=index;
//                 data3.push(item);
//                 break;
//             case "计算题":
//                 item.index=index;
//                 data4.push(item);
//                 break;
//             default:
//                 break;
//         }
//     });
//     obj.data=data;
//     obj.type="单选题";
//     obj1.data=data1;
//     obj1.type="多选题";
//     obj2.data=data2;
//     obj2.type="判断题";
//     obj3.data=data3;
//     obj3.type="识图题";
//     obj4.data=data4;
//     obj4.type="计算题";
//     arr[0]=obj;
//     arr[1]=obj1;
//     arr[2]=obj2;
//     arr[3]=obj3;
//     arr[4]=obj4;
//     return arr;
// }
var classQues=function(dataList){
    var data = {};
    if(dataList) {
        dataList.map((item,index)=>{
            item.index = index;
            if(data[item.questionType] == undefined) {
                data[item.questionType] = [];
                data[item.questionType].push(item)
            } else {
                data[item.questionType].push(item)
            }

        });
    }

    var dataList = [];
    for (var i in data) {
        var item = {
            title: i,
            list: data[i]
        }
        dataList.push(item)
    }
    return dataList;
}
export  {filterData,classQues}
