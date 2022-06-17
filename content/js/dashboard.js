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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8925244262667575, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.735, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.81, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.729, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 314.18700295387504, 1, 13012, 14.0, 674.9000000000015, 2628.9500000000007, 4418.960000000006, 15.749626389230848, 105.88935008456343, 138.73585030849728], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 8.555999999999987, 5, 30, 8.0, 11.0, 13.0, 18.99000000000001, 0.3653945091436322, 3.9071128163311615, 0.13202731287416397], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.53000000000001, 4, 42, 7.0, 9.0, 10.0, 13.0, 0.36538543047519106, 3.9231976039119627, 0.15414697848172124], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 20.764000000000014, 13, 253, 20.0, 25.0, 28.0, 47.98000000000002, 0.361782982307365, 0.19496711030907843, 4.027662107718712], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.584000000000024, 26, 63, 45.0, 55.0, 58.0, 60.0, 0.3652730525649839, 1.519236260619401, 0.15195929725847965], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.24, 1, 10, 2.0, 3.0, 4.0, 5.0, 0.36528692923004086, 0.22830433076877557, 0.1544621487857497], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.226000000000006, 22, 65, 39.0, 48.0, 50.0, 54.99000000000001, 0.3652706509415216, 1.4988367499532453, 0.13269597866234967], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 750.166, 554, 999, 726.5, 959.8000000000001, 971.95, 986.99, 0.3651402101893106, 1.5443576663377971, 0.17757795378347332], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 9.522, 6, 31, 10.0, 12.0, 13.0, 16.0, 0.3651319440793125, 0.5430624519851494, 0.18648828784519575], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.0739999999999967, 1, 15, 3.0, 4.0, 5.0, 9.980000000000018, 0.3621611167889926, 0.34942889002687955, 0.19805686074398032], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 15.313999999999993, 10, 25, 16.0, 19.0, 20.0, 22.0, 0.36527145147916673, 0.5953496606628216, 0.2386392588276978], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 607.0, 607, 607, 607.0, 607.0, 607.0, 607.0, 1.6474464579901154, 0.7030606466227348, 1948.583260399506], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 3.9060000000000024, 2, 12, 4.0, 5.0, 6.0, 9.0, 0.3621642646725419, 0.363522380665064, 0.21255929987128683], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 16.237999999999992, 11, 38, 17.0, 20.0, 21.0, 27.980000000000018, 0.3652690498767582, 0.5735294815955536, 0.21723520642084546], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 9.634000000000002, 6, 28, 10.0, 12.0, 13.0, 15.990000000000009, 0.36527011725170766, 0.5653839217226139, 0.20867482284399314], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 3153.386, 2618, 4107, 3114.0, 3591.7000000000003, 3744.8999999999996, 3970.96, 0.36441608153591176, 0.5565886245333652, 0.2007135449084514], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 17.497999999999998, 12, 80, 16.0, 22.0, 25.0, 40.0, 0.3617670148071239, 0.1953683195198628, 2.9167465568824364], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 22.735999999999994, 16, 48, 23.0, 27.0, 28.0, 34.98000000000002, 0.36527278571637295, 0.6613435007013237, 0.30463179590017825], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 15.46399999999999, 10, 49, 16.0, 19.0, 20.0, 23.99000000000001, 0.365272518868152, 0.6185376442552496, 0.2618262000480699], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 100.0, 100, 100, 100.0, 100.0, 100.0, 100.0, 10.0, 4.658203125, 1363.828125], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 587.0, 587, 587, 587.0, 587.0, 587.0, 587.0, 1.7035775127768313, 0.7802518100511073, 3257.9955014906304], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.5199999999999987, 1, 19, 2.0, 3.0, 4.0, 7.990000000000009, 0.36210944685609336, 0.30446897826474256, 0.1531185453991098], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 524.2100000000006, 398, 699, 516.5, 654.0, 662.9, 673.99, 0.36200693750095025, 0.3184671187288633, 0.16756961755415078], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.3100000000000014, 2, 13, 3.0, 4.0, 5.0, 11.990000000000009, 0.36213567340577013, 0.32818545402397914, 0.17682405928016118], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 814.2400000000004, 626, 1138, 765.0, 1079.0, 1098.95, 1118.95, 0.3619613381855457, 0.3425200553728455, 0.1912315273031057], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 59.0, 59, 59, 59.0, 59.0, 59.0, 59.0, 16.949152542372882, 7.928363347457627, 1116.0454184322034], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 42.300000000000004, 27, 599, 43.0, 49.0, 52.94999999999999, 79.96000000000004, 0.3616134323479126, 0.1952853789925739, 16.54028314874173], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 40.12, 27, 166, 41.0, 48.0, 52.0, 81.0, 0.36190553396990105, 81.89773795922193, 0.11168178587352415], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 321.0, 321, 321, 321.0, 321.0, 321.0, 321.0, 3.115264797507788, 1.633688668224299, 1.2777453271028036], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.016000000000001, 1, 18, 2.0, 3.0, 3.9499999999999886, 6.990000000000009, 0.3655074961932394, 0.39727523756159716, 0.15669706135628136], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 2.8579999999999988, 1, 16, 3.0, 4.0, 5.0, 7.990000000000009, 0.36550535867406353, 0.3751427069984773, 0.13456593771496284], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.9039999999999986, 1, 12, 2.0, 3.0, 3.0, 5.990000000000009, 0.36540225307029245, 0.2073229580408593, 0.1416647406922911], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 121.97600000000003, 81, 480, 118.0, 153.0, 162.0, 167.0, 0.3653760852583172, 0.3329061401816504, 0.1191754028088652], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 165.972, 110, 585, 164.0, 198.0, 221.5499999999999, 376.84000000000015, 0.36181753975651126, 0.19539560496616282, 107.03227100387], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.110000000000001, 1, 10, 2.0, 3.0, 4.0, 5.990000000000009, 0.3655040227372742, 0.20339727765293786, 0.15312619702567448], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 455.43399999999986, 340, 579, 454.0, 557.0, 562.95, 572.96, 0.3654236173283879, 0.3971269710036359, 0.15701796057079168], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 12.06400000000001, 8, 352, 10.0, 14.0, 18.0, 42.820000000000164, 0.36152845554320734, 0.15287287231465702, 0.26231996334824514], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 2.6520000000000006, 1, 11, 2.0, 3.0, 4.0, 7.0, 0.36551123691195636, 0.38906957835354733, 0.1484889399954823], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.3939999999999992, 2, 13, 3.0, 4.0, 5.0, 9.990000000000009, 0.36210656216754095, 0.22242678476892894, 0.18105328108377047], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 3.7920000000000016, 2, 25, 4.0, 5.0, 5.949999999999989, 9.990000000000009, 0.36210053069453774, 0.21216827970383073, 0.17079546516158373], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 521.7979999999997, 368, 887, 524.0, 657.0, 664.0, 676.0, 0.3618686026154415, 0.33036059030177667, 0.15937767556598056], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 14.073999999999987, 6, 115, 14.0, 19.0, 22.0, 29.0, 0.36194666498723416, 0.3205914308041224, 0.14880815035119685], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 8.527999999999999, 5, 37, 9.0, 10.0, 11.0, 14.990000000000009, 0.3621658386348376, 0.24156178494882233, 0.16941155928328827], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 2459.546, 1954, 13012, 2326.0, 2839.5, 3012.5499999999997, 4934.350000000016, 0.36162860164005806, 0.27192775709262174, 0.19988455910964145], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 15.688000000000015, 11, 27, 16.0, 19.0, 20.0, 22.0, 0.3651231450831422, 0.298088817665534, 0.2253494411060018], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 15.245999999999988, 10, 34, 16.0, 19.0, 20.0, 24.99000000000001, 0.3651266113037357, 0.30338313082194385, 0.23105668371564525], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 15.276000000000003, 10, 28, 15.0, 19.0, 20.0, 25.99000000000001, 0.3651114137479052, 0.2955833613252084, 0.2228463218676179], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 21.022000000000023, 14, 48, 22.0, 25.900000000000034, 26.0, 29.0, 0.36511381327787495, 0.3266057157837241, 0.2538681982947725], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 15.337999999999994, 10, 33, 16.0, 19.0, 19.0, 25.970000000000027, 0.3650610309031464, 0.27415227809035114, 0.20142527584011494], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 4398.795999999999, 3594, 5878, 4358.0, 5017.200000000001, 5243.05, 5555.99, 0.364060527247018, 0.3039194346795321, 0.23180416383306224], "isController": false}]}, function(index, item){
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
