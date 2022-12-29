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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8719634120399915, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.477, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.997, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.826, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.844, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.847, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.494, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 482.97881301850646, 1, 25941, 12.0, 1005.9000000000015, 1790.9500000000007, 10477.780000000035, 10.22208073812947, 64.48177292963724, 84.69115898466752], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 10987.641999999993, 8962, 25941, 10551.5, 12436.6, 12988.849999999999, 24213.970000000092, 0.2201051045895436, 0.12788063587374243, 0.11134223064197617], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.0140000000000025, 2, 14, 3.0, 4.0, 4.0, 8.0, 0.2208739097111632, 0.11339416315845273, 0.0802393500122585], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.468000000000001, 3, 18, 4.0, 6.0, 6.0, 9.990000000000009, 0.22087244616234125, 0.12670399641082275, 0.09361195472114854], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.323999999999995, 10, 421, 14.0, 20.0, 23.0, 44.950000000000045, 0.21956229816735742, 0.12901643596707094, 2.444774730179892], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.799999999999976, 27, 85, 45.0, 55.0, 57.0, 60.99000000000001, 0.2208247450909555, 0.9183872560217804, 0.0922978426747353], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.648000000000002, 1, 18, 2.0, 4.0, 4.0, 7.990000000000009, 0.22082903636833398, 0.13796811615165655, 0.09380920978537625], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.45400000000002, 24, 84, 39.0, 49.0, 51.0, 54.99000000000001, 0.2208245500368556, 0.9063101022318296, 0.08065271651736719], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1099.7379999999985, 779, 1690, 1078.5, 1405.8000000000004, 1492.85, 1568.97, 0.22075298844358104, 0.9336730399894039, 0.10778954513846732], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.596000000000004, 4, 20, 6.0, 8.0, 9.0, 13.0, 0.22070368279407332, 0.328191117995472, 0.11315374362000828], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.245999999999998, 2, 16, 4.0, 5.0, 6.0, 11.990000000000009, 0.21975491174203232, 0.21196691784836205, 0.12060767617092008], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 9.966, 6, 32, 10.0, 12.0, 13.0, 18.99000000000001, 0.2208247450909555, 0.3599184565984421, 0.14470058980081166], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 608.0, 608, 608, 608.0, 608.0, 608.0, 608.0, 1.644736842105263, 0.7806075246710527, 1945.3815660978619], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.601999999999997, 3, 14, 4.0, 6.0, 7.0, 12.0, 0.21975616734695852, 0.22076695987450168, 0.1294071962013828], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.493999999999996, 7, 26, 16.0, 20.0, 20.0, 22.0, 0.2208235747715249, 0.346915129854199, 0.13176094158730633], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.702, 5, 29, 7.0, 9.0, 10.0, 16.0, 0.2208235747715249, 0.3417395773204914, 0.12658538905359873], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2183.162000000001, 1582, 3462, 2136.5, 2752.3, 2982.1, 3324.4700000000003, 0.2205508389533363, 0.3367944847458218, 0.121906030124598], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 13.66800000000001, 9, 56, 12.0, 18.0, 21.0, 39.98000000000002, 0.219557863157488, 0.12901382992235555, 1.7706140956587262], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.37, 9, 33, 14.0, 17.0, 19.0, 25.99000000000001, 0.22082533025532267, 0.3997520731910099, 0.18459617451030877], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 9.949999999999998, 6, 32, 10.0, 12.0, 13.0, 18.99000000000001, 0.2208255253108009, 0.37381189656664887, 0.15871834631713813], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 73.0, 73, 73, 73.0, 73.0, 73.0, 73.0, 13.698630136986301, 7.036601027397261, 1868.2844606164385], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 685.0, 685, 685, 685.0, 685.0, 685.0, 685.0, 1.4598540145985401, 0.7384808394160584, 2791.8909671532842], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.7520000000000007, 2, 19, 3.0, 3.0, 4.0, 6.990000000000009, 0.21972381595230062, 0.1847482475927059, 0.09333970697192458], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 691.8319999999999, 509, 947, 678.0, 828.0, 846.95, 899.9200000000001, 0.21967130143823194, 0.19337510209223732, 0.10211283152792812], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.652000000000001, 2, 13, 3.0, 5.0, 5.949999999999989, 10.990000000000009, 0.21975037236700595, 0.19908654096542489, 0.10772918645335644], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 943.9160000000002, 737, 1446, 917.0, 1139.0, 1163.8, 1222.96, 0.21967477588779363, 0.20781362514674273, 0.11648769854206244], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 69.0, 69, 69, 69.0, 69.0, 69.0, 69.0, 14.492753623188406, 7.4728260869565215, 954.3280117753623], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 29.288000000000004, 19, 566, 27.0, 33.900000000000034, 39.0, 81.87000000000012, 0.21950417518891627, 0.12898228247355745, 10.040601138524256], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 36.39800000000001, 26, 252, 34.0, 41.0, 46.0, 110.91000000000008, 0.21962546829640478, 49.700218270653686, 0.06820400284986007], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 1043.0, 1043, 1043, 1043.0, 1043.0, 1043.0, 1043.0, 0.9587727708533077, 0.5027939237775647, 0.3951192473633749], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.034, 2, 11, 3.0, 4.0, 4.0, 7.0, 0.22083927759055513, 0.2399082316184427, 0.09510754044671368], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.760000000000003, 2, 11, 4.0, 5.0, 5.0, 8.0, 0.22083830219513273, 0.2266486786968332, 0.0817360513007376], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.1479999999999984, 1, 15, 2.0, 3.0, 3.0, 7.990000000000009, 0.22087449513612276, 0.12525783991259556, 0.08606340191339158], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 193.98000000000005, 88, 347, 188.0, 267.0, 290.95, 327.97, 0.22085742151610668, 0.2011678961155155, 0.07246884143497251], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 112.61999999999989, 82, 347, 112.0, 129.0, 144.95, 215.99, 0.21959469845695198, 0.12909766452254404, 64.9605723208788], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 262.924, 17, 539, 312.0, 433.90000000000003, 446.0, 496.99, 0.22083586374427208, 0.12310434839617954, 0.09294946999392702], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 492.7739999999997, 301, 1007, 469.0, 808.0, 882.9, 941.96, 0.22088649703172725, 0.11879336209017823, 0.0944807477538052], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.49, 5, 255, 7.0, 11.0, 15.0, 33.0, 0.2194814356017325, 0.10324843978877983, 0.15968131789383858], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 501.29199999999963, 287, 1094, 455.5, 853.0, 908.95, 963.95, 0.22081070207645967, 0.11357734852606649, 0.08927307681606866], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.014000000000003, 2, 25, 4.0, 5.0, 6.0, 11.0, 0.21972159516120315, 0.1349034805603516, 0.1102899413211508], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.436000000000001, 2, 40, 4.0, 5.0, 6.0, 11.990000000000009, 0.2197179261264389, 0.12867874753641276, 0.10406561930793248], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 853.1199999999988, 582, 1456, 853.5, 1122.2000000000003, 1260.85, 1347.8100000000002, 0.21962710831042623, 0.20069070460659078, 0.09715925787560849], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 467.87000000000063, 250, 980, 384.0, 857.0, 887.0, 941.98, 0.2196222848096929, 0.19446652525370767, 0.090722877416504], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.514, 3, 37, 5.0, 6.0, 8.0, 12.990000000000009, 0.21975694003404472, 0.14657616215161384, 0.10322567202771048], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1181.8140000000012, 897, 10480, 1087.5, 1404.0, 1422.9, 1562.7200000000003, 0.21967130143823194, 0.16505809839121524, 0.12184892501651927], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 169.96400000000003, 142, 258, 176.0, 188.0, 191.0, 210.93000000000006, 0.22096019578841028, 4.272256754311265, 0.11177478654140285], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 230.43800000000016, 194, 354, 231.0, 256.0, 261.0, 286.96000000000004, 0.22094037526280857, 0.4282251681521961, 0.15836937054970848], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.124000000000002, 6, 21, 9.0, 11.0, 12.0, 18.0, 0.22070241633833504, 0.18018283208871883, 0.13664583199072697], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 8.854000000000003, 6, 21, 9.0, 11.0, 12.0, 17.0, 0.22070290343497584, 0.18350670511973352, 0.14009461643821708], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 10.028000000000002, 7, 23, 10.0, 12.0, 13.0, 18.0, 0.22070105247917907, 0.17861051679689502, 0.13513628896918484], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.251999999999999, 8, 28, 12.0, 15.0, 16.0, 22.980000000000018, 0.2207014421515036, 0.1973618335864779, 0.1538875290001695], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.500000000000004, 6, 32, 9.0, 11.0, 12.949999999999989, 26.980000000000018, 0.22068663557044849, 0.16566799182554634, 0.12219660387543388], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 1978.2460000000015, 1587, 2689, 1902.0, 2439.9, 2583.9, 2636.91, 0.22053225901778462, 0.18428872984776215, 0.14084775136487415], "isController": false}]}, function(index, item){
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
