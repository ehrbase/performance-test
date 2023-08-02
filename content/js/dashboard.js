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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8909168262071899, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.193, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.618, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.961, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.999, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.496, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.106, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 325.5729419272484, 1, 23272, 9.0, 843.0, 1510.9500000000007, 6000.990000000002, 15.193746937656833, 95.70935737839669, 125.7295525064188], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 6220.935999999998, 4973, 23272, 5989.5, 6531.9, 6686.95, 22094.730000000134, 0.32799037020273086, 0.19050603174290803, 0.16527639748496983], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.4000000000000004, 1, 9, 2.0, 3.0, 4.0, 5.0, 0.32903871996041006, 0.16892475143592497, 0.11889094373569505], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 3.7060000000000013, 2, 21, 3.0, 5.0, 5.0, 8.990000000000009, 0.32903655464507486, 0.18884577493208685, 0.13881229649089097], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 13.678000000000006, 8, 415, 11.0, 16.0, 21.0, 39.99000000000001, 0.32657582633481336, 0.1698927816863461, 3.593290854799162], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 33.54399999999998, 24, 52, 33.0, 40.0, 42.0, 45.99000000000001, 0.32898091581707345, 1.3681975742180945, 0.1368612013067122], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.2779999999999982, 1, 10, 2.0, 3.0, 4.0, 6.990000000000009, 0.3289893578522522, 0.2055251778434221, 0.1391136640136965], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 29.735999999999994, 21, 46, 30.0, 35.0, 37.0, 41.0, 0.32898199810506373, 1.3502108723204418, 0.11951299149910517], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 866.1840000000002, 679, 1156, 872.0, 1014.6000000000001, 1058.95, 1080.97, 0.32884373937423667, 1.3907488970169926, 0.15992595918786118], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 5.577999999999996, 4, 19, 5.0, 7.0, 8.0, 12.990000000000009, 0.32892919075524774, 0.489124773491136, 0.16799801441894], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.9419999999999966, 2, 29, 4.0, 5.0, 6.0, 9.0, 0.3267894828687149, 0.31520824230884614, 0.17871299844382849], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 7.726000000000005, 5, 18, 7.0, 10.0, 10.0, 14.990000000000009, 0.32898091581707345, 0.5361071719073326, 0.21492991472814663], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 1.0349693480861244, 2829.641241776316], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.1140000000000025, 3, 18, 4.0, 5.0, 6.0, 10.0, 0.3267950361141195, 0.3282981656259334, 0.19180060225057205], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 7.9780000000000015, 5, 15, 8.0, 10.0, 11.0, 13.0, 0.32897983353620425, 0.516829246101589, 0.19565304553080898], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 6.613999999999998, 4, 16, 6.0, 8.0, 9.0, 13.0, 0.3289796170808849, 0.5091184462736807, 0.1879424570237477], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1568.0580000000002, 1347, 1932, 1544.5, 1773.8000000000002, 1869.9, 1912.99, 0.32864164520636724, 0.5018556904547349, 0.18100965614881945], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 11.766000000000007, 8, 79, 10.0, 14.0, 17.94999999999999, 38.0, 0.32656729441609117, 0.16988834317226165, 2.632948811229735], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 11.085999999999993, 8, 26, 11.0, 14.0, 16.0, 20.0, 0.3289839462413913, 0.5955476865108686, 0.27436747079116036], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 7.872000000000002, 5, 29, 8.0, 10.0, 11.0, 15.990000000000009, 0.32898199810506373, 0.5569915819675098, 0.23581326817296558], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 83.0, 83, 83, 83.0, 83.0, 83.0, 83.0, 12.048192771084338, 5.682887801204819, 1643.1664156626505], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 1.0262548396017699, 4231.06937914823], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.3180000000000014, 1, 16, 2.0, 3.0, 3.0, 6.0, 0.32677602771060715, 0.2746673777449187, 0.13817775390497353], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 562.9259999999997, 446, 714, 552.5, 651.0, 672.8499999999999, 696.97, 0.3266782441436391, 0.2876650776628524, 0.1512162966055517], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.3520000000000003, 2, 15, 3.0, 4.0, 5.0, 9.990000000000009, 0.3267888421217746, 0.2960598405515542, 0.15956486431727276], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 758.9919999999992, 584, 935, 739.5, 880.0, 901.0, 919.98, 0.32664601828303097, 0.30900904723726064, 0.1725737264561716], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 78.0, 78, 78, 78.0, 78.0, 78.0, 78.0, 12.82051282051282, 6.072215544871795, 844.1882011217949], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 23.330000000000005, 16, 612, 21.0, 25.0, 33.0, 67.0, 0.3264389428601274, 0.16982157153419775, 14.890588887691946], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 30.14199999999998, 20, 236, 29.0, 35.0, 39.94999999999999, 95.91000000000008, 0.326698521950547, 73.88960570571618, 0.10081712200817661], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 1.13264376349892, 0.8858666306695464], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.725999999999999, 1, 9, 3.0, 3.0, 4.0, 8.0, 0.32899022372651177, 0.357490929533913, 0.1410417072421276], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.376000000000003, 2, 13, 3.0, 4.0, 5.0, 7.0, 0.3289891413843995, 0.3375704890078148, 0.12112197881046738], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8979999999999992, 1, 13, 2.0, 3.0, 3.0, 6.990000000000009, 0.3290395860945239, 0.18659822074311616, 0.12756710515578706], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 94.04600000000006, 68, 124, 95.0, 114.0, 116.0, 118.0, 0.329023346838645, 0.2996907869432349, 0.10731816195713616], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 81.98400000000002, 58, 388, 79.0, 93.0, 102.0, 312.5600000000004, 0.32664601828303097, 0.16992929726518888, 96.58705847257708], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 202.85999999999999, 12, 373, 260.0, 335.0, 337.0, 346.99, 0.3289858944007917, 0.18335501932956624, 0.1378270983378317], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 425.408, 312, 541, 416.0, 497.90000000000003, 508.95, 524.0, 0.3289607865583991, 0.17691601051325775, 0.14006533490181836], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 7.475999999999999, 4, 269, 6.0, 8.0, 10.949999999999989, 35.950000000000045, 0.3263852442536614, 0.14716340930113087, 0.23682054343795939], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 400.8219999999998, 275, 514, 403.5, 462.0, 472.95, 492.97, 0.32893243661965343, 0.16919140985540787, 0.1323439100461887], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.5040000000000027, 2, 17, 3.0, 5.0, 5.0, 8.990000000000009, 0.32677367851090544, 0.20063074161776498, 0.1633868392554527], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.2459999999999996, 2, 34, 4.0, 5.0, 6.0, 10.0, 0.3267670582207403, 0.19137253172417984, 0.15412938390685307], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 677.15, 544, 878, 684.0, 803.6000000000001, 834.0, 859.94, 0.3266182792573223, 0.29845702156627835, 0.1438523866650902], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 245.2319999999999, 171, 314, 240.5, 290.0, 296.0, 311.99, 0.32670449904765636, 0.289283433917481, 0.13431893954986654], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 4.3660000000000005, 3, 29, 4.0, 5.0, 6.0, 9.990000000000009, 0.3267963176590926, 0.2178780410439835, 0.1528666368737357], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 992.2020000000008, 789, 10595, 928.5, 1074.0, 1103.0, 1134.95, 0.3266257469930834, 0.24551474972465448, 0.18053727812313006], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 135.21600000000018, 117, 163, 138.0, 151.0, 152.0, 156.99, 0.3290289762658238, 6.361669221371024, 0.1657997575714503], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 181.98199999999989, 159, 258, 177.0, 204.0, 206.0, 209.99, 0.328997800320707, 0.6376613518305766, 0.23518202132300542], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 6.983999999999998, 5, 31, 7.0, 9.0, 10.0, 13.0, 0.32892616133959784, 0.26844422098937043, 0.20300911520178305], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 6.790000000000002, 5, 18, 6.0, 8.0, 10.0, 12.990000000000009, 0.3289268104953967, 0.27358423219436945, 0.2081489972666182], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 8.256, 5, 16, 8.0, 10.0, 11.0, 15.990000000000009, 0.3289229155990377, 0.2661930755723423, 0.20075861547792828], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 9.636000000000001, 7, 21, 9.0, 11.0, 12.0, 14.990000000000009, 0.328924213887575, 0.2941398358388587, 0.2287051174687045], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 7.792, 5, 26, 8.0, 9.0, 11.0, 16.99000000000001, 0.32889998085802113, 0.24690303152868107, 0.1814731339695136], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1609.9879999999994, 1429, 1971, 1584.5, 1787.8000000000002, 1850.9, 1930.88, 0.3285936978357505, 0.27459073552249025, 0.20922176854385674], "isController": false}]}, function(index, item){
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
