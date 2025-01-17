const addPatientButton = document.getElementById("addPatient");
const report = document.getElementById("report");
const btnSearch = document.getElementById('btnSearch');
const btnReset = document.getElementById('btnReset');
const patients = [];

function addPatient() {
    const name = document.getElementById("name").value;
    const gender = document.querySelector('input[name="gender"]:checked');
    const age = document.getElementById("age").value;
    const condition = document.getElementById("condition").value;

    if (name && gender && age && condition) {
        patients.push({ name, gender: gender.value, age, condition });
        resetForm();
        generateReport();
    }
}

function resetForm() {
    document.getElementById("name").value = "";
    document.querySelector('input[name="gender"]:checked').checked = false;
    document.getElementById("age").value = "";
    document.getElementById("condition").value = "";
}

function generateReport() {
    const numPatients = patients.length;
    const conditionsCount = {
        Diabetes: 0,
        Thyroid: 0,
        "High Blood Pressure": 0,
    };
    const genderConditionsCount = {
        Male: {
            Diabetes: 0,
            Thyroid: 0,
            "High Blood Pressure": 0,
        },
        Female: {
            Diabetes: 0,
            Thyroid: 0,
            "High Blood Pressure": 0,
        },
    };

    for (const patient of patients) {
        conditionsCount[patient.condition]++;
        genderConditionsCount[patient.gender][patient.condition]++;
    }

    report.innerHTML = `Number of patients: ${numPatients}<br><br>`;
    report.innerHTML += `Conditions Breakdown:<br>`;
    for (const condition in conditionsCount) {
        report.innerHTML += `${condition}: ${conditionsCount[condition]}<br>`;
    }

    report.innerHTML += `<br>Gender-Based Conditions:<br>`;
    for (const gender in genderConditionsCount) {
        report.innerHTML += `${gender}:<br>`;
        for (const condition in genderConditionsCount[gender]) {
            report.innerHTML += `&nbsp;&nbsp;${condition}: ${genderConditionsCount[gender][condition]}<br>`;
        }
    }
}

// addPatientButton.addEventListener("click", addPatient);

function searchCondition() {
    const input = document.getElementById('conditionInput').value.toLowerCase();
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    fetch('travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            
            const lowerCaseKeyword = input.toLowerCase();
            console.log("lowerCaseKeyword:",lowerCaseKeyword);
            const destinations = data[lowerCaseKeyword];
            // // Check if the keyword matches any key in the JSON object
            // const destinations = Object.keys(destinations).find(key => key.toLowerCase() === lowerCaseKeyword);

            if (destinations && destinations.length > 0) {
                destinations.forEach(destination => {
                    console.log(destination);
                    resultDiv.innerHTML += `<h2>${destination.name}</h2>`;
                    resultDiv.innerHTML += `<img src="${destination.imageUrl}" width="200"  heigth="200" alt="hjh">`;
                    resultDiv.innerHTML += `<p><strong>Symptoms:</strong> ${destination.description}</p>`;
                })
            } else {
                resultDiv.innerHTML = 'Condition not found.';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            resultDiv.innerHTML = 'An error occurred while fetching data.';
        });
}
btnSearch.addEventListener('click', searchCondition);

function resetForm() {
    document.getElementById('conditionInput').value = "";
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';
}

btnReset.addEventListener('click', resetForm);