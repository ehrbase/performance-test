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

    var data = {"OkPercent": 97.8174856413529, "KoPercent": 2.1825143586470963};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8915337162305892, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.499, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.866, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.399, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.993, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.979, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.651, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.52, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.998, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 513, 2.1825143586470963, 209.5862156987883, 1, 3860, 17.0, 628.0, 1339.9000000000015, 2612.0, 23.382289743426497, 155.5956498499002, 193.72506134680197], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 26.030000000000005, 16, 85, 26.0, 33.0, 38.0, 49.960000000000036, 0.5059684032851517, 0.29382336225617384, 0.2559488602555748], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 8.392000000000003, 4, 37, 7.0, 12.0, 14.0, 21.0, 0.5058117773214231, 5.419488674874306, 0.18375193473004825], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 8.836000000000007, 5, 47, 8.0, 12.0, 14.0, 20.0, 0.5057902872079567, 5.431089171333425, 0.21436814907055976], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 1, 0.2, 24.470000000000006, 14, 266, 22.0, 34.0, 39.94999999999999, 58.0, 0.5030818795943953, 0.2714224998591371, 5.601698819468061], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 48.01999999999998, 26, 102, 47.0, 62.0, 72.89999999999998, 93.0, 0.505861928021918, 2.1039133510368146, 0.21143447772791102], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.8820000000000014, 1, 18, 3.0, 4.0, 6.0, 10.990000000000009, 0.5058987797721431, 0.31612942851144343, 0.2149081730477366], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 42.470000000000006, 24, 102, 42.0, 53.0, 62.0, 76.97000000000003, 0.5058291754175114, 2.076057296788187, 0.18474620274038014], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 843.3559999999999, 584, 1834, 820.0, 1092.6000000000001, 1199.75, 1349.91, 0.5054242126501616, 2.137515993517429, 0.24678916633308667], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 11.987999999999992, 6, 30, 12.0, 17.0, 20.0, 25.0, 0.5056020709460827, 0.7518411420413178, 0.259219811764349], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.9360000000000004, 2, 28, 3.0, 6.0, 8.0, 20.940000000000055, 0.5037651406613026, 0.4859690467176679, 0.27648047758950395], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 18.60799999999998, 11, 44, 18.0, 25.0, 30.0, 37.0, 0.5058081955090301, 0.8242075392355417, 0.33144267498687424], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 631.0, 631, 631, 631.0, 631.0, 631.0, 631.0, 1.5847860538827259, 0.6763198296354992, 1874.472253862916], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.841999999999998, 2, 23, 4.0, 7.0, 8.0, 15.990000000000009, 0.503774276882403, 0.5061770440389397, 0.2966561415625869], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 19.77200000000002, 12, 51, 20.0, 27.0, 30.0, 40.99000000000001, 0.5057943804221158, 0.7946918808115775, 0.30179723284952414], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 11.165999999999995, 6, 47, 11.0, 15.0, 17.0, 22.0, 0.5057913105052856, 0.7828325735926357, 0.2899409172525416], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2231.413999999999, 1537, 3709, 2167.5, 2772.8, 2985.5499999999997, 3412.830000000001, 0.5048322543385284, 0.7709380124047381, 0.27903814058164755], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 20.754000000000005, 13, 74, 19.0, 28.0, 35.0, 52.950000000000045, 0.5030510043413302, 0.2715532202810043, 4.056831243994829], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 23.58800000000001, 14, 81, 23.0, 32.0, 36.0, 46.98000000000002, 0.5058271285205569, 0.9156804750096107, 0.42283986524765294], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 19.05200000000002, 11, 66, 19.0, 27.0, 31.0, 41.99000000000001, 0.5058214996393493, 0.8563083781238271, 0.3635592028657823], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 81.0, 81, 81, 81.0, 81.0, 81.0, 81.0, 12.345679012345679, 5.750868055555555, 1683.7625385802469], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 715.0, 715, 715, 715.0, 715.0, 715.0, 715.0, 1.3986013986013985, 0.6405703671328672, 2674.748688811189], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.581999999999996, 1, 18, 2.0, 4.0, 5.0, 9.980000000000018, 0.5037240317668524, 0.42325608536409676, 0.21398432990095778], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 463.0879999999999, 325, 927, 451.5, 613.6000000000001, 683.9, 786.96, 0.5035672705445375, 0.4432867275529853, 0.23408009841718735], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.5999999999999988, 2, 22, 3.0, 5.0, 7.0, 14.990000000000009, 0.5037661557806158, 0.4563383432667623, 0.24696348652526287], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1289.4940000000006, 940, 2044, 1237.5, 1674.8000000000002, 1772.8, 2000.8300000000002, 0.5032748091833561, 0.4761294241630288, 0.2668732630728148], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 58.0, 58, 58, 58.0, 58.0, 58.0, 58.0, 17.241379310344826, 8.065059267241379, 1135.321255387931], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 3, 0.6, 49.93400000000002, 13, 784, 45.0, 67.0, 77.94999999999999, 105.96000000000004, 0.5026610877988069, 0.2707585912948147, 22.992817727046987], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 49.868, 8, 188, 47.0, 70.0, 78.94999999999999, 108.98000000000002, 0.5033584072934619, 111.97541933373216, 0.15631638038996182], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 360.0, 360, 360, 360.0, 360.0, 360.0, 360.0, 2.7777777777777777, 1.4567057291666667, 1.1447482638888888], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.677999999999998, 1, 14, 2.0, 4.0, 5.0, 8.990000000000009, 0.5058506688357544, 0.5496156435963352, 0.2178517040591481], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.685999999999998, 2, 15, 3.0, 6.0, 7.0, 12.980000000000018, 0.5058460629495075, 0.5190118923144784, 0.18722232212681966], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.5020000000000002, 1, 15, 2.0, 4.0, 5.0, 9.990000000000009, 0.505822011350646, 0.28688011512508976, 0.19709275637588644], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 138.0680000000001, 82, 275, 130.0, 193.90000000000003, 217.79999999999995, 239.96000000000004, 0.5057713569542044, 0.4607675845320957, 0.16595622650059833], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 9, 1.8, 187.93000000000012, 27, 679, 180.0, 256.90000000000003, 292.95, 440.9100000000001, 0.5031557931345398, 0.2698556203885772, 148.84370396124493], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.5619999999999976, 1, 16, 2.0, 4.0, 5.0, 9.0, 0.5058394101507806, 0.28200744709425607, 0.2129070173583852], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.84, 2, 21, 3.0, 5.0, 7.0, 12.0, 0.5058839360603176, 0.27209441767194237, 0.2163839492132999], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 13.698000000000011, 7, 424, 11.0, 19.0, 22.0, 50.960000000000036, 0.502460549309971, 0.2122670106134742, 0.3655596769882113], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 5.181999999999995, 3, 63, 5.0, 7.0, 9.0, 16.0, 0.5058532276976899, 0.26025061771002267, 0.2045148791668395], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.554, 2, 29, 4.0, 6.900000000000034, 9.0, 15.990000000000009, 0.5037164197448777, 0.30932615367430905, 0.25284203100475305], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.723999999999999, 2, 32, 4.0, 7.0, 9.0, 17.980000000000018, 0.5037022112527073, 0.2950238943736463, 0.23856989497808895], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 586.454, 382, 969, 589.0, 765.0, 859.2999999999998, 938.99, 0.5033031787622164, 0.45990802480429055, 0.22265267576101958], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 18.176000000000005, 6, 115, 16.0, 31.900000000000034, 39.94999999999999, 50.0, 0.5034501438357061, 0.4457274215826056, 0.2079681746508825], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 10.07800000000001, 5, 50, 10.0, 13.0, 17.0, 30.99000000000001, 0.5037823982460312, 0.33573357833111, 0.23663997417611426], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 605.1660000000003, 378, 3234, 583.0, 700.9000000000001, 743.0, 824.9300000000001, 0.5036164698701375, 0.3784677771074083, 0.2793497606310919], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 189.44999999999985, 144, 365, 185.0, 249.90000000000003, 275.95, 317.95000000000005, 0.5058788177409678, 9.781089873545472, 0.25590354256818487], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 287.22800000000007, 209, 539, 276.0, 370.0, 402.0, 479.8100000000002, 0.5057442431132806, 0.9803160705543563, 0.3625158930128398], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 18.89000000000002, 11, 62, 19.0, 25.0, 30.94999999999999, 44.0, 0.5055749752521049, 0.41252548097875275, 0.3130220061619478], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 18.617999999999995, 11, 47, 18.0, 26.0, 31.0, 39.99000000000001, 0.5055898008380656, 0.4204374186000421, 0.32093102592260025], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 18.174000000000028, 10, 57, 18.0, 24.0, 29.0, 40.98000000000002, 0.5055581058153338, 0.40922756345765343, 0.3095555979943499], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 21.306000000000008, 12, 50, 21.0, 29.0, 34.0, 43.99000000000001, 0.5055662847955996, 0.45218756951536415, 0.3525139915469317], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 19.114000000000022, 11, 93, 18.0, 28.0, 31.0, 39.99000000000001, 0.5052536272157898, 0.37926192486979615, 0.2797644596009305], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2458.7380000000007, 1709, 3860, 2386.5, 3030.3, 3222.8999999999996, 3622.75, 0.50440038899358, 0.4215329219611894, 0.32214634218925914], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 97.46588693957115, 2.1272069772388855], "isController": false}, {"data": ["500", 13, 2.53411306042885, 0.055307381408211016], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 513, "No results for path: $['rows'][1]", 500, "500", 13, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 3, "500", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 9, "500", 9, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
