/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 97.87279302276112, "KoPercent": 2.1272069772388855};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8916613486492235, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.188, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.633, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.962, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.999, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.13, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 324.4831312486686, 1, 18882, 9.0, 840.0, 1501.0, 6051.970000000005, 15.249134065871328, 96.05823690848379, 126.1878857189962], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6195.1179999999995, 5062, 18882, 6038.0, 6488.700000000001, 6599.45, 16560.280000000086, 0.32891296239406537, 0.19102326939977987, 0.1657412974563845], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.302, 1, 7, 2.0, 3.0, 3.9499999999999886, 6.0, 0.32998748027499836, 0.16941183423375916, 0.11923375752123964], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.609999999999999, 2, 14, 3.0, 5.0, 5.0, 8.0, 0.32998530245462865, 0.1893902950250096, 0.13921254947304645], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.072000000000005, 8, 362, 11.0, 15.0, 17.0, 55.7800000000002, 0.327817906331934, 0.1705389422676607, 3.6069573736737306], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.708000000000006, 24, 48, 34.0, 40.0, 41.94999999999999, 43.0, 0.3298956012380322, 1.3720016561996289, 0.13724172473379073], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.3559999999999977, 1, 10, 2.0, 3.0, 4.0, 6.990000000000009, 0.32990452563028255, 0.2060968985263165, 0.1395006441385863], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.597999999999995, 21, 59, 29.0, 35.0, 36.0, 39.98000000000002, 0.32989581890039127, 1.3539613838387337, 0.11984496545990775], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 856.3679999999998, 669, 1084, 856.0, 1014.7, 1059.95, 1076.97, 0.3297522241787521, 1.3945910691144174, 0.16036778089943218], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.628000000000001, 3, 15, 5.0, 7.0, 8.0, 11.990000000000009, 0.3298683957048496, 0.4905213914294253, 0.16847770600941048], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.84, 2, 25, 4.0, 5.0, 6.0, 9.990000000000009, 0.328022646683527, 0.3163977034724477, 0.17938738490505385], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.77, 5, 17, 8.0, 10.0, 11.0, 14.0, 0.32990278424753794, 0.5376094483415127, 0.21553219009922156], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.9877104737442922, 2700.433879138128], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.01, 2, 18, 4.0, 5.0, 6.0, 9.0, 0.3280273811015553, 0.3295361789189267, 0.19252388285354957], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 7.989999999999994, 5, 15, 8.0, 9.0, 10.0, 14.0, 0.3299010428831768, 0.5182764713833938, 0.19620091319907682], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.739999999999998, 4, 20, 7.0, 8.0, 9.0, 12.0, 0.32989886620357667, 0.5105410471303418, 0.18846761399325423], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1570.3799999999992, 1328, 1936, 1545.5, 1784.9, 1843.8, 1902.98, 0.329575296090446, 0.5032814318843665, 0.18152389354981596], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.635999999999996, 8, 70, 10.0, 14.0, 17.0, 36.99000000000001, 0.32781016906481664, 0.17053491715089694, 2.642969488085084], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.207999999999995, 8, 29, 11.0, 14.0, 15.0, 19.0, 0.32990300191937566, 0.5972114196171542, 0.27513394886635434], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.849999999999997, 5, 18, 8.0, 10.0, 11.0, 14.990000000000009, 0.32990300191937566, 0.5585509115797274, 0.2364734408289275], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 59.0, 59, 59, 59.0, 59.0, 59.0, 59.0, 16.949152542372882, 7.994570974576272, 2311.573093220339], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.9975638440860215, 4112.7814180107525], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.25, 1, 17, 2.0, 3.0, 4.0, 7.0, 0.32802608988308496, 0.27571810138991215, 0.1387063446478279], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 557.0879999999993, 441, 713, 547.5, 647.0, 657.0, 686.97, 0.32792454587369263, 0.2887625412693041, 0.15179319799231475], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.3259999999999974, 2, 24, 3.0, 4.0, 5.0, 12.0, 0.32802630508545744, 0.29718094090901337, 0.1601690942800085], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 761.8199999999989, 607, 935, 748.0, 878.0, 891.95, 927.99, 0.32788196773772593, 0.3101782626632934, 0.17322670365831025], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 79.0, 79, 79, 79.0, 79.0, 79.0, 79.0, 12.658227848101266, 5.995352056962025, 833.5022745253165], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 23.942000000000007, 17, 561, 22.0, 27.0, 30.94999999999999, 54.950000000000045, 0.3276913619246231, 0.1704731107527988, 14.947718276854635], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.852, 21, 298, 29.0, 35.0, 40.0, 109.99000000000001, 0.3279398164848787, 74.17035005423304, 0.10120017774338053], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 1.09710054916318, 0.8580674686192469], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.7379999999999964, 1, 25, 3.0, 4.0, 4.0, 7.0, 0.329937615395681, 0.35852039455754703, 0.14144786441279683], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.3560000000000016, 2, 10, 3.0, 4.0, 5.0, 7.0, 0.32993630909489235, 0.3385423626260687, 0.12147069192263125], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8220000000000005, 1, 12, 2.0, 3.0, 3.0, 5.990000000000009, 0.3299883514111952, 0.18713626518358903, 0.12793493702172315], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 92.40800000000006, 67, 121, 92.0, 110.0, 114.0, 118.0, 0.32996722765494935, 0.3005505204160623, 0.10762602933276667], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 82.32799999999996, 58, 334, 80.0, 94.0, 101.94999999999999, 297.8800000000001, 0.32788282779266004, 0.17057271600920695, 96.95277483138626], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 202.60000000000008, 13, 396, 261.0, 333.0, 338.0, 359.97, 0.32993260796549695, 0.18388265497264528, 0.1382237195480451], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 420.8559999999998, 324, 532, 404.5, 495.0, 508.95, 525.99, 0.32989146570778216, 0.17741653230462176, 0.1404616006333916], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.122, 3, 259, 6.0, 8.0, 10.0, 29.970000000000027, 0.32764004154475723, 0.14772918318518544, 0.23773100670679165], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 394.6640000000004, 289, 505, 387.5, 459.90000000000003, 470.0, 488.99, 0.32987122487123477, 0.169674289894461, 0.13272162563178586], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.4159999999999995, 2, 13, 3.0, 4.900000000000034, 5.0, 9.0, 0.3280237226756239, 0.20139823699549952, 0.16401186133781195], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.071999999999998, 2, 24, 4.0, 5.0, 5.0, 9.990000000000009, 0.3280187731704261, 0.192105603962926, 0.15471979242315995], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 675.202, 540, 873, 682.5, 806.9000000000001, 838.0, 858.99, 0.3278742274463516, 0.299604681019361, 0.14440554353350055], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 241.48199999999986, 167, 348, 236.0, 285.90000000000003, 293.0, 303.99, 0.327954658300762, 0.29039039866004285, 0.13483292103966873], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.507999999999994, 3, 53, 4.0, 5.0, 6.0, 9.990000000000009, 0.328030393984185, 0.2187008108173271, 0.15344390499846153], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 987.496, 817, 9139, 934.0, 1097.8000000000002, 1120.95, 1148.88, 0.3278613277728052, 0.24644349863281825, 0.18122022609317162], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 134.4519999999999, 117, 170, 135.0, 149.0, 150.0, 154.0, 0.3299763736916437, 6.379986845285628, 0.16627715705555482], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 181.50399999999976, 161, 235, 176.0, 201.0, 203.95, 210.99, 0.3299561224348386, 0.6395187653883286, 0.23586707189677916], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 7.021999999999998, 5, 21, 7.0, 9.0, 9.0, 13.990000000000009, 0.3298642608566575, 0.2692098256255051, 0.20358809849746828], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.929999999999997, 5, 20, 7.0, 9.0, 9.949999999999989, 12.990000000000009, 0.3298662194560374, 0.27436558376259923, 0.20874346699952367], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.316000000000011, 6, 17, 8.0, 10.0, 11.0, 15.990000000000009, 0.32985838519806676, 0.2669501390600488, 0.20132958080936694], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.621999999999998, 7, 21, 9.0, 12.0, 13.0, 16.0, 0.3298607789596323, 0.29497735732531727, 0.22935632287036933], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.812000000000002, 5, 34, 8.0, 9.0, 11.0, 14.990000000000009, 0.32983662532274516, 0.24760616430844473, 0.18198993487045995], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1618.7240000000004, 1397, 1972, 1591.5, 1851.5000000000002, 1920.95, 1964.0, 0.32952729309805084, 0.2753708984149737, 0.20981620615227456], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 100.0, 2.1272069772388855], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
