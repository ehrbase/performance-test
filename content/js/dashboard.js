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

    var data = {"OkPercent": 97.82174005530739, "KoPercent": 2.1782599446926185};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.892235694533078, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [0.997, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.887, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.414, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.995, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.984, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.647, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.515, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [0.999, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 512, 2.1782599446926185, 209.34677728142904, 1, 3490, 18.5, 624.0, 1329.9500000000007, 2592.970000000005, 23.368922762752494, 155.70275690901877, 193.61431431648512], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 28.20400000000002, 17, 68, 28.0, 36.0, 40.0, 51.950000000000045, 0.5061743142856564, 0.2939429378306584, 0.25605302226559573], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 8.210000000000008, 4, 29, 7.0, 12.0, 15.0, 22.99000000000001, 0.5060160245154643, 5.410615874633518, 0.18382613390600855], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 8.767999999999995, 5, 35, 8.0, 12.0, 15.0, 20.99000000000001, 0.5060016859976177, 5.43341645570613, 0.2144577458232091], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 1, 0.2, 24.640000000000008, 10, 276, 22.0, 32.0, 36.0, 71.95000000000005, 0.5026353169668573, 0.2711531010211539, 5.596726449273541], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 46.65400000000001, 26, 92, 46.0, 62.0, 69.0, 81.0, 0.5058655105953531, 2.1038995986589506, 0.2114359751316515], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 3.022000000000002, 1, 13, 3.0, 5.0, 6.0, 9.990000000000009, 0.5058926374409117, 0.3160969361750672, 0.21490556375663733], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 41.05200000000001, 24, 92, 41.0, 53.80000000000007, 60.94999999999999, 70.99000000000001, 0.5058552748058781, 2.0761930675696183, 0.18475573513417812], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 861.1500000000002, 575, 1443, 857.5, 1077.0, 1202.6999999999998, 1328.98, 0.5055974695857842, 2.138220086136113, 0.2468737644461837], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 12.715999999999987, 7, 40, 12.0, 17.0, 21.0, 27.0, 0.5054880841293928, 0.7516716411959645, 0.25916137125774535], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.9579999999999975, 2, 27, 3.0, 6.0, 8.0, 14.0, 0.5035906009850232, 0.48580067285999173, 0.27638468530623345], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 20.36800000000001, 12, 56, 20.0, 27.0, 32.0, 40.99000000000001, 0.5058348044695563, 0.8242508981729246, 0.33146011113190654], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 675.0, 675, 675, 675.0, 675.0, 675.0, 675.0, 1.4814814814814814, 0.6322337962962963, 1752.2844328703702], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.086000000000004, 2, 23, 5.0, 7.900000000000034, 9.949999999999989, 16.980000000000018, 0.503603281478982, 0.5059767086629836, 0.29655544798029904], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 20.928000000000004, 12, 60, 21.0, 27.0, 31.0, 40.0, 0.5058250816401682, 0.7947114675730714, 0.3018155516427175], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 11.766, 7, 34, 12.0, 15.0, 17.0, 22.99000000000001, 0.505823546490748, 0.7828538162995569, 0.28995939627936435], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2204.5579999999995, 1509, 3206, 2147.5, 2690.9, 2853.7, 3098.92, 0.5047288041662334, 0.7707800318685767, 0.2789809601153204], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 1, 0.2, 22.653999999999996, 7, 559, 19.0, 30.0, 33.94999999999999, 60.97000000000003, 0.502607022626363, 0.2711378372744425, 4.053250774266118], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 25.03399999999997, 15, 60, 25.0, 34.0, 38.0, 48.99000000000001, 0.5058537394731837, 0.9157286478504251, 0.42286211034086446], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 20.354000000000003, 12, 53, 20.0, 28.0, 32.0, 41.0, 0.5058455511895463, 0.8563777465516509, 0.3635764899174865], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 78.0, 78, 78, 78.0, 78.0, 78.0, 78.0, 12.82051282051282, 5.972055288461538, 1748.5226362179487], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 851.0, 851, 851, 851.0, 851.0, 851.0, 851.0, 1.1750881316098707, 0.538199544653349, 2247.2917890716803], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.8020000000000014, 1, 30, 2.0, 4.0, 6.0, 11.0, 0.5032525210435042, 0.42291690571161417, 0.21378402993547296], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 453.11400000000003, 316, 814, 444.0, 605.4000000000002, 651.95, 730.99, 0.5031082024748899, 0.4428826131590969, 0.2338667034941871], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.5219999999999985, 2, 29, 3.0, 5.0, 7.0, 13.980000000000018, 0.5033269914132416, 0.45599754219138505, 0.24674819305610082], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1281.4960000000003, 913, 2156, 1236.5, 1645.0000000000005, 1728.95, 1947.97, 0.502872912951693, 0.4756922391371908, 0.2666601481765325], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 58.0, 58, 58, 58.0, 58.0, 58.0, 58.0, 17.241379310344826, 8.065059267241379, 1135.321255387931], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 2, 0.4, 49.99199999999996, 21, 810, 47.0, 63.0, 73.0, 100.96000000000004, 0.5022051829583701, 0.2706601483991205, 22.971963642353575], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 50.556000000000004, 10, 196, 48.5, 70.0, 76.89999999999998, 115.90000000000009, 0.5029164122747815, 112.0861752301597, 0.156179120218145], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 1.9789209905660377, 1.555129716981132], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.787999999999999, 1, 37, 2.0, 4.0, 6.0, 11.980000000000018, 0.5060472648145338, 0.5498579114164264, 0.2179363708820404], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.7539999999999947, 2, 26, 3.0, 6.0, 8.0, 10.0, 0.5060426553475045, 0.5191849389181213, 0.18729508435225023], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.639999999999999, 1, 27, 2.0, 4.0, 5.0, 11.990000000000009, 0.5060267789371413, 0.2870249120145938, 0.19717254374601503], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 137.90999999999997, 86, 274, 130.5, 189.0, 206.0, 269.9100000000001, 0.5059771075717451, 0.46092636850363344, 0.16602373842197884], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 8, 1.6, 186.94399999999982, 35, 437, 182.0, 248.0, 263.95, 369.9000000000001, 0.5027111210759627, 0.2698213575185978, 148.7121609339166], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.6539999999999977, 1, 25, 2.0, 4.0, 5.0, 9.980000000000018, 0.5060395824161366, 0.28211904391411496, 0.21299126955210435], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 3.693999999999998, 2, 14, 3.0, 5.0, 6.0, 9.0, 0.5060764600558911, 0.2722266329948694, 0.21646629834421902], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 13.638000000000009, 8, 321, 11.0, 19.0, 23.0, 42.960000000000036, 0.5020574313536874, 0.2121251482324566, 0.36526639292821983], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 5.251999999999997, 3, 56, 5.0, 7.0, 9.0, 12.990000000000009, 0.5060493134935012, 0.26029417374039265, 0.2045941560413179], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.403999999999997, 2, 20, 4.0, 6.0, 7.949999999999989, 15.990000000000009, 0.5032464428025191, 0.30903754652513366, 0.2526061246098582], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.820000000000005, 2, 27, 4.0, 7.0, 9.949999999999989, 18.99000000000001, 0.503234286761013, 0.29477832938546034, 0.23834827058505012], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 584.476, 379, 1069, 583.0, 760.0, 858.0, 937.0, 0.502858246271809, 0.4594729725006939, 0.2224558452745405], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 18.531999999999993, 6, 110, 17.5, 30.0, 37.0, 54.950000000000045, 0.5030110239896018, 0.44536713957248086, 0.20778678041757964], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 10.794, 6, 51, 10.5, 14.0, 17.0, 22.980000000000018, 0.5036108900818871, 0.3357048553755426, 0.23655941223573018], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 617.0020000000001, 432, 3490, 596.0, 705.8000000000001, 744.0, 815.94, 0.5034171959259454, 0.3783465366029609, 0.2792392258651728], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 188.11800000000002, 143, 339, 184.0, 241.0, 266.0, 297.97, 0.5060718500569836, 9.784822123968373, 0.2560011897749195], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 292.22999999999956, 213, 520, 284.0, 365.90000000000003, 386.9, 424.93000000000006, 0.5059699393139655, 0.9807248933288876, 0.3626776713441901], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 20.227999999999994, 12, 59, 20.0, 27.0, 31.0, 39.97000000000003, 0.5054661105191541, 0.4124652823761153, 0.31295460358314814], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 20.14799999999999, 12, 65, 20.0, 26.0, 31.0, 45.97000000000003, 0.505476330565345, 0.42037168969869565, 0.32085899889401776], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 19.762000000000008, 12, 54, 20.0, 26.0, 29.0, 41.98000000000002, 0.5054426059812056, 0.4091054427197058, 0.30948487690450777], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 23.47799999999999, 14, 62, 23.0, 31.0, 37.0, 45.98000000000002, 0.5054533360425633, 0.45205791692823877, 0.3524352362640529], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 20.121999999999993, 12, 45, 20.0, 28.0, 32.0, 40.99000000000001, 0.5051847106857681, 0.37923880756958667, 0.2797262997644829], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2443.5459999999985, 1702, 3480, 2406.5, 2976.0000000000005, 3099.9, 3388.6200000000003, 0.5043261093661429, 0.4214422803180684, 0.32209890188032947], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["No results for path: $['rows'][1]", 500, 97.65625, 2.1272069772388855], "isController": false}, {"data": ["500", 12, 2.34375, 0.05105296745373325], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23505, 512, "No results for path: $['rows'][1]", 500, "500", 12, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Query cross patient #1", 500, 500, "No results for path: $['rows'][1]", 500, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 2, "500", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 8, "500", 8, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
