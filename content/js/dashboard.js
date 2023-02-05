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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8670921080621145, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.457, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [0.999, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.747, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.742, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.499, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [0.844, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.468, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 507.44245905126496, 1, 24295, 13.0, 1069.0, 1939.9500000000007, 10730.950000000008, 9.747938749518408, 61.40495015171409, 80.76283601721327], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 11368.425999999998, 9228, 24295, 10839.0, 13285.900000000001, 13773.35, 21126.95000000006, 0.20978319745675633, 0.12189551024098635, 0.10612079715097635], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 3.2560000000000007, 2, 9, 3.0, 4.0, 5.0, 7.990000000000009, 0.21052817730177825, 0.10808278133722446, 0.07648093941041163], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.700000000000005, 3, 16, 5.0, 6.0, 6.0, 9.990000000000009, 0.21052702493313663, 0.1207812456578801, 0.08922727423923954], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.865999999999996, 10, 414, 15.0, 21.0, 25.0, 44.960000000000036, 0.2093672586456116, 0.10891800034482788, 2.3312553545676398], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 44.59199999999996, 26, 62, 46.0, 56.0, 58.0, 60.0, 0.2104760673978044, 0.8753481767458042, 0.08797241879517606], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.699999999999999, 1, 9, 2.0, 4.0, 4.949999999999989, 7.0, 0.2104795228681792, 0.13150201502571218, 0.08941268793716597], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 39.556, 24, 56, 41.0, 50.0, 51.0, 54.0, 0.21047438400462032, 0.8638070150112436, 0.07687248009543751], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1168.4260000000013, 804, 1785, 1166.0, 1460.0, 1589.8, 1709.88, 0.21040645055679857, 0.8899124388295846, 0.1027375246859368], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 7.0420000000000025, 4, 22, 7.0, 9.0, 10.0, 14.0, 0.2103518344783485, 0.3127976971469981, 0.10784639951282517], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.6220000000000026, 3, 17, 4.0, 6.0, 6.0, 12.0, 0.2095149101285793, 0.20208981629208891, 0.11498767528541168], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 10.546000000000005, 6, 31, 10.0, 13.0, 14.0, 18.99000000000001, 0.21047332082279915, 0.3430468480988787, 0.13791757643759592], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 559.0, 559, 559, 559.0, 559.0, 559.0, 559.0, 1.7889087656529516, 0.7739126788908764, 2115.906962768336], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.259999999999995, 3, 31, 5.0, 7.0, 7.0, 13.0, 0.2095160514437332, 0.21049161055826807, 0.12337712794977648], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 16.375999999999983, 8, 24, 17.0, 20.0, 21.0, 23.0, 0.2104723462488987, 0.33066521047866043, 0.12558457378718468], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 8.089999999999996, 5, 18, 8.0, 10.0, 11.0, 15.990000000000009, 0.21047216905461374, 0.32572006935794623, 0.1206515265967366], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2390.987999999999, 1714, 3746, 2274.5, 3100.9000000000005, 3364.65, 3622.9, 0.21019752261199848, 0.3209843438316486, 0.11618339628749134], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.770000000000007, 9, 84, 13.0, 18.0, 24.94999999999999, 57.92000000000007, 0.20936296293814957, 0.10891576561209146, 1.6883978007258194], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 15.282000000000004, 9, 34, 15.0, 18.0, 20.0, 24.99000000000001, 0.21047473840094763, 0.3810147727746296, 0.1759437266320422], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 10.550000000000004, 7, 21, 10.0, 13.0, 14.0, 17.0, 0.2104742068069042, 0.35630117877658074, 0.1512783361424624], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 62.0, 62, 62, 62.0, 62.0, 62.0, 62.0, 16.129032258064516, 7.60773689516129, 2199.7542842741937], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 725.0, 725, 725, 725.0, 725.0, 725.0, 725.0, 1.379310344827586, 0.6398168103448276, 2637.855603448276], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 3.0499999999999994, 2, 19, 3.0, 4.0, 4.0, 8.990000000000009, 0.20950455106736285, 0.17615568209863222, 0.08899851534599885], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 757.0240000000002, 586, 1017, 741.5, 908.8000000000001, 934.75, 972.0, 0.20945435047158648, 0.1843811919942358, 0.09736354572702652], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.9419999999999957, 2, 13, 4.0, 5.0, 6.0, 11.0, 0.20951526130114842, 0.18981387017743012, 0.1027115831769302], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1012.3720000000006, 786, 1341, 975.0, 1225.6000000000001, 1257.8, 1314.95, 0.20944399739786776, 0.19813524874930516, 0.11106258846390839], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 74.0, 74, 74, 74.0, 74.0, 74.0, 74.0, 13.513513513513514, 6.400443412162162, 889.8463893581081], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 30.691999999999975, 19, 655, 28.0, 36.0, 42.0, 91.88000000000011, 0.20930634621027835, 0.10888631219695058, 9.574130133290469], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 37.921999999999954, 27, 251, 36.0, 42.0, 50.94999999999999, 103.93000000000006, 0.20942610127762487, 47.36597086197061, 0.06503662129519991], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 1019.0, 1019, 1019, 1019.0, 1019.0, 1019.0, 1019.0, 0.9813542688910696, 0.5146359789008833, 0.4044252944062807], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.296000000000001, 2, 8, 3.0, 4.0, 5.0, 8.0, 0.2104978653411476, 0.22868578538963788, 0.09065386583539657], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.9679999999999986, 2, 14, 4.0, 5.0, 6.0, 8.0, 0.2104968019220884, 0.21604701056651845, 0.07790848430514795], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.3539999999999988, 1, 12, 2.0, 3.0, 4.0, 7.0, 0.210528886457982, 0.11936700029705626, 0.0820322516569676], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 194.55999999999977, 90, 307, 193.0, 275.90000000000003, 280.0, 295.0, 0.21051239981188613, 0.19174513713725028, 0.06907438118827512], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 115.37800000000001, 83, 379, 113.0, 132.90000000000003, 145.89999999999998, 282.63000000000034, 0.20939549196633256, 0.10899198947075708, 61.94343986957173], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 260.8700000000002, 16, 502, 313.0, 428.0, 439.0, 454.97, 0.2104946751162036, 0.11735160362210817, 0.08859687985848022], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 531.6620000000001, 327, 1076, 503.5, 809.0, 907.8, 1040.95, 0.21052161783337045, 0.11319525356381521, 0.09004733262794556], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.464000000000006, 4, 257, 7.0, 10.900000000000034, 15.0, 28.940000000000055, 0.2092856703357235, 0.09436453794014345, 0.15226350039073633], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 549.5979999999998, 321, 1110, 507.0, 874.7, 939.4999999999999, 1051.94, 0.21046915679741712, 0.10825801716481208, 0.08509202237708074], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.590000000000004, 3, 16, 4.0, 6.0, 7.0, 11.990000000000009, 0.20950332209417843, 0.12862972034553802, 0.10516084722305441], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.893999999999999, 3, 59, 5.0, 6.0, 6.0, 10.990000000000009, 0.20949840634562295, 0.12269364186477885, 0.09922531941174524], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 907.4179999999997, 619, 1547, 913.5, 1208.0, 1342.75, 1423.99, 0.20941908402605675, 0.19136282335353672, 0.09264340338262082], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 519.2620000000003, 270, 1124, 420.0, 943.6000000000001, 988.9, 1070.8100000000002, 0.20942206630051313, 0.18543465013216626, 0.08650931059093461], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.916000000000002, 4, 60, 6.0, 7.0, 8.0, 13.0, 0.20951684159227774, 0.1397460964917243, 0.09841562578699763], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1241.0199999999998, 942, 10177, 1155.5, 1481.0, 1505.0, 1584.91, 0.2094362771277574, 0.1573676370582413, 0.11617168496930293], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 169.85799999999983, 144, 206, 167.5, 191.90000000000003, 195.0, 200.99, 0.21058217548233846, 4.071598137084785, 0.10652496767563607], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 230.04200000000003, 197, 330, 221.0, 260.0, 263.0, 271.99, 0.21056754269783348, 0.40812061295685265, 0.1509341565822361], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 9.538000000000004, 6, 19, 9.0, 12.0, 13.0, 16.0, 0.21035006457746983, 0.17173110740894998, 0.13023627045128505], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 9.25, 6, 20, 9.0, 11.0, 12.0, 18.0, 0.21035086102917944, 0.17489934579830463, 0.13352349577047523], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 10.318, 7, 22, 10.0, 13.0, 14.0, 16.99000000000001, 0.21034785224325467, 0.1702318053051832, 0.12879697593410222], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 12.750000000000004, 8, 27, 13.0, 15.0, 17.0, 20.0, 0.21034847169214407, 0.18811562424274553, 0.14666875858221765], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 9.710000000000004, 6, 37, 10.0, 12.0, 13.0, 19.0, 0.2103321017687668, 0.1578949120611999, 0.11646318525672925], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2068.226, 1619, 2766, 2014.0, 2517.9, 2644.95, 2697.99, 0.2101834733575633, 0.17564072264335986, 0.1342382730232875], "isController": false}]}, function(index, item){
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
