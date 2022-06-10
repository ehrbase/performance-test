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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9156328107248353, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.003, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.994, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.842, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.719, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.733, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 191.6091797318803, 1, 3765, 12.0, 580.0, 1285.9500000000007, 2153.9900000000016, 25.647660241056535, 172.4411395193963, 225.92599113331656], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 6.768, 4, 26, 6.0, 9.0, 11.0, 17.0, 0.5938898239354228, 6.354875143201683, 0.21458909653916644], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.1499999999999995, 4, 35, 7.0, 9.0, 10.0, 16.0, 0.593870073105406, 6.376471127521722, 0.2505389370913432], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 20.058000000000014, 12, 243, 18.0, 26.0, 31.0, 49.99000000000001, 0.5896761852196485, 0.3177801816910262, 6.564754405765618], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 41.284000000000006, 26, 77, 42.0, 51.0, 53.0, 55.99000000000001, 0.5936197746619335, 2.4689713088722414, 0.24695510156834347], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.093999999999997, 1, 12, 2.0, 3.0, 3.9499999999999886, 6.0, 0.5936557200509595, 0.3710348250318496, 0.25102824881061075], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 36.25400000000001, 22, 62, 37.0, 45.0, 47.0, 52.97000000000003, 0.5936092033170882, 2.4357918895174553, 0.21564709339253596], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 747.918, 565, 1009, 739.0, 908.9000000000001, 921.0, 941.96, 0.5932577443865953, 2.5091789950569767, 0.28851792646926216], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.223999999999998, 5, 38, 8.0, 10.0, 11.0, 18.980000000000018, 0.5933337763558862, 0.8824681068261864, 0.30304059085364116], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.216, 2, 23, 3.0, 4.0, 5.0, 13.0, 0.5906374513757718, 0.5698728534758424, 0.32300485622112524], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 12.29599999999999, 8, 28, 13.0, 15.0, 16.0, 20.0, 0.5936099080616974, 0.9675145864794659, 0.38781741063796443], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 595.0, 595, 595, 595.0, 595.0, 595.0, 595.0, 1.680672268907563, 0.7172400210084033, 1987.882418592437], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.139999999999997, 2, 22, 4.0, 5.0, 6.0, 10.980000000000018, 0.5906500103363752, 0.5928649478751365, 0.34666079708218894], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 13.598000000000006, 8, 35, 14.0, 16.0, 18.0, 26.99000000000001, 0.5936042701516778, 0.9320514548053452, 0.35303222707262866], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.980000000000001, 5, 27, 8.0, 10.0, 11.0, 14.990000000000009, 0.5935958134874466, 0.918798207400003, 0.33911479579116827], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1857.918000000002, 1458, 2435, 1844.5, 2132.9, 2192.0, 2256.0, 0.5923223181126241, 0.9046797905548283, 0.32624002677296876], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 16.768000000000008, 11, 65, 15.0, 21.0, 28.0, 41.0, 0.5896393294149834, 0.3184282706703963, 4.753967093408304], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 16.65599999999999, 11, 36, 17.0, 20.0, 21.94999999999999, 25.0, 0.5936148413208168, 1.0747674959070257, 0.4950655024296655], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 12.401999999999994, 8, 35, 13.0, 16.0, 17.0, 20.99000000000001, 0.5936148413208168, 1.0052032566897424, 0.4255012632123823], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 90.0, 90, 90, 90.0, 90.0, 90.0, 90.0, 11.11111111111111, 5.17578125, 1515.3645833333335], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 562.0, 562, 562, 562.0, 562.0, 562.0, 562.0, 1.779359430604982, 0.8149605204626333, 3402.924127001779], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.031999999999995, 1, 20, 2.0, 3.0, 3.0, 7.0, 0.5905739670270742, 0.49656658751006927, 0.24972512472922184], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 402.93799999999976, 312, 537, 407.5, 464.0, 476.95, 505.98, 0.5903689569833563, 0.5193632531336784, 0.27327625547862394], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 2.968000000000001, 1, 26, 3.0, 4.0, 5.949999999999989, 10.0, 0.590623497601478, 0.5352525447013394, 0.2883903796882217], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1153.935999999999, 926, 1392, 1143.0, 1331.8000000000002, 1357.95, 1374.98, 0.5899684130911631, 0.5582806565286494, 0.31169229636945234], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 51.0, 51, 51, 51.0, 51.0, 51.0, 51.0, 19.607843137254903, 9.17202818627451, 1291.1113664215686], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 40.81, 27, 612, 40.0, 46.0, 51.0, 87.98000000000002, 0.5892217205981307, 0.31820274559645145, 26.951139598999266], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 38.98400000000001, 27, 169, 39.0, 46.0, 53.0, 78.98000000000002, 0.5899809436155212, 133.5102676964784, 0.18206443181885223], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 276.0, 276, 276, 276.0, 276.0, 276.0, 276.0, 3.6231884057971016, 1.9000509510869563, 1.4860733695652173], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.0440000000000027, 1, 9, 2.0, 3.0, 4.0, 7.0, 0.5939413233487837, 0.6455631766476526, 0.2546291415528477], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.0220000000000016, 1, 25, 3.0, 4.0, 5.0, 9.990000000000009, 0.5939349736233478, 0.6095953684356822, 0.2186655127500021], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.8320000000000005, 1, 10, 2.0, 3.0, 3.0, 5.990000000000009, 0.5939067542639536, 0.33697248459702833, 0.23025486469022416], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 118.92199999999993, 82, 181, 117.5, 146.0, 150.0, 160.96000000000004, 0.5938355123137732, 0.5410630204968265, 0.193692442492969], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 163.27400000000014, 107, 705, 163.0, 186.0, 213.84999999999997, 328.96000000000004, 0.589752693105673, 0.3184894914916379, 174.4596741115081], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.082000000000001, 1, 13, 2.0, 3.0, 4.0, 7.990000000000009, 0.593930035041872, 0.3305127843440043, 0.24882420413375303], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 452.5, 348, 669, 455.0, 524.0, 534.9, 559.97, 0.5937022440757421, 0.6452105520480946, 0.2551064330012955], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 11.228000000000002, 6, 292, 9.0, 14.0, 18.0, 38.99000000000001, 0.5890363835993422, 0.2490749551743312, 0.4273965166155383], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 2.724000000000002, 1, 10, 3.0, 3.0, 5.0, 8.0, 0.5939434399541, 0.6322249507323916, 0.24128952248135313], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.328000000000001, 2, 15, 3.0, 4.0, 5.0, 10.990000000000009, 0.5905655964830637, 0.36275953143344447, 0.2952827982415319], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 3.7899999999999983, 2, 28, 4.0, 5.0, 6.0, 9.990000000000009, 0.5905481586117867, 0.3460243116865937, 0.27854957090770793], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 516.4399999999994, 368, 907, 525.0, 625.9000000000001, 635.9, 658.99, 0.5899176003095887, 0.5385532905013828, 0.25981722435510207], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 14.65800000000001, 5, 125, 13.0, 23.0, 32.94999999999999, 48.0, 0.5900944387139718, 0.522671538978098, 0.24260718622908412], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 6.838000000000001, 4, 42, 7.0, 8.0, 9.0, 16.980000000000018, 0.5906590810289755, 0.3939649925222561, 0.27629462872351485], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 517.1319999999998, 356, 3765, 503.0, 568.9000000000001, 595.8499999999999, 679.8900000000001, 0.5904400667905804, 0.4439832533483856, 0.3263565212924497], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 12.509999999999996, 8, 36, 13.0, 15.0, 17.0, 23.99000000000001, 0.5933239192604811, 0.4843933559587521, 0.36619210641857813], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 12.285999999999984, 8, 24, 13.0, 15.0, 16.0, 21.0, 0.5933267355400341, 0.49299425748719006, 0.37546457483392787], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 12.498000000000001, 8, 27, 13.0, 16.0, 17.0, 22.980000000000018, 0.5933049100727747, 0.4803220414554007, 0.3621245789018401], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 15.114000000000011, 10, 37, 16.0, 18.0, 20.0, 29.99000000000001, 0.5933140624925836, 0.5307379699640689, 0.4125386840768745], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 12.142000000000005, 8, 38, 13.0, 15.0, 17.0, 21.980000000000018, 0.5930684531469992, 0.44538050827152575, 0.327230152371147], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2088.816, 1638, 2682, 2064.0, 2399.0, 2498.95, 2635.99, 0.5919422453790029, 0.4941561611716668, 0.37690072654991197], "isController": false}]}, function(index, item){
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
