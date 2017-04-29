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

    // Jake's fixes (necessary to distinguish between if first train time is after or before current time, respectively)
    if ((moment().format("X")) < (moment(childSnapshot.val().firstTrainTimeDb, 'hh:mm').format("X"))) { // this is if current time is less than first train time
        // tMinutesTillTrain is difference from the first train time minus the current time
        tMinutesTillTrain = moment(childSnapshot.val().firstTrainTimeDb, 'hh:mm').diff(moment(), "minutes");
        // nextTrain is of course the first train time since the current time is less
        nextTrain = moment(childSnapshot.val().firstTrainTimeDb, 'hh:mm').format("hh:mm a")

    } else { // this is if first train time is less than current time
        // tMinutesTillTrain is frequency - (difference between the current time and the first train time and then its remainder)
        tMinutesTillTrain = childSnapshot.val().frequencyDb - ((moment().diff(moment(childSnapshot.val().firstTrainTimeDb, 'hh:mm'), "minutes")) % childSnapshot.val().frequencyDb);
        // nextTrain is the current time + tMinutesTillTrain
        nextTrain = moment().add(tMinutesTillTrain, 'minutes').format("hh:mm a");
    };


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