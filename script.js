var data = [];

async function fetchData(url) {
    //Fetch XLSX and read
    const response = await fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vTY-BsAIrtO2VSVDhLAzcWFFWGNWLZgQxgOuU3DOi5KhPkbg3bxLiMM8sscfcC_XLGOYYAUvV2DIXhQ/pub?output=xlsx");
    const arrayBuffer = await response.arrayBuffer();
    const spreadsheet = XLSX.read(arrayBuffer, {type: "array"});
    
    //For every sheet, take the non empty rows and add to the data array
    spreadsheet.SheetNames.forEach(sheetName => {
        console.log(sheetName);
        const sheet = spreadsheet.Sheets[sheetName];
        var rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
        rows = rows.filter(row => row.some(cell => cell !== null && cell !== undefined && cell !== ""));
        rows = rows.slice(1);
        rows = rows.slice(1);
        data = data.concat(rows);
    });

    //Variables needed to create cards from templates
    const assignmentCardTemplate = document.querySelector("[assignment-card]");
    const assignmentsTable = document.querySelector("[assignments-table]");
    data.forEach(row => {
        var invalid = false;
        if (row[0] == '') {
            invalid = true;
        }
        if (row[1] == '') {
            invalid = true;
        }
        if (row[3] == '') {
            invalid = true;
        }
        if (row[4] == '') {
            invalid = true;
        }
        if (row[5] == '') {
            invalid = true;
        }

        if (!invalid) {
            const assignmentCard = assignmentCardTemplate.content.cloneNode(true).children[0];

            if ((row[3] == "No") && (row[4] == "Yes")) {
                assignmentCard.style.borderTopWidth = "5px";
                assignmentCard.style.borderRadius = "5px";
                assignmentCard.style.borderImage = "linear-gradient(to right, blue 50%, greenyellow 50%) 1";
            } else if (row[3] == "No") {
                assignmentCard.style.borderColor = "blue";
            }
            else if (row[4] == "Yes") {
                assignmentCard.style.borderColor = "greenyellow";
            }

            var today = new Date();
            var date = new Date(row[5]);
            if ((date - today) / (1000 * 60 * 60 * 24) <= 3) {
                assignmentCard.style.backgroundColor = "rgba(175, 0, 0, 0.75)";
            }

            assignmentCard.querySelector("[manager-role]").textContent = row[0];
            if (row[9] == '') {
                assignmentCard.querySelector("[assignment]").textContent = row[1];
            } else {
                assignmentCard.querySelector("[assignment]").innerHTML = `<a href=\"${row[2]}\">${row[1]}</a>`;
            }
            assignmentCard.querySelector("[deadline]").textContent = row[5];
            if (row[6] == '') {
                assignmentCard.querySelector("[reward]").textContent = "No Reward";
            } else {
                assignmentCard.querySelector("[reward]").textContent = row[6];
            }
            if (row[7] == '') {
                assignmentCard.querySelector("[penalty]").textContent = "No Penalty";
            } else {
                assignmentCard.querySelector("[penalty]").textContent = row[7];
            }
            if (row[9] == '') {
                assignmentCard.querySelector("[makeup]").textContent = row[8];
            } else {
                assignmentCard.querySelector("[makeup]").innerHTML = `<a href=\"${row[9]}\">${row[8]}</a>`;
            }
            assignmentsTable.append(assignmentCard);
        }
    });
    console.log(data);
}

fetchData();