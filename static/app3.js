// View 3
// Saya's


function dynamicColors() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return "rgba(" + r + "," + g + "," + b + ", 0.5)";
};

function poolColors(a) {
    var pool = [];
    for (i = 0; i < a; i++) {
        pool.push(dynamicColors());
    }
    return pool;
};

d3.json("/output6").then(function (censusData) {

    // console.log(censusData);

    //parse data
    censusData.forEach(function (data) {
        data.COMM_LABEL = data.COMM_LABEL;
        data.VAL = +data.VAL;
        data.TON = +data.TON;
        data.AVGMILE = +data.AVGMILE;
        data.COMM = data.COMM;
    });

    var commLabels = censusData.map(function (d) { return d.COMM_LABEL });
    var avgMile = censusData.map(function (d) { return d.AVGMILE });
    var tonShip = censusData.map(function (d) { return d.TON });
    var commValue = censusData.map(function (d) { return d.VAL });
    var commCode = censusData.map(function (d) { return d.COMM });
    // console.log(avgMile)
    // let select = document.querySelector('#chartType');

    // select.addEventListener('change', showHide);

    // function showHide() {
    //     // concat Chart for the canvas ID
    //     let chart = this.options[select.selectedIndex].value + 'Chart';
    //     document.querySelectorAll('canvas')
    //         .forEach(c => {
    //             c.style.display = (c.id === chart) ? 'inherit' : 'none';
    //         })
    // }

    var data = {
        labels: commLabels,
        datasets:[{
            label: "Average Miles per Shipment",
            data: avgMile,
            backgroundColor: poolColors(avgMile.length)
        }]
    };

    var data1 = {
        labels: commLabels,
        datasets:[{
            label:"Commodity Value ($ Millions)",
            data: commValue,
            backgroundColor: poolColors(commValue.length)
        }]
    };

    var data2 = {
        labels: commLabels,
        datasets:[{
            label: "Tons (Thousands)",
            data:tonShip,
            backgroundColor: poolColors(tonShip.length)
        }]
    };


    const ctx = document.getElementById("Chart3").getContext("2d");
    chart = new Chart(ctx, {
        type:"horizontalBar",
        data: data
    });

    // if(window.bar !=undefined)
    // window.bar.destory();
    // window.bar - new Chart(ctx,{});

   $("#btn1").on("click", function(){
        if(chart)chart.destroy();
        var context1 = document.getElementById("Chart3").getContext("2d");
        chart = new Chart(context1,{
            type:"horizontalBar",
            data:data
    })},
        chart.update());

    $("#btn2").on("click", function(){
        if(chart)chart.destroy();
        var context2 = document.getElementById("Chart3").getContext("2d")
        chart = new Chart(context2, {
            type:"horizontalBar",
            data:data1
    })}, chart.update());
    
    
    $("#btn3").on("click",function(){
        if(chart)chart.destroy();
        var context3 = document.getElementById("Chart3").getContext("2d")
        chart = new Chart(context3, {
            type:"horizontalBar",
            data:data2
    })}, chart.update());

    // var dataFee = 
    // var ctx = document.getElementById("Chart3").getContext("2d");
    // var myBarChart = new Chart(ctx, {
    //     type: "horizontalBar",
    //     data: dataFee
    // });
    // setInterval('#chartType').change(function () {
    //     const val = $(this).val();

    //     switch (val) {
    //         case 'ton':
    //             var secondData = {
    //                 label: "Ton (thousands)",
    //                 data: tonShip,
    //                 backgroundColor: poolColors(tonShip)
    //             };
    //             dataFee.datasets.push(secondData);
    //             myBarChart.update();
    //             break;
    //     };



    // })
}).catch(function (error) {
    console.log(error)
});