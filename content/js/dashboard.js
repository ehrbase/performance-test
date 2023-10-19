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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8730908317379281, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Query cross patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.996, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.777, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [0.805, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.46, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query single patient #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23505, 500, 2.1272069772388855, 462.7612422888717, 1, 20318, 11.0, 1000.0, 1861.0, 10386.980000000003, 10.70310351296758, 67.42165413536296, 88.56909494655733], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query cross patient #1", 500, 500, 100.0, 10527.61399999999, 8939, 20318, 10345.5, 11224.9, 11608.75, 19506.51000000006, 0.23044681794424848, 0.13387609848236945, 0.11612359185471896], "isController": false}, {"data": ["Query participation #2", 500, 0, 0.0, 2.8160000000000003, 2, 16, 3.0, 4.0, 4.0, 7.0, 0.23138378610512597, 0.11878981464191972, 0.08360546958876623], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 4.123999999999995, 3, 16, 4.0, 5.0, 6.0, 8.990000000000009, 0.23138250118930606, 0.13279864235738972, 0.0976144926892385], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 15.904000000000012, 10, 431, 14.0, 18.0, 20.0, 40.98000000000002, 0.23006022056333467, 0.11968298837528711, 2.531336430749113], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.04600000000002, 26, 59, 44.5, 54.0, 56.0, 59.0, 0.23133496933423647, 0.9620981906771545, 0.09623896185193823], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.6560000000000006, 1, 31, 2.0, 4.0, 4.0, 8.0, 0.23134032104484395, 0.14452218435116904, 0.09782261622306387], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.16600000000001, 23, 61, 39.0, 48.0, 50.0, 53.0, 0.23133293574912775, 0.9494387132834147, 0.08403891806511281], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 1006.6819999999999, 731, 1425, 972.5, 1251.6000000000001, 1370.75, 1414.99, 0.23125793214707266, 0.9780381243443836, 0.11246723653246306], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 6.832000000000001, 4, 25, 6.0, 9.0, 10.0, 17.970000000000027, 0.23129976125238644, 0.3439477143131068, 0.11813454603027158], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 4.376000000000004, 3, 16, 4.0, 5.900000000000034, 6.949999999999989, 11.0, 0.23017078672374902, 0.22201365991690833, 0.12587464898955023], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 9.254000000000005, 6, 19, 9.0, 12.0, 13.0, 17.99000000000001, 0.23133207951346238, 0.3769786664110447, 0.15113394647901007], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 505.0, 505, 505, 505.0, 505.0, 505.0, 505.0, 1.9801980198019802, 0.856667698019802, 2342.1584931930693], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 5.074000000000001, 3, 25, 5.0, 6.0, 7.0, 14.990000000000009, 0.23017205821695833, 0.23123075977379612, 0.13509121776210153], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 9.596, 6, 20, 9.0, 12.0, 13.0, 16.99000000000001, 0.2313313303124546, 0.3634228753778797, 0.13757888687527817], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 7.5859999999999985, 5, 21, 7.0, 9.0, 10.0, 15.0, 0.2313307951718487, 0.358000219157012, 0.13215675310110497], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2048.042, 1604, 2650, 1997.0, 2423.8, 2558.75, 2609.96, 0.23111843294306675, 0.35293184060293253, 0.12729569939442348], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 14.397999999999998, 10, 94, 13.0, 17.0, 20.0, 56.87000000000012, 0.23005524546664635, 0.11968040020755584, 1.8548204165748363], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 14.174000000000005, 9, 43, 14.0, 17.0, 19.0, 24.99000000000001, 0.23133400605262291, 0.41877554722637467, 0.19292894645404296], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 9.479999999999993, 6, 29, 9.0, 12.0, 13.0, 16.99000000000001, 0.23133347089963735, 0.3916651873373147, 0.16581910902376348], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 68.0, 68, 68, 68.0, 68.0, 68.0, 68.0, 14.705882352941176, 6.936465992647058, 2005.6295955882351], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 581.0, 581, 581, 581.0, 581.0, 581.0, 581.0, 1.721170395869191, 0.7983944707401033, 3291.6408939328744], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.806, 1, 19, 3.0, 4.0, 5.0, 7.0, 0.23017184630044793, 0.1934679783488853, 0.09732852485165425], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 691.9820000000002, 524, 914, 680.5, 826.9000000000001, 844.95, 866.99, 0.23011305454369732, 0.20263207266855207, 0.10651717563839115], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.737999999999997, 2, 14, 3.0, 5.0, 6.0, 9.0, 0.23017322376474086, 0.2085292982605349, 0.11238926941637738], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 956.1919999999996, 746, 1223, 927.5, 1143.0, 1165.0, 1196.93, 0.23008605218351663, 0.21766275352606876, 0.12155913499148682], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 72.0, 72, 72, 72.0, 72.0, 72.0, 72.0, 13.888888888888888, 6.578233506944445, 914.5372178819445], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 31.29400000000003, 20, 1595, 27.0, 33.0, 37.94999999999999, 97.99000000000001, 0.22988769985861907, 0.11959323885906735, 10.486381308980564], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 39.64199999999999, 26, 292, 37.0, 47.0, 53.0, 140.8800000000001, 0.230132436614623, 52.049194774515094, 0.07101743161154382], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 1.1475143599562363, 0.8974972647702407], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 3.189999999999997, 2, 9, 3.0, 4.0, 5.0, 7.0, 0.23135637766244918, 0.2513989794812342, 0.09918500956427265], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.9119999999999946, 2, 12, 4.0, 5.0, 6.0, 8.0, 0.2313557353549506, 0.23739041474101577, 0.0851768674109535], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.1639999999999984, 1, 14, 2.0, 3.0, 4.0, 7.0, 0.23138464272360085, 0.131218140503928, 0.08970674136842728], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 124.18999999999998, 88, 172, 123.0, 152.0, 157.0, 165.98000000000002, 0.23137275770876184, 0.21074578597904225, 0.07546728620578756], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 102.22, 70, 573, 97.0, 116.0, 129.89999999999998, 395.52000000000044, 0.23009833482437053, 0.11970281635184613, 68.03854961081169], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 247.72, 15, 439, 314.0, 409.0, 418.95, 431.0, 0.2313532732092447, 0.12894104155590627, 0.09692436934254489], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 492.8019999999999, 370, 675, 480.0, 592.0, 607.0, 639.97, 0.23132779843020956, 0.12440872253271554, 0.09849503917536266], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 8.384, 5, 285, 7.0, 9.0, 12.0, 27.960000000000036, 0.22985948230127956, 0.10364103669269902, 0.1667828079588386], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 458.7179999999999, 321, 603, 465.0, 544.0, 557.0, 589.96, 0.23131816657221174, 0.11898202296411098, 0.09306941858178831], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.073999999999999, 3, 15, 4.0, 5.0, 6.0, 10.990000000000009, 0.23017057480957986, 0.141318888758331, 0.11508528740478993], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.615999999999999, 3, 34, 4.0, 6.0, 6.0, 10.0, 0.2301673961438675, 0.13479852455218633, 0.10856528548582814], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 776.6560000000004, 556, 1151, 737.5, 998.9000000000001, 1099.0, 1125.98, 0.23009695825627002, 0.21025783672849066, 0.10134153141950956], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 279.51000000000016, 181, 399, 269.0, 341.0, 351.9, 367.98, 0.23013529654083636, 0.2037753659438884, 0.09461617172235556], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 5.3759999999999994, 3, 42, 5.0, 7.0, 8.0, 12.980000000000018, 0.23017343568378773, 0.1534586975348425, 0.10766901923099055], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 1252.404000000001, 940, 11229, 1140.0, 1492.0, 1515.95, 1647.2200000000007, 0.2300735591183213, 0.17293937420797179, 0.1271695649032909], "isController": false}, {"data": ["Query single patient #2", 500, 0, 0.0, 165.8479999999999, 141, 192, 166.0, 184.0, 186.0, 191.0, 0.2313807879904116, 4.473672969720353, 0.11659422519829334], "isController": false}, {"data": ["Query single patient #1", 500, 0, 0.0, 225.55400000000006, 194, 324, 217.5, 252.0, 256.0, 265.98, 0.23136055274812378, 0.4484214869577429, 0.16538664512854162], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 8.244000000000009, 5, 21, 8.0, 11.0, 12.0, 19.0, 0.23129665831839927, 0.18876653351881784, 0.14275340630588704], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 8.256000000000004, 5, 21, 8.0, 11.0, 12.0, 17.99000000000001, 0.23129815627613667, 0.19238178972846523, 0.14636836451849275], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 9.301999999999989, 6, 35, 9.0, 12.0, 13.0, 18.0, 0.2312941974299514, 0.18718341245329595, 0.14117077479855433], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 11.450000000000012, 8, 24, 11.0, 15.0, 17.0, 19.99000000000001, 0.23129526737501613, 0.2068353411015391, 0.1608224905966909], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 8.808000000000002, 5, 35, 9.0, 11.0, 12.0, 30.840000000000146, 0.23126798686767863, 0.17361134197759104, 0.12760391853538908], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2052.1680000000015, 1651, 2753, 1990.0, 2493.9, 2670.9, 2723.94, 0.23109001926828582, 0.19311136756646957, 0.14713934820597885], "isController": false}]}, function(index, item){
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
