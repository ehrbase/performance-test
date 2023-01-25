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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8669432035737077, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.455, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.728, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.745, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.842, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.479, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 504.7397574984034, 1, 24409, 13.0, 1056.0, 1919.0, 10741.960000000006, 9.7931828114955, 61.77624756511498, 81.13768847085522], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 11366.547999999992, 9067, 24409, 10833.5, 13120.5, 13621.3, 22203.690000000068, 0.2107262173337486, 0.12243152069626471, 0.10659783259656425], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.2020000000000017, 2, 13, 3.0, 4.0, 5.0, 8.990000000000009, 0.21144098724334234, 0.10855140762079835, 0.07681254614699547], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.627999999999998, 3, 20, 4.0, 6.0, 6.0, 9.990000000000009, 0.21143946720637297, 0.12129274592418711, 0.08961399293707605], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.490000000000016, 10, 447, 14.5, 19.900000000000034, 22.0, 45.99000000000001, 0.21029397415234705, 0.12357029998750854, 2.3415741145361926], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 44.434000000000026, 27, 63, 45.0, 56.0, 58.0, 60.99000000000001, 0.21139450188267944, 0.8791678506960798, 0.08835629570877616], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.7260000000000013, 1, 10, 3.0, 4.0, 4.0, 7.0, 0.21139923887818035, 0.13207662915880436, 0.08980338760938324], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 39.080000000000005, 23, 73, 39.0, 49.0, 51.0, 54.0, 0.2113928037661742, 0.8676002444493535, 0.07720791856303628], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1152.0539999999999, 828, 1725, 1136.5, 1470.5000000000005, 1595.85, 1659.8700000000001, 0.21132472283705975, 0.8937962642649471, 0.10318589982278309], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.972000000000001, 4, 29, 7.0, 9.0, 10.0, 15.980000000000018, 0.21128766308238275, 0.3141892943868897, 0.10832619445141693], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.471999999999998, 2, 16, 4.0, 6.0, 6.0, 12.0, 0.21045276808525862, 0.2029944370756746, 0.11550239810929233], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.076, 6, 20, 10.0, 12.0, 13.0, 17.0, 0.21139146316715146, 0.34454331252536696, 0.13851921072769396], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 510.0, 510, 510, 510.0, 510.0, 510.0, 510.0, 1.9607843137254901, 0.9306066176470588, 2319.1999846813724], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.889999999999997, 3, 15, 5.0, 6.0, 7.0, 13.0, 0.21045391964111715, 0.21142192546290392, 0.12392940775741566], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.694000000000006, 7, 25, 16.0, 20.0, 20.0, 22.0, 0.211390569443916, 0.33209582321300984, 0.12613245891624283], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.813999999999997, 5, 15, 8.0, 9.0, 10.0, 13.0, 0.21139092693230332, 0.32714190997938514, 0.12117819737232621], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2354.7099999999987, 1640, 3624, 2294.0, 3028.7000000000003, 3289.7999999999997, 3495.83, 0.2111420504595718, 0.3224266950431025, 0.11670546929698987], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 13.978000000000003, 9, 83, 13.0, 17.0, 20.94999999999999, 36.97000000000003, 0.21028955188978807, 0.12356770143320742, 1.6958702338924512], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.916000000000004, 10, 27, 15.0, 18.0, 19.0, 24.980000000000018, 0.21139378688293098, 0.3826784928542558, 0.1767119937224501], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.324000000000002, 6, 27, 10.0, 13.0, 14.0, 19.99000000000001, 0.21139244627143888, 0.35784364669515395, 0.15193832075759672], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 64.0, 64, 64, 64.0, 64.0, 64.0, 64.0, 15.625, 8.026123046875, 2131.011962890625], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 623.0, 623, 623, 623.0, 623.0, 623.0, 623.0, 1.6051364365971108, 0.8119733146067416, 3069.7356540930978], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.9259999999999993, 2, 20, 3.0, 4.0, 4.949999999999989, 8.990000000000009, 0.21043266217940057, 0.17693605677389054, 0.08939278129691335], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 735.1199999999994, 555, 960, 720.0, 885.9000000000001, 905.95, 937.99, 0.21038316665376317, 0.1851988223486672, 0.09779530012421023], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.7439999999999993, 2, 15, 3.0, 5.0, 5.949999999999989, 9.990000000000009, 0.21045028785390374, 0.19066097318842287, 0.10316996533462858], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 981.7839999999999, 763, 1314, 928.5, 1187.9, 1216.8, 1264.0, 0.21038166178791592, 0.19902228475641803, 0.11155980698324058], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 65.0, 65, 65, 65.0, 65.0, 65.0, 65.0, 15.384615384615385, 7.9326923076923075, 1013.0558894230769], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 29.144000000000005, 19, 655, 27.0, 33.0, 36.94999999999999, 73.97000000000003, 0.21023225618734553, 0.12353403405321062, 9.616483281069595], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 37.43599999999999, 26, 247, 36.0, 43.0, 46.94999999999999, 127.8900000000001, 0.21035625936085353, 47.60263955691609, 0.06532547898120256], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 1035.0, 1035, 1035, 1035.0, 1035.0, 1035.0, 1035.0, 0.966183574879227, 0.5066802536231885, 0.398173309178744], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.231999999999999, 2, 11, 3.0, 4.0, 5.0, 8.0, 0.21141362992128646, 0.22966870136429443, 0.09104825272977278], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.8779999999999992, 2, 11, 4.0, 5.0, 5.0, 7.990000000000009, 0.21141273601060784, 0.21697512071138694, 0.07824748725392615], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.196, 1, 13, 2.0, 3.0, 3.9499999999999886, 7.990000000000009, 0.2114417025624197, 0.11990850692873316, 0.0823879290257866], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 193.3360000000002, 90, 292, 193.0, 272.0, 279.0, 288.0, 0.2114249832445701, 0.19257636340043255, 0.06937382262712455], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 112.19599999999996, 80, 365, 111.0, 129.0, 138.89999999999998, 242.0, 0.21032608535621458, 0.12364873377386833, 62.21872829697707], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 257.5280000000002, 17, 459, 316.0, 420.90000000000003, 434.95, 452.98, 0.21140996493554323, 0.1178499068791957, 0.08898212391329993], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 543.5719999999995, 326, 994, 517.0, 868.9000000000001, 918.95, 968.0, 0.21143535427473656, 0.11371051167250015, 0.09043816911360801], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.628000000000007, 5, 281, 7.0, 10.0, 13.0, 35.98000000000002, 0.2102088340682935, 0.09888642329984146, 0.1529351380672643], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 547.5359999999998, 310, 1047, 502.5, 886.7, 936.8499999999999, 1005.99, 0.21138547536577085, 0.10872933957998551, 0.08546248711077063], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.266000000000001, 2, 15, 4.0, 6.0, 7.0, 11.990000000000009, 0.21043151085616166, 0.1291996046781029, 0.10562675447272175], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.636000000000001, 3, 31, 4.0, 5.0, 6.0, 11.0, 0.21042911968661213, 0.12323871813208803, 0.0996661357890692], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 895.6119999999995, 599, 1450, 910.0, 1182.6000000000001, 1312.8, 1410.8500000000001, 0.21035015307180638, 0.19221361497150385, 0.09305529232571122], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 517.8560000000009, 263, 1068, 424.0, 944.0, 983.0, 1030.95, 0.21035130350495757, 0.18625745156345708, 0.08689316541269243], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.746000000000001, 4, 40, 6.0, 7.0, 8.0, 13.980000000000018, 0.21045471687947848, 0.14037165198113652, 0.09885617072170816], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1242.748, 955, 9867, 1163.5, 1475.0, 1493.95, 1555.8300000000002, 0.2103737837239694, 0.1580720670633755, 0.11669170815938927], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 169.83599999999998, 145, 214, 172.0, 190.0, 192.0, 195.99, 0.21151549583674048, 4.089643849679321, 0.10699709652678865], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 231.024, 197, 323, 224.0, 259.0, 262.0, 271.97, 0.211499301629306, 0.40992654193037104, 0.15160203847256895], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.25, 6, 21, 9.0, 12.0, 13.0, 17.99000000000001, 0.21128489528509306, 0.1724943090413455, 0.13081506211987207], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 9.12599999999999, 6, 26, 9.0, 11.0, 12.0, 19.99000000000001, 0.2112860559654505, 0.17567692750986705, 0.13411712536869416], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 10.025999999999996, 7, 21, 10.0, 12.0, 13.0, 17.99000000000001, 0.2112818597198318, 0.17098768551603694, 0.12936887309017045], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.463999999999999, 8, 40, 12.0, 15.0, 16.0, 22.980000000000018, 0.21128212756031683, 0.18893862991040794, 0.14731976472467403], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.578000000000005, 6, 39, 10.0, 11.0, 13.0, 22.960000000000036, 0.2112499022969202, 0.15858389882291557, 0.11697138144761109], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2065.7900000000004, 1675, 2748, 2000.5, 2531.8, 2658.45, 2704.99, 0.21110273736919546, 0.17640890956464284, 0.13482538109321665], "isController": false}]}, function(index, item){
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
