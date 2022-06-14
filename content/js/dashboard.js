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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9163826403090207, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.007, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.993, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.499, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.88, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.737, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.708, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 191.07502840263618, 1, 3898, 14.0, 581.0, 1279.7500000000036, 2151.0, 25.781409266544976, 173.34925672317175, 227.1041641464719], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 7.161999999999999, 4, 22, 7.0, 9.0, 12.0, 17.0, 0.5971553905814263, 6.398850078391574, 0.21576903761242944], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.531999999999997, 5, 50, 7.0, 9.0, 10.949999999999989, 14.0, 0.5971240119090413, 6.411409151462895, 0.2519116925241268], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 19.633999999999983, 12, 263, 18.0, 24.0, 29.0, 44.960000000000036, 0.5928652227631788, 0.3194987739547193, 6.600257362793202], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 42.664000000000016, 26, 73, 43.0, 53.0, 55.0, 60.0, 0.597012073972184, 2.483080491257355, 0.24836635108608435], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.0780000000000003, 1, 8, 2.0, 3.0, 3.0, 5.990000000000009, 0.5970491443091664, 0.373155715193229, 0.252463163560419], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 37.82599999999999, 22, 74, 38.0, 47.0, 49.0, 56.960000000000036, 0.5969928277281676, 2.449676116466137, 0.21687630069812341], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 737.2079999999988, 558, 948, 730.5, 879.8000000000001, 903.95, 927.98, 0.5966558632178367, 2.5235513121059086, 0.29017052722898695], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 9.314000000000004, 6, 39, 10.0, 11.0, 13.0, 19.0, 0.5967562716100365, 0.8875584000606304, 0.30478860356645415], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.2880000000000034, 2, 22, 3.0, 4.0, 6.0, 14.990000000000009, 0.5939236855577953, 0.5730435559874041, 0.3248020155394193], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 14.77000000000001, 10, 42, 16.0, 18.0, 19.0, 23.99000000000001, 0.5969771465208769, 0.9730027905696714, 0.3900172959203776], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 656.0, 656, 656, 656.0, 656.0, 656.0, 656.0, 1.524390243902439, 0.6505454458841463, 1803.0335961318597], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.134000000000001, 2, 22, 4.0, 5.0, 6.0, 9.0, 0.5939363846617116, 0.596163646104193, 0.3485896163883679], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.893999999999997, 10, 38, 17.0, 19.0, 21.0, 27.0, 0.5969657425238996, 0.9373294916597916, 0.35503138398149886], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 9.130000000000003, 6, 28, 9.0, 11.0, 12.0, 17.0, 0.5969628915927329, 0.9240099445063297, 0.34103837068530146], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1808.3980000000004, 1453, 2433, 1797.0, 2041.0, 2106.9, 2235.75, 0.5957274427803791, 0.9098805864340948, 0.3281155055938807], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 16.41799999999998, 11, 80, 15.0, 21.0, 25.0, 40.98000000000002, 0.5928188298230554, 0.3201453250899899, 4.779601815448385], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 19.008000000000003, 12, 45, 20.0, 23.0, 24.94999999999999, 30.980000000000018, 0.5969971045640429, 1.080891242052476, 0.49788625712665296], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 14.873999999999995, 10, 56, 16.0, 18.0, 19.0, 24.980000000000018, 0.5969956789452757, 1.0109282297764728, 0.427924637056477], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 88.0, 88, 88, 88.0, 88.0, 88.0, 88.0, 11.363636363636363, 5.293412642045455, 1549.8046875], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 652.0, 652, 652, 652.0, 652.0, 652.0, 652.0, 1.5337423312883436, 0.7024659700920245, 2933.195336464724], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.1179999999999968, 1, 18, 2.0, 3.0, 4.0, 8.0, 0.5938362175958422, 0.49930955405275407, 0.25110457247949186], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 401.1639999999997, 304, 678, 409.5, 462.90000000000003, 474.95, 508.98, 0.593632460772767, 0.5222342441040424, 0.2747869007873941], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 2.853999999999998, 1, 16, 3.0, 4.0, 5.0, 11.0, 0.5939088706228915, 0.5382299140019955, 0.2899945657338338], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1155.7020000000002, 906, 1581, 1145.0, 1341.0, 1361.0, 1414.91, 0.5932683032170567, 0.5614033064622344, 0.3134356953519802], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 57.0, 57, 57, 57.0, 57.0, 57.0, 57.0, 17.543859649122805, 8.20655153508772, 1155.2049067982455], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 41.25799999999999, 27, 582, 40.0, 49.0, 56.0, 79.92000000000007, 0.5924191673667086, 0.31992949175174795, 27.097391563595608], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 40.842000000000034, 28, 189, 40.0, 49.0, 55.0, 92.93000000000006, 0.5932190318902687, 134.24303379183232, 0.18306368562238762], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 286.0, 286, 286, 286.0, 286.0, 286.0, 286.0, 3.4965034965034967, 1.8336156031468533, 1.4341127622377623], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 1.9840000000000004, 1, 8, 2.0, 3.0, 4.0, 5.990000000000009, 0.5971810664937229, 0.6490844990307751, 0.2560180548737738], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 2.976, 2, 12, 3.0, 4.0, 6.0, 10.0, 0.5971746473086533, 0.612920463204487, 0.2198582441751585], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.985999999999999, 1, 20, 2.0, 3.0, 3.0, 5.990000000000009, 0.5971703679286071, 0.3388242028969929, 0.2315201524098213], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 116.42999999999996, 83, 159, 115.0, 143.0, 148.0, 153.0, 0.5971040453799074, 0.5440410882221227, 0.1947585460516495], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 158.23, 108, 588, 157.0, 187.90000000000003, 201.95, 308.96000000000004, 0.5929692818193246, 0.32022657504500635, 175.4112001075646], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.014000000000001, 1, 10, 2.0, 3.0, 4.0, 5.990000000000009, 0.5971689414822211, 0.33231518517014536, 0.25018112880456334], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 443.14799999999985, 343, 583, 446.5, 517.0, 526.95, 541.98, 0.5969443612038696, 0.6487339481661272, 0.2564995302047877], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 11.111999999999991, 6, 310, 9.0, 14.0, 18.0, 47.950000000000045, 0.5922240975985312, 0.25042288501969145, 0.42970947706612184], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 2.671999999999999, 1, 21, 2.0, 3.0, 4.0, 7.0, 0.5971846327672818, 0.6356750485511107, 0.2426062570617083], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.5420000000000016, 2, 23, 3.0, 4.0, 6.0, 13.990000000000009, 0.5938270490596156, 0.3647629041586896, 0.29691352452980774], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 3.798, 2, 25, 3.0, 5.0, 6.0, 14.0, 0.5938115337201817, 0.34793644553916897, 0.28008883865903106], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 512.5620000000002, 366, 906, 508.0, 621.0, 630.0, 679.7800000000002, 0.5931746946929847, 0.5415267886589744, 0.2612517454165391], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 14.228000000000023, 4, 124, 13.0, 24.0, 34.94999999999999, 52.99000000000001, 0.5933478584889091, 0.5255532301264068, 0.2439447738513972], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 8.330000000000014, 5, 42, 8.0, 10.0, 11.0, 18.99000000000001, 0.5939455565745021, 0.3961570460355322, 0.27783195468670563], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 525.9140000000002, 418, 3898, 508.0, 586.0, 609.95, 659.94, 0.5936810958878085, 0.4464203553062623, 0.3281479494848629], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 14.794000000000006, 10, 38, 16.0, 18.0, 18.0, 23.980000000000018, 0.5967121162395203, 0.48715950114867085, 0.3682832592415789], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 14.527999999999988, 10, 50, 15.0, 17.0, 18.0, 24.99000000000001, 0.5967327687445697, 0.49582432515491187, 0.37761995522117303], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 14.991999999999996, 10, 52, 16.0, 18.0, 19.0, 27.99000000000001, 0.5966644072974444, 0.48304179067341935, 0.36417505328213157], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 17.314, 12, 43, 18.0, 21.0, 22.0, 25.99000000000001, 0.5966879047781574, 0.5337559773210862, 0.4148845587910626], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 14.904000000000002, 9, 48, 16.0, 18.0, 19.94999999999999, 25.980000000000018, 0.5964309571524, 0.44790566997089415, 0.3290854402256895], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2107.0060000000008, 1623, 2667, 2109.5, 2415.9, 2475.75, 2621.0, 0.5952756542972355, 0.49693890656196166, 0.37902317050956785], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 22005, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
