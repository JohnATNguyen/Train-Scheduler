var config = {
	apiKey: "AIzaSyDBcUj9XDES0jIESlddtCodAWt8pWCfsLA",
	authDomain: "john-57aba.firebaseapp.com",
	databaseURL: "https://john-57aba.firebaseio.com",
	projectId: "john-57aba",
	storageBucket: "john-57aba.appspot.com",
	messagingSenderId: "309633750648"
};

firebase.initializeApp(config);

var database = firebase.database();

$('#submit').on('click', function() {
	event.preventDefault();

	var trainNameVar = $('#trainName').val().trim();
	var destinationVar = $('#destination').val().trim();
	var firstTrainTimeVar = $('#firstTrainTime').val().trim();
	var frequencyVar = $('#frequency').val().trim();

	database.ref('/trainScheduler').push({
		trainNameDb: trainNameVar,
		destinationDb: destinationVar,
		firstTrainTimeDb: firstTrainTimeVar,
		frequencyDb: frequencyVar
	});
});

database.ref('/trainScheduler').on("child_added", function(childSnapshot) {
    var tFrequency = childSnapshot.val().frequencyDb;

    var firstTime = childSnapshot.val().firstTrainTimeDb;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

	$('#table').append(`

		<tr>
			<td>${childSnapshot.val().trainNameDb}</td>
			<td>${childSnapshot.val().destinationDb}</td>
			<td>${childSnapshot.val().frequencyDb}</td>
			<td>${nextTrain}</td>
			<td>${tMinutesTillTrain}</td>
		</tr>

	`);
});