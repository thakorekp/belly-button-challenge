// Set the endpoint
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Set up an initial default plot
function init() {
    // Fetch json data and set up variables
    d3.json(url).then(function(data){
        console.log(data);
        let testsubjectIds = data.names;

        // Use D3 to select the dropdown menu
        let dropdownMenu = d3.select("#selDataset");

        for (let i=0;i<testsubjectIds.length;i++) {
            dropdownMenu.append('option').attr('value',testsubjectIds[i]).text(testsubjectIds[i]);
        };
        // Use D3 to select the Demographic Info panel and set it up with the appropriate fields
        let demographicInfo = d3.select("#sample-metadata");
        demographicInfo.append('p').attr("class","demoID").text("id:");
        demographicInfo.append('p').attr("class","demoEthnicity").text("ethnicity:");
        demographicInfo.append('p').attr("class","demoGender").text("gender:");
        demographicInfo.append('p').attr("class","demoAge").text("age:");
        demographicInfo.append('p').attr("class","demoLocation").text("location:");
        demographicInfo.append('p').attr("class","demoBbtype").text("bbtype:");
        demographicInfo.append('p').attr("class","demoWfreq").text("wfreq:");

    });
    
    // Set up the initial Bar Plot without data
    let dataBar = [{
        x: [],
        y: [],
        type:'bar',
        text: 'otu_labels',
        orientation: 'h'
    }];

    let layoutBar = {
        title: "Top 10 OTUs in Test Subject ID"
    }
    Plotly.newPlot("bar", dataBar, layoutBar);

    // Set up initial Bubble Plot without data
    let dataBubble = {
        x: [],
        y: [],
        type: 'scatter',
        mode: 'markers',
        marker: {
            color:[],
            size: []
        }

    };
    let layoutBubble = {
        title: "Sample Data for Test Subject ID"
    };
    Plotly.newPlot("bubble", [dataBubble], layoutBubble);
};

// Call optionChanged() when a change occurs on dropdown
d3.selectAll("#selDataset").on("change",optionChanged);

// Set up optionChanged function for all plots
function optionChanged() {
    d3.json(url).then(function(data){
        console.log(data);
        let testsubjectIds = data.names;
        let samples = data.samples;
        let metadata = data.metadata;
        
        //console.log(metadataEthnicity)
        // Use D3 to select the dropdown menu
        let dropdownMenu = d3.select("#selDataset");
        // Assign the value of the dropdown menu options to a variable
        let dataset = dropdownMenu.property("value");
        // Initialize x and y arrays
        let x = [];
        let y = [];
        
        // Loop through list of data.names to set x and y values for each chart (per test subject)
        for (let j=0;j<testsubjectIds.length;j++) {
            if (dataset === testsubjectIds[j]) {
                let yvaluesArray = samples[j].otu_ids.slice(0,10).reverse()
                let xvaluesArray = samples[j].sample_values.slice(0,10).reverse()
                let otu_labels = samples[j].otu_labels.slice(0,10).reverse()

                // Add a label of 'OTU' in front of the OTU number
                for (let k=0;k<10;k++) {
                    yvaluesArray[k] = `OTU ${yvaluesArray[k]}`
                };
                x = xvaluesArray;
                y = yvaluesArray;
                text = otu_labels;
            
                let layoutBar = {
                title: `Top 10 OTUs in Test Subject ID ${testsubjectIds[j]}`
                }
                //Restyle bar plot for each change
                Plotly.restyle("bar", "x", [x]);
                Plotly.restyle("bar", "y", [y]);
                Plotly.restyle("bar", "text", [text]);
                Plotly.relayout("bar", layoutBar);             
                

                // Reset the demographic info panel with each ID change
                let Ethnicity = metadata[j].ethnicity;
                let gender = metadata[j].gender;
                let age = metadata[j].age;
                let location = metadata[j].location;
                let bbtype = metadata[j].bbtype;
                let wfreq = metadata[j].wfreq;
                d3.select(".demoID").text(`id: ${testsubjectIds[j]}`);
                d3.select(".demoEthnicity").text(`ethnicity: ${Ethnicity}`);
                d3.select(".demoGender").text(`gender: ${gender}`);
                d3.select(".demoAge").text(`age: ${age}`);
                d3.select(".demoLocation").text(`location: ${location}`);
                d3.select(".demoBbtype").text(`bbtype: ${bbtype}`);
                d3.select(".demoWfreq").text(`wfreq: ${wfreq}`);

                // Pull values for Bubble Plot and create bubble plot with each change
                let xvalues = samples[j].otu_ids;
                let yvalues = samples[j].sample_values;
                let otu_labels_bubble = samples[j].otu_labels;

                let dataBubble = {
                    x: xvalues,
                    y: yvalues,
                    type: 'scatter',
                    mode: 'markers',
                    text: otu_labels_bubble,
                    marker: {
                        color: xvalues,
                        size: yvalues,
                        colorscale: 'Earth'
                    }
                };
                
                let layoutBubble = {
                    title: `Sample Data for Test Subject ID ${testsubjectIds[j]}`
                };
                Plotly.newPlot("bubble", [dataBubble], layoutBubble);

            }     

        }

    })

};

init();