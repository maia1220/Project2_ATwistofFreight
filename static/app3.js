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
    //d3.csv("../data/CFSPRELIM2017.CF1700P6.csv").then(function (censusData) {

    console.log(censusData);

    //parse data
    censusData.forEach(function (data) {
        data.COMM_LABEL = data.COMM_LABEL;
        data.VAL = +data.VAL;
        data.TON = +data.TON;
        data.AVGMILE = +data.AVGMILE;
        data.COMM = data.COMM;
    });

    // var arrayCensusData = Array.from(censusData);

    // console.log(arrayCensusData);


    var commLabels = censusData.map(function (d) { return d.COMM_LABEL });
    var avgMile = censusData.map(function (d) { return d.AVGMILE });
    var tonShip = censusData.map(function (d) { return d.TON });
    var commValue = censusData.map(function (d) { return d.VAL });
    var commCode = censusData.map(function (d) { return d.COMM })



    var ctx = document.getElementById("Chart3").getContext("2d");
    // var gradientStroke = ctx.createLinearGradient(500,0,100,0);
    // gradientStroke.addColorStop(0, "#80b6f4");
    // gradientStroke.addColorStop(1, "#f49080");

    var chart = new Chart(ctx, {
        responsive: false,
        type: 'horizontalBar',
        data: {
            labels: commLabels,
            datasets: [
                // {
                //     label: "Ton (thousands)",
                //     data: tonShip,
                //     backgroundColor: '#19A0AA'
                // },
                {
                    label: "Average Mile per Commodity",
                    data: avgMile,
                    backgroundColor: poolColors(avgMile.length)
                },
                // {
                //     label:"Commodity Values",
                //     data:commValue,
                //     backgroundColor:'#19aa2c' 
                // },
            ]
        },
        options: {
            legend: {
                data: commLabels,
                display: true
            },
            title: {
                display: true,
                text: "Commodity Data"
            }
        }
    })

   



}).catch(function (error) {
    console.log(error);
});