
/**
View 1
Ally
**/

//default
function init() {
    d3.json("/output1").then((data) => {
        console.log(data);

        data.AVGMILE = +data.AVGMILE;
        data.AVGMILE_S = +data.AVGMILE_S;
        data.DMODE_LABEL = data.DMODE_LABEL;
        data.TMILE = +data.TMILE;
        data.TON = +data.TON;
        data.VAL = +data.AVGMILE_S;
        var namesDataset = data.map(function(d){return d.DMODE_LABEL});


        console.log(namesDataset);

        //Add all IDs to the dropdown menu
        var dropdownMenu = d3.select("#selDataset");
        var option;
        for (var i = 0; i < namesDataset.length; i++) {
            option = dropdownMenu.append("option").text(namesDataset[i]);
        };

        // Display default charts
        showBars(namesDataset[0]);
        showMeta(namesDataset[0]);
        showBubble(namesDataset[0]);
    })
};

function optionChanged() {
    var name = d3.select("#selDataset").node().value;
    console.log(name);
    showBars(name);
    showMeta(name);
    showBubble(name);
};


//Update demographic info
function showMeta(name) {
    d3.json("/output1").then((data) => {

        var metaset = d3.select("#sample-metadata");

        var panelb = metaset.selectAll("p");

        panelb.remove();
    
        var sample = data.filter(obj => obj.DMODE_LABEL === name)[0];
        
        Object.entries(sample).forEach(function([key, value]) {
          var cell = metaset.append("p");
          cell.text(`${key}: ${value}`)})
        })
}; 


function showBars(name) {
    d3.json("/output1").then(data => {
        var sample = data.filter(obj => obj.DMODE_LABEL == name)[0];
       

        var barx = sample["VAL"];
        var bary = sample["TON"];

        var trace1 = 
            {
                y: [bary],
                x: sample.DMODE_LABEL,
                name: "Tons (Thousands)",
                type: 'bar'
            };

        var trace2 = 
        {
            y: [barx],
            x: sample.DMODE_LABEL,
            name: "Value ($ Millions)",
            type: 'bar'
        };

        var barData = [trace1, trace2];

        var barLayout = {
            'title': 'Tonnage & Value',
            'xaxis': { title: name },
            // 'yaxis': { title: "Total Tonnage"}
            
        };

        Plotly.newPlot("bar", barData, barLayout);
    });
};

function showBubble(name) {
    d3.json("/output1").then(data => {
        // var sample = data.filter(obj => obj.DMODE_LABEL == name)[0];
        var namesDataset = data.map(function(d){return d.DMODE_LABEL});
        var ton = data.map(function(d){return d.TON});
        var val = data.map(function(d){return d.VAL});
        var tmile = data.map(function(d){return d.TMILE});
        var avgmile = data.map(function(d){return d.AVGMILE});

        var trace1 = {
            x: namesDataset,
            y: ton,
            name: "Tons (Thousands)",
            type: "scatter"
        };

        var trace2 = {
            x: namesDataset,
            y: val,
            name: "Value ($ Millions)",
            type: "scatter"
        };

        var trace3 = {
            x: namesDataset,
            y: tmile,
            name: "Ton-Miles (Millions)",
            type: "scatter"
        };

        var trace4 = {
            x: namesDataset,
            y: avgmile,
            name: "Average Miles per Shipment (Number)",
            type: "scatter"
        }

        var bubbleData = [trace1, trace2,trace3, trace4];

        var bubbleLayout = {
            "margin": { t: 40, r: -40 },
            'hovermode': 'closest',
            'title': 'Overall Comparsion for All Transportation Modes',
        };

        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    })
};


init();