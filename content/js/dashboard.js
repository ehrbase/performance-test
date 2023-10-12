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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8727930227611147, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.776, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.781, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.465, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 465.2491384811755, 1, 20338, 11.0, 1017.0, 1908.0, 10399.820000000029, 10.658051351810917, 67.13785876480758, 88.19628446834439], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 10517.645999999999, 9062, 20338, 10343.0, 11227.1, 11466.5, 19490.270000000066, 0.22936442658663989, 0.13324729252496748, 0.11557816808467401], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.8800000000000012, 1, 12, 3.0, 4.0, 4.0, 7.0, 0.2303314238858293, 0.11824954379982358, 0.08322522152124692], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.062000000000004, 2, 15, 4.0, 5.0, 6.0, 9.0, 0.23032993842359425, 0.13219453917083065, 0.09717044277245383], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 15.951999999999982, 10, 441, 14.0, 18.0, 21.0, 75.66000000000031, 0.22910956110856034, 0.1191884319317785, 2.5208763916114743], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 41.654, 26, 62, 43.0, 53.900000000000034, 55.0, 57.99000000000001, 0.2302715961367795, 0.957675731624672, 0.0957965819865899], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.5259999999999976, 1, 24, 2.0, 3.0, 4.0, 7.0, 0.2302775350908422, 0.14385824411422132, 0.09737321552181119], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 36.778000000000034, 23, 75, 37.0, 47.0, 49.0, 50.0, 0.2302679904926952, 0.9450679553940968, 0.08365204342117444], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1026.3920000000007, 727, 1458, 1006.5, 1260.0, 1396.95, 1424.93, 0.2301894366988257, 0.9735192337948939, 0.11194759714454608], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.831999999999994, 4, 19, 7.0, 9.0, 10.0, 13.990000000000009, 0.23026237015504947, 0.3424050914636673, 0.11760470663192467], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.3759999999999994, 2, 17, 4.0, 5.0, 6.0, 10.990000000000009, 0.22921448653892085, 0.22109125048765385, 0.12535167232597236], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 9.437999999999994, 6, 22, 9.0, 12.0, 13.0, 18.99000000000001, 0.23026693003063012, 0.3752428992298953, 0.15043806268602689], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.9146240750528541, 2500.613190406977], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.009999999999996, 3, 14, 5.0, 6.0, 7.0, 12.990000000000009, 0.22921585256836363, 0.2302701559527357, 0.13453000722029937], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 9.80599999999999, 6, 36, 10.0, 12.0, 14.0, 17.99000000000001, 0.2302655514445479, 0.3617485305316003, 0.1369450398727829], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.503999999999998, 5, 17, 7.0, 9.0, 10.0, 14.990000000000009, 0.2302645970484684, 0.3563502046764437, 0.13154764577475977], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2090.7480000000005, 1646, 2714, 2065.0, 2436.0, 2509.5, 2649.98, 0.23006318455300565, 0.3513204124193169, 0.12671448836708515], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.069999999999997, 9, 81, 13.0, 17.0, 20.0, 52.8900000000001, 0.22910546686882932, 0.11918630200751375, 1.8471628266299367], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 13.986000000000008, 9, 26, 14.0, 17.0, 18.0, 22.99000000000001, 0.23026883886938, 0.41684731377007656, 0.19204061366645558], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 9.463999999999997, 6, 19, 10.0, 12.0, 13.0, 17.0, 0.23026788444604915, 0.38986106830367173, 0.16505529998378915], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 68.0, 68, 68, 68.0, 68.0, 68.0, 68.0, 14.705882352941176, 6.936465992647058, 2005.6295955882351], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 532.0, 532, 532, 532.0, 532.0, 532.0, 532.0, 1.8796992481203008, 0.8719308035714285, 3594.8183446898493], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.8840000000000026, 2, 17, 3.0, 4.0, 4.0, 11.990000000000009, 0.2292167982905928, 0.19266522505536732, 0.0969246813084245], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 699.9060000000004, 536, 903, 686.0, 836.9000000000001, 857.0, 886.0, 0.22915765313231012, 0.20179076895110876, 0.10607492928194824], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.8060000000000005, 2, 16, 4.0, 5.0, 6.0, 10.0, 0.2292145916175307, 0.2076608093647455, 0.1119211873132474], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 960.3259999999998, 734, 1291, 929.5, 1144.0, 1182.95, 1235.97, 0.22913076951277633, 0.21675905052218905, 0.12105443975235547], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 59.0, 59, 59, 59.0, 59.0, 59.0, 59.0, 16.949152542372882, 8.027674788135593, 1116.0454184322034], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 30.28999999999998, 20, 1307, 27.0, 33.0, 36.94999999999999, 79.98000000000002, 0.22896939045600626, 0.11911551170880773, 10.444492410351614], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 38.673999999999985, 27, 284, 37.0, 44.900000000000034, 51.0, 114.0, 0.2291807612834856, 51.833953779368365, 0.07072375055232563], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 1.2821859718826407, 1.0028270171149145], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.285999999999997, 2, 12, 3.0, 4.0, 5.0, 8.0, 0.2303049006579811, 0.250256412120256, 0.09873422987192745], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.9399999999999995, 2, 12, 4.0, 5.0, 6.0, 8.0, 0.2303042641755729, 0.2363115170038244, 0.08478975350995213], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.2159999999999984, 1, 11, 2.0, 3.0, 4.0, 7.0, 0.23033237883595545, 0.13062140206428485, 0.08929878359167413], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 125.62599999999993, 88, 165, 125.0, 153.0, 158.0, 163.0, 0.23032091995703133, 0.20978771997375262, 0.07512420631410983], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 100.31599999999999, 70, 491, 97.0, 114.0, 126.94999999999999, 401.6900000000003, 0.22914536569538058, 0.11920705835897087, 67.75676296767996], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 254.59599999999995, 15, 475, 317.0, 419.0, 428.0, 443.98, 0.23030171828112012, 0.12835497425802544, 0.09648382533457082], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 494.1580000000001, 364, 655, 484.0, 589.0, 608.0, 633.95, 0.23025378111246655, 0.12383111308246725, 0.0980377427392924], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.38199999999999, 5, 300, 7.0, 10.0, 12.0, 27.0, 0.22894045441932917, 0.10322665743159029, 0.16611597425152497], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 470.1620000000001, 349, 616, 481.5, 553.0, 563.95, 587.0, 0.23025643198317103, 0.118435903603375, 0.09264223630572896], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.102, 2, 15, 4.0, 5.0, 6.0, 10.990000000000009, 0.22921574748859766, 0.14073264902691038, 0.11460787374429883], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.561999999999996, 3, 30, 4.0, 5.0, 6.0, 10.990000000000009, 0.2292128052942657, 0.13423946431935946, 0.1081150243721976], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 774.9139999999998, 524, 1143, 738.0, 1002.8000000000001, 1105.0, 1135.99, 0.2291381198758988, 0.20938167006745825, 0.10091923053127964], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 278.0219999999995, 188, 377, 270.0, 339.0, 351.0, 362.0, 0.22918223195992063, 0.20293146634802697, 0.09422433560070954], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.243999999999999, 3, 45, 5.0, 6.0, 7.949999999999989, 12.0, 0.22921690337132222, 0.15282096884827673, 0.10722157882310872], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1260.7339999999988, 956, 10589, 1169.5, 1486.9, 1507.0, 1583.7600000000002, 0.2291142854131641, 0.1722183170169595, 0.12663934135141686], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 168.10799999999986, 144, 200, 177.0, 185.0, 187.95, 194.98000000000002, 0.23030246082785444, 4.452823861540088, 0.11605084940153602], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 226.92599999999973, 195, 315, 223.5, 252.0, 255.0, 268.95000000000005, 0.23028898965311567, 0.4463445904828469, 0.16462064494734444], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 8.322000000000005, 5, 20, 8.0, 11.0, 11.0, 16.0, 0.23025961310858767, 0.18792017702243927, 0.14211335496545646], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 8.306, 5, 24, 8.0, 10.0, 12.0, 16.980000000000018, 0.23026077954326393, 0.19151895365702473, 0.1457118995547217], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 9.450000000000008, 6, 21, 9.0, 12.0, 12.0, 16.99000000000001, 0.23025759838561793, 0.18634450620912638, 0.14053808495215936], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 11.546000000000006, 7, 23, 11.0, 14.0, 15.949999999999989, 19.99000000000001, 0.2302583406478733, 0.2059080714010391, 0.1601015024817244], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 8.670000000000005, 5, 27, 9.0, 11.0, 12.0, 16.99000000000001, 0.23023088013121318, 0.17283279283756336, 0.1270316867911479], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2081.682, 1618, 2757, 2023.5, 2579.9000000000005, 2675.8, 2727.92, 0.230046248497798, 0.1922391360371589, 0.14647475978570731], "isController": false}]}, function(index, item){
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
