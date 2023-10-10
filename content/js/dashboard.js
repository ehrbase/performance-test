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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8740480748776855, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.794, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.821, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.469, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 461.3560519038509, 1, 20151, 11.0, 1006.9000000000015, 1861.9500000000007, 10372.0, 10.74441100926154, 67.68186088053316, 88.91091800347085], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 10494.894000000004, 8949, 20151, 10339.5, 11177.9, 11415.0, 19557.260000000068, 0.2313359326238723, 0.13439262201466762, 0.11657162229874815], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.7639999999999993, 1, 10, 3.0, 4.0, 4.0, 6.990000000000009, 0.23227638288067312, 0.11924806371503775, 0.08392798990805571], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.066000000000002, 2, 13, 4.0, 5.0, 6.0, 8.990000000000009, 0.23227508803225838, 0.13331092967523298, 0.097991052763609], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 16.115999999999993, 10, 444, 14.0, 18.0, 21.94999999999999, 78.77000000000021, 0.2310397249703114, 0.12019255067278767, 2.542113848867674], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.144000000000005, 25, 63, 45.0, 54.0, 56.0, 59.0, 0.23221133460678028, 0.9657429031281655, 0.09660354349852385], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.688000000000002, 1, 11, 2.0, 4.0, 4.0, 7.990000000000009, 0.23221758973932646, 0.1450702288399849, 0.09819357066125817], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 37.68999999999995, 23, 63, 39.0, 48.0, 50.0, 53.0, 0.23220842284968035, 0.9530318953072072, 0.08435696611336044], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1013.0459999999997, 731, 1447, 1003.5, 1230.0, 1338.95, 1413.96, 0.2321345749128451, 0.981745629805476, 0.112893572565036], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.81, 4, 22, 6.0, 9.0, 10.0, 17.0, 0.2321606588905228, 0.34522788759686324, 0.11857424277318693], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.382000000000006, 3, 21, 4.0, 5.0, 6.0, 13.0, 0.23105894313639408, 0.22287034055199983, 0.12636035952771554], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 9.167999999999994, 6, 28, 9.0, 12.0, 13.0, 15.0, 0.23220572684340002, 0.3784023617586426, 0.15170471802561972], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 569.0, 569, 569, 569.0, 569.0, 569.0, 569.0, 1.757469244288225, 0.7603114015817224, 2078.7171161028123], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.853999999999998, 3, 18, 5.0, 6.0, 7.0, 13.980000000000018, 0.23106033123884845, 0.23212311850460526, 0.1356125576899882], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 9.386000000000001, 6, 23, 9.0, 12.0, 14.0, 17.0, 0.23220475629646417, 0.36479503271648916, 0.13809833650834638], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.470000000000001, 5, 17, 7.0, 9.0, 11.0, 14.0, 0.2322041092696809, 0.35935173242261337, 0.1326556678933236], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2047.3999999999994, 1637, 2715, 2024.5, 2417.9, 2570.85, 2647.94, 0.23198228397693724, 0.35425099343513333, 0.12777149234667248], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.108000000000015, 10, 82, 13.0, 17.0, 20.0, 37.0, 0.23103396014386948, 0.1201895516682038, 1.8627113036599474], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 13.823999999999993, 9, 34, 13.5, 17.0, 18.0, 24.980000000000018, 0.23220885421649481, 0.4203592530758385, 0.19365855615320954], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 9.280000000000008, 6, 23, 9.0, 12.0, 13.0, 17.0, 0.23220777580246363, 0.3931454521352434, 0.16644580804590653], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 57.0, 57, 57, 57.0, 57.0, 57.0, 57.0, 17.543859649122805, 8.275082236842104, 2392.6809210526317], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 592.0, 592, 592, 592.0, 592.0, 592.0, 592.0, 1.6891891891891893, 0.7835594383445946, 3230.4786475929054], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.7300000000000035, 2, 24, 3.0, 3.0, 4.0, 8.0, 0.23111757829454643, 0.19426290118544828, 0.09772842910306505], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 687.4739999999996, 533, 973, 677.5, 816.0, 834.0, 882.94, 0.23103673576513362, 0.20344544434255726, 0.10694473901628256], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.6799999999999984, 2, 22, 3.0, 5.0, 5.0, 11.990000000000009, 0.23109685500290025, 0.20936607749486388, 0.11284026123188491], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 949.138000000001, 709, 1245, 910.0, 1147.7, 1174.0, 1231.99, 0.23097963544946096, 0.2185080885314915, 0.12203123318179528], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 55.0, 55, 55, 55.0, 55.0, 55.0, 55.0, 18.18181818181818, 8.611505681818182, 1197.2123579545455], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 30.70200000000002, 20, 1521, 27.0, 33.0, 36.0, 101.8900000000001, 0.23087276832610318, 0.12010569571777188, 10.531315438000272], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 38.609999999999964, 26, 277, 37.0, 44.0, 50.0, 122.86000000000013, 0.2311149075586593, 52.27140083237767, 0.07132061600443002], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 1.1602081028761062, 0.907425331858407], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.1739999999999995, 2, 9, 3.0, 4.0, 5.0, 8.0, 0.23224833106349296, 0.2523682035719329, 0.09956739974304045], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.827999999999999, 2, 13, 4.0, 5.0, 6.0, 9.0, 0.23224736016038072, 0.2383052966739391, 0.08550513162154642], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.089999999999998, 1, 10, 2.0, 3.0, 4.0, 7.980000000000018, 0.23227703031029423, 0.13172421315575292, 0.0900527158527215], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 126.55800000000005, 90, 167, 125.0, 154.0, 158.0, 165.0, 0.23226516134067168, 0.21155863147857215, 0.0757583631716644], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 101.06999999999998, 70, 502, 97.0, 115.0, 123.89999999999998, 393.97, 0.23107698976929736, 0.12021193673828359, 68.32793137914604], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 251.90200000000013, 15, 446, 315.0, 412.90000000000003, 423.95, 435.98, 0.23224487900041804, 0.12943796376399275, 0.09729790340935482], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 480.74200000000013, 359, 644, 465.5, 577.9000000000001, 593.95, 619.94, 0.2322267573527636, 0.12489218509935589, 0.09887779902910636], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.258000000000003, 5, 290, 7.0, 10.0, 12.0, 27.970000000000027, 0.23084441501947633, 0.104085131697893, 0.16749746128854584], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 449.974, 314, 598, 456.5, 533.0, 549.9, 581.99, 0.2322134915109714, 0.11944254698607788, 0.09342964697511741], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.000000000000003, 2, 21, 4.0, 5.0, 6.0, 11.980000000000018, 0.2311159758456071, 0.14189934099012858, 0.11555798792280356], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.581999999999999, 3, 39, 4.0, 5.0, 6.0, 12.0, 0.23111202323322946, 0.13535174946601566, 0.10901084689614242], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 767.1259999999999, 536, 1131, 731.5, 993.8000000000001, 1098.95, 1121.99, 0.23103876414592592, 0.21111843945213316, 0.10175633069317636], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 274.89599999999996, 186, 364, 270.0, 332.0, 338.0, 352.98, 0.2311111686321131, 0.20463946065471023, 0.09501738475988245], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.177999999999995, 3, 43, 5.0, 6.0, 7.0, 11.990000000000009, 0.23106161257899419, 0.15405085305059094, 0.10808448479036935], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1253.5499999999997, 942, 11031, 1162.5, 1484.0, 1508.9, 1552.8200000000002, 0.23096245751445593, 0.17360753239594912, 0.12766088960271688], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 166.6039999999999, 143, 204, 169.0, 185.0, 187.0, 190.0, 0.2322795121572774, 4.491049511858797, 0.11704709792300305], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 226.4140000000001, 195, 270, 226.0, 252.0, 256.0, 264.0, 0.23226537712929285, 0.4501752115647254, 0.16603345318226792], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 8.325999999999993, 5, 23, 8.0, 11.0, 12.0, 17.0, 0.232157856198638, 0.18946937695680055, 0.1432849268725969], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 8.090000000000005, 5, 23, 8.0, 10.0, 12.0, 17.0, 0.2321588263535556, 0.19309765038436216, 0.1469130073018594], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 9.191999999999993, 6, 21, 9.0, 11.0, 13.0, 16.99000000000001, 0.2321550535744217, 0.187880092234042, 0.1416961996914195], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 11.314000000000007, 8, 23, 11.0, 14.0, 15.0, 18.99000000000001, 0.23215645487807143, 0.20760545634413946, 0.16142128503240905], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 8.788, 6, 48, 9.0, 11.0, 11.0, 46.76000000000022, 0.23214470600962286, 0.17426948921548552, 0.12808765517132512], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2055.818000000001, 1623, 2841, 2014.5, 2496.7000000000003, 2632.95, 2723.91, 0.2319644185139153, 0.19384206305326412, 0.147696094600657], "isController": false}]}, function(index, item){
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
