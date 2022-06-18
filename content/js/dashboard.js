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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9157009770506703, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.002, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.996, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.823, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.717, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.756, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 191.85698704839785, 1, 3674, 13.0, 575.0, 1256.9500000000007, 2155.0, 25.603136835124175, 172.13298548188408, 225.5337918247107], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 7.178000000000001, 4, 27, 7.0, 9.0, 11.949999999999989, 17.99000000000001, 0.5927330922885425, 6.33352905873985, 0.214171136862071], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.508000000000006, 4, 38, 7.0, 9.0, 10.0, 14.990000000000009, 0.592710607860291, 6.364021777076799, 0.2500497876910603], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 20.254, 12, 240, 19.0, 25.0, 30.0, 44.950000000000045, 0.5885517272227538, 0.3171742042486372, 6.552236025722064], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 44.10999999999999, 27, 66, 45.0, 54.0, 56.0, 59.0, 0.5924872615238772, 2.464260983232611, 0.24648395840739426], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.3599999999999994, 1, 14, 2.0, 3.0, 4.0, 8.0, 0.5925223677193814, 0.37032647982461336, 0.25054900900634], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.67999999999995, 23, 63, 40.0, 48.0, 49.0, 52.99000000000001, 0.592472518162245, 2.4311276618309057, 0.21523415698862808], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 762.0019999999996, 568, 958, 764.0, 904.7, 923.95, 946.96, 0.5921245072043788, 2.5043859772482078, 0.28796680135525454], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.750000000000007, 5, 40, 9.0, 11.0, 12.0, 19.980000000000018, 0.5921427395602274, 0.880696672217018, 0.3024322781152334], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.0599999999999987, 1, 18, 3.0, 4.0, 5.0, 10.0, 0.5894676282062619, 0.5687441569021354, 0.3223651091752994], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 13.236000000000002, 8, 34, 14.0, 16.0, 18.0, 23.0, 0.5924584775476011, 0.9656378896747521, 0.387065157694673], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 602.0, 602, 602, 602.0, 602.0, 602.0, 602.0, 1.6611295681063123, 0.7089000207641196, 1964.767506748339], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 3.980000000000003, 2, 24, 4.0, 5.0, 6.0, 10.990000000000009, 0.5894773575852178, 0.5916878976761624, 0.34597255069210536], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 14.266000000000009, 9, 34, 15.0, 18.0, 19.0, 26.970000000000027, 0.5924493515049398, 0.9302380520739283, 0.3523453662758871], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 8.372, 5, 34, 9.0, 11.0, 11.949999999999989, 14.990000000000009, 0.5924458415633934, 0.9170182215605261, 0.3384578294087746], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1848.5020000000006, 1454, 2367, 1827.0, 2100.9, 2161.7, 2244.87, 0.5911381300645759, 0.9028711283408171, 0.3255877981996297], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 17.012, 11, 64, 16.0, 22.0, 25.0, 40.92000000000007, 0.5885177826533207, 0.31782259160867804, 4.744924622642398], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 18.084, 11, 55, 19.0, 22.0, 23.0, 29.980000000000018, 0.5924760284198901, 1.0727056217680433, 0.49411575026424426], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 13.325999999999999, 8, 61, 14.0, 16.0, 17.0, 23.0, 0.5924683059079755, 1.003261760199638, 0.4246794302113808], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 83.0, 83, 83, 83.0, 83.0, 83.0, 83.0, 12.048192771084338, 5.6122929216867465, 1643.1664156626505], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 615.0, 615, 615, 615.0, 615.0, 615.0, 615.0, 1.6260162601626016, 0.7447281504065041, 3109.66399898374], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.0299999999999976, 1, 18, 2.0, 2.0, 4.0, 7.0, 0.5894071742641251, 0.4955855244545037, 0.24923174458629513], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 399.9040000000003, 310, 541, 400.5, 466.0, 472.0, 499.95000000000005, 0.5892043619977327, 0.518338727990271, 0.27273717537785674], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 2.785999999999999, 1, 12, 3.0, 4.0, 4.0, 9.0, 0.589453034740004, 0.5341918127331287, 0.2878188646191426], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1137.2780000000005, 925, 1474, 1124.5, 1318.9, 1350.0, 1382.97, 0.5888088632220564, 0.5571833871700904, 0.31107968262024654], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 51.0, 51, 51, 51.0, 51.0, 51.0, 51.0, 19.607843137254903, 9.17202818627451, 1291.1113664215686], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 41.06600000000004, 28, 584, 41.0, 46.900000000000034, 51.0, 80.96000000000004, 0.5881232047539174, 0.31760950412980116, 26.900893226820298], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 41.053999999999995, 28, 168, 41.0, 48.0, 52.0, 85.97000000000003, 0.588874742808956, 133.25993899110446, 0.1817230651637013], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 2.0646222933070866, 1.6147883858267715], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 1.9240000000000006, 1, 9, 2.0, 3.0, 3.0, 6.0, 0.5927738496630673, 0.6442942330810488, 0.2541286328145377], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 2.976000000000003, 2, 20, 3.0, 4.0, 6.0, 10.980000000000018, 0.5927689303721759, 0.6083985799034735, 0.2182362175295999], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 1.97, 1, 18, 2.0, 3.0, 3.9499999999999886, 6.990000000000009, 0.5927506594351086, 0.3363165362615216, 0.2298066521442755], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 118.48199999999999, 84, 163, 118.0, 145.0, 149.0, 154.0, 0.5926818021794096, 0.540011837337294, 0.1933161346952371], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 160.90399999999994, 112, 591, 161.0, 187.90000000000003, 206.95, 310.97, 0.5886383382504256, 0.3178876963403177, 174.1300274864672], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.0699999999999985, 1, 8, 2.0, 3.0, 4.0, 6.0, 0.5927647139021108, 0.32986430133787, 0.2483359983046929], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 455.85199999999986, 346, 658, 461.0, 527.0, 533.0, 605.7300000000002, 0.5925371135621079, 0.6439443373598206, 0.25460579098371827], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 11.138, 6, 302, 10.0, 14.0, 18.0, 37.960000000000036, 0.5879330273729859, 0.24860839927002235, 0.4265959368536411], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 2.5619999999999994, 1, 13, 2.0, 3.0, 4.0, 7.990000000000009, 0.5927766607230928, 0.6309829689337607, 0.2408155184187564], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.2899999999999983, 2, 12, 3.0, 4.0, 5.0, 9.990000000000009, 0.5894002263296869, 0.36204369371227835, 0.29470011316484346], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 3.798000000000004, 2, 28, 3.0, 5.0, 6.0, 10.990000000000009, 0.5893828572102152, 0.34534151789661044, 0.2779999219067714], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 519.8979999999997, 375, 833, 534.5, 623.9000000000001, 633.0, 656.98, 0.5888053962836958, 0.5375379264275881, 0.25932737668354183], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 14.387999999999987, 5, 115, 14.0, 23.0, 31.0, 44.0, 0.5889871188517107, 0.5216907390610368, 0.2421519306997756], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 7.179999999999999, 4, 56, 7.0, 9.0, 10.0, 13.0, 0.5894884772687349, 0.3931842089595175, 0.2757470513786367], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 506.6420000000003, 342, 3674, 500.0, 539.9000000000001, 568.95, 632.98, 0.5892849145419017, 0.4431146330051409, 0.32571802893624646], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 13.560000000000006, 9, 29, 14.0, 16.0, 17.0, 22.0, 0.5921231047619724, 0.48341300349707905, 0.3654509787202799], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 13.411999999999992, 9, 35, 14.0, 16.0, 18.0, 22.99000000000001, 0.5921315195160627, 0.49200115436039726, 0.37470822719375846], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 13.411999999999992, 8, 30, 14.0, 16.0, 17.94999999999999, 23.99000000000001, 0.5921041724396823, 0.4793499599145475, 0.36139170681132954], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 16.026000000000007, 10, 34, 17.0, 19.0, 20.94999999999999, 25.0, 0.5921118854618769, 0.5296625850420695, 0.4117027953602113], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 12.828000000000005, 8, 37, 14.0, 16.0, 17.0, 21.0, 0.591839947539307, 0.4444579293532491, 0.32655231480440283], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2103.3060000000005, 1608, 2659, 2089.5, 2402.7000000000003, 2494.6, 2616.6600000000003, 0.5907197920666332, 0.4931356514162507, 0.3761223676049266], "isController": false}]}, function(index, item){
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
